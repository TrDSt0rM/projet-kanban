package com.example.servertomcat.board.mappers;

import com.example.servertomcat.board.dtos.BoardDetailDto;
import com.example.servertomcat.board.dtos.BoardSummaryDto;
import com.example.servertomcat.board.entities.Board;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper (componentModel = "spring", uses = BoardMemberMapper.class)
public interface BoardMapper {

    @Mapping(source = "board.idBoard", target = "idBoard")
    @Mapping(source = "board.boardName", target = "boardName")
    @Mapping(source = "ownerPseudo", target = "ownerPseudo")
    BoardSummaryDto toSummaryDto(Board board, String ownerPseudo);

    @Mapping(source = "board.idBoard", target = "idBoard")
    @Mapping(source = "board.boardName", target = "boardName")
    @Mapping(source = "ownerPseudo", target = "ownerPseudo")
    @Mapping(source = "board.members", target = "members")
    BoardDetailDto toDetailDto(Board board, String ownerPseudo);
}
