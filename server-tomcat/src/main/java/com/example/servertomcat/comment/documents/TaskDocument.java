package com.example.servertomcat.comment.documents;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "tasks")
public class TaskDocument {

    @Id
    private String id;

    private String taskId; // référence vers l'UUID SQL

    private List<AttachmentDocument> taskAttachments = new ArrayList<>();

    private List<CommentDocument> comments = new ArrayList<>();
}
