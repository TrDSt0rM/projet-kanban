package com.example.servertomcat.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "BOARD_COLUMN")
@Getter
@Setter
public class BoardColumn {
    @Id
    @Column(name = "id_column", length = 36)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "position", nullable = false)
    private int position;

    @ManyToOne
    @JoinColumn(name = "id_board", nullable = false)
    @JsonIgnore
    private Board board;
}