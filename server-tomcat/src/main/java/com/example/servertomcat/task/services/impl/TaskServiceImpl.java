package com.example.servertomcat.task.services.impl;

import com.example.servertomcat.board.entities.Board;
import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.board.services.BoardService;
import com.example.servertomcat.boardColumn.BoardColumn;
import com.example.servertomcat.boardColumn.BoardColumnRepository;
import com.example.servertomcat.comment.documents.AttachmentDocument;
import com.example.servertomcat.comment.documents.CommentDocument;
import com.example.servertomcat.comment.documents.TaskDocument;
import com.example.servertomcat.comment.dtos.AttachmentDto;
import com.example.servertomcat.comment.dtos.CommentDto;
import com.example.servertomcat.comment.repositories.TaskDocumentRepository;
import com.example.servertomcat.task.dtos.*;
import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.task.enums.Priority;
import com.example.servertomcat.task.mappers.TaskMapper;
import com.example.servertomcat.task.repositories.TaskRepository;
import com.example.servertomcat.task.services.TaskService;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final BoardColumnRepository boardColumnRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final TaskDocumentRepository taskDocumentRepository;
    private final BoardService boardService;

    @Override
    @Transactional(readOnly = true)
    public List<TaskSummaryDto> getTasks(String columnId, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        checkIsMember(column.getBoard().getIdBoard(), pseudo);
        return taskRepository.findByColumnIdColumnOrderByPosition(columnId)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDetailDto getTaskById(String taskId, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        TaskDetailDto dto = taskMapper.toDetailDto(task);

        Optional<TaskDocument> docOpt = taskDocumentRepository.findByTaskId(taskId);
        if (docOpt.isPresent()) {
            TaskDocument doc = docOpt.get();
            dto.setComments(doc.getComments().stream()
                    .map(this::toCommentDto)
                    .toList());
            dto.setTaskAttachments(doc.getTaskAttachments().stream()
                    .map(this::toAttachmentDto)
                    .toList());
        }
        return dto;
    }

    @Override
    public TaskSummaryDto createTask(String columnId, TaskCreateDto dto, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        checkIsMember(column.getBoard().getIdBoard(), pseudo);
        int nextPosition = taskRepository.countByColumnIdColumn(columnId);
        Task task = new Task();
        task.setIdTask(UUID.randomUUID().toString());
        task.setTaskName(dto.getTaskName());
        task.setDescription((dto.getDescription() != null && !dto.getDescription().isBlank()) ? dto.getDescription() : null);
        task.setPosition(nextPosition);
        task.setPriority(dto.getPriority());
        task.setLimitDate(dto.getLimitDate());
        task.setColumn(column);
        if (dto.getAssignedUserPseudo() != null && !dto.getAssignedUserPseudo().isBlank()) {
            User user = userRepository.findById(dto.getAssignedUserPseudo())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
            task.setAssignedUser(user);
        }
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public TaskSummaryDto updateTask(String taskId, TaskUpdateDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        task.setTaskName(dto.getTaskName());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setLimitDate(dto.getLimitDate());
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public void deleteTask(String taskId, String pseudo) {
        Task task = findTaskById(taskId);
        String columnId = task.getColumn().getIdColumn();
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        taskRepository.deleteById(taskId);
        List<Task> remaining = taskRepository.findByColumnIdColumnOrderByPosition(columnId);
        for (int i = 0; i < remaining.size(); i++) remaining.get(i).setPosition(i);
        taskRepository.saveAll(remaining);
    }

    @Override
    public void moveTask(String taskId, TaskMoveDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        BoardColumn targetColumn = findColumnById(dto.getTargetColumnId());
        String oldColumnId = task.getColumn().getIdColumn();
        task.setColumn(targetColumn);
        task.setPosition(taskRepository.countByColumnIdColumn(dto.getTargetColumnId()));
        taskRepository.save(task);
        List<Task> oldColumnTasks = taskRepository.findByColumnIdColumnOrderByPosition(oldColumnId);
        for (int i = 0; i < oldColumnTasks.size(); i++) oldColumnTasks.get(i).setPosition(i);
        taskRepository.saveAll(oldColumnTasks);
    }

    @Override
    public void updatePosition(String taskId, TaskPositionDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        String columnId = task.getColumn().getIdColumn();
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        List<Task> tasks = taskRepository.findByColumnIdColumnOrderByPosition(columnId);
        tasks.remove(task);
        tasks.add(dto.getPosition(), task);
        for (int i = 0; i < tasks.size(); i++) tasks.get(i).setPosition(i);
        taskRepository.saveAll(tasks);
    }

    @Override
    public TaskSummaryDto assignTask(String taskId, TaskAssignDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        if (dto.getPseudo() == null) {
            task.setAssignedUser(null);
        } else {
            User user = userRepository.findById(dto.getPseudo())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
            task.setAssignedUser(user);
        }
        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskSummaryDto> searchTasks(String pseudo, String keyword, Priority priority, String assignedTo) {
        return taskRepository.searchTasks(pseudo, keyword, priority, assignedTo)
                .stream().map(taskMapper::toDto).toList();
    }

    /**
     * Suppression d'un commentaire.
     * Corrigé : On extrait le pseudo de l'objet User du Board.
     */
    @Override
    public void deleteComment(String taskId, String commentId, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);

        TaskDocument doc = findOrCreateDocument(taskId);
        CommentDocument comment = findComment(doc, commentId);

        // ICI : On récupère l'objet User, puis son pseudo (ou son ID selon ta config)
        User ownerUser = task.getColumn().getBoard().getOwner();
        String boardOwnerPseudo = (ownerUser != null) ? ownerUser.getPseudo() : null;

        boolean isAuthor = comment.getUserId().equals(pseudo);
        boolean isBoardOwner = boardOwnerPseudo != null && boardOwnerPseudo.equals(pseudo);

        if (!isAuthor && !isBoardOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul l'auteur ou le propriétaire du tableau peut supprimer ce commentaire");
        }

        doc.getComments().remove(comment);
        taskDocumentRepository.save(doc);
    }

    // ---- Méthodes privées ----

    private TaskDocument findOrCreateDocument(String taskId) {
        return taskDocumentRepository.findByTaskId(taskId)
                .orElseGet(() -> {
                    TaskDocument newDoc = new TaskDocument();
                    newDoc.setTaskId(taskId);
                    return newDoc;
                });
    }

    private CommentDocument findComment(TaskDocument doc, String commentId) {
        return doc.getComments().stream()
                .filter(c -> c.getCommentId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Commentaire introuvable"));
    }

    private Task findTaskById(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tâche introuvable"));
    }

    private BoardColumn findColumnById(String columnId) {
        return boardColumnRepository.findById(columnId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Colonne introuvable"));
    }

    private void checkIsMember(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Accès refusé");
        }
    }

    private CommentDto toCommentDto(CommentDocument c) {
        CommentDto dto = new CommentDto();
        dto.setCommentId(c.getCommentId());
        dto.setUserId(c.getUserId());
        dto.setMessage(c.getMessage());
        dto.setDate(c.getDate());
        dto.setAttachments(c.getAttachments().stream().map(this::toAttachmentDto).toList());
        return dto;
    }

    private AttachmentDto toAttachmentDto(AttachmentDocument a) {
        AttachmentDto dto = new AttachmentDto();
        dto.setFileId(a.getFileId());
        dto.setFileName(a.getFileName());
        dto.setEmpreinte(a.getEmpreinte());
        dto.setUploaderId(a.getUploaderId());
        dto.setUploaderDate(a.getUploaderDate());
        return dto;
    }
}