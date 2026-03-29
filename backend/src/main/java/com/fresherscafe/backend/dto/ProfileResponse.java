package com.fresherscafe.backend.dto;

public class ProfileResponse {

    private Long id;
    private String username;
    private String email;

    public ProfileResponse(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
