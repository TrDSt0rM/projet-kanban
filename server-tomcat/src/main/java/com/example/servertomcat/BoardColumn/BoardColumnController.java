package com.example.servertomcat.BoardColumn;

import com.example.servertomcat.BoardColumn.dtos.BoardColumnCreateDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnPositionDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnUpdateDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BoardColumnController {

    private final BoardColumnService boardColumnService;

    public BoardColumnController(BoardColumnService boardColumnService) {
        this.boardColumnService = boardColumnService;
    }

    @GetMapping("/boards/{boardId}/columns")
    public ResponseEntity<List<BoardColumnDto>> getColumns(
            @PathVariable String boardId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(boardColumnService.getColumns(boardId, pseudo));
    }

    @PostMapping("/boards/{boardId}/columns")
    public ResponseEntity<BoardColumnDto> createColumn(
            @PathVariable String boardId,
            @Valid @RequestBody BoardColumnCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201)
                .body(boardColumnService.createColumn(boardId, dto, pseudo));
    }

    @PutMapping("/columns/{columnId}")
    public ResponseEntity<BoardColumnDto> updateColumn(
            @PathVariable String columnId,
            @Valid @RequestBody BoardColumnUpdateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(boardColumnService.updateColumn(columnId, dto, pseudo));
    }

    @PatchMapping("/columns/{columnId}/position")
    public ResponseEntity<Void> updatePosition(
            @PathVariable String columnId,
            @Valid @RequestBody BoardColumnPositionDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        boardColumnService.updatePosition(columnId, dto, pseudo);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/columns/{columnId}")
    public ResponseEntity<Void> deleteColumn(
            @PathVariable String columnId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        boardColumnService.deleteColumn(columnId, pseudo);
        return ResponseEntity.noContent().build();
    }
}
