package com.example.servertomcat.controllers;

import com.example.servertomcat.entities.User;
import com.example.servertomcat.repositories.UserRepository;
import com.example.servertomcat.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<User> getUserByPseudo(@RequestParam String pseudo) {
        User user = userService.getUserByPseudo(pseudo);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Deno envoie un objet User avec le password DÉJÀ HASHÉ
        User userCreated = userService.createUser(user);
        return ResponseEntity.ok(userCreated);
    }

    @PutMapping
    public User update(@RequestParam String pseudo, @RequestBody User userDetails) {
        return userService.updateUser(pseudo, userDetails);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam String pseudo) {
        userService.deleteUser(pseudo);
        return ResponseEntity.noContent().build();
    }
}