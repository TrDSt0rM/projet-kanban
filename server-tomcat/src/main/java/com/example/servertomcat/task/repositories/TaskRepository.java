package com.example.servertomcat.task.repositories;

import com.example.servertomcat.task.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByColumnIdColumn(String columnId);
    @Query("SELECT count(t) FROM Task t WHERE t.column.board.id = :boardId")
    long countByBoardId(@Param("boardId") String boardId);
}