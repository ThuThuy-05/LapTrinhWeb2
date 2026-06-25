package com.booking.backend.controller;

import com.booking.backend.dto.RoomRequest;
import com.booking.backend.entity.Branch;
import com.booking.backend.entity.Room;
import com.booking.backend.repository.BranchRepository;
import com.booking.backend.service.RoomService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class RoomController {

    private final RoomService roomService;
    private final BranchRepository branchRepository;

    public RoomController(RoomService roomService, BranchRepository branchRepository) {
        this.roomService = roomService;
        this.branchRepository = branchRepository;
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

        Branch branch = branchRepository
                .findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        Room room = new Room();

        room.setName(request.getName());

        room.setLocation(request.getLocation());

        room.setBranch(branch);

        room.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true);
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

        Branch branch = branchRepository
                .findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        Room room = new Room();

        room.setName(request.getName());

        room.setLocation(request.getLocation());

        room.setActive(request.getActive());

        room.setBranch(branch);

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