package com.example.drive_ease_new.service;

import com.example.drive_ease_new.dto.BookingDTO;
import com.example.drive_ease_new.model.Admin;
import com.example.drive_ease_new.model.Booking;
import com.example.drive_ease_new.model.Booking.VehicleType;
import com.example.drive_ease_new.model.Contract;
import com.example.drive_ease_new.repo.AdminRepository;
import com.example.drive_ease_new.repo.BookingRepository;
import com.example.drive_ease_new.repo.ContractRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Get all bookings
    public List<BookingDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return modelMapper.map(bookings, new TypeToken<List<BookingDTO>>() {}.getType());
    }

    // Save a new booking
    public void saveBooking(BookingDTO bookingDTO, int adminId, int contractId) {
        // Fetch Admin using adminId
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Fetch Contract using contractId
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        // Create a new Booking object
        Booking booking = new Booking();
        booking.setPickupDate(bookingDTO.getPickupDate());
        booking.setRentalDays(bookingDTO.getRentalDays());
        booking.setVehicleCount(bookingDTO.getVehicleCount());
        booking.setVehicleType(VehicleType.valueOf(bookingDTO.getVehicleType()));
        booking.setAdmin(admin); // Set Admin using the adminId
        booking.setContract(contract); // Set Contract using the contractId

        // Save the Booking object to the repository
        bookingRepository.save(booking);
    }

    // Delete a booking by ID
    public void deleteBookingById(int id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(id);
    }
}
