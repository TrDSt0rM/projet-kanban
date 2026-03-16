package com.example.servertomcat.services;

import com.example.servertomcat.entities.User;
import com.example.servertomcat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}