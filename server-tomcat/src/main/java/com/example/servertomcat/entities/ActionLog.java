package com.example.servertomcat.entities;

import com.example.servertomcat.user.entities.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ACTION_LOG")
public class ActionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "action_type")
    private String actionType;

    private LocalDateTime datetime;

    @Column(name = "target_id")
    private String targetId;

    @ManyToOne
    @JoinColumn(name = "pseudo")
    private User user;
}
