package com.example.drive_ease_new.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int contractId;

    @Column(nullable = false)
    private String providerName;
    @Column(nullable = false)
    private String vehicleType;
    @Column(nullable = false)
    private Double basicDailyRate;
    @Column(nullable = false)
    private Integer allowedMileage;

    private LocalDate startDate;   // Booking / pickup date
    private int rentalDays;        // Number of days booked
    private String status;

    public enum Availability {
        Available,
        Not_Available
    }
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Contract.Availability availability = Availability.Available;
    // If Admin relationship exists (based on ERD)
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;
}

