package com.example.servertomcat.task.controllers;

import com.example.servertomcat.task.dtos.*;
import com.example.servertomcat.task.enums.Priority;
import com.example.servertomcat.task.services.TaskService;
import com.example.servertomcat.task.services.impl.TaskServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/columns/{columnId}/tasks")
    public ResponseEntity<List<TaskDto>> getTasks(
            @PathVariable String columnId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(taskService.getTasks(columnId, pseudo));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDto> getTaskById(
            @PathVariable String taskId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(taskService.getTaskById(taskId, pseudo));
    }

    @PostMapping("/columns/{columnId}/tasks")
    public ResponseEntity<TaskDto> createTask(
            @PathVariable String columnId,
            @Valid @RequestBody TaskCreateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.status(201)
                .body(taskService.createTask(columnId, dto, pseudo));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable String taskId,
            @Valid @RequestBody TaskUpdateDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(taskService.updateTask(taskId, dto, pseudo));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable String taskId,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        taskService.deleteTask(taskId, pseudo);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/tasks/{taskId}/move")
    public ResponseEntity<Void> moveTask(
            @PathVariable String taskId,
            @Valid @RequestBody TaskMoveDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        taskService.moveTask(taskId, dto, pseudo);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/tasks/{taskId}/position")
    public ResponseEntity<Void> updatePosition(
            @PathVariable String taskId,
            @Valid @RequestBody TaskPositionDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        taskService.updatePosition(taskId, dto, pseudo);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/tasks/{taskId}/assign")
    public ResponseEntity<TaskDto> assignTask(
            @PathVariable String taskId,
            @Valid @RequestBody TaskAssignDto dto,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(taskService.assignTask(taskId, dto, pseudo));
    }

    @GetMapping("/boards/{boardId}/tasks/search")
    public ResponseEntity<List<TaskDto>> searchTasks(
            @PathVariable String boardId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String assignedTo,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(
                taskService.searchTasks(pseudo, keyword, priority, assignedTo));
    }

    /*
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTask(@PathVariable String id) {
        try {
            TaskDto task = taskService.getTaskWithComments(id);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    */
}