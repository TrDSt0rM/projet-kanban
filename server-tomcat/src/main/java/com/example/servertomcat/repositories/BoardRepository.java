package com.example.servertomcat.repositories;

//import com.example.servertomcat.entities.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // Trouve les tableaux créés par l'utilisateur ou où il est membre
    List<Board> findByOwnerIdOrMembersId(Long ownerId, Long memberId);
}
