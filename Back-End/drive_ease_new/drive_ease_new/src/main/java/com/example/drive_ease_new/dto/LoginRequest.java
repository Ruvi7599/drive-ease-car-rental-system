package com.example.drive_ease_new.dto;

import lombok.Data;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;


@Data
public class LoginRequest {

    // Ensures the username is not empty and has a length between 3 and 20 characters
    @NotEmpty(message = "Username cannot be empty")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String userName;

    // Ensures the password is not empty and has at least 8 characters
    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    // constructor for initializing LoginRequest with values
    public LoginRequest(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }


}
