package com.example.servertomcat.dtos;

import com.example.servertomcat.enums.RoleUser;
import lombok.Data;

@Data
public class UserDTO {
    private String pseudo;
    private RoleUser role;
    private boolean isActive;
}
