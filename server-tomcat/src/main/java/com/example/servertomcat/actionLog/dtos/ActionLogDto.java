package com.example.servertomcat.actionLog.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActionLogDto {
    private Long id;
    private String actionType;
    private LocalDateTime datetime;
    private String targetId;
    private String targetType;
    private String userPseudo;
}
