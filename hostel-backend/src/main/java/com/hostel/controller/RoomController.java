package com.hostel.controller;

import com.hostel.model.Room;
import com.hostel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // @PostMapping
    // public Room create(@RequestBody Room room) {
    //     return roomService.createRoom(room);
    // }

    @GetMapping
    public List<Room> getAll() {
        return roomService.getAllRooms();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }

     // ✅ ADD ROOM (Admin use)
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomService.saveRoom(room);
    }
}
