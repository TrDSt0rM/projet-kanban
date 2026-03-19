package com.example.servertomcat.invitation;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class InvitationId implements Serializable {
    @Column(name = "pseudo")
    private String pseudo;

    @Column(name = "id_board")
    private String idBoard;
}