package com.example.servertomcat.board.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardSummaryDto {
    private String idBoard;
    private String boardName;
    private String ownerPseudo;
}