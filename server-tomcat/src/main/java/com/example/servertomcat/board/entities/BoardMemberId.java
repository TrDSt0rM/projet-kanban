package com.example.servertomcat.board.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class BoardMemberId implements Serializable {
    @Column(name = "id_board")
    private String idBoard;

    @Column(name = "pseudo")
    private String pseudoUser;
}
