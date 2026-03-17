package com.example.servertomcat.entities;

import com.example.servertomcat.enums.RoleMember;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
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

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<BoardColumn> columns = new ArrayList<>();

    public User getOwner(){
        return members.stream()
                .filter(m -> m.getRole() == RoleMember.OWNER)
                .map(BoardMember::getUser)
                .findFirst()
                .orElse(null);
    }
}