package com.example.servertomcat.user.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "APP_USER")
public class User {

    @Id
    @Column(name = "pseudo", length = 50, nullable = false, updatable = false)
    private String pseudo;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20, nullable = false)
    private UserRole userRole;

    @Column(name = "isActive")
    @JsonProperty("isActive")
    private boolean isActive = true;
}