package com.example.servertomcat.repositories;

import com.example.servertomcat.entities.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ColumnRepository extends JpaRepository<BoardColumn, String> {
}