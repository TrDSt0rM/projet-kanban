package com.example.servertomcat.boardColumn.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardColumnPositionDto {
    @NotNull(message = "La positon est obligatoire")
    private int position;
}
