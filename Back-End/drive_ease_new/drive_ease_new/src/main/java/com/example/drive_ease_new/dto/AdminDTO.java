package com.example.drive_ease_new.dto;

import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {

    @NotNull(message = "Username cannot be Null")
    private String userName;

    @NotNull(message = "Password cannot be Null")
    @Size(min = 8, message = "Password must be at least 8 characters Long")
    private String password;
}
