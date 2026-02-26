package com.hostel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hostel.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

@Query(value = """
SELECT DATE(created_at), COUNT(*)
FROM user
GROUP BY DATE(created_at)
ORDER BY DATE(created_at)
""", nativeQuery = true)
List<Object[]> userGrowth();


}
