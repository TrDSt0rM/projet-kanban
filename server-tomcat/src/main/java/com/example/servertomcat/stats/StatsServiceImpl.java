package com.example.servertomcat.stats;

import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.board.repositories.BoardRepository;
import com.example.servertomcat.stats.dtos.StatsDto;
import com.example.servertomcat.stats.dtos.UserActivityDto;
import com.example.servertomcat.task.repositories.TaskRepository;
import com.example.servertomcat.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;
    private final BoardMemberRepository boardMemberRepository;

    @Override
    public StatsDto getGlobalStats() {
        long totalUsers = userRepository.count();
        long totalBoards = boardRepository.count();
        long totalTasks = taskRepository.count();

        List<UserActivityDto> userActivity = userRepository.findAll().stream()
                .map(user -> {
                    long taskCount = taskRepository
                            .countByAssignedUserPseudo(user.getPseudo());
                    long boardCount = boardMemberRepository
                            .countByIdPseudoUser(user.getPseudo());
                    return new UserActivityDto(user.getPseudo(), taskCount, boardCount);
                })
                .toList();

        return new StatsDto(totalUsers, totalBoards, totalTasks, userActivity);
    }
}
