package com.hostel.repository;

import com.hostel.model.Payment;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByBooking_Id(Long bookingId);

    // ✅ User payment history
    List<Payment> findByUserEmail(String email);

    // @Query("SELECT COALESCE(SUM(p.amount),0) FROM Payment p WHERE p.status =
    // com.hostel.model.PaymentStatus.SUCCESS")
    // Double getTotalRevenueByStatus(@Param("status") PaymentStatus status);
    @Query("""
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            WHERE p.status = com.hostel.model.PaymentStatus.SUCCESS
            """)
    Double getTotalRevenue();

    @Query("""
            SELECT DATE(p.createdAt), SUM(p.amount)
            FROM Payment p
            WHERE p.status = com.hostel.model.PaymentStatus.SUCCESS
            GROUP BY DATE(p.createdAt)
            ORDER BY DATE(p.createdAt)
            """)
    List<Object[]> revenueByDate();

    @Query("""
            SELECT r.roomType, SUM(p.amount)
            FROM Payment p
            JOIN p.booking b
            JOIN b.room r
            WHERE p.status = com.hostel.model.PaymentStatus.SUCCESS
            GROUP BY r.roomType
            """)
    List<Object[]> revenueByRoomType();

    @Query("""
            SELECT
               (SUM(CASE WHEN MONTH(p.createdAt)=MONTH(CURRENT_DATE) THEN p.amount ELSE 0 END) -
                SUM(CASE WHEN MONTH(p.createdAt)=MONTH(CURRENT_DATE)-1 THEN p.amount ELSE 0 END))
            FROM Payment p
            WHERE p.status = 'SUCCESS'
            """)
    Double revenueGrowth();

    @Query(value = """
            SELECT COALESCE(SUM(amount),0)
            FROM payment
            WHERE status = 'SUCCESS'
            AND MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
            """, nativeQuery = true)
    Double monthlyRevenue();

    @Query(value = """
            SELECT COALESCE(SUM(amount),0)
            FROM payment
            WHERE status = 'REFUNDED'
            """, nativeQuery = true)
    Double totalRefunds();

    @Query(value = """
            SELECT COALESCE(SUM(amount),0)
            FROM payment
            WHERE status = 'SUCCESS'
            AND DATE(created_at) = CURRENT_DATE()
            """, nativeQuery = true)
    Double todayRevenue();

    @Query("""
            SELECT p FROM Payment p
            JOIN FETCH p.user
            JOIN FETCH p.booking
            ORDER BY p.createdAt DESC
            """)
    List<Payment> findAllWithUserAndBooking();

}

