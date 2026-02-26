package com.hostel.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private Double price;
    private boolean available;

    @Enumerated(EnumType.STRING) // ✅ Important
    private RoomType roomType;
    private Integer floor;
    private Integer capacity;
    private String description;
    private String imageUrl;

    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private List<Booking> bookings;
}

