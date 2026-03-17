package com.example.servertomcat.controllers;

import com.example.servertomcat.dtos.BoardDTO;
import com.example.servertomcat.dtos.BoardMemberDTO;
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

    @GetMapping("/{pseudo}")
    public ResponseEntity<List<BoardDTO>> getUserBoards(@PathVariable String pseudo) {
        List<BoardDTO> boards = boardService.getBoardsForUser(pseudo);
        if (boards.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(boards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardDetails(@PathVariable String id) {
        Board board = boardService.getBoardById(id);
        if (board == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(board);
    }

    @PostMapping
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO dto) {
        BoardDTO created = boardService.createBoard(dto, dto.getOwnerPseudo());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable String id) {
        Board board = boardService.getBoardById(id);
        if (board == null) {
            return ResponseEntity.notFound().build();
        }
        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<BoardMemberDTO>> getBoardMembers(@PathVariable String id) {
        List<BoardMemberDTO> members = boardService.getBoardMembers(id);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{boardId}/members/{memberPseudo}")
    public ResponseEntity<Void> deleteBoardMember(@PathVariable String boardId, String memberPseudo)  {
        boolean removed = boardService.removeBoardMember(boardId, memberPseudo);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}