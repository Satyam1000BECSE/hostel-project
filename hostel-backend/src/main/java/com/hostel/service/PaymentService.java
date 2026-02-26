// package com.hostel.service;

// import com.hostel.model.Booking;
// import com.hostel.model.BookingStatus;
// import com.hostel.model.Payment;
// import com.hostel.model.PaymentStatus;
// import com.hostel.model.User;
// import com.hostel.repository.BookingRepository;
// import com.hostel.repository.PaymentRepository;
// import com.hostel.repository.UserRepository;
// import lombok.RequiredArgsConstructor;

// import org.json.JSONObject;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.time.LocalDateTime;
// import java.util.UUID;
// // import com.razorpay.*;

// @Service
// @RequiredArgsConstructor
// @Transactional
// public class PaymentService {

//     private final PaymentRepository paymentRepository;
//     private final BookingRepository bookingRepository;
//     private final UserRepository userRepository;

//     public Payment processPayment(String email, Long bookingId) {

//         User user = userRepository.findByEmail(email)
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         Booking booking = bookingRepository.findById(bookingId)
//                 .orElseThrow(() -> new RuntimeException("Booking not found"));

//         // 🚨 Security check
//         if (!booking.getUser().getId().equals(user.getId())) {
//             throw new RuntimeException("Unauthorized payment attempt");
//         }

//         // 🚫 Prevent double payment
//         if (paymentRepository.existsByBooking_Id(bookingId)) {
//             throw new RuntimeException("Payment already done");
//         }

//         // 💳 Create Payment (Sandbox Mode)
//         Payment payment = new Payment();
//         payment.setBooking(booking);
//         payment.setUser(user);
//         payment.setAmount(booking.getRoom().getPrice());
//         payment.setStatus(PaymentStatus.SUCCESS);  // simulate success
//         payment.setTransactionId("TXN-" + UUID.randomUUID());
//         payment.setCreatedAt(LocalDateTime.now());

//         // 🔄 Update booking & room
//         booking.setStatus(BookingStatus.PAID);
//         booking.getRoom().setAvailable(false);

//         return paymentRepository.save(payment);
//     }
// }

package com.hostel.service;

import com.hostel.model.Booking;
import com.hostel.model.BookingStatus;
import com.hostel.model.Payment;
import com.hostel.model.PaymentStatus;
import com.hostel.model.User;
import com.hostel.repository.BookingRepository;
import com.hostel.repository.PaymentRepository;
import com.hostel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import com.razorpay.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @Transactional
    public Payment processPayment(String email, Long bookingId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized payment attempt");
        }

        if (paymentRepository.existsByBooking_Id(bookingId)) {
            throw new RuntimeException("Payment already completed");
        }

        // 🔹 Create Payment in PENDING state
        Payment payment = Payment.builder()
                .booking(booking)
                .user(user)
                .amount(booking.getRoom().getPrice())
                .status(PaymentStatus.PENDING)
                .transactionId(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    // @Transactional
    // public Payment processPayment(String email, Long bookingId) {

    // // 🔐 Get logged-in user
    // User user = userRepository.findByEmail(email)
    // .orElseThrow(() -> new RuntimeException("User not found"));

    // // 📦 Get booking
    // Booking booking = bookingRepository.findById(bookingId)
    // .orElseThrow(() -> new RuntimeException("Booking not found"));

    // // 🚨 Security check (booking belongs to logged-in user)
    // if (!booking.getUser().getId().equals(user.getId())) {
    // throw new RuntimeException("Unauthorized payment attempt");
    // }

    // try {
    // // 🚫 Prevent double payment
    // boolean alreadyPaid = paymentRepository.existsByBooking_Id(bookingId);
    // if (alreadyPaid) {
    // throw new RuntimeException("Payment already completed");
    // }

    // // 💰 Create payment
    // Payment payment = Payment.builder()
    // .booking(booking)
    // .user(user)
    // .amount(booking.getRoom().getPrice())
    // // .status("SUCCESS")
    // .status(PaymentStatus.PENDING)
    // .transactionId(UUID.randomUUID().toString())
    // .createdAt(LocalDateTime.now())
    // .build();

    // // 🔄 Update booking status
    // booking.setStatus(BookingStatus.PAID);
    // bookingRepository.save(booking);
    // // After real payment success
    // // booking.setStatus(BookingStatus.PAID);

    // payment.setStatus(PaymentStatus.SUCCESS);

    // return paymentRepository.save(payment);
    // } catch (Exception e) {

    // // 🔥 AUTO UNBOOK
    // booking.setStatus(BookingStatus.FAILED);
    // booking.getRoom().setAvailable(true);

    // throw new RuntimeException("Payment failed");
    // }
    // }

    @Transactional
    public void confirmPaymentSuccess(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.SUCCESS);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.PAID);

        bookingRepository.save(booking);
        paymentRepository.save(payment);

        sendAdminRealtimeUpdate(); // 🔥 live revenue update
    }

    private void sendAdminRealtimeUpdate() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'sendAdminRealtimeUpdate'");
    }

    public Order createRazorpayOrder(Double amount) throws RazorpayException {

        RazorpayClient razorpay = new RazorpayClient("YOUR_KEY", "YOUR_SECRET");

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // Razorpay takes paisa
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        return razorpay.orders.create(options);
    }

    // @Transactional
    // public void refundPayment(Long paymentId) throws RazorpayException {

    //     // 1️⃣ Get Payment
    //     Payment payment = paymentRepository.findById(paymentId)
    //             .orElseThrow(() -> new RuntimeException("Payment not found"));

    //     if (payment.getStatus() != PaymentStatus.SUCCESS) {
    //         throw new RuntimeException("Refund not allowed");
    //     }

    //     // 2️⃣ Razorpay refund (only if real gateway used)
    //     RazorpayClient razorpay = new RazorpayClient(key, secret);
    //     razorpay.payments.refund(payment.getTransactionId());

    //     // 3️⃣ Update DB
    //     payment.setStatus(PaymentStatus.REFUNDED);

    //     Booking booking = payment.getBooking();
    //     booking.setStatus(BookingStatus.CANCELLED);
    //     booking.getRoom().setAvailable(true);

    //     bookingRepository.save(booking);
    //     paymentRepository.save(payment);
    // }


    @Transactional
public void refundPayment(Long paymentId) throws RazorpayException {

    Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

    if (payment.getStatus() != PaymentStatus.SUCCESS) {
        throw new RuntimeException("Refund not allowed");
    }

    RazorpayClient razorpay = new RazorpayClient(key, secret);
    razorpay.payments.refund(payment.getTransactionId());

    payment.setStatus(PaymentStatus.REFUNDED);

    Booking booking = payment.getBooking();
    booking.setStatus(BookingStatus.CANCELLED);
    booking.getRoom().setAvailable(true);

    bookingRepository.save(booking);
    paymentRepository.save(payment);

    sendAdminRealtimeUpdate();   // 🔥 important
}

}
