package com.example.drive_ease_new.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Inject the secret key from application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Inject the expiration time for the token in milliseconds (e.g., jwt.expiration-ms=3600000)
    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // Generates the signing key from the secret using HMAC SHA algorithm
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Generates a JWT token for the given user details
    public String generateToken(UserDetails userDetails) {
        Date now = new Date(); // Current time
        Date exp = new Date(now.getTime() + expirationMs); // Expiration time

        // Build the JWT with subject (username), issue time, expiration time, and signature
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // Set username as subject
                .setIssuedAt(now) // Set token issued time
                .setExpiration(exp) // Set token expiration
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with secret key using HS256
                .compact(); // Compact to String
    }

    // Extracts expiration date from the token
    public Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    // Extracts username (subject) from the token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Extracts userId claim from the token if available
    public Integer extractUserId(String token) {
        return getClaims(token).get("userId", Integer.class);
    }

    // Extracts role claim from the token if available
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // Validates token by checking if it's well-formed and not expired
    public boolean validateToken(String token, String userName) {
        try {
            getClaims(token); // Will throw if the token is invalid or expired
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // Parses the token and extracts all claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Use the same signing key to validate
                .build()
                .parseClaimsJws(token) // Parse the signed token
                .getBody(); // Extract claims
    }
}
