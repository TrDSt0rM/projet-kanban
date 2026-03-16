package com.example.servertomcat.entities;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
@Getter @Setter
public class Comment {
    @Id
    private String id;
    private String taskId;
    private String content;
    private String authorPseudo;
    private LocalDateTime createdAt;
}