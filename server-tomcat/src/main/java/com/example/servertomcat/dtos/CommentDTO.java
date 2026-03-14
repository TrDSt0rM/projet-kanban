package com.example.servertomcat.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private String id;
    private String content;
    private String authorPseudo;
    private LocalDateTime createdAt;
    private String taskId;
}
