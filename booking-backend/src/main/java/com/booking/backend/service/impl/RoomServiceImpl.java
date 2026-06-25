package com.booking.backend.service.impl;

import com.booking.backend.entity.Room;
import com.booking.backend.repository.RoomRepository;
import com.booking.backend.service.RoomService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // =========================
    // GET ALL
    // =========================

    @Override
    public List<Room> getAllRooms() {

        return roomRepository.findAll();
    }

    // =========================
    // FIND BY ID
    // =========================

    @Override
    public Room findById(Long id) {

        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    // =========================
    // CREATE
    // =========================

    @Override
    public Room createRoom(Room room) {

        if (roomRepository.existsByName(room.getName())) {

            throw new RuntimeException("Tên phòng đã tồn tại");
        }

        room.setActive(true);

        return roomRepository.save(room);
    }

    // =========================
    // UPDATE
    // =========================

    @Override
    public Room updateRoom(Long id, Room room) {

        Room oldRoom = findById(id);

        oldRoom.setName(room.getName());

        oldRoom.setLocation(room.getLocation());

        oldRoom.setBranch(room.getBranch());
        oldRoom.setActive(room.getActive());

        return roomRepository.save(oldRoom);
    }
    // =========================
    // DELETE
    // =========================

    @Override
    public void deleteRoom(Long id) {

        roomRepository.deleteById(id);
    }
}