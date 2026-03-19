package com.example.servertomcat.task.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskMoveDto {
    @NotBlank(message = "La colonne cible est obligatoire")
    private String targetColumnId;
}
