package com.example.servertomcat.board.controllers;

import com.example.servertomcat.board.dtos.*;
import com.example.servertomcat.board.services.BoardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "*")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    // Récupérer tous les tableaux de l'utilisateur connecté
    @GetMapping
    public ResponseEntity<List<BoardSummaryDto>> getAllBoards(
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(boardService.getAllBoards(pseudo));
    }

    // récupère les détails d'un tableau spécifique
    @GetMapping("/{id}")
    public ResponseEntity<BoardDetailDto> getBoardById(
            @PathVariable String id,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(boardService.getBoardById(id, pseudo));
    }

    @PostMapping
    public ResponseEntity<BoardSummaryDto> createBoard(
            @Valid @RequestBody BoardCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201).body(boardService.createBoard(dto, pseudo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardSummaryDto> updateBoard(
            @PathVariable String id,
            @Valid @RequestBody BoardUpdateDto dto,
            @RequestHeader("X-User-Pseudo") String userPseudo) {
        return ResponseEntity.ok(boardService.updateBoard(id, dto, userPseudo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable String id,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        boardService.deleteBoard(id, pseudo);
        return ResponseEntity.noContent().build();
    }

    // Membres
    @GetMapping("/{id}/members")
    public ResponseEntity<List<BoardMemberDto>> getMembers(
            @PathVariable String id,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(boardService.getBoardById(id, pseudo).getMembers());
    }

    @DeleteMapping("/{id}/members/{pseudo}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String id,
            @PathVariable String pseudo,
            @RequestHeader("X-User-Pseudo") String currentPseudo) {
        boardService.removeMember(id, pseudo, currentPseudo);
        return ResponseEntity.noContent().build();
    }
}