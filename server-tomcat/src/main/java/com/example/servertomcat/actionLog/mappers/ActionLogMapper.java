package com.example.servertomcat.actionLog.mappers;

import com.example.servertomcat.actionLog.dtos.ActionLogDto;
import com.example.servertomcat.actionLog.entities.ActionLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActionLogMapper {

    @Mapping(source = "user.pseudo", target = "userPseudo")
    ActionLogDto toDto(ActionLog actionLog);
}
