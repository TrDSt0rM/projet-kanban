package com.example.servertomcat.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "APP_USER")
public class User {
    @Id
    @Column(length = 50)
    private String pseudo;

    @Column(nullable = false)
    private String password;

    @Column(length = 20, nullable = false)
    private String role = "USER";

    @Column(name = "isActive")
    private boolean isActive = true;
}