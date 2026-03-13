package com.example.servertomcat.repositories;

import com.example.servertomcat.entities.Column;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface ColumnRepository extends JpaRepository<Column, Long> {

}
