package com.example.servertomcat.repositories;

import com.example.servertomcat.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByColumnId(String columnId);
    @Query("SELECT count(t) FROM Task t WHERE t.column.board.id = :boardId")
    long countByBoardId(@Param("boardId") String boardId);
}