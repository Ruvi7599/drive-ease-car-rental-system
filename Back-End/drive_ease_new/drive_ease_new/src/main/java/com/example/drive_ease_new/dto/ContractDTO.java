package com.example.drive_ease_new.dto;

//import jakarta.validation.constraints.*;

import lombok.Data;

import jakarta.validation.constraints.*;

@Data
public class ContractDTO {

    private int contractId;  // Ensure contractId is included
    private int adminId;     // Ensure adminId is included

    @NotBlank(message = "Provider name is required")
    @Size(min = 3, max = 50, message = "Provider name must be between 3 and 50 characters")
    private String providerName;

    @NotBlank(message = "Vehicle type is required")
    @Size(min = 3, max = 30, message = "Vehicle type must be between 3 and 30 characters")
    private String vehicleType;

    @DecimalMin(value = "0.01", inclusive = true, message = "Base daily rate must be a positive number.")
    @NotNull(message = "Basic daily rate is required")
    @Positive(message = "Basic daily rate must be positive")
    private Double basicDailyRate;

    @NotNull(message = "Allowed mileage is required")
    @Min(value = 1, message = "Allowed mileage must be at least 1 km")
    private Integer allowedMileage;

    @NotBlank(message = "Availability is required (e.g., Available or Not Available)")
    @Pattern(regexp = "Available|Not_Available", message = "Availability must be either 'Available' or 'Not_Available'")
    private String availability;

}
