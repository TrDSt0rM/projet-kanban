package com.example.servertomcat.comment.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String commentId;
    private String userId;
    private String message;
    private LocalDateTime date;
    private List<AttachmentDto> attachments;
}