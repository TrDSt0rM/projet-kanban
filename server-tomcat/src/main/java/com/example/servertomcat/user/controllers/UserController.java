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

    // Renvoie un UserAuthDto pour vérifier le mot de passe haché afin de faire le token
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

    @DeleteMapping("/users/me")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-User-Pseudo") String userPseudo) {
        userService.deleteUser(userPseudo);
        return ResponseEntity.noContent().build();
    }

    // Routes admin
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/admin/users/{pseudo}/activate")
    public ResponseEntity<Void> toggleActive(
            @PathVariable String pseudo,
            @RequestBody(required = false) java.util.Map<String, Object> body) {
        userService.toggleActive(pseudo);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/admin/users/{pseudo}")
    public ResponseEntity<Void> deleteUser(@PathVariable String pseudo) {
        userService.deleteUser(pseudo);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/users/{pseudo}/role")
    public ResponseEntity<Void> updateRole(@PathVariable String pseudo, @RequestBody java.util.Map<String, String> body) {
        String newRole = body.get("role");
        userService.updateRole(pseudo, newRole);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/autocomplete")
    public ResponseEntity<List<UserDto>> autocomplete(@RequestParam String pseudo) {
        if (pseudo.length() < 2) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(userService.getSuggestions(pseudo));
    }
}