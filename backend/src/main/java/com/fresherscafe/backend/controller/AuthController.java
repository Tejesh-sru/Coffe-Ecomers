package com.fresherscafe.backend.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fresherscafe.backend.dto.AuthRequest;
import com.fresherscafe.backend.dto.AuthResponse;
import com.fresherscafe.backend.dto.ProfileResponse;
import com.fresherscafe.backend.dto.ProfileUpdateRequest;
import com.fresherscafe.backend.dto.RegisterRequest;
import com.fresherscafe.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @GetMapping("/profile")
    public ProfileResponse profile(@RequestHeader("Authorization") String authHeader) {
        return authService.getProfile(authHeader);
    }

    @PutMapping("/profile")
    public ProfileResponse updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return authService.updateProfile(authHeader, request);
    }
}
