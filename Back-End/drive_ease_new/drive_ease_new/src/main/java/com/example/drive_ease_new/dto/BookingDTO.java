package com.example.drive_ease_new.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

//import javax.validation.constraints.*;
import java.time.LocalDate;

@Data
public class BookingDTO {

    @NotNull(message = "Pickup date is required")
    @FutureOrPresent(message = "Pickup date must be today or in the future")
    private LocalDate pickupDate;

    @NotNull(message = "Rental days are required")
    @Min(value = 1, message = "Rental days must be at least 1")
    @Max(value = 365, message = "Rental days cannot exceed 365")
    private Integer rentalDays;

    @NotNull(message = "Vehicle count is required")
    @Min(value = 1, message = "At least one vehicle must be booked")
    @Max(value = 10, message = "Maximum 10 vehicles can be booked at once")
    private Integer vehicleCount;

    @NotBlank(message = "Vehicle type is required (e.g., SUV, Sedan, or Hatchback)")
    @Pattern(regexp = "SUV|Sedan|Hatchback", message = "Vehicle type must be either 'SUV', 'Sedan', or 'Hatchback'")
    private String vehicleType;

    }
