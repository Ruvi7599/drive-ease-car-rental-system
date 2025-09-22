package com.example.drive_ease_new.security;

import com.example.drive_ease_new.repo.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
// This class implements Spring Security's UserDetailsService interface
// to provide a way to load user-specific data during authentication.
public class CustomUserDetailsService implements UserDetailsService {

    // Injecting the AdminRepository to access admin user data from the database.
    @Autowired
    private AdminRepository repo;

    // This method is called by Spring Security to load a user by their username.
    @Override
    public UserDetails loadUserByUsername(String userName)
            throws UsernameNotFoundException {

        // Attempt to find an admin by the provided username.
        // If not found, throw UsernameNotFoundException.
        var admin = repo.findByUserName(userName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Admin not found "));

        // If the admin is found, wrap it in a CustomUserDetails object and return.
        // This object must implement Spring Security's UserDetails interface.
        return new CustomUserDetails(admin);
    }
}


