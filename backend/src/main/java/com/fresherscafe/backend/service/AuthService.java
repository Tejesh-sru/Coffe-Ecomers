package com.fresherscafe.backend.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fresherscafe.backend.dto.AuthRequest;
import com.fresherscafe.backend.dto.AuthResponse;
import com.fresherscafe.backend.dto.ProfileResponse;
import com.fresherscafe.backend.dto.ProfileUpdateRequest;
import com.fresherscafe.backend.dto.RegisterRequest;
import com.fresherscafe.backend.model.AppUser;
import com.fresherscafe.backend.repository.AppUserRepository;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordUtil passwordUtil;

    public AuthService(AppUserRepository appUserRepository, PasswordUtil passwordUtil) {
        this.appUserRepository = appUserRepository;
        this.passwordUtil = passwordUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use");
        }
        if (appUserRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use");
        }

        AppUser user = new AppUser();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPasswordHash(passwordUtil.hash(request.getPassword()));
        user.setAuthToken(UUID.randomUUID().toString());

        AppUser savedUser = appUserRepository.save(user);
        return new AuthResponse(savedUser.getAuthToken(), savedUser.getUsername(), savedUser.getEmail());
    }

    public AuthResponse login(AuthRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String inputHash = passwordUtil.hash(request.getPassword());
        if (!inputHash.equals(user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        user.setAuthToken(UUID.randomUUID().toString());
        AppUser savedUser = appUserRepository.save(user);
        return new AuthResponse(savedUser.getAuthToken(), savedUser.getUsername(), savedUser.getEmail());
    }

    public AppUser getUserByToken(String authHeader) {
        String token = extractBearerToken(authHeader);
        return appUserRepository.findByAuthToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token"));
    }

    public ProfileResponse getProfile(String authHeader) {
        AppUser user = getUserByToken(authHeader);
        return new ProfileResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    public ProfileResponse updateProfile(String authHeader, ProfileUpdateRequest request) {
        AppUser user = getUserByToken(authHeader);

        String newUsername = request.getUsername().trim();
        boolean usernameTaken = appUserRepository.existsByUsername(newUsername) && !newUsername.equals(user.getUsername());
        if (usernameTaken) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use");
        }

        user.setUsername(newUsername);
        AppUser savedUser = appUserRepository.save(user);
        return new ProfileResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authorization token");
        }
        return authHeader.substring(7);
    }
}
