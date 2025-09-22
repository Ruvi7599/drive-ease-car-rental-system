package com.example.drive_ease_new.controller;

import com.example.drive_ease_new.service.ContractService;  // ✅ import your service
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    private final ContractService contractService;

    @GetMapping("/providers")
    public ResponseEntity<Long> getProviderCount() {
        logger.info("Fetching provider count...");
        long count = contractService.getProviderCount();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/contracts")
    public ResponseEntity<Long> getContractCount() {
        logger.info("Fetching contract count...");
        long count = contractService.getContractCount();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/vehicles")
    public ResponseEntity<Long> getVehicleCount() {
        logger.info("Fetching vehicle count...");
        long count = contractService.getVehicleCount();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/vehicleTypes")
    public ResponseEntity<Long> getVehicleTypes() {
        logger.info("Fetching vehicle Types...");
        long count = contractService.getVehicleTypes();
        return ResponseEntity.ok(count);
    }
}
