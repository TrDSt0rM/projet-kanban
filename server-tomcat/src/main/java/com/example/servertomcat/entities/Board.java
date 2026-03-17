package com.example.servertomcat.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "BOARD")
@Getter @Setter
public class Board {
    @Id
    @Column(name = "id_board")
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "pseudo_owner")
    private User owner;

    @ManyToMany
    @JoinTable(
            name = "BOARD_MEMBER",
            joinColumns = @JoinColumn(name = "id_board"),
            inverseJoinColumns = @JoinColumn(name = "pseudo")
    )
    private List<User> members;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<BoardColumn> columns;
}