package com.example.drive_ease_new.repo;

import com.example.drive_ease_new.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    // Check if an Admin with the given username exists
    boolean existsByUserName(String userName);

    // Find an Admin by username, returns Optional to handle absence gracefully
    Optional<Admin> findByUserName(String userName);

}
