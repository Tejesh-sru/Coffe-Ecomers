package com.fresherscafe.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fresherscafe.backend.model.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByAuthToken(String authToken);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
