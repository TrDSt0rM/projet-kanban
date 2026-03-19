package com.example.servertomcat.task.entities;

import com.example.servertomcat.boardColumn.BoardColumn;
import com.example.servertomcat.task.enums.Priority;
import com.example.servertomcat.user.entities.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "TASK")
public class Task {
    @Id
    @Column(name = "id_task", length = 36)
    private String idTask;

    @Column(name = "name", nullable = false, length = 100)
    private String taskName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "position", nullable = false)
    private int position;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @Column(name = "limit_date")
    private LocalDate limitDate;

    @ManyToOne
    @JoinColumn(name = "id_column", nullable = false)
    private BoardColumn column;

    @ManyToOne
    @JoinColumn(name = "pseudo")
    private User assignedUser;
}
