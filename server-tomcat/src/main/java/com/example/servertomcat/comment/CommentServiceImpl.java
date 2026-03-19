package com.example.servertomcat.comment;

import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.comment.documents.AttachmentDocument;
import com.example.servertomcat.comment.documents.CommentDocument;
import com.example.servertomcat.comment.documents.TaskDocument;
import com.example.servertomcat.comment.dtos.*;
import com.example.servertomcat.comment.repositories.TaskDocumentRepository;
import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.task.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final TaskDocumentRepository taskDocumentRepository;
    private final TaskRepository taskRepository;
    private final BoardMemberRepository boardMemberRepository;

    @Override
    public List<CommentDto> getComments(String taskId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        return doc.getComments().stream()
                .map(this::toCommentDto)
                .toList();
    }

    @Override
    public CommentDto addComment(String taskId, CommentCreateDto dto, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);

        CommentDocument comment = new CommentDocument();
        comment.setCommentId(UUID.randomUUID().toString());
        comment.setUserId(pseudo);
        comment.setMessage(dto.getMessage());
        comment.setDate(LocalDateTime.now());
        comment.setAttachments(new ArrayList<>());

        doc.getComments().add(comment);
        taskDocumentRepository.save(doc);

        return toCommentDto(comment);
    }

    @Override
    public CommentDto updateComment(String taskId, String commentId,
                                    CommentUpdateDto dto, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);

        CommentDocument comment = findComment(doc, commentId);

        // Seul l'auteur peut modifier son commentaire
        if (!comment.getUserId().equals(pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous ne pouvez modifier que vos propres commentaires");
        }

        comment.setMessage(dto.getMessage());
        taskDocumentRepository.save(doc);

        return toCommentDto(comment);
    }

    @Override
    public void deleteComment(String taskId, String commentId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);

        if (!comment.getUserId().equals(pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous ne pouvez supprimer que vos propres commentaires");
        }

        doc.getComments().remove(comment);
        taskDocumentRepository.save(doc);
    }

    @Override
    public CommentDto addAttachmentToComment(String taskId, String commentId,
                                             AttachmentCreateDto dto, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);

        AttachmentDocument attachment = new AttachmentDocument();
        attachment.setFileId(UUID.randomUUID().toString());
        attachment.setFileName(dto.getFileName());
        attachment.setEmpreinte(dto.getEmpreinte());
        attachment.setUploaderId(pseudo);
        attachment.setUploaderDate(LocalDateTime.now());

        comment.getAttachments().add(attachment);
        taskDocumentRepository.save(doc);

        return toCommentDto(comment);
    }

    @Override
    public void deleteAttachmentFromComment(String taskId, String commentId,
                                            String fileId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);

        comment.getAttachments().removeIf(a -> a.getFileId().equals(fileId));
        taskDocumentRepository.save(doc);
    }

    @Override
    public List<AttachmentDto> getTaskAttachments(String taskId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        return doc.getTaskAttachments().stream()
                .map(this::toAttachmentDto)
                .toList();
    }

    @Override
    public AttachmentDto addTaskAttachment(String taskId, AttachmentCreateDto dto, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);

        AttachmentDocument attachment = new AttachmentDocument();
        attachment.setFileId(UUID.randomUUID().toString());
        attachment.setFileName(dto.getFileName());
        attachment.setEmpreinte(dto.getEmpreinte());
        attachment.setUploaderId(pseudo);
        attachment.setUploaderDate(LocalDateTime.now());

        doc.getTaskAttachments().add(attachment);
        taskDocumentRepository.save(doc);

        return toAttachmentDto(attachment);
    }

    @Override
    public void deleteTaskAttachment(String taskId, String fileId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        doc.getTaskAttachments().removeIf(a -> a.getFileId().equals(fileId));
        taskDocumentRepository.save(doc);
    }

    // ---- Méthodes privées ----

    private TaskDocument findOrCreateDocument(String taskId) {
        return taskDocumentRepository.findByTaskId(taskId)
                .orElseGet(() -> {
                    TaskDocument doc = new TaskDocument();
                    doc.setTaskId(taskId);
                    return taskDocumentRepository.save(doc);
                });
    }

    private CommentDocument findComment(TaskDocument doc, String commentId) {
        return doc.getComments().stream()
                .filter(c -> c.getCommentId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Commentaire introuvable"));
    }

    private void checkIsMember(String taskId, String pseudo) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tâche introuvable"));
        String boardId = task.getColumn().getBoard().getIdBoard();
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous n'avez pas accès à cette tâche");
        }
    }

    private CommentDto toCommentDto(CommentDocument comment) {
        CommentDto dto = new CommentDto();
        dto.setCommentId(comment.getCommentId());
        dto.setUserId(comment.getUserId());
        dto.setMessage(comment.getMessage());
        dto.setDate(comment.getDate());
        dto.setAttachments(comment.getAttachments().stream()
                .map(this::toAttachmentDto)
                .toList());
        return dto;
    }

    private AttachmentDto toAttachmentDto(AttachmentDocument attachment) {
        AttachmentDto dto = new AttachmentDto();
        dto.setFileId(attachment.getFileId());
        dto.setFileName(attachment.getFileName());
        dto.setEmpreinte(attachment.getEmpreinte());
        dto.setUploaderId(attachment.getUploaderId());
        dto.setUploaderDate(attachment.getUploaderDate());
        return dto;
    }
}
