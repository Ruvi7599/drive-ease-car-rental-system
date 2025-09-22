package com.example.drive_ease_new.dto;

import lombok.Getter;
import lombok.Setter;

// This class is used to send a login response containing the JWT token back to the client
@Getter
public class LoginResponse {

    @Setter
    private String token;

    // Constructor to initialize the token
    public LoginResponse(String token) {
        this.token = token;
    }
}
