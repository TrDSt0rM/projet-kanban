package com.example.servertomcat.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "TASK")
public class Task {
    @Id
    @Column(name = "id_task", length = 36)
    private String id; // UUID

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
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
