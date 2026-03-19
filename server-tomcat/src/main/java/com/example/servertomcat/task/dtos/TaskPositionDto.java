package com.example.servertomcat.task.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskPositionDto {
    @NotNull(message = "La position est obligatoire")
    private int position;
}
