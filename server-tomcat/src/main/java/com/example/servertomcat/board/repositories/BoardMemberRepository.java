package com.example.servertomcat.board.repositories;

import com.example.servertomcat.board.entities.BoardMember;
import com.example.servertomcat.board.entities.BoardMemberId;
import com.example.servertomcat.board.enums.MemberRole;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardMemberRepository extends JpaRepository<BoardMember, BoardMemberId> {

    List<BoardMember> findByIdIdBoard(String boardId);

    Optional<BoardMember> findByIdIdBoardAndIdPseudoUser(String boardId, String pseudo);

    Optional<BoardMember> findByIdIdBoardAndRole(String boardId, MemberRole role);

    boolean existsByIdIdBoardAndIdPseudoUser(String boardId, String pseudo);

    // Vérifie si un user est owner d'un tableau
    boolean existsByIdIdBoardAndIdPseudoUserAndRole(
            String boardId, String pseudo, MemberRole role);

    long countByIdPseudoUser(String pseudo);

    @Query("SELECT bm.id.idBoard FROM BoardMember bm WHERE bm.id.pseudoUser = :pseudo AND bm.role = 'OWNER'")
    List<String> findBoardIdsByOwner(@Param("pseudo") String pseudo);

    // Suppression par le champ pseudoUser à l'intérieur de l'Id
    @Modifying
    @Transactional
    void deleteByIdPseudoUser(String pseudoUser);
}
