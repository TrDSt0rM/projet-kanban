package com.example.servertomcat.invitation;

import com.example.servertomcat.board.entities.Board;
import com.example.servertomcat.user.entities.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "INVITATION")
public class Invitation {

    @EmbeddedId
    private InvitationId id = new InvitationId();

    @ManyToOne
    @MapsId("pseudo")
    @JoinColumn(name = "pseudo", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("idBoard")
    @JoinColumn(name = "id_board", nullable = false)
    private Board board;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;
}
