package com.hostel.controller;

import com.hostel.model.Payment;
import com.hostel.repository.BookingRepository;
import com.hostel.repository.PaymentRepository;
import com.hostel.repository.RoomRepository;
import com.hostel.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    // ================= DASHBOARD =================
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(Authentication authentication) {

        validateAdmin(authentication);

        Map<String, Object> data = new HashMap<>();

        Double revenue = paymentRepository.getTotalRevenue();
        if (revenue == null) revenue = 0.0;

        data.put("totalRevenue", revenue);
        data.put("totalBookings", bookingRepository.count());
        data.put("totalUsers", userRepository.count());
        data.put("totalRooms", roomRepository.count());
        data.put("availableRooms", roomRepository.countByAvailableTrue());
        data.put("activeRooms", roomRepository.countByAvailableFalse());

        return data;
    }

    // ================= ANALYTICS =================
    @GetMapping("/analytics")
    public Map<String, Object> getFullAnalytics(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            Authentication authentication) {

        validateAdmin(authentication);

        Map<String, Object> data = new HashMap<>();

        data.put("revenueByDate", paymentRepository.revenueByDate());
        data.put("monthlyRevenue", paymentRepository.monthlyRevenue());
        data.put("todayRevenue", paymentRepository.todayRevenue());
        data.put("refundAmount", paymentRepository.totalRefunds());
        data.put("bookingTrend", bookingRepository.bookingByDate());
        data.put("revenueByRoomType", paymentRepository.revenueByRoomType());
        data.put("bookingByRoomType", bookingRepository.bookingByRoomType());
        data.put("topRooms", bookingRepository.topBookedRooms());
        data.put("revenueGrowth", paymentRepository.revenueGrowth());
        data.put("userGrowth", userRepository.userGrowth());
        data.put("bookingStatus", bookingRepository.bookingStatusStats());
        data.put("topUsers", bookingRepository.topUsers());

        return data;
    }

    // ================= ALL PAYMENTS (ADMIN) =================
    @GetMapping("/payments")
    public Page<Payment> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        validateAdmin(authentication);

        return paymentRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
    }

    // ================= ADMIN VALIDATION =================
    private void validateAdmin(Authentication authentication) {

        if (authentication == null) {
            throw new RuntimeException("Authentication required");
        }

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new RuntimeException("Only ADMIN allowed");
        }
    }
}




