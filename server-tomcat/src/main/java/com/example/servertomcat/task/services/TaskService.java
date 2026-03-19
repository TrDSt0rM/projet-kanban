package com.example.servertomcat.task.services;

import com.example.servertomcat.task.dtos.*;
import com.example.servertomcat.task.enums.Priority;

import java.util.List;

public interface TaskService {
    List<TaskDto> getTasks(String columnId, String pseudo);
    TaskDto getTaskById(String taskId, String pseudo);
    TaskDto createTask(String columnId, TaskCreateDto dto, String pseudo);
    TaskDto updateTask(String taskId, TaskUpdateDto dto, String pseudo);
    void deleteTask(String taskId, String pseudo);
    void moveTask(String taskId, TaskMoveDto dto, String pseudo);
    void updatePosition(String taskId, TaskPositionDto dto, String pseudo);
    TaskDto assignTask(String taskId, TaskAssignDto dto, String pseudo);
    List<TaskDto> searchTasks(String pseudo, String keyword, Priority priority, String assignedTo);
}
