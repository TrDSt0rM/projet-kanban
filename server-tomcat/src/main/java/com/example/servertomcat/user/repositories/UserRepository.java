package com.example.servertomcat.user.repositories;

import com.example.servertomcat.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByPseudo(String pseudo);
}
