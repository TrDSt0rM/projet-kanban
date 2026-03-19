package com.example.servertomcat.actionLog.entities;

import com.example.servertomcat.user.entities.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "ACTION_LOG")
public class ActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "action_type", length = 50, nullable = false)
    private String actionType;

    @Column(name = "datetime", nullable = false)
    private LocalDateTime datetime;

    @Column(name = "target_id", length = 36)
    private String targetId;

    @Column(name = "target_type", length = 20)
    private String targetType;

    @ManyToOne
    @JoinColumn(name = "pseudo")
    private User user;
}
