package com.fresherscafe.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ProfileUpdateRequest {

    @NotBlank
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
