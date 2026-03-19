package com.example.servertomcat.task.dtos;

import com.example.servertomcat.task.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDto {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String taskName;

    @Size(max = 1000)
    private String description;

    private Priority priority;
    private LocalDate limitDate;
}