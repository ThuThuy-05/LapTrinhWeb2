package com.booking.backend.service;

import com.booking.backend.entity.Room;

import java.util.List;

public interface RoomService {

    List<Room> getAllRooms();

    Room findById(Long id);

    Room createRoom(Room room);

    Room updateRoom(Long id, Room room);

    void deleteRoom(Long id);
}