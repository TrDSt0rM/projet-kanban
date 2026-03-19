package com.example.servertomcat.stats.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private long totalUsers;
    private long totalBoards;
    private long totalTasks;
    private List<UserActivityDto> userActivity;
}

