package com.example.servertomcat.board.services;

import com.example.servertomcat.board.dtos.*;

import java.util.List;

public interface BoardService {

    // Tableaux
    List<BoardSummaryDto> getAllBoards(String userPseudo);
    BoardDetailDto getBoardById(String boardId, String pseudo);
    BoardSummaryDto createBoard(BoardCreateDto dto, String pseudo);
    BoardSummaryDto updateBoard(String boardId, BoardUpdateDto dto, String pseudo);
    void deleteBoard(String boardId, String pseudo);

    // Membres
    List<BoardMemberDto> getMembers(String boardId, String pseudo);
    void removeMember(String boardId, String targetPseudo, String pseudo);
}
