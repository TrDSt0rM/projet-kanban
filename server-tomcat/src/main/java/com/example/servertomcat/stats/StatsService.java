package com.example.servertomcat.stats;

import com.example.servertomcat.stats.dtos.StatsDto;

public interface StatsService {
    StatsDto getGlobalStats();
}
