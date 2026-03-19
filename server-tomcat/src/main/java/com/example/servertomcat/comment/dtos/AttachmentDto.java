package com.example.servertomcat.comment.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDto {
    private String fileId;
    private String fileName;
    private String empreinte;
    private String uploaderId;
    private LocalDateTime uploaderDate;
}