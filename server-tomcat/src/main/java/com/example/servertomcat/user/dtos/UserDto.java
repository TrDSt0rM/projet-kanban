package com.example.servertomcat.user.dtos;

import com.example.servertomcat.user.entities.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private String pseudo;
    private UserRole role;
    private boolean isActive;
}
