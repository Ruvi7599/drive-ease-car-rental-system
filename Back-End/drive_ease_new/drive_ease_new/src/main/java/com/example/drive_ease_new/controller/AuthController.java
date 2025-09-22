package com.example.drive_ease_new.controller;

import com.example.drive_ease_new.dto.LoginRequest;
import com.example.drive_ease_new.dto.LoginResponse;
import com.example.drive_ease_new.security.CustomUserDetailsService;
import com.example.drive_ease_new.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Date;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUserName(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            logger.error("Authentication failed for user: {}", request.getUserName());
            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUserName());
        String token = jwtUtil.generateToken(userDetails);
        //date expiration = jwtUtil.extractExpiration(token);

        //logger.info("Generated JWT for user: {} expiring at {}", request.getUserName(), expiration);

        return ResponseEntity.ok(new LoginResponse(token));
    }
}
