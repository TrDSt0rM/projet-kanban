package com.example.servertomcat.services;

import com.example.servertomcat.dtos.TaskDTO;
import com.example.servertomcat.dtos.CommentDTO;
import com.example.servertomcat.entities.Comment;
import com.example.servertomcat.entities.Task;
import com.example.servertomcat.repositories.CommentRepository;
import com.example.servertomcat.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private CommentRepository commentRepository;

    public TaskDTO getTaskWithComments(String taskId) {
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
    private TaskDTO convertToFullDTO(Task task, List<Comment> comments) {
        TaskDTO dto = new TaskDTO();
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