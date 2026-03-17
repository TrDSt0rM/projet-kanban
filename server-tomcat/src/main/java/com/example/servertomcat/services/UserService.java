package com.example.servertomcat.services;

import com.example.servertomcat.entities.User;
import com.example.servertomcat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public long countUsers() {
        return userRepository.count();
    }

    public void toggleUserActive(String pseudo) {
        User user = userRepository.findByPseudo(pseudo).orElseThrow();
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public User getUserByPseudo(String pseudo) {
        return userRepository.findById(pseudo).orElse(null);
    }

    public User createUser(User user){
        // vérifie que le pseudo n'existe pas déjà
        if ( userRepository.existsById(user.getPseudo()) ) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Le pseudo " + user.getPseudo() + " est déjà pris");
        }
        return userRepository.save(user);
    }
}