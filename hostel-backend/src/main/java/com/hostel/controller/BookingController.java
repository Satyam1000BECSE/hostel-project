package com.hostel.controller;

import com.hostel.model.Booking;
import com.hostel.service.BookingService;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking book(@RequestParam Long roomId,
            Principal principal) {

        String email = principal.getName();
        return bookingService.bookRoom(email, roomId);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> cancel(@PathVariable Long bookingId,
            Authentication authentication) {

        bookingService.cancelBooking(authentication.getUsername(), bookingId);
        return ResponseEntity.ok("Booking Cancelled");
    }

}
