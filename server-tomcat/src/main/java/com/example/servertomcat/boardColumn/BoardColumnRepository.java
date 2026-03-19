package com.example.servertomcat.boardColumn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardColumnRepository extends JpaRepository<BoardColumn, String> {
    List<BoardColumn> findByBoardIdBoardOrderByPosition(String boardId);

    boolean existsByBoardIdBoardAndColumnName(String boardId, String columnName);

    int countByBoardIdBoard(String boardId);
}
