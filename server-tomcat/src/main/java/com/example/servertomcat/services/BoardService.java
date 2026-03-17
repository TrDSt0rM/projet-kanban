package com.example.servertomcat.services;

import com.example.servertomcat.dtos.BoardDTO;
import com.example.servertomcat.entities.Board;
import com.example.servertomcat.entities.User;
import com.example.servertomcat.repositories.BoardRepository;
import com.example.servertomcat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Board> getBoardsForUser(String pseudo) {
        return boardRepository.findByOwnerPseudoOrMembersPseudo(pseudo, pseudo);
    }

    public Board getBoardById(String id) {
        return boardRepository.findById(id).orElse(null);
    }

    public Board createBoard(BoardDTO dto, String ownerPseudo) {
        User user = userRepository.findById(ownerPseudo)
                .orElseThrow(() -> new RuntimeException("Utilisateur " + ownerPseudo + " inexistant"));

        Board board = new Board();
        board.setId(dto.getId());
        board.setName(dto.getName());
        board.setOwner(user);

        return boardRepository.save(board);
    }
}