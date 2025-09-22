package com.example.drive_ease_new.controller;

import com.example.drive_ease_new.dto.AdminDTO;
import com.example.drive_ease_new.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/v1/admins")  // More RESTFUL endpoint name
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get all admins
    @GetMapping("view")
    public ResponseEntity<List<AdminDTO>> getAdmin() {
        List<AdminDTO> admins = adminService.getAllAdmins();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    // Save a new admin
    @PostMapping("save")
    public ResponseEntity<?> saveAdmin(@RequestBody AdminDTO adminDTO) {
        adminService.saveAdmin(adminDTO);
        return ResponseEntity.ok ("Admin Added");
    }

    // Delete an admin by ID
    @DeleteMapping("delete")
    public String deleteUser(@RequestBody AdminDTO adminDTO){
        return adminService.deleteUser(adminDTO);
    }
}
