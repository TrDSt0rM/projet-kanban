package com.example.servertomcat.task.dtos;

import com.example.servertomcat.task.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSummaryDto {
    private String idTask;
    private String taskName;
    private String description;
    private int position;
    private Priority priority;
    private LocalDate limitDate;
    private String assignedUserPseudo;
    //private List<CommentDTO> comments;
}