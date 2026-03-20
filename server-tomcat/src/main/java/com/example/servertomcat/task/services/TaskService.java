package com.example.servertomcat.task.services;

import com.example.servertomcat.task.dtos.*;
import com.example.servertomcat.task.enums.Priority;

import java.util.List;

public interface TaskService {
    List<TaskSummaryDto> getTasks(String columnId, String pseudo);
    TaskSummaryDto getTaskById(String taskId, String pseudo);
    TaskSummaryDto createTask(String columnId, TaskCreateDto dto, String pseudo);
    TaskSummaryDto updateTask(String taskId, TaskUpdateDto dto, String pseudo);
    void deleteTask(String taskId, String pseudo);
    void moveTask(String taskId, TaskMoveDto dto, String pseudo);
    void updatePosition(String taskId, TaskPositionDto dto, String pseudo);
    TaskSummaryDto assignTask(String taskId, TaskAssignDto dto, String pseudo);
    List<TaskSummaryDto> searchTasks(String pseudo, String keyword, Priority priority, String assignedTo);
    void deleteComment(String taskId, String commentId, String pseudo);
}
