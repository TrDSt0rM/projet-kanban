package com.example.servertomcat.BoardColumn;

import com.example.servertomcat.BoardColumn.dtos.BoardColumnCreateDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnPositionDto;
import com.example.servertomcat.BoardColumn.dtos.BoardColumnUpdateDto;
import com.example.servertomcat.board.entities.Board;
import com.example.servertomcat.board.enums.MemberRole;
import com.example.servertomcat.board.repositories.BoardMemberRepository;
import com.example.servertomcat.board.repositories.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardColumnServiceImpl implements BoardColumnService {

    private final BoardColumnRepository boardColumnRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final BoardRepository boardRepository;
    private final BoardColumnMapper boardColumnMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BoardColumnDto> getColumns(String boardId, String pseudo) {
        checkIsMember(boardId, pseudo);
        return boardColumnRepository.findByBoardIdBoardOrderByPosition(boardId)
                .stream()
                .map(boardColumnMapper::toDto)
                .toList();
    }

    @Override
    public BoardColumnDto createColumn(String boardId, BoardColumnCreateDto dto, String pseudo) {
        checkIsOwner(boardId, pseudo);

        if (boardColumnRepository.existsByBoardIdBoardAndColumnName(boardId, dto.getColumnName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Une colonne avec ce nom existe déjà dans ce tableau");
        }

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tableau introuvable"));

        int nextPosition = boardColumnRepository.countByBoardIdBoard(boardId);

        BoardColumn column = new BoardColumn();
        column.setIdColumn(UUID.randomUUID().toString());
        column.setColumnName(dto.getColumnName());
        column.setPosition(nextPosition);
        column.setBoard(board);

        return boardColumnMapper.toDto(boardColumnRepository.save(column));
    }

    @Override
    public BoardColumnDto updateColumn(String columnId, BoardColumnUpdateDto dto, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        checkIsOwner(column.getBoard().getIdBoard(), pseudo);
        column.setColumnName(dto.getColumnName());
        return boardColumnMapper.toDto(boardColumnRepository.save(column));
    }


    @Override
    public void updatePosition(String columnId, BoardColumnPositionDto dto, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        String boardId = column.getBoard().getIdBoard();
        checkIsOwner(boardId, pseudo);

        List<BoardColumn> columns = boardColumnRepository
                .findByBoardIdBoardOrderByPosition(boardId);

        // Retire la colonne de sa position actuelle et la reinsère à la nouvelle
        columns.remove(column);
        columns.add(dto.getPosition(), column);

        // Réindexe toutes les positions
        for (int i = 0; i < columns.size(); i++) {
            columns.get(i).setPosition(i);
        }
        boardColumnRepository.saveAll(columns);
    }

    @Override
    public void deleteColumn(String columnId, String pseudo) {
        BoardColumn column = findColumnById(columnId);
        String boardId = column.getBoard().getIdBoard();
        checkIsOwner(boardId, pseudo);
        boardColumnRepository.deleteById(columnId);

        // Réindexe les positions après suppression
        List<BoardColumn> remaining = boardColumnRepository
                .findByBoardIdBoardOrderByPosition(boardId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setPosition(i);
        }
        boardColumnRepository.saveAll(remaining);
    }


    // Méthodes privées
    private BoardColumn findColumnById(String columnId) {
        return boardColumnRepository.findById(columnId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Colonne introuvable"));
    }

    private void checkIsMember(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUser(boardId, pseudo)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Vous n'avez pas accès à ce tableau");
        }
    }

    private void checkIsOwner(String boardId, String pseudo) {
        if (!boardMemberRepository.existsByIdIdBoardAndIdPseudoUserAndRole(
                boardId, pseudo, MemberRole.OWNER)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Seul le propriétaire peut effectuer cette action");
        }
    }
}
