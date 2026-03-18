package com.example.servertomcat.board.services.impl;

import com.example.servertomcat.board.dtos.*;
import com.example.servertomcat.board.entities.*;
import com.example.servertomcat.board.enums.MemberRole;
import com.example.servertomcat.board.mappers.BoardMapper;
import com.example.servertomcat.board.mappers.BoardMemberMapper;
import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.board.repositories.BoardRepository;
import com.example.servertomcat.board.services.BoardService;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final UserRepository userRepository;
    private final BoardMapper boardMapper;
    private final BoardMemberMapper boardMemberMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BoardSummaryDto> getAllBoards(String pseudo) {
        return boardRepository.findAllByMemberPseudo(pseudo).stream()
                .map(board -> boardMapper.toSummaryDto(board, board.getOwnerPseudo()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BoardDetailDto getBoardById(String boardId, String pseudo) {
        Board board = findBoardById(boardId);
        checkIsMember(boardId, pseudo);
        return boardMapper.toDetailDto(board, board.getOwnerPseudo());
    }

    @Override
    public BoardSummaryDto createBoard(BoardCreateDto dto, String pseudo) {
        // Récupère l'utilisateur connecté
        User user = userRepository.findById(pseudo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"));

        // Vérifie qu'il n'a pas déjà un tableau avec ce nom
        boolean nameExists = boardRepository.findAllByMemberPseudo(pseudo).stream()
                .filter(b -> boardMemberRepository
                        .existsByIdIdBoardAndIdPseudoUserAndRole(
                                b.getIdBoard(), pseudo, MemberRole.OWNER))
                .anyMatch(b -> b.getBoardName().equalsIgnoreCase(dto.getBoardName()));

        if (nameExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Vous avez déjà un tableau avec ce nom");
        }

        // Crée le tableau
        Board board = new Board();
        board.setIdBoard(UUID.randomUUID().toString());
        board.setBoardName(dto.getBoardName());
        boardRepository.save(board);

        // Ajoute le créateur comme OWNER dans BOARD_MEMBER
        BoardMember owner = new BoardMember();
        BoardMemberId memberId = new BoardMemberId();
        memberId.setIdBoard(board.getIdBoard());
        memberId.setPseudoUser(pseudo);
        owner.setId(memberId);
        owner.setBoard(board);
        owner.setUser(user);
        owner.setRole(MemberRole.OWNER);
        boardMemberRepository.save(owner);

        return boardMapper.toSummaryDto(board, pseudo);
    }

    @Override
    public BoardSummaryDto updateBoard(String boardId, BoardUpdateDto dto, String pseudo) {
        Board board = findBoardById(boardId);
        checkIsOwner(boardId, pseudo);
        board.setBoardName(dto.getBoardName());
        return boardMapper.toSummaryDto(boardRepository.save(board), board.getOwnerPseudo());
    }

    @Override
    public void deleteBoard(String boardId, String pseudo) {
        findBoardById(boardId);
        checkIsOwner(boardId, pseudo);
        boardRepository.deleteById(boardId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoardMemberDto> getMembers(String boardId, String pseudo) {
        checkIsMember(boardId, pseudo);
        return boardMemberRepository.findByIdIdBoard(boardId).stream()
                .map(boardMemberMapper::toDto)
                .toList();
    }

    @Override
    public void removeMember(String boardId, String targetPseudo, String pseudo) {
        checkIsOwner(boardId, pseudo);

        if (targetPseudo.equals(pseudo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Vous ne pouvez pas vous retirer vous-même");
        }

        BoardMemberId memberId = new BoardMemberId();
        memberId.setIdBoard(boardId);
        memberId.setPseudoUser(targetPseudo);

        if (!boardMemberRepository.existsById(memberId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Membre introuvable");
        }
        boardMemberRepository.deleteById(memberId);
    }

    // ---- Méthodes privées utilitaires ----

    private Board findBoardById(String boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tableau introuvable"));
    }

    private void checkIsMember(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous n'avez pas accès à ce tableau");
        }
    }

    private void checkIsOwner(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUserAndRole(
                boardId, pseudo, MemberRole.OWNER)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul le propriétaire peut effectuer cette action");
        }
    }
}