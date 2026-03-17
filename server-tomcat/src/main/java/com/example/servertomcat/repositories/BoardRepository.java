package com.example.servertomcat.repositories;

import com.example.servertomcat.entities.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, String> {
    List<Board> findByMembers_User_Pseudo(String pseudo);
}
