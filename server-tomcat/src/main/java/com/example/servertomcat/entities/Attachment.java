package com.example.servertomcat.entities;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "attachments")
public class Attachment {
    @Id
    private String id;
    private String taskId;
    private String fileName;
    private String contentType;
    private byte[] data;
}
