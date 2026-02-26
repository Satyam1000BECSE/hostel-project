package com.hostel.service;

import com.hostel.model.*;
import com.hostel.repository.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // ================= BOOK ROOM =================
    @Transactional
    public Booking bookRoom(String email, Long roomId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.isAvailable()) {
            throw new RuntimeException("Room is already booked");
        }

        // 🔥 Create booking with status
        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkIn(LocalDate.now())
                .checkOut(LocalDate.now().plusDays(30))
                .status(BookingStatus.PENDING)
                .build();

        room.setAvailable(false);
        roomRepository.save(room);

        Booking savedBooking = bookingRepository.save(booking);

        // 🔴 Send real-time update
        messagingTemplate.convertAndSend("/topic/rooms", room);

        return savedBooking;
    }

    // ================= CANCEL BOOKING =================
    @Transactional
    public void cancelBooking(String email, Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Room room = booking.getRoom();
        room.setAvailable(true);

        bookingRepository.save(booking);
        roomRepository.save(room);

        // 🔴 Send live update
        messagingTemplate.convertAndSend("/topic/rooms", room);
    }
}



