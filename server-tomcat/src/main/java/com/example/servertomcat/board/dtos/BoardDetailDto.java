package com.example.servertomcat.board.dtos;

import com.example.servertomcat.BoardColumn.dtos.BoardColumnDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardDetailDto {
    private String idBoard;
    private String boardName;
    private String ownerPseudo;
    private List<BoardMemberDto> members;
    private List<BoardColumnDto> columns; // on le remplira dans le module column
}