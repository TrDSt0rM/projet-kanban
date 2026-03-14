package com.example.servertomcat.repositories;

import com.example.servertomcat.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByColumnId(Long columnId);
    long countByBoardId(Long boardId);
}