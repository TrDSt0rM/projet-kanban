package com.example.servertomcat.dtos;

import lombok.Data;

@Data
public class UserDTO {
    private String pseudo;
    private String role;
    private boolean isActive;
}
