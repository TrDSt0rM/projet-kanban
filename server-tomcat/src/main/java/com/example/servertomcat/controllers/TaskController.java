package com.example.servertomcat.controllers;

import com.example.servertomcat.dtos.TaskDTO;
import com.example.servertomcat.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable String id) {
        try {
            TaskDTO task = taskService.getTaskWithComments(id);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}