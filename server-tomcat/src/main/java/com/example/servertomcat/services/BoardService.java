package com.example.servertomcat.services;

import com.example.servertomcat.dtos.BoardDTO;
import com.example.servertomcat.dtos.BoardMemberDTO;
import com.example.servertomcat.entities.Board;
import com.example.servertomcat.entities.User;
import com.example.servertomcat.entities.BoardMember;
import com.example.servertomcat.enums.RoleMember;
import com.example.servertomcat.repositories.BoardRepository;
import com.example.servertomcat.repositories.BoardMemberRepository;
import com.example.servertomcat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BoardMemberRepository boardMemberRepository;

    public List<BoardDTO> getBoardsForUser(String pseudo) {
        return boardRepository.findByMembers_User_Pseudo(pseudo).stream()
                .map(b -> {
                    BoardDTO dto = new BoardDTO();
                    dto.setId(b.getId());
                    dto.setName(b.getName());
                    dto.setOwnerPseudo(b.getOwner() != null ? b.getOwner().getPseudo() : null);
                    return dto;
                }).toList();
    }

    public Board getBoardById(String id) {
        return boardRepository.findById(id).orElse(null);
    }

    public BoardDTO createBoard(BoardDTO dto, String ownerPseudo) {
        User creator = userRepository.findById(ownerPseudo)
                .orElseThrow(() -> new RuntimeException("Utilisateur " + ownerPseudo + " inexistant"));

        Board board = new Board();
        board.setId(dto.getId());
        board.setName(dto.getName());

        BoardMember owner = new BoardMember();
        owner.setBoard(board);
        owner.setUser(creator);
        owner.setRole(RoleMember.OWNER);

        board.getMembers().add(owner);

        Board saveBoard = boardRepository.save(board);

        BoardDTO responseDto = new BoardDTO();
        responseDto.setId(saveBoard.getId());
        responseDto.setName(saveBoard.getName());
        responseDto.setOwnerPseudo(ownerPseudo);
        responseDto.setColumns(new ArrayList<>());
        return responseDto;
    }

    public void deleteBoard(String id) {
        boardRepository.deleteById(id);
    }

    public List<BoardMemberDTO> getBoardMembers(String id) {
        List<BoardMember> members = boardMemberRepository.findByBoardId(id);
        return members.stream().map(member -> {
            BoardMemberDTO boardMemberDto = new BoardMemberDTO();
            boardMemberDto.setBoardId(member.getBoard().getId());
            boardMemberDto.setPseudo(member.getUser().getPseudo());
            boardMemberDto.setRole(member.getRole());
            return boardMemberDto;
        }).toList();
    }

    public boolean removeBoardMember(String boardId, String memberPseudo) {
        List<BoardMember> members = boardMemberRepository.findByBoardId(boardId);
        BoardMember toRemove = members.stream()
                .filter(m -> m.getUser().getPseudo().equals(memberPseudo))
                .findFirst()
                .orElse(null);
        if (toRemove != null) {
            boardMemberRepository.delete(toRemove);
            return true;
        }
        return false;
    }
}