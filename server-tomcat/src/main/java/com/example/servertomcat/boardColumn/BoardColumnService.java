package com.example.servertomcat.boardColumn;

import com.example.servertomcat.boardColumn.dtos.BoardColumnCreateDto;
import com.example.servertomcat.boardColumn.dtos.BoardColumnDto;
import com.example.servertomcat.boardColumn.dtos.BoardColumnPositionDto;
import com.example.servertomcat.boardColumn.dtos.BoardColumnUpdateDto;

import java.util.List;

public interface BoardColumnService {
    List<BoardColumnDto> getColumns(String boardId, String pseudo);
    BoardColumnDto createColumn(String boardId, BoardColumnCreateDto dto, String pseudo);
    BoardColumnDto updateColumn(String columnId, BoardColumnUpdateDto dto, String pseudo);
    void updatePosition(String columnId, BoardColumnPositionDto dto, String pseudo);
    void deleteColumn(String columnId, String pseudo);
}
