package com.example.servertomcat.comment.documents;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDocument {
    private String commentId;
    private String userId;
    private String message;
    private LocalDateTime date;
    private List<AttachmentDocument> attachments = new ArrayList<>();
}