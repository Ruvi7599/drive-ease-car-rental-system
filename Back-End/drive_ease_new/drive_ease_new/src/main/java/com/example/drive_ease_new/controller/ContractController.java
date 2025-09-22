package com.example.drive_ease_new.controller;

import com.example.drive_ease_new.dto.ContractDTO;
import com.example.drive_ease_new.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Valid
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/admins/contracts")
@RequiredArgsConstructor
public class ContractController {

    private static final Logger logger = LoggerFactory.getLogger(ContractController.class);

    private final ContractService contractService;

    // Get all contracts (for admin use)
    @GetMapping("/all")
    public ResponseEntity<List<ContractDTO>> getAllContracts() {
        logger.info("Fetching all contracts...");
        List<ContractDTO> contracts = contractService.getAllContracts();
        return ResponseEntity.ok(contracts);
    }

    // Get available contracts for vehicle type (Public access endpoint)
    @GetMapping("/available-public/{vehicleType}")
    public ResponseEntity<List<ContractDTO>> getAvailableContractsForPublic(
            @PathVariable String vehicleType) {
        logger.info("Fetching available contracts for vehicle type (public): {}", vehicleType);
        List<ContractDTO> availableContracts = contractService.getAvailableContracts(vehicleType);
        return ResponseEntity.ok(availableContracts);
    }

    // Get all outdated contracts (for admin use)
    @GetMapping("/outdated")
    public ResponseEntity<List<ContractDTO>> getOutdatedContracts() {
        logger.info("Fetching outdated contracts...");
        try {
            List<ContractDTO> outdatedContracts = contractService.getOutdatedContracts();
            return ResponseEntity.ok(outdatedContracts);
        } catch (RuntimeException e) {
            logger.error("Failed to fetch outdated contracts: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }


    // Save a new contract (for admin use)
    @PostMapping("/save/{adminId}")
    public ResponseEntity<String> saveContract(
            @PathVariable int adminId,
            @Valid @RequestBody ContractDTO contractDTO) {
        logger.info("Attempting to save contract for admin ID: {}", adminId);
        try {
            contractService.saveContract(contractDTO, adminId);
            logger.info("Contract saved successfully for provider: {}", contractDTO.getProviderName());
            return ResponseEntity.ok("Contract saved successfully");
        } catch (RuntimeException e) {
            logger.error("Failed to save contract: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error saving contract: " + e.getMessage());
        }
    }

    // Delete a contract by ID (for admin use)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContract(@PathVariable int id) {
        logger.info("Attempting to delete contract with ID: {}", id);
        try {
            contractService.deleteContractById(id);
            logger.info("Contract deleted successfully with ID: {}", id);
            return ResponseEntity.ok("Contract deleted successfully");
        } catch (RuntimeException e) {
            logger.error("Failed to delete contract: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error deleting contract: " + e.getMessage());
        }
    }
}
