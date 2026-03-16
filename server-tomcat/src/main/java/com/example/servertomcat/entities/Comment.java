package com.example.servertomcat.entities;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String taskId;
    private String content;
    private String authorPseudo;
    private LocalDateTime createdAt;
}