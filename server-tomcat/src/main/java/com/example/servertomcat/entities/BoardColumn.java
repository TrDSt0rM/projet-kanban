package com.example.servertomcat.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "BOARD_COLUMN")
public class BoardColumn {
    @Id
    @Column(name = "id_column")
    private String id;

    private String name;

    @Column(name = "`order` Rose")
    private int order;

    @ManyToOne
    @JoinColumn(name = "id_board")
    private Board board;
}
