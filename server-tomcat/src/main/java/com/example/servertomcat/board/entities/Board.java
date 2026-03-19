package com.example.servertomcat.board.entities;

import com.example.servertomcat.boardColumn.BoardColumn;
import com.example.servertomcat.board.enums.MemberRole;
import com.example.servertomcat.user.entities.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name="BOARD")
public class Board {

    @Id
    @Column(name = "id_board", length = 36)
    private String idBoard;

    @Column(name = "name", nullable = false, length = 100)
    private String boardName;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardColumn> columns = new ArrayList<>();

    public String getOwnerPseudo(){
        return getOwner().getPseudo();
    }

    public User getOwner(){
        return members.stream()
                .filter(m -> m.getRole() == MemberRole.OWNER)
                .map(BoardMember::getUser)
                .findFirst()
                .orElse(null);
    }
}
