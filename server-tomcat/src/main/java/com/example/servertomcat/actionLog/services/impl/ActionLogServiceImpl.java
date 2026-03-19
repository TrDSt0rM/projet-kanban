package com.example.servertomcat.actionLog.services.impl;

import com.example.servertomcat.actionLog.dtos.ActionLogDto;
import com.example.servertomcat.actionLog.entities.ActionLog;
import com.example.servertomcat.actionLog.mappers.ActionLogMapper;
import com.example.servertomcat.actionLog.repositories.ActionLogRepository;
import com.example.servertomcat.actionLog.services.ActionLogService;
import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.common.dtos.PageDto;
import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.task.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.resource.ResourceUrlProvider;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ActionLogServiceImpl implements ActionLogService {

    private final ActionLogRepository actionLogRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final TaskRepository taskRepository;
    private final ActionLogMapper actionLogMapper;
    private final HandlerMapping resourceHandlerMapping;
    private final ResourceUrlProvider resourceUrlProvider;

    @Override
    public PageDto<ActionLogDto> getBoardLogs(String boardId, String pseudo, int page, int size) {
        checkIsMember(boardId, pseudo);
        Pageable pageable = PageRequest.of(page, size);
        Page<ActionLog> result = actionLogRepository
                .findByTargetIdAndTargetTypeOrderByDatetimeDesc(boardId, "BOARD", pageable);

        return new PageDto<>(
                result.getContent().stream().map(actionLogMapper::toDto).toList(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getNumber(),
                result.isLast(),
                result.isFirst()
        );
    }

    @Override
    public PageDto<ActionLogDto> getTaskLogs(String taskId, String pseudo, int page, int size) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tâche introuvable"));
        checkIsMember(task.getColumn().getBoard().getIdBoard(), pseudo);
        Pageable pageable = PageRequest.of(page, size);
        Page<ActionLog> result = actionLogRepository
                .findByTargetIdAndTargetTypeOrderByDatetimeDesc(taskId, "TASK", pageable);

        return new PageDto<>(
                result.getContent().stream().map(actionLogMapper::toDto).toList(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getNumber(),
                result.isLast(),
                result.isFirst()
        );
    }

    private void checkIsMember(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous n'avez pas accès à ce tableau");
        }
    }
}