package com.hostel.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hostel.model.Booking;

public interface BookingRepository
                extends JpaRepository<Booking, Long> {

        @Query("""
                        SELECT r.roomType, COUNT(b)
                        FROM Booking b
                        JOIN b.room r
                        GROUP BY r.roomType
                        """)
        List<Object[]> bookingByRoomType();

       

        @Query("""
                        SELECT FUNCTION('DATE', b.checkIn), COUNT(b)
                        FROM Booking b
                        GROUP BY FUNCTION('DATE', b.checkIn)
                        """)
        List<Object[]> bookingByDate();

        @Query("""
                        SELECT DATE(b.checkIn), COUNT(b)
                        FROM Booking b
                        GROUP BY DATE(b.checkIn)
                        ORDER BY DATE(b.checkIn)
                        """)
        List<Object[]> bookingTrend();

        @Query("""
                        SELECT r.roomNumber, COUNT(b)
                        FROM Booking b
                        JOIN b.room r
                        GROUP BY r.roomNumber
                        ORDER BY COUNT(b) DESC
                        """)
        List<Object[]> topBookedRooms();

        @Query("""
                        SELECT SUM(p.amount)
                        FROM Payment p
                        WHERE p.status = com.hostel.model.PaymentStatus.SUCCESS
                        AND MONTH(p.createdAt) = :month
                        AND YEAR(p.createdAt) = :year
                        """)
        Double revenueByMonth(@Param("month") int month,
                        @Param("year") int year);


        @Query("""
SELECT SUM(p.amount)
FROM Payment p
WHERE p.status = com.hostel.model.PaymentStatus.SUCCESS
AND p.createdAt BETWEEN :startDate AND :endDate
""")
Double revenueBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate);

        @Query("""
SELECT b.status, COUNT(b)
FROM Booking b
GROUP BY b.status
""")
List<Object[]> bookingStatusStats();

@Query("""
SELECT b.user.email, COUNT(b)
FROM Booking b
GROUP BY b.user.email
ORDER BY COUNT(b) DESC
""")
List<Object[]> topUsers();


}
