package com.example.servertomcat.task.services.impl;

import com.example.servertomcat.task.dtos.TaskDto;
import com.example.servertomcat.dtos.CommentDTO;
import com.example.servertomcat.entities.Comment;
import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.repositories.CommentRepository;
import com.example.servertomcat.task.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private CommentRepository commentRepository;

    public TaskDto getTaskWithComments(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        List<Comment> comments = commentRepository.findByTaskId(taskId);

        return convertToFullDTO(task, comments);
    }

    /**
     * Convertit une tâche et ses commentaires en DTO complet.
     * @param task La tâche à convertir
     * @param comments Les commentaires associés
     * @return Le DTO complet
     */
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
}