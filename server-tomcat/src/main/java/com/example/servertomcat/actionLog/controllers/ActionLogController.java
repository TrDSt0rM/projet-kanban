package com.example.servertomcat.actionLog.controllers;

import com.example.servertomcat.actionLog.dtos.ActionLogDto;
import com.example.servertomcat.actionLog.services.ActionLogService;
import com.example.servertomcat.common.dtos.PageDto;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ActionLogController {

    private final ActionLogService actionLogService;

    public ActionLogController(ActionLogService actionLogService) {
        this.actionLogService = actionLogService;
    }

    @GetMapping("/boards/{boardId}/logs")
    public ResponseEntity<PageDto<ActionLogDto>> getBoardLogs(
            @PathVariable String boardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(actionLogService.getBoardLogs(boardId, pseudo, page, size));
    }

    @GetMapping("/tasks/{taskId}/logs")
    public ResponseEntity<PageDto<ActionLogDto>> getTaskLogs(
            @PathVariable String taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("X-User-Pseudo") String pseudo) {
        return ResponseEntity.ok(actionLogService.getTaskLogs(taskId, pseudo, page, size));
    }

}