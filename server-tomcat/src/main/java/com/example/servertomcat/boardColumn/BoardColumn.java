package com.example.servertomcat.boardColumn;

import com.example.servertomcat.board.entities.Board;
import com.example.servertomcat.task.entities.Task;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "BOARD_COLUMN")
public class BoardColumn {
    @Id
    @Column(name = "id_column", length = 36)
    private String idColumn;

    @Column(name = "name", nullable = false)
    private String columnName;

    @Column(name = "position", nullable = false)
    private int position;

    @ManyToOne
    @JoinColumn(name = "id_board", nullable = false)
    @JsonIgnore
    private Board board;

    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();
}