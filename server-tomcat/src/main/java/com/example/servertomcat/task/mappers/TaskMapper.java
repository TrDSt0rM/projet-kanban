package com.example.servertomcat.task.mappers;

import com.example.servertomcat.task.dtos.TaskSummaryDto;
import com.example.servertomcat.task.entities.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "assignedUser.pseudo", target = "assignedUserPseudo")
    TaskSummaryDto toDto(Task task);
}
