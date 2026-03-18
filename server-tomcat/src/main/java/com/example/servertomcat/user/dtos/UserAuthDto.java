package com.example.servertomcat.user.dtos;

import com.example.servertomcat.user.entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthDto {
    private String pseudo;
    private String password;
    private UserRole userRole;
    private boolean isActive;
}
