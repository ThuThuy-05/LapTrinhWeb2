// app/admin/rooms/components/RoomTable.tsx
"use client";

import {
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
} from "lucide-react";
import { Room } from "@/services/roomService";

interface RoomTableProps {
  rooms: Room[];
  onDelete: (id: number) => void;
  onEdit: (room: Room) => void;
}

export default function RoomTable({ rooms, onDelete, onEdit }: RoomTableProps) {
  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">Chưa có phòng khám nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-blue-50 to-teal-50/50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Tên phòng
              </th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Vị trí
              </th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Chi nhánh
              </th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-5 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-slate-50/50 transition duration-150"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-500" />
                    <span className="font-medium text-slate-800">
                      {room.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm">
                      {room.location || "Chưa cập nhật"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <Building2 className="w-3 h-3" />
                    {room.branch?.name || "N/A"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      room.active
                        ? "bg-teal-50 text-teal-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {room.active ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {room.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onEdit(room)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(room.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
