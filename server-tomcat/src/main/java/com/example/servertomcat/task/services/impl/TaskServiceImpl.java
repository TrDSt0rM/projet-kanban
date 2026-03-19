package com.example.servertomcat.task.services.impl;

import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.boardColumn.BoardColumn;
import com.example.servertomcat.boardColumn.BoardColumnRepository;
import com.example.servertomcat.task.dtos.*;
import com.example.servertomcat.dtos.CommentDTO;
import com.example.servertomcat.entities.Comment;
import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.repositories.CommentRepository;
import com.example.servertomcat.task.enums.Priority;
import com.example.servertomcat.task.mappers.TaskMapper;
import com.example.servertomcat.task.repositories.TaskRepository;
import com.example.servertomcat.task.services.TaskService;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final BoardColumnRepository boardColumnRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getTasks(String columnId, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        checkIsMember(column.getBoard().getIdBoard(), pseudo);
        return taskRepository.findByColumnIdColumnOrderByPosition(columnId)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskById(String taskId, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        return taskMapper.toDto(task);
    }

    @Override
    public TaskDto createTask(String columnId, TaskCreateDto dto, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        checkIsMember(column.getBoard().getIdBoard(), pseudo);

        int nextPosition = taskRepository.countByColumnIdColumn(columnId);

        Task task = new Task();
        task.setIdTask(UUID.randomUUID().toString());
        task.setTaskName(dto.getTaskName());
        task.setDescription(dto.getDescription());
        task.setPosition(nextPosition);
        task.setPriority(dto.getPriority());
        task.setLimitDate(dto.getLimitDate());
        task.setColumn(column);

        if (dto.getAssignedUserPseudo() != null) {
            User user = userRepository.findById(dto.getAssignedUserPseudo())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Utilisateur introuvable"));
            task.setAssignedUser(user);
        }

        return taskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public TaskDto updateTask(String taskId, TaskUpdateDto dto, String pseudo) {
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

        // Réindexe les positions
        List<Task> remaining = taskRepository
                .findByColumnIdColumnOrderByPosition(columnId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setPosition(i);
        }
        taskRepository.saveAll(remaining);
    }

    // Change la tâche de colonne
    @Override
    public void moveTask(String taskId, TaskMoveDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);

        BoardColumn targetColumn = findColumnById(dto.getTargetColumnId());

        // Réindexe l'ancienne colonne
        String oldColumnId = task.getColumn().getIdColumn();
        task.setColumn(targetColumn);
        int newPosition = taskRepository.countByColumnIdColumn(dto.getTargetColumnId());
        task.setPosition(newPosition);
        taskRepository.save(task);

        List<Task> oldColumnTasks = taskRepository
                .findByColumnIdColumnOrderByPosition(oldColumnId);
        for (int i = 0; i < oldColumnTasks.size(); i++) {
            oldColumnTasks.get(i).setPosition(i);
        }
        taskRepository.saveAll(oldColumnTasks);
    }

    @Override
    public void updatePosition(String taskId, TaskPositionDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        String columnId = task.getColumn().getIdColumn();
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);

        List<Task> tasks = taskRepository
                .findByColumnIdColumnOrderByPosition(columnId);
        tasks.remove(task);
        tasks.add(dto.getPosition(), task);

        for (int i = 0; i < tasks.size(); i++) {
            tasks.get(i).setPosition(i);
        }
        taskRepository.saveAll(tasks);
    }


    @Override
    public TaskDto assignTask(String taskId, TaskAssignDto dto, String pseudo) {
        Task task = findTaskById(taskId);
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);

        if (dto.getPseudo() == null) {
            task.setAssignedUser(null);
        } else {
            User user = userRepository.findById(dto.getPseudo())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Utilisateur introuvable"));
            task.setAssignedUser(user);
        }

        return taskMapper.toDto(taskRepository.save(task));
    }


    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> searchTasks(String pseudo, String keyword,
                                     Priority priority, String assignedTo) {
        return taskRepository.searchTasks(pseudo, keyword, priority, assignedTo)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    // ---- Méthodes privées ----

    private Task findTaskById(String taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tâche introuvable"));
    }

    private BoardColumn findColumnById(String columnId) {
        return boardColumnRepository.findById(columnId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Colonne introuvable"));
    }

    private void checkIsMember(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous n'avez pas accès à ce tableau");
        }
    }

    /*
    public TaskDto getTaskWithComments(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        List<Comment> comments = commentRepository.findByTaskId(taskId);

        return convertToFullDTO(task, comments);
    }


    private TaskDto convertToFullDTO(Task task, List<Comment> comments) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setOrder(task.getOrder());
        dto.setPriority(task.getPriority());
        dto.setLimitDate(task.getLimitDate());

        if (task.getAssignedTo() != null) {
            dto.setAssignedToPseudo(task.getAssignedTo().getPseudo());
        }

        List<CommentDTO> commentDTOs = comments.stream().map(c -> {
            CommentDTO cDto = new CommentDTO();
            cDto.setId(c.getId());
            cDto.setTaskId(c.getTaskId());
            cDto.setContent(c.getContent());
            cDto.setAuthorPseudo(c.getAuthorPseudo());
            cDto.setCreatedAt(c.getCreatedAt());
            return cDto;
        }).collect(Collectors.toList());

        dto.setComments(commentDTOs);
        return dto;
    }
    */
}