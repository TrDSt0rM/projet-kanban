package com.example.servertomcat.controllers;

import com.example.servertomcat.dtos.BoardDTO;
import com.example.servertomcat.entities.Board;
import com.example.servertomcat.services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "*")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping("/user/{pseudo}")
    public ResponseEntity<List<Board>> getAllUserBoards(@PathVariable String pseudo) {
        List<Board> boards = boardService.getBoardsForUser(pseudo);
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardDetails(@PathVariable String id) {
        Board board = boardService.getBoardById(id);
        if (board == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(board);
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody BoardDTO dto) {
        Board created = boardService.createBoard(dto, dto.getOwner());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}