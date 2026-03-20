package com.example.servertomcat.comment;

import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.comment.documents.AttachmentDocument;
import com.example.servertomcat.comment.documents.CommentDocument;
import com.example.servertomcat.comment.documents.TaskDocument;
import com.example.servertomcat.comment.dtos.*;
import com.example.servertomcat.comment.repositories.TaskDocumentRepository;
import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.task.repositories.TaskRepository;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final TaskDocumentRepository taskDocumentRepository;
    private final TaskRepository taskRepository;
    private final BoardMemberRepository boardMemberRepository;

    // Chemin dynamique : crée un dossier 'uploads' à la racine du projet
    private final Path rootPath = Paths.get("uploads");

    // --- Gestion Fichiers Physiques ---

    @Override
    public AttachmentDto saveTaskAttachment(String taskId, MultipartFile file, String pseudo) {
        checkIsMember(taskId, pseudo);
        try {
            if (!Files.exists(rootPath)) Files.createDirectories(rootPath);

            String fileId = UUID.randomUUID().toString();
            String originalFileName = file.getOriginalFilename();

            // Copie physique du fichier
            Files.copy(file.getInputStream(), rootPath.resolve(fileId));

            // Enregistrement dans MongoDB
            TaskDocument doc = findOrCreateDocument(taskId);
            AttachmentDocument attachment = new AttachmentDocument();
            attachment.setFileId(fileId);
            attachment.setFileName(originalFileName);
            attachment.setUploaderId(pseudo);
            attachment.setUploaderDate(LocalDateTime.now());

            doc.getTaskAttachments().add(attachment);
            taskDocumentRepository.save(doc);

            return toAttachmentDto(attachment);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de l'écriture du fichier");
        }
    }

    @Override
    public Resource loadFileAsResource(String fileId) {
        try {
            Path filePath = rootPath.resolve(fileId).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) return resource;

            // Backup pour ton dossier spécifique si besoin (optionnel)
            Path backup = Paths.get("C:/Users/Neil/Documents/M1info/projet-kanban/server-tomcat/uploads").resolve(fileId);
            Resource backupRes = new UrlResource(backup.toUri());
            if (backupRes.exists()) return backupRes;

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Fichier physique introuvable");
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur de chemin de fichier");
        }
    }

    // --- Gestion Commentaires ---

    @Override
    public List<CommentDto> getComments(String taskId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        return doc.getComments().stream().map(this::toCommentDto).toList();
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
    public CommentDto updateComment(String taskId, String commentId, CommentUpdateDto dto, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);

        if (!comment.getUserId().equals(pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul l'auteur peut modifier son commentaire");
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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Seul l'auteur peut supprimer son commentaire");
        }

        doc.getComments().remove(comment);
        taskDocumentRepository.save(doc);
    }


    @Override
    public List<AttachmentDto> getTaskAttachments(String taskId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        return doc.getTaskAttachments().stream().map(this::toAttachmentDto).toList();
    }

    @Override
    public void deleteTaskAttachment(String taskId, String fileId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);

        // Suppression physique du fichier
        try { Files.deleteIfExists(rootPath.resolve(fileId)); } catch (IOException ignored) {}

        doc.getTaskAttachments().removeIf(a -> a.getFileId().equals(fileId));
        taskDocumentRepository.save(doc);
    }

    @Override
    public CommentDto addAttachmentToComment(String taskId, String commentId, AttachmentCreateDto dto, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);

        AttachmentDocument attachment = new AttachmentDocument();
        attachment.setFileId(UUID.randomUUID().toString()); // Ici on suppose que c'est géré ailleurs ou via métadonnées
        attachment.setFileName(dto.getFileName());
        attachment.setUploaderId(pseudo);
        attachment.setUploaderDate(LocalDateTime.now());

        comment.getAttachments().add(attachment);
        taskDocumentRepository.save(doc);
        return toCommentDto(comment);
    }

    @Override
    public void deleteAttachmentFromComment(String taskId, String commentId, String fileId, String pseudo) {
        checkIsMember(taskId, pseudo);
        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);
        comment.getAttachments().removeIf(a -> a.getFileId().equals(fileId));
        taskDocumentRepository.save(doc);
    }

    // --- Méthodes privées utilitaires ---

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commentaire non trouvé"));
    }

    private void checkIsMember(String taskId, String pseudo) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tâche inexistante"));
        String boardId = task.getColumn().getBoard().getIdBoard();
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès interdit au tableau");
        }
    }

    private CommentDto toCommentDto(CommentDocument comment) {
        CommentDto dto = new CommentDto();
        dto.setCommentId(comment.getCommentId());
        dto.setUserId(comment.getUserId());
        dto.setMessage(comment.getMessage());
        dto.setDate(comment.getDate());
        dto.setAttachments(comment.getAttachments().stream().map(this::toAttachmentDto).toList());
        return dto;
    }

    private AttachmentDto toAttachmentDto(AttachmentDocument attachment) {
        AttachmentDto dto = new AttachmentDto();
        dto.setFileId(attachment.getFileId());
        dto.setFileName(attachment.getFileName());
        dto.setUploaderId(attachment.getUploaderId());
        dto.setUploaderDate(attachment.getUploaderDate());
        return dto;
    }
}