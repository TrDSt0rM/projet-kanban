package com.example.servertomcat.entities;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class BoardMemberId implements Serializable {
    private String idBoard;
    private String pseudoUser;
}
