package com.example.servertomcat.controllers;

import com.example.servertomcat.entities.User;
import com.example.servertomcat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{pseudo}")
    public ResponseEntity<User> getUserByPseudo(@PathVariable String pseudo) {
        return userRepository.findById(pseudo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Deno envoie un objet User avec le password DÉJÀ HASHÉ
        return ResponseEntity.ok(userRepository.save(user));
    }
}