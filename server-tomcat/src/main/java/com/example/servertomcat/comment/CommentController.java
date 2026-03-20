package com.example.servertomcat.comment;

import com.example.servertomcat.comment.dtos.*;
import org.springframework.core.io.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // --- Gestion des fichiers (Binaire) ---

    @GetMapping("/files/{fileId}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileId) {
        Resource resource = commentService.loadFileAsResource(fileId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping(value = "/tasks/{taskId}/attachments/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentDto> uploadTaskAttachment(
            @PathVariable String taskId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201).body(commentService.saveTaskAttachment(taskId, file, pseudo));
    }

    // --- Gestion des commentaires ---

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
        return ResponseEntity.status(201).body(commentService.addComment(taskId, dto, pseudo));
    }

    @PutMapping("/tasks/{taskId}/comments/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @Valid @RequestBody CommentUpdateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(commentService.updateComment(taskId, commentId, dto, pseudo));
    }

    @DeleteMapping("/tasks/{taskId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String taskId,
            @PathVariable String commentId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        commentService.deleteComment(taskId, commentId, pseudo);
        return ResponseEntity.noContent().build();
    }

    // --- Gestion des pièces jointes (Métadonnées) ---

    @GetMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<List<AttachmentDto>> getTaskAttachments(
            @PathVariable String taskId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(commentService.getTaskAttachments(taskId, pseudo));
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