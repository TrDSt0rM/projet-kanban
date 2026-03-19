package com.example.servertomcat.invitation;

import com.example.servertomcat.invitation.dtos.InvitationDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvitationMapper {

    @Mapping(source = "id.pseudo", target = "pseudo")
    @Mapping(source = "id.idBoard", target = "idBoard")
    @Mapping(source = "board.boardName", target = "boardName")
    InvitationDto toDto(Invitation invitation);
}
