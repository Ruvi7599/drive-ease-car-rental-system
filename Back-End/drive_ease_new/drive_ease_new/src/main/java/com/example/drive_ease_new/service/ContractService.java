package com.example.drive_ease_new.service;

import com.example.drive_ease_new.dto.ContractDTO;
import com.example.drive_ease_new.model.Admin;
import com.example.drive_ease_new.model.Contract;
import com.example.drive_ease_new.repo.AdminRepository;
import com.example.drive_ease_new.repo.ContractRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Valid
@Service
@Transactional
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Retrieve all contracts
    public List<ContractDTO> getAllContracts() {
        List<Contract> contracts = contractRepository.findAll();
        List<ContractDTO> contractDTOs = modelMapper.map(contracts, new TypeToken<List<ContractDTO>>() {}.getType());

        for (ContractDTO dto : contractDTOs) {
            Contract contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new RuntimeException("Contract not found"));
            dto.setAdminId(contract.getAdmin().getAdminId());
        }

        return contractDTOs;
    }

    // Fetch available contracts for public
    public List<ContractDTO> getAvailableContracts(String vehicleType) {
        List<Contract> availableContracts = contractRepository.findAvailableContracts(vehicleType);
        return modelMapper.map(availableContracts, new TypeToken<List<ContractDTO>>() {}.getType());
    }

    // Fixed: Fetch outdated contracts
    public List<ContractDTO> getOutdatedContracts() {
        LocalDate today = LocalDate.now();
        List<Contract> activeContracts = contractRepository.findByStatus("Active");

        // Filter contracts whose rental period has ended
        List<Contract> outdatedContracts = activeContracts.stream()
                .filter(c -> !today.isBefore(c.getStartDate().plusDays(c.getRentalDays())))
                .collect(Collectors.toList());

        // Map to DTOs using ModelMapper
        return modelMapper.map(outdatedContracts, new TypeToken<List<ContractDTO>>() {}.getType());
    }

    // Save a new contract
    public void saveContract(ContractDTO contractDTO, int adminId) {
        validateContractDTO(contractDTO);

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + adminId + " not found"));

        Contract contract = modelMapper.map(contractDTO, Contract.class);
        contract.setAdmin(admin);

        try {
            contract.setAvailability(Contract.Availability.valueOf(contractDTO.getAvailability().replace(" ", "_")));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid availability value: " + contractDTO.getAvailability());
        }

        contractRepository.save(contract);
    }

    // Delete a contract by ID
    public void deleteContractById(int id) {
        if (!contractRepository.existsById(id)) {
            throw new RuntimeException("Contract with ID " + id + " not found");
        }
        contractRepository.deleteById(id);
    }

    // Count unique providers
    public long getProviderCount() {
        return contractRepository.findAll().stream()
                .map(Contract::getProviderName)
                .distinct()
                .count();
    }

    public long getContractCount() {
        return contractRepository.findAll().stream()
                .map(Contract::getContractId)
                .distinct()
                .count();
    }

    public long getVehicleCount() {
        return contractRepository.countAllVehicles();
    }

    public long getVehicleTypes() {
        return contractRepository.findAll().stream()
                .map(Contract::getVehicleType)
                .distinct()
                .count();
    }

    // Validate contract fields
    private void validateContractDTO(ContractDTO dto) {
        if (dto.getProviderName() == null || dto.getProviderName().trim().isEmpty()) {
            throw new RuntimeException("Provider name is required.");
        }
        if (dto.getVehicleType() == null || dto.getVehicleType().trim().isEmpty()) {
            throw new RuntimeException("Vehicle type is required.");
        }
        if (dto.getBasicDailyRate() == null || dto.getBasicDailyRate() <= 0) {
            throw new RuntimeException("Base daily rate must be a positive number.");
        }
        if (dto.getAvailability() == null || dto.getAvailability().trim().isEmpty()) {
            throw new RuntimeException("Availability status is required.");
        }
        if (dto.getAllowedMileage() == null || dto.getAllowedMileage() < 0) {
            throw new RuntimeException("Allowed mileage must be a non-negative number.");
        }
    }
}
