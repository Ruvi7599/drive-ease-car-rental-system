package com.example.drive_ease_new.controller;

import com.example.drive_ease_new.dto.BookingDTO;
import com.example.drive_ease_new.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


//import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admins/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Get all bookings
    @GetMapping("/all")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Save a new booking
    @PostMapping("/save/{adminId}/{contractId}")
    public ResponseEntity<String> saveBooking(@PathVariable int adminId,
                                              @PathVariable int contractId,
                                              @Valid @RequestBody BookingDTO bookingDTO) {
        bookingService.saveBooking(bookingDTO, adminId, contractId);
        return ResponseEntity.ok("Booking saved successfully");
    }

    // Delete a booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable int id) {
        bookingService.deleteBookingById(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }
}
