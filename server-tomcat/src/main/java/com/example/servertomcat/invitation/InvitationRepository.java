package com.example.servertomcat.invitation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, InvitationId> {

    List<Invitation> findByIdPseudo(String pseudo);

    boolean existsByIdPseudoAndIdIdBoard(String pseudo, String boardId);
}
