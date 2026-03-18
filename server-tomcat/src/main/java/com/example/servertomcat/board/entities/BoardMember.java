package com.example.servertomcat.board.entities;

import com.example.servertomcat.board.entities.Board;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.board.enums.MemberRole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
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
    @Column(name = "role",  length = 20, nullable = false)
    private MemberRole role;
}
