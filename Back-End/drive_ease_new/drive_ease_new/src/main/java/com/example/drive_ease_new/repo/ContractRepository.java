package com.example.drive_ease_new.repo;

import com.example.drive_ease_new.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ContractRepository extends JpaRepository<Contract, Integer> {

    // Custom query to fetch available contracts by vehicle type
    @Query("SELECT c FROM Contract c WHERE c.availability = 'Available' AND c.vehicleType = :vehicleType")
    List<Contract> findAvailableContracts(@Param("vehicleType") String vehicleType);

    @Query("SELECT COUNT(DISTINCT c.providerName) FROM Contract c")
    long countUniqueProviders();

    @Query("SELECT COUNT(DISTINCT c.contractId) FROM Contract c")
    long CountUniqueContracts();

    @Query("SELECT COUNT(c) FROM Contract c")
    long countAllVehicles();

    @Query("SELECT COUNT(DISTINCT c.vehicleType) FROM Contract c")
    long CountUniqueVehicleTypes();

    List<Contract> findByStatus(String status);

}

