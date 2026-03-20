package com.example.servertomcat.user.services.impl;

import com.example.servertomcat.user.dtos.UserAuthDto;
import com.example.servertomcat.user.dtos.UserDto;
import com.example.servertomcat.user.dtos.UserRegisterDto;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.user.entities.UserRole;
import com.example.servertomcat.user.mappers.UserMapper;
import com.example.servertomcat.user.repositories.UserRepository;
import com.example.servertomcat.user.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.example.servertomcat.board.repositories.BoardRepository;
import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.board.entities.Board;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BoardRepository boardRepository;
    private final BoardMemberRepository boardMemberRepository;

    public long countUsers() {
        return userRepository.count();
    }

    @Override
    public UserDto register(UserRegisterDto dto) {
        if (userRepository.existsByPseudo(dto.getPseudo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Le pseudo " + dto.getPseudo() + " est déjà pris");
        }

        User user = userMapper.toEntity(dto);
        user.setPassword(dto.getPassword());

        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public UserAuthDto getUserForAuth(String pseudo) {
        User user = findUserByPseudo(pseudo);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        }
        return userMapper.toAuthDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto searchByPseudo(String pseudo) {
        User user = userRepository.findById(pseudo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        return userMapper.toDto(user);
    }

    @Override
    public void updatePassword(String userPseudo, String newPassword) {
        User user = findUserByPseudo(userPseudo);
        if (newPassword.equals(user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous ne pouvez pas utilisé le même mot de passe");
        }
        if (newPassword.length() < 6){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mot de passe doit contenir au moins 6 caractères");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(String pseudo) {
        if (!userRepository.existsById(pseudo)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé");
        }
        List<String> ownedBoardIds = boardMemberRepository.findBoardIdsByOwner(pseudo);

        if (!ownedBoardIds.isEmpty()) {
            boardRepository.deleteAllById(ownedBoardIds);
        }
        boardMemberRepository.deleteByIdPseudoUser(pseudo);
        userRepository.deleteById(pseudo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void toggleActive(String userPseudo) {
        User user = userRepository.findById(userPseudo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));
        userRepository.updateActivationStatus(userPseudo, !user.isActive());
    }

    private User findUserByPseudo(String userPseudo) {
        return userRepository.findById(userPseudo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"));
    }

    @Override
    public void updateRole(String pseudo, String newRole) {
        User user = findUserByPseudo(pseudo);
        user.setUserRole(UserRole.valueOf(newRole.toUpperCase()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getSuggestions(String pseudo) {
        return userRepository.findByPseudoStartingWithIgnoreCase(pseudo)
                .stream()
                .map(userMapper::toDto)
                .toList();
    }
}