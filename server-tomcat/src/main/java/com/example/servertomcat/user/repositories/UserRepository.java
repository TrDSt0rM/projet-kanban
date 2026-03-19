package com.example.servertomcat.user.repositories;

import com.example.servertomcat.user.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByPseudo(String pseudo);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.isActive = :status WHERE u.pseudo = :pseudo")
    void updateActivationStatus(@Param("pseudo") String pseudo, @Param("status") boolean status);
}