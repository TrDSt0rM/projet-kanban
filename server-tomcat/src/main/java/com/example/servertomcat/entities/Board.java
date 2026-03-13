package com.example.servertomcat.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "BOARD")
public class Board {
    @Id
    @Column(name = "id_board", length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<BoardColumn> columns;
}
