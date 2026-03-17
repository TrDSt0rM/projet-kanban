package com.example.servertomcat.entities;

import com.example.servertomcat.enums.RoleMember;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table (name = "BOARD_MEMBER")
public class BoardMember {

    @EmbeddedId
    private BoardMemberId id = new BoardMemberId();

    @ManyToOne
    @MapsId("idBoard")
    @JoinColumn(name = "id_board", nullable = false)
    private Board board;

    @ManyToOne
    @MapsId("pseudoUser")
    @JoinColumn(name = "pseudo", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private RoleMember role;
}
