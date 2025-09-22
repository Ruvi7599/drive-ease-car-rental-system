package com.example.drive_ease_new.security;

import com.example.drive_ease_new.model.Admin;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Custom implementation of UserDetails to integrate Admin entity with Spring Security.
 */
public class CustomUserDetails implements UserDetails {

    // The Admin object that holds the authenticated user's data
    private final Admin admin;

    // Constructor to initialize the CustomUserDetails with an Admin object
    public CustomUserDetails(Admin admin) {
        this.admin = admin;
    }

    /**
     * Returns the authorities (roles/permissions) granted to the user.
     * In this case, every user is assigned "ROLE_ADMIN".
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_ADMIN")); // Assigns admin role
    }

    /**
     * Returns the user's password used for authentication.
     */
    @Override
    public String getPassword() {
        return admin.getPassword();
    }

    /**
     * Returns the username used to authenticate the user.
     */
    @Override
    public String getUsername() {
        return admin.getUserName();
    }

    /**
     * Indicates whether the user's account has expired.
     * Returns true to indicate the account is always non-expired.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is locked or unlocked.
     * Returns true to indicate the account is never locked.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indicates whether the user's credentials (password) have expired.
     * Returns true to indicate credentials are always valid.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is enabled or disabled.
     * Returns true to indicate the user is always enabled.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
