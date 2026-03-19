package com.example.servertomcat.stats.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityDto {
    private String pseudo;
    private long taskCount;
    private long boardCount;
}
