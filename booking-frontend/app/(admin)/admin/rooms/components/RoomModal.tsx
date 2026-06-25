    // app/admin/rooms/components/RoomModal.tsx
    "use client";

    import { useState, useEffect, useMemo } from "react";
    import { X, Building2, MapPin, Layers } from "lucide-react";
    import { Room } from "@/services/roomService";
    import { getAllBranches, Branch } from "@/services/branchService";

    interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: any) => void;
    currentRoom?: Room | null;
    }

    export default function RoomModal({
    isOpen,
    onClose,
    onSuccess,
    currentRoom,
    }: RoomModalProps) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        branchId: 1,
        active: true,
    });

    useEffect(() => {
        const fetchBranches = async () => {
        try {
            setLoadingBranches(true);

            const data = await getAllBranches();

            console.log("BRANCHES:", data);

            setBranches(data);
        } catch (error) {
            console.error("Load branches error:", error);
        } finally {
            setLoadingBranches(false);
        }
        };

        if (isOpen) {
        fetchBranches();
        }
    }, [isOpen]);

    // Reset form khi currentRoom hoặc branches thay đổi
    useEffect(() => {
        if (!isOpen) return;

        setFormData({
        name: currentRoom?.name || "",
        location: currentRoom?.location || "",
        branchId: currentRoom?.branch?.id || branches[0]?.id || 1,
        active: currentRoom?.active ?? true,
        });
    }, [isOpen, currentRoom, branches]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
        await onSuccess(formData);
        onClose();
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                    <Layers className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">
                    {currentRoom ? "Sửa phòng khám" : "Thêm phòng khám mới"}
                </h2>
                </div>
                <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                >
                <X className="w-5 h-5 text-white" />
                </button>
            </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tên phòng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    required
                    placeholder="Nhập tên phòng"
                    value={formData.name}
                    onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-teal-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-200 outline-none transition"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Vị trí
                </label>
                <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Ví dụ: Tầng 2, Khu A"
                    value={formData.location}
                    onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-teal-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-200 outline-none transition"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Chi nhánh <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {loadingBranches ? (
                    <div className="w-full px-4 py-2.5 border border-teal-200 rounded-xl bg-slate-50 text-slate-400 text-sm">
                    Đang tải chi nhánh...
                    </div>
                ) : (
                    <select
                    required
                    value={formData.branchId}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        branchId: Number(e.target.value),
                        })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-teal-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-200 outline-none transition appearance-none bg-white text-slate-700"
                    >
                    {branches.length === 0 ? (
                        <option value={1}>Chưa có chi nhánh</option>
                    ) : (
                        branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                        ))
                    )}
                    </select>
                )}
                </div>
                {branches.length === 0 && !loadingBranches && (
                <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Chưa có chi nhánh nào. Vui lòng thêm chi nhánh trước.
                </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Trạng thái
                </label>

                <select
                value={String(formData.active)}
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    active: e.target.value === "true",
                    })
                }
                className="w-full px-4 py-2.5 border border-teal-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-200 outline-none transition bg-white"
                >
                <option value="true">Hoạt động</option>
                <option value="false">Ngừng hoạt động</option>
                </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-teal-100">
                <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-teal-200 text-slate-600 rounded-xl hover:bg-teal-50 transition font-medium"
                >
                Hủy
                </button>
                <button
                type="submit"
                disabled={loading || loadingBranches || branches.length === 0}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-md transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                    </div>
                ) : currentRoom ? (
                    "Cập nhật"
                ) : (
                    "Thêm mới"
                )}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }
