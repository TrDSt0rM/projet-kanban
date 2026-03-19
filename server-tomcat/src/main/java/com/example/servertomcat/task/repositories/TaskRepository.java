package com.example.servertomcat.task.repositories;

import com.example.servertomcat.task.entities.Task;
import com.example.servertomcat.task.enums.Priority;
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

    List<Task> findByColumnIdColumnOrderByPosition(String columnId);

    int countByColumnIdColumn(String columnId);

    // Recherche par mot-clé
    @Query("SELECT t FROM Task t " +
            "JOIN t.column c " +
            "JOIN c.board b " +
            "JOIN BoardMember bm ON bm.id.idBoard = b.idBoard " +
            "WHERE bm.id.pseudoUser = :pseudo " +
            "AND (:keyword IS NULL OR LOWER(t.taskName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:priority IS NULL OR t.priority = :priority) " +
            "AND (:assignedTo IS NULL OR t.assignedUser.pseudo = :assignedTo)")
    List<Task> searchTasks(@Param("pseudo") String pseudo,
                           @Param("keyword") String keyword,
                           @Param("priority") Priority priority,
                           @Param("assignedTo") String assignedTo);

    long countByAssignedUserPseudo(String pseudo);
}