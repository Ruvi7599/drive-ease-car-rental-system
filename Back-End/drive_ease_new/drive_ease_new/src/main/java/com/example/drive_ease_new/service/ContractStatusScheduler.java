package com.example.drive_ease_new.service;

import com.example.drive_ease_new.model.Contract;
import com.example.drive_ease_new.repo.ContractRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class ContractStatusScheduler {

    private final ContractRepository contractRepository;

    public ContractStatusScheduler(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
    public void updateOutdatedContracts() {
        LocalDate today = LocalDate.now();
        List<Contract> activeContracts = contractRepository.findByStatus("Active");

        for (Contract contract : activeContracts) {
            LocalDate endDate = contract.getStartDate().plusDays(contract.getRentalDays());
            if (!today.isBefore(endDate)) { // Today >= end date
                contract.setStatus("Outdated");
                contractRepository.save(contract);
            }
        }
    }
}
