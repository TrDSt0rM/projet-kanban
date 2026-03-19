package com.example.servertomcat.boardColumn;

import com.example.servertomcat.boardColumn.dtos.BoardColumnDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BoardColumnMapper {
    BoardColumnDto toDto(BoardColumn boardColumn);
}
