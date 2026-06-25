"use client";

import { useEffect, useState } from "react";
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  exportDoctorsToExcel, // THÊM DÒNG NÀY
  importDoctorsFromExcel, // THÊM DÒNG NÀY
} from "@/services/doctorService";
import { getAllSpecialties } from "@/services/specialtyService";
import { getAllBranches } from "@/services/branchService";
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  User,
  ImageIcon,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Eye,
  Building2,
  MapPin,
  Calendar,
  Users,
  Stethoscope,
  Award,
  Activity,
  Filter,
  Sparkles,
  Upload, // Thêm
  Download, // Thêm
  FileSpreadsheet, // Thêm
  CheckCircle2, // Thêm
  XCircle,
} from "lucide-react";
import axios from "axios";
import Pagination from "@/components/Pagination";
import * as XLSX from "xlsx";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .doctor-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

export default function DoctorPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "MALE",
    dateOfBirth: "",
    address: "",
    specialtyId: 0,
    branchId: 0,
    degree: "",
    experience: 0,
    description: "",
    active: true,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Import/Export states
  const [isImporting, setIsImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);

  // Fetch data
  const fetchData = async () => {
    try {
      setFetching(true);

      const [docs, specs, branchs] = await Promise.all([
        getAllDoctors(),
        getAllSpecialties(),
        getAllBranches(),
      ]);

      setDoctors(docs || []);
      setSpecialties(specs || []);
      setBranches(branchs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };

    load();
  }, []);

  // Filter
  const filtered = doctors.filter((d) => {
    const s = searchTerm.toLowerCase();
    const name =
      `${d.user?.lastName || ""} ${d.user?.firstName || ""}`.toLowerCase();
    const mail = d.user?.email?.toLowerCase() || "";
    const phone = d.user?.phone || "";
    const specialty = d.specialty?.name?.toLowerCase() || "";
    const branch = d.branch?.name?.toLowerCase() || "";

    const matchesSearch =
      name.includes(s) ||
      mail.includes(s) ||
      phone.includes(searchTerm) ||
      specialty.includes(s) ||
      branch.includes(s);

    const matchesSpecialty =
      !selectedSpecialty || d.specialty?.id.toString() === selectedSpecialty;

    const matchesBranch =
      !selectedBranch || d.branch?.id.toString() === selectedBranch;

    return matchesSearch && matchesSpecialty && matchesBranch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // useEffect(() => {
  //   if (currentPage !== 1) {
  //     setCurrentPage(1);
  //   }
  // }, [searchTerm, selectedSpecialty, selectedBranch, currentPage]);

  // Validate
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName.trim())
      newErrors.lastName = "Vui lòng nhập họ và tên đệm";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Số điện thoại phải gồm đúng 10 số và bắt đầu bằng số 0";
    }
    if (!editingId && !formData.password)
      newErrors.password = "Vui lòng nhập mật khẩu";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
    if (formData.specialtyId === 0)
      newErrors.specialtyId = "Vui lòng chọn chuyên khoa";
    if (formData.branchId === 0) newErrors.branchId = "Vui lòng chọn chi nhánh";
    if (!formData.degree.trim()) newErrors.degree = "Vui lòng nhập bằng cấp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal
  const handleOpenModal = (doc?: any) => {
    setErrors({});
    if (doc) {
      setEditingId(doc.id);
      setFormData({
        firstName: doc.user?.firstName || "",
        lastName: doc.user?.lastName || "",
        email: doc.user?.email || "",
        phone: doc.user?.phone || "",
        password: "",
        gender: doc.user?.gender || "MALE",
        dateOfBirth: doc.user?.dateOfBirth?.split("T")[0] || "",
        address: doc.user?.address || "",
        specialtyId: doc.specialty?.id || 0,
        branchId: doc.branch?.id || 0,
        degree: doc.degree || "",
        experience: doc.experience || 0,
        description: doc.description || "",
        active: doc.user?.active ?? true,
      });
      setPreview(doc.user?.avatar || null);
      setFile(null);
    } else {
      setEditingId(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        gender: "MALE",
        dateOfBirth: "",
        address: "",
        specialtyId: 0,
        branchId: 0,
        degree: "",
        experience: 0,
        description: "",
        active: true,
      });
      setPreview(null);
      setFile(null);
    }
    setIsModalOpen(true);
  };

  const handleViewDoctor = (doc: any) => {
    setSelectedDoctor(doc);
    setIsViewModalOpen(true);
  };

  // Save
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Tạo object data để gửi
      const data: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address.trim(),
        specialtyId: formData.specialtyId,
        branchId: formData.branchId,
        degree: formData.degree.trim(),
        experience: formData.experience,
        description: formData.description.trim(),
        active: formData.active,
      };

      if (formData.password) {
        data.password = formData.password;
      } else if (!editingId) {
        alert("Vui lòng nhập mật khẩu");
        setLoading(false);
        return;
      }

      if (file) {
        data.file = file;
      }

      if (editingId) {
        await updateDoctor(editingId, data);
      } else {
        await createDoctor(data);
      }

      await fetchData();
      setIsModalOpen(false);
      setFile(null);
      setPreview(null);
      alert(editingId ? "Cập nhật thành công!" : "Thêm bác sĩ thành công!");
    } catch (e: any) {
      console.error("Save error:", e);
      const message =
        e?.response?.data?.message || e?.message || "Thao tác thất bại";
      const lowerMessage = message.toLowerCase();

      setErrors({ email: "", phone: "" });

      if (lowerMessage.includes("email")) {
        setErrors({ email: "Email đã tồn tại" });
      } else if (
        lowerMessage.includes("phone") ||
        lowerMessage.includes("số điện thoại")
      ) {
        setErrors({ phone: "Số điện thoại đã tồn tại" });
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa bác sĩ này?")) return;
    try {
      await deleteDoctor(id);
      await fetchData();
      alert("Xóa thành công!");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xóa thất bại");
    }
  };

  // Export Excel
  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await exportDoctorsToExcel();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `danh_sach_bac_si_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert("Xuất file Excel thành công!");
    } catch (error: any) {
      console.error("Export error:", error);
      alert(error?.response?.data?.message || "Xuất file thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Import Excel
  // Import Excel
  // Import Excel - Cập nhật để hiển thị lỗi chi tiết
  const handleImport = async () => {
    if (!importFile) {
      alert("Vui lòng chọn file Excel");
      return;
    }

    try {
      setIsImporting(true);
      const result = await importDoctorsFromExcel(importFile);
      await fetchData(); // Refresh danh sách

      // Hiển thị thông báo chi tiết
      if (result.errors && result.errors.length > 0) {
        // Tạo thông báo lỗi chi tiết
        let errorMessage = `${result.message || "Kết quả import:"}\n\n`;
        errorMessage += `✅ Thành công: ${result.success}/${result.total} bác sĩ\n`;
        errorMessage += `❌ Thất bại: ${result.errors.length} dòng\n\n`;
        errorMessage += `📋 Chi tiết lỗi:\n${result.errors.join("\n")}`;

        alert(errorMessage);
      } else {
        alert(result.message || `Import thành công ${result.success} bác sĩ!`);
      }

      setShowImportModal(false);
      setImportFile(null);
      setImportPreview([]);
    } catch (error: any) {
      console.error("Import error:", error);
      alert(
        error?.response?.data?.error || error?.message || "Import thất bại!",
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Xử lý chọn file import
  const handleImportFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }
      setImportFile(file);

      // Preview file Excel
      const XLSX = await import("xlsx");
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setImportPreview(jsonData.slice(0, 5));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Download template Excel
  // Download template Excel - Cách 2: Tạo từ array để kiểm soát header chính xác
  const downloadTemplate = () => {
    // const XLSX = require("xlsx");
    // Định nghĩa headers đúng thứ tự như file export
    const headers = [
      "STT",
      "Họ và tên đệm",
      "Tên",
      "Email",
      "Số điện thoại",
      "Giới tính",
      "Ngày sinh",
      "Địa chỉ",
      "Chuyên khoa",
      "Chi nhánh",
      "Bằng cấp",
      "Kinh nghiệm (năm)",
      "Mô tả",
      "URL ảnh",
    ];

    // Dữ liệu mẫu
    const sampleData = [
      [
        1,
        "Nguyễn Văn",
        "A",
        "doctor@example.com",
        "0912345678",
        "MALE",
        "1990-01-01",
        "Hà Nội",
        "Nội tổng hợp",
        "Cơ sở 1",
        "Tiến sĩ",
        10,
        "Bác sĩ giàu kinh nghiệm",
        "https://res.cloudinary.com/dbxbz6alk/image/upload/v1779898470/doctors/qeyvlzv1yh33efwvwgsb.webp",
      ],
      [
        2,
        "Trần Thị",
        "B",
        "doctor2@example.com",
        "0987654321",
        "FEMALE",
        "1985-05-15",
        "TP. Hồ Chí Minh",
        "Nhi khoa",
        "Cơ sở 2",
        "Thạc sĩ",
        15,
        "Chuyên gia nhi khoa",
        "",
      ],
    ];

    // Gộp header và data
    const wsData = [headers, ...sampleData];

    // Tạo worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Đặt độ rộng cột
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 30 },
      { wch: 50 },
    ];

    // Tạo file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách bác sĩ");
    XLSX.writeFile(wb, `template_bac_si.xlsx`);
  };
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setSelectedBranch("");
  };

  return (
    <div className="doctor-page min-h-screen bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FDFA] p-4 md:p-8">
      <style>{fontStyle}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F4A5C]">
                  Quản lý <span className="text-[#2DD4BF]">Bác sĩ</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <Activity size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-bold text-[#2DD4BF]">
                    {filtered.length}
                  </span>{" "}
                  bác sĩ
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white px-5 py-2.5 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
          >
            <PlusCircle size={16} />
            Thêm bác sĩ
          </button>
        </div> */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={loading}
            className="bg-white border-2 border-[#2DD4BF] text-[#2DD4BF] px-5 py-2.5 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:bg-[#E6F7F5] transition-all duration-300 text-sm"
          >
            <Download size={16} />
            Xuất Excel
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-white border-2 border-[#0EA5E9] text-[#0EA5E9] px-5 py-2.5 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:bg-[#E6F7F5] transition-all duration-300 text-sm"
          >
            <Upload size={16} />
            Import Excel
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white px-5 py-2.5 rounded-2xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
          >
            <PlusCircle size={16} />
            Thêm bác sĩ
          </button>
        </div>
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, SĐT, chuyên khoa, chi nhánh..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all text-[#1F4A5C] placeholder:text-[#B8D9E6] font-medium"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="relative min-w-[180px]">
              <Stethoscope
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
                size={16}
              />
              <select
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none appearance-none cursor-pointer text-[#1F4A5C] font-medium"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id.toString()}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Filter size={14} className="text-[#2DD4BF]" />
              </div>
            </div>

            <div className="relative min-w-[180px]">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
                size={16}
              />
              <select
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none appearance-none cursor-pointer text-[#1F4A5C] font-medium"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">Tất cả chi nhánh</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Filter size={14} className="text-[#2DD4BF]" />
              </div>
            </div>

            {(searchTerm || selectedSpecialty || selectedBranch) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all text-sm font-medium flex items-center gap-2"
              >
                <X size={14} />
                Xóa lọc
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FDFA] border-b border-[#D0F0FD]">
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Chuyên khoa
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Chi nhánh
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Kinh nghiệm
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Bằng cấp
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-bold text-[#1F4A5C] uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F7F5]">
                {fetching ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-[#2DD4BF]"
                        size={32}
                      />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center text-[#5B8C9E]"
                    >
                      <AlertCircle className="mx-auto mb-2" size={32} />
                      <p className="font-medium">Không tìm thấy bác sĩ nào</p>
                    </td>
                  </tr>
                ) : (
                  currentData.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-[#2DD4BF]/5 transition-all duration-200 group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] overflow-hidden flex-shrink-0 shadow-sm">
                            {doc.user?.avatar ? (
                              <img
                                src={doc.user.avatar}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <User className="w-full h-full p-2 text-[#2DD4BF]" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#1F4A5C] text-sm">
                              {doc.user?.lastName} {doc.user?.firstName}
                            </p>
                            <p className="text-xs text-[#5B8C9E] font-medium">
                              {doc.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F7F5] text-[#2DD4BF] rounded-lg text-xs font-semibold">
                          <Stethoscope size={12} />
                          {doc.specialty?.name || "---"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Building2 size={14} className="text-[#2DD4BF]" />
                          <span className="text-sm text-[#1F4A5C] font-medium">
                            {doc.branch?.name || "---"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm text-[#1F4A5C] font-medium">
                          <Phone size={14} className="text-[#2DD4BF]" />
                          {doc.user?.phone || "---"}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm text-[#1F4A5C] font-medium">
                          <Briefcase size={14} className="text-[#2DD4BF]" />
                          {doc.experience} năm
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm text-[#1F4A5C] font-medium">
                          <Award size={14} className="text-[#2DD4BF]" />
                          {doc.degree || "---"}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            doc.user?.active
                              ? "bg-[#E6F7F5] text-[#2DD4BF]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {doc.user?.active ? "Đang công tác" : "Tạm nghỉ"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleViewDoctor(doc)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#2DD4BF] hover:bg-[#E6F7F5] rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(doc)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#0EA5E9] hover:bg-[#E6F7F5] rounded-lg transition-all"
                            title="Sửa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#F43F5E] hover:bg-[#FEF2F2] rounded-lg transition-all"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "✏️ Cập nhật bác sĩ" : "➕ Thêm bác sĩ mới"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Avatar */}
                  <div className="col-span-2 flex justify-center mb-2">
                    <label className="cursor-pointer group">
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] border-2 border-dashed border-[#2DD4BF] flex flex-col items-center justify-center overflow-hidden hover:border-[#0EA5E9] transition-all group-hover:shadow-md">
                        {preview ? (
                          <img
                            src={preview}
                            className="w-full h-full object-cover"
                            alt="Preview"
                          />
                        ) : (
                          <>
                            <ImageIcon className="text-[#2DD4BF]" size={28} />
                            <span className="text-[10px] text-[#2DD4BF] mt-1 font-semibold">
                              Ảnh đại diện
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setFile(f);
                            setPreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Họ và tên đệm
                    </label>
                    <input
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.lastName ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      placeholder="Nguyễn Văn"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                    {errors.lastName && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Tên
                    </label>
                    <input
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.firstName ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      placeholder="A"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                    {errors.firstName && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.email ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      placeholder="doctor@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Số điện thoại
                    </label>
                    <input
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.phone ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    {errors.phone && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Mật khẩu{" "}
                      {editingId && (
                        <span className="font-normal text-[#5B8C9E]">
                          (để trống nếu không đổi)
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.password ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      placeholder={
                        editingId ? "Mật khẩu mới..." : "Nhập mật khẩu"
                      }
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    {errors.password && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.dateOfBirth ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                    {errors.dateOfBirth && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Giới tính
                    </label>
                    <select
                      className="w-full p-2.5 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Địa chỉ
                    </label>
                    <input
                      className="w-full p-2.5 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium"
                      placeholder="Nhập địa chỉ..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Chuyên khoa
                    </label>
                    <select
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.specialtyId ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      value={formData.specialtyId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialtyId: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>-- Chọn chuyên khoa --</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.specialtyId && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.specialtyId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Chi nhánh
                    </label>
                    <select
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.branchId ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      value={formData.branchId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          branchId: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>-- Chọn chi nhánh --</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    {errors.branchId && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.branchId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Bằng cấp
                    </label>
                    <input
                      className={`w-full p-2.5 bg-[#F0FDFA] rounded-xl border ${errors.degree ? "border-[#F43F5E]" : "border-[#D0F0FD]"} text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium`}
                      placeholder="Tiến sĩ, Thạc sĩ..."
                      value={formData.degree}
                      onChange={(e) =>
                        setFormData({ ...formData, degree: e.target.value })
                      }
                    />
                    {errors.degree && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.degree}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Kinh nghiệm (năm)
                    </label>
                    <input
                      type="number"
                      className="w-full p-2.5 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] text-sm focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD]">
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider flex-1">
                      Đang công tác
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, active: !formData.active })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${formData.active ? "bg-[#2DD4BF]" : "bg-[#B8D9E6]"}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.active ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Mô tả
                    </label>
                    <textarea
                      rows={2}
                      className="w-full p-2.5 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] text-sm resize-none focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all font-medium"
                      placeholder="Thông tin thêm về bác sĩ..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end gap-3 bg-[#F0FDFA]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D0F0FD] text-[#5B8C9E] text-sm font-semibold hover:bg-[#E6F7F5] transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : editingId ? (
                    "Cập nhật"
                  ) : (
                    "Thêm mới"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Detail Modal */}
        {isViewModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Stethoscope size={18} />
                  Chi tiết bác sĩ
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col items-center mb-5">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] overflow-hidden mb-3 shadow-md">
                    {selectedDoctor.user?.avatar ? (
                      <img
                        src={selectedDoctor.user.avatar}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <User className="w-full h-full p-5 text-[#2DD4BF]" />
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1F4A5C]">
                    {selectedDoctor.user?.lastName}{" "}
                    {selectedDoctor.user?.firstName}
                  </h3>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      selectedDoctor.user?.active
                        ? "bg-[#E6F7F5] text-[#2DD4BF]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedDoctor.user?.active ? "Đang công tác" : "Tạm nghỉ"}
                  </span>
                </div>

                <div className="space-y-3 text-sm border-t border-[#E6F7F5] pt-4">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Mail size="1.2rem" className="text-[#2DD4BF]" /> Email:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.user?.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Phone size="1.2rem" className="text-[#2DD4BF]" /> SĐT:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.user?.phone || "---"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Users size="1.2rem" className="text-[#2DD4BF]" /> Giới
                      tính:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.user?.gender === "MALE" ? "Nam" : "Nữ"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Calendar size="1.2rem" className="text-[#2DD4BF]" /> Ngày
                      sinh:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {formatDate(selectedDoctor.user?.dateOfBirth)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <MapPin size="1.2rem" className="text-[#2DD4BF]" /> Địa
                      chỉ:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.user?.address || "---"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Stethoscope size="1.2rem" className="text-[#2DD4BF]" />{" "}
                      Chuyên khoa:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.specialty?.name || "---"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Building2 size="1.2rem" className="text-[#2DD4BF]" /> Chi
                      nhánh:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.branch?.name || "---"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Briefcase size="1.2rem" className="text-[#2DD4BF]" />{" "}
                      Kinh nghiệm:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.experience} năm
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-2 font-medium">
                      <Award size="1.2rem" className="text-[#2DD4BF]" /> Bằng
                      cấp:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedDoctor.degree || "---"}
                    </span>
                  </div>

                  {selectedDoctor.description && (
                    <div className="pt-2">
                      <span className="text-[#5B8C9E] flex items-center gap-2 mb-2 font-medium">
                        Mô tả:
                      </span>
                      <p className="text-[#1F4A5C] bg-[#F0FDFA] p-3 rounded-xl leading-relaxed">
                        {selectedDoctor.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end bg-[#F0FDFA]">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white text-sm font-bold uppercase tracking-wider hover:shadow-md transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Excel Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet size={20} />
                  Import danh sách bác sĩ từ Excel
                </h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Download template */}
                <div className="bg-[#F0FDFA] rounded-xl p-4 border border-[#D0F0FD]">
                  <p className="text-sm font-semibold text-[#1F4A5C] mb-2">
                    📋 Tải file mẫu
                  </p>
                  <p className="text-xs text-[#5B8C9E] mb-3">
                    Tải file Excel mẫu để có đúng định dạng cột. Đảm bảo nhập
                    đúng tên cột và định dạng dữ liệu để quá trình import diễn
                    ra suôn sẻ.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="text-[#2DD4BF] text-sm font-semibold flex items-center gap-2 hover:underline"
                  >
                    <Download size={14} />
                    Tải file mẫu tại đây
                  </button>
                </div>

                {/* Upload file */}
                <div>
                  <label className="text-[11px] font-bold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Chọn file Excel
                  </label>
                  <div className="relative border-2 border-dashed rounded-2xl overflow-hidden transition-all border-[#D0F0FD] bg-[#F0FDFA] hover:border-[#2DD4BF]">
                    <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                      <div className="w-16 h-16 bg-[#E6F7F5] text-[#2DD4BF] rounded-2xl flex items-center justify-center mb-4">
                        <FileSpreadsheet size={32} />
                      </div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B8C9E]">
                        {importFile
                          ? importFile.name
                          : "Nhấp để tải file Excel lên"}
                      </span>
                      <span className="text-[10px] text-[#B8D9E6] mt-1">
                        Hỗ trợ .xlsx, .xls
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImportFileChange}
                        accept=".xlsx,.xls"
                      />
                    </label>
                  </div>
                </div>

                {/* Preview */}
                {importPreview.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold text-[#1F4A5C]">
                        📊 Xem trước {importPreview.length} dòng đầu:
                      </p>
                      <p className="text-[10px] text-[#2DD4BF] font-medium">
                        Tổng số: {importPreview.length} dòng
                      </p>
                    </div>
                    <div className="overflow-x-auto max-h-64 rounded-xl border border-[#D0F0FD]">
                      <table className="w-full text-xs">
                        <thead className="bg-[#E6F7F5] sticky top-0">
                          <tr>
                            {Object.keys(importPreview[0] || {}).map((key) => (
                              <th
                                key={key}
                                className="px-3 py-2 text-left font-bold text-[#1F4A5C] min-w-[100px]"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.map((row, idx) => (
                            <tr key={idx} className="border-t border-[#E6F7F5]">
                              {Object.values(row).map((val: any, i) => (
                                <td
                                  key={i}
                                  className="px-3 py-2 text-[#5B8C9E] max-w-[200px] truncate"
                                >
                                  {String(val) || "---"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-[#B8D9E6] mt-2 text-center">
                      * Chỉ hiển thị 5 dòng đầu tiên. Dữ liệu sẽ được kiểm tra
                      và import toàn bộ.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end gap-3 bg-[#F0FDFA]">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportPreview([]);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#D0F0FD] text-[#5B8C9E] text-sm font-semibold hover:bg-[#E6F7F5] transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImport}
                  disabled={isImporting || !importFile}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isImporting ? "Đang import..." : "Import dữ liệu"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
