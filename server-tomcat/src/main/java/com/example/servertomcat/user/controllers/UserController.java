package com.example.servertomcat.user.controllers;

import com.example.servertomcat.user.dtos.UserAuthDto;
import com.example.servertomcat.user.dtos.UserDto;
import com.example.servertomcat.user.dtos.UserRegisterDto;
import com.example.servertomcat.user.entities.User;
import com.example.servertomcat.user.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/internal/auth/user")
    public ResponseEntity<UserAuthDto> getAuthenticatedUser(@RequestParam String pseudo){
        return ResponseEntity.ok(userService.getUserForAuth(pseudo));
    }

    // Appelé par Deno pour créer un compte
    @PostMapping("/auth/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody UserRegisterDto dto) {
        return ResponseEntity.status(201).body(userService.register(dto));
    }

    // Recherche d'un user par pseudo (pour les invitations)
    @GetMapping("/users/search")
    public ResponseEntity<UserDto> search(@RequestParam String pseudo) {
        return ResponseEntity.ok(userService.searchByPseudo(pseudo));
    }

    // Changer son mot de passe
    @PutMapping("/users/me/password")
    public ResponseEntity<Void> updatePassword(
            @RequestHeader("X-User-Pseudo") String userPseudo,
            @RequestBody String newPassword) {
        userService.updatePassword(userPseudo, newPassword);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/me/delete")
    public ResponseEntity<Void> delete(@RequestHeader("X-User-Pseudo") String userPseudo){
        userService.deleteUser(userPseudo);
        return ResponseEntity.noContent().build();
    }

    // Routes admin
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/admin/users/{id}/activate")
    public ResponseEntity<Void> toggleActive(@PathVariable String id) {
        userService.toggleActive(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}