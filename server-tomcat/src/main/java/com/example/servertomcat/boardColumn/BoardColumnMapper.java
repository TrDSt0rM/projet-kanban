package com.example.servertomcat.boardColumn;

import com.example.servertomcat.boardColumn.dtos.BoardColumnDto;
import com.example.servertomcat.task.mappers.TaskMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = TaskMapper.class)
public interface BoardColumnMapper {

    @Mapping(target = "tasks", qualifiedByName = "toSummaryDto")
    BoardColumnDto toDto(BoardColumn boardColumn);
}
