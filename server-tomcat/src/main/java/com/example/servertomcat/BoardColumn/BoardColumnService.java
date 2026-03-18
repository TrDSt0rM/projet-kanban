package com.example.servertomcat.BoardColumn;

import com.example.servertomcat.BoardColumn.dtos.BoardColumnCreateDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnPositionDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnUpdateDto;

import java.util.List;

public interface BoardColumnService {
    List<BoardColumnDto> getColumns(String boardId, String pseudo);
    BoardColumnDto createColumn(String boardId, BoardColumnCreateDto dto, String pseudo);
    BoardColumnDto updateColumn(String columnId, BoardColumnUpdateDto dto, String pseudo);
    void updatePosition(String columnId, BoardColumnPositionDto dto, String pseudo);
    void deleteColumn(String columnId, String pseudo);
}
