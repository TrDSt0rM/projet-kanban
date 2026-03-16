package com.example.servertomcat.services;

import com.example.servertomcat.entities.Board;
import com.example.servertomcat.repositories.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Board createBoard(String name) {
        Board board = new Board();
        board.setName(name);
        return boardRepository.save(board);
    }
}