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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public BoardDTO createBoard(BoardDTO dto, String ownerPseudo) {
        Board board = new Board();
        board.setId(dto.getId());
        board.setName(dto.getName());
        board.setMembers(new ArrayList<>());

        User ownerUser = userRepository.findById(ownerPseudo)
                .orElseThrow(() -> new RuntimeException("Propriétaire " + ownerPseudo + " introuvable"));

        BoardMember ownerEntry = new BoardMember();
        ownerEntry.setBoard(board);
        ownerEntry.setUser(ownerUser);
        ownerEntry.setRole(RoleMember.OWNER);
        board.getMembers().add(ownerEntry);

        if (dto.getMembers() != null) {
            for (String mPseudo : dto.getMembers()) {
                if (!mPseudo.equals(ownerPseudo)) {
                    User memberUser = userRepository.findById(mPseudo)
                            .orElseThrow(() -> new RuntimeException("Membre " + mPseudo + " introuvable"));

                    BoardMember memberEntry = new BoardMember();
                    memberEntry.setBoard(board);
                    memberEntry.setUser(memberUser);
                    memberEntry.setRole(RoleMember.MEMBER);
                    board.getMembers().add(memberEntry);
                }
            }
        }

        Board savedBoard = boardRepository.save(board);

        BoardDTO responseDto = new BoardDTO();
        responseDto.setId(savedBoard.getId());
        responseDto.setName(savedBoard.getName());
        responseDto.setOwnerPseudo(ownerPseudo);
        responseDto.setMembers(dto.getMembers());
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