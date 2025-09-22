package com.example.drive_ease_new.service;

import com.example.drive_ease_new.dto.AdminDTO;
import com.example.drive_ease_new.model.Admin;
import com.example.drive_ease_new.repo.AdminRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder; //bcrypt

    // Get all admins
    public List<AdminDTO> getAllAdmins() {
        List<Admin> adminList = adminRepository.findAll();
        return modelMapper.map(adminList, new TypeToken<List<AdminDTO>>() {}.getType());
    }

    // Save a new admin
    public void saveAdmin(AdminDTO adminDTO) {
        if(adminRepository.existsByUserName(adminDTO.getUserName())){
            throw new RuntimeException("User Name Already Created");
        }
        Admin admin = new Admin();
        admin.setUserName(adminDTO.getUserName());
        admin.setPassword(passwordEncoder .encode(adminDTO.getPassword()));
        adminRepository.save(admin);

    }
    public String deleteUser(AdminDTO adminDTO){
        adminRepository.delete(modelMapper.map(adminDTO,Admin.class));
        return "Admin Deleted";
    }

}
