package com.booking.backend.controller;

import com.booking.backend.dto.RoomRequest;
import com.booking.backend.entity.Room;
import com.booking.backend.service.RoomService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // =========================
    // GET ALL ROOMS
    // =========================

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {

        return roomService.getAllRooms();
    }

    // =========================
    // GET ROOM BY ID
    // =========================

    @GetMapping("/rooms/{id}")
    public Room getRoomById(@PathVariable Long id) {

        return roomService.findById(id);
    }

    // =========================
    // CREATE ROOM
    // =========================

    @PostMapping("/admin/rooms")
    public Room createRoom(
            @RequestBody RoomRequest request) {

        Room room = new Room();

        room.setName(request.getName());

        room.setLocation(request.getLocation());

        room.setActive(request.getActive());

        return roomService.createRoom(room);
    }

    // =========================
    // UPDATE ROOM
    // =========================

    @PutMapping("/admin/rooms/{id}")
    public Room updateRoom(

            @PathVariable Long id,

            @RequestBody RoomRequest request

    ) {

        Room room = new Room();

        room.setName(request.getName());

        room.setLocation(request.getLocation());

        room.setActive(request.getActive());

        return roomService.updateRoom(id, room);
    }

    // =========================
    // DELETE ROOM
    // =========================

    @DeleteMapping("/admin/rooms/{id}")
    public void deleteRoom(@PathVariable Long id) {

        roomService.deleteRoom(id);
    }
} 