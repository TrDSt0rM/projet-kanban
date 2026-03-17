package com.example.servertomcat.repositories;

import com.example.servertomcat.entities.BoardMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardMemberRepository extends JpaRepository<BoardMember, String> {
    List<BoardMember> findByBoardId(String boardId);
}
