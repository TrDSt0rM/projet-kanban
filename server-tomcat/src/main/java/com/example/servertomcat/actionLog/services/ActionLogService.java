package com.example.servertomcat.actionLog.services;

import com.example.servertomcat.actionLog.dtos.ActionLogDto;
import com.example.servertomcat.common.dtos.PageDto;

public interface ActionLogService {
    PageDto<ActionLogDto> getBoardLogs(String boardId, String pseudo, int page, int size);
    PageDto<ActionLogDto> getTaskLogs(String taskId, String pseudo, int page, int size);
    PageDto<ActionLogDto> getLogs(int page, int size);
}