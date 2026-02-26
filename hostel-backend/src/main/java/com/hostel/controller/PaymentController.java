package com.hostel.controller;

import com.hostel.model.Booking;
import com.hostel.model.Payment;
import com.hostel.repository.BookingRepository;
import com.hostel.repository.PaymentRepository;
import com.hostel.service.PaymentService;
import com.razorpay.RazorpayClient;
import com.razorpay.Order;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    // @GetMapping("/test-key")
    // public String testKey() {
    //     System.out.println("KEY = " + key);
    //     System.out.println("SECRET = " + secret);
    //     return "Check console" + key + secret;
    // }

    // ================= CREATE ORDER =================
    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<?> createOrder(@PathVariable Long bookingId) {

        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            RazorpayClient razorpay = new RazorpayClient(key, secret);

            JSONObject options = new JSONObject();
            options.put("amount", booking.getRoom().getPrice() * 100);
            options.put("currency", "INR");
            options.put("receipt", "txn_" + bookingId);

            Order order = razorpay.orders.create(options);

            return ResponseEntity.ok(order.get("id"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // ================= VERIFY PAYMENT =================
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> data,
            Authentication auth) {

        try {
            Long bookingId = Long.parseLong(data.get("bookingId"));

            Payment payment = paymentService.processPayment(
                    auth.getName(),
                    bookingId);

            return ResponseEntity.ok(payment);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // ================= SIMPLE TEST PAYMENT =================
    @PostMapping("/{bookingId}")
    public ResponseEntity<?> simplePay(@PathVariable Long bookingId,
            Authentication authentication) {

        try {
            String email = authentication.getName();
            Payment payment = paymentService.processPayment(email, bookingId);
            return ResponseEntity.ok(payment);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // ================= USER HISTORY =================
    @GetMapping("/history")
    public List<Payment> history(Authentication auth) {
        return paymentRepository.findByUserEmail(auth.getName());
    }

    // ================= ADMIN REVENUE =================
    @GetMapping("/admin/revenue")
    public Double revenue() {
        return paymentRepository.getTotalRevenue();
    }

}

