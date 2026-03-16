package com.example.servertomcat.controllers;

import com.example.servertomcat.entities.Board;
import com.example.servertomcat.services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "*")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    @PostMapping
    public Board createBoard(@RequestParam String name) {
        return boardService.createBoard(name);
    }
}