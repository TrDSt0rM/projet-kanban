package com.example.servertomcat.comment;

import com.example.servertomcat.comment.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // Commentaires
    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(
            @PathVariable String taskId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(commentService.getComments(taskId, pseudo));
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable String taskId,
            @Valid @RequestBody CommentCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201)
                .body(commentService.addComment(taskId, dto, pseudo));
    }

    @PutMapping("/tasks/{taskId}/comments/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentUpdateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(
                commentService.updateComment(taskId, commentId, dto, pseudo));
    }

    @DeleteMapping("/tasks/{taskId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        commentService.deleteComment(taskId, commentId, pseudo);
        return ResponseEntity.noContent().build();
    }

    // Pièces jointes d'un commentaire
    @PostMapping("/tasks/{taskId}/comments/{commentId}/attachments")
    public ResponseEntity<CommentDto> addAttachmentToComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @Valid @RequestBody AttachmentCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201)
                .body(commentService.addAttachmentToComment(
                        taskId, commentId, dto, pseudo));
    }

    @DeleteMapping("/tasks/{taskId}/comments/{commentId}/attachments/{fileId}")
    public ResponseEntity<Void> deleteAttachmentFromComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @PathVariable String fileId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        commentService.deleteAttachmentFromComment(taskId, commentId, fileId, pseudo);
        return ResponseEntity.noContent().build();
    }

    // Pièces jointes d'une tâche
    @GetMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<List<AttachmentDto>> getTaskAttachments(
            @PathVariable String taskId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(commentService.getTaskAttachments(taskId, pseudo));
    }

    @PostMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<AttachmentDto> addTaskAttachment(
            @PathVariable String taskId,
            @Valid @RequestBody AttachmentCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201)
                .body(commentService.addTaskAttachment(taskId, dto, pseudo));
    }

    @DeleteMapping("/tasks/{taskId}/attachments/{fileId}")
    public ResponseEntity<Void> deleteTaskAttachment(
            @PathVariable String taskId,
            @PathVariable String fileId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        commentService.deleteTaskAttachment(taskId, fileId, pseudo);
        return ResponseEntity.noContent().build();
    }
}