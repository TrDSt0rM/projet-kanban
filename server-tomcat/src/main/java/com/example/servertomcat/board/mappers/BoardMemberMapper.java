package com.example.servertomcat.board.mappers;

import com.example.servertomcat.board.dtos.BoardMemberDto;
import com.example.servertomcat.board.entities.BoardMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BoardMemberMapper {

    @Mapping(source = "user.pseudo", target = "pseudo")
    @Mapping(source = "id.idBoard", target = "idBoard")
    BoardMemberDto toDto(BoardMember boardMember);
}
