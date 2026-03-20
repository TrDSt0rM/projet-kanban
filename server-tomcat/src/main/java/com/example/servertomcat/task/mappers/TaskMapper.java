package com.example.servertomcat.task.mappers;

import com.example.servertomcat.task.dtos.TaskDetailDto;
import com.example.servertomcat.task.dtos.TaskSummaryDto;
import com.example.servertomcat.task.entities.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Named("toSummaryDto")
    @Mapping(source = "assignedUser.pseudo", target = "assignedUserPseudo", defaultValue = "")
    TaskSummaryDto toDto(Task task);

    @Named("toDetailDto")
    @Mapping(source = "assignedUser.pseudo", target = "assignedUserPseudo", defaultValue = "")
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "taskAttachments", ignore = true)
    TaskDetailDto toDetailDto(Task task);
}
