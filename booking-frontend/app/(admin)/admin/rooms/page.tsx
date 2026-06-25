// app/admin/rooms/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Building2 } from "lucide-react";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  Room,
} from "@/services/roomService";
import RoomStats from "./components/RoomStats";
import RoomFilters from "./components/RoomFilters";
import RoomTable from "./components/RoomTable";
import RoomModal from "./components/RoomModal";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // fetchData - dùng useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect chỉ gọi fetchData 1 lần
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dùng useMemo để filter thay vì useEffect
  const filteredRooms = useMemo(() => {
    let result = rooms;

    if (searchTerm) {
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus === "active") {
      result = result.filter((room) => room.active);
    } else if (filterStatus === "inactive") {
      result = result.filter((room) => !room.active);
    }

    return result;
  }, [rooms, searchTerm, filterStatus]);

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setCurrentRoom(room);
    } else {
      setCurrentRoom(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleSave = async (data: any) => {
    try {
      console.log("UPDATE DATA:", data);

      if (currentRoom) {
        await updateRoom(currentRoom.id, data);
      } else {
        await createRoom(data);
      }

      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      await deleteRoom(id);
      await fetchData();
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const stats = {
    total: rooms.length,
    active: rooms.filter((r) => r.active).length,
    inactive: rooms.filter((r) => !r.active).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 mt-3">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-teal-700 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-teal-500" />
              Quản lý Phòng khám
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Tổng số:{" "}
              <span className="font-semibold text-teal-600">{stats.total}</span>{" "}
              phòng khám
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm phòng mới
          </button>
        </div>

        {/* Stats */}
        <RoomStats
          total={stats.total}
          active={stats.active}
          inactive={stats.inactive}
        />

        {/* Filters */}
        <RoomFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onReset={handleReset}
        />

        {/* Table */}
        <RoomTable
          rooms={filteredRooms}
          onDelete={handleDelete}
          onEdit={handleOpenModal}
        />

        {/* Modal */}
        <RoomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSave}
          currentRoom={currentRoom}
        />
      </div>
    </div>
  );
}
