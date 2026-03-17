package com.example.servertomcat.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
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
    @JsonProperty("isActive")
    private boolean isActive = true;

}