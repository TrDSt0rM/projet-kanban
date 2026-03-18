package com.example.servertomcat.BoardColumn;

import com.example.servertomcat.BoardColumn.dtos.BoardColumnDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BoardColumnMapper {
    BoardColumnDto toDto(BoardColumn boardColumn);
}
