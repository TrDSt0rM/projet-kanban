package com.example.servertomcat.task.entities;

import com.example.servertomcat.BoardColumn.BoardColumn;
import com.example.servertomcat.user.entities.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "TASK")
@Getter
@Setter
public class Task {
    @Id
    @Column(name = "id_task", length = 36)
    private String id;

    private String name;
    private String description;

    @Column(name = "`order`", nullable = false)
    private int order;

    private Integer priority;

    @Column(name = "limit_date")
    private LocalDate limitDate;

    @ManyToOne
    @JoinColumn(name = "pseudo")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "id_column", nullable = false)
    private BoardColumn column;
}
