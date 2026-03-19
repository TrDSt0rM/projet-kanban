package com.example.servertomcat.user.services;

import com.example.servertomcat.user.dtos.UserAuthDto;
import com.example.servertomcat.user.dtos.UserDto;
import com.example.servertomcat.user.dtos.UserRegisterDto;

import java.util.List;

public interface UserService {
    long countUsers();
    UserDto register(UserRegisterDto dto);
    UserAuthDto getUserForAuth(String pseudo);
    UserDto searchByPseudo(String pseudo);
    void updatePassword(String userId, String newPassword);
    void deleteUser(String pseudo);
    // Admin (il peut aussi delete n'importe quel USER qui n'est pas admin)
    List<UserDto> getAllUsers();
    void toggleActive(String userId);
    void updateRole(String pseudo, String newRole);
}
