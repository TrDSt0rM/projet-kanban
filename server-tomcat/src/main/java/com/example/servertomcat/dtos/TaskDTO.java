package com.example.servertomcat.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TaskDTO {
    private String id;
    private String name;
    private String description;
    private int order;
    private Integer priority;
    private LocalDate limitDate;
    private String assignedToPseudo;
    private String columnId;
    private List<CommentDTO> comments;
}