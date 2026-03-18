package com.example.servertomcat.user.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "APP_USER")
public class User {

    @Id
    @Column(nullable = false, length = 50)
    private String pseudo;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20, nullable = false)
    private UserRole userRole;

    @Column(name = "isActive")
    @JsonProperty("isActive")
    private boolean isActive = true;

}