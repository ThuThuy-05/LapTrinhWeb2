"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAllBranches, Branch } from "@/services/branchService";
import { getAllSpecialties, Specialty } from "@/services/specialtyService";
import { getDoctorsByFilter, getDoctorById } from "@/services/doctorService";
import { getSchedulesByDoctorId, Schedule } from "@/services/scheduleService";
import { getProfile } from "@/services/authService";
import api from "@/lib/api";
import {
  Clock,
  User,
  Phone,
  Mail,
  Activity,
  Loader2,
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Award,
  Heart,
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();

  const doctorIdFromUrl = params.id as string;
  const [loading, setLoading] = useState(true);

  // DỮ LIỆU TỪ API GỐC
  const [branches, setBranches] = useState<Branch[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  // TRẠNG THÁI LỰA CHỌN TRÊN GIAO DIỆN
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [symptom, setSymptom] = useState("");
  const [cccdImage, setCccdImage] = useState<File | null>(null);
  const [cccdFront, setCccdFront] = useState<File | null>(null);
  const [cccdBack, setCccdBack] = useState<File | null>(null);

  const STORAGE_KEY = "booking_state";
  const [availableTabs, setAvailableTabs] = useState<
    Array<{
      dateStr: string;
      labelDay: string;
      labelYear: string;
      dayName: string;
    }>
  >([]);

  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const scrollTabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (loading) return;

    const data = {
      selectedBranch,
      selectedSpecialty,
      selectedDoctorId,
      selectedDate,
      selectedScheduleId: selectedSchedule?.id || null,
      symptom,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    isHydrated,
    loading,
    selectedBranch,
    selectedSpecialty,
    selectedDoctorId,
    selectedDate,
    selectedSchedule,
    symptom,
  ]);

  useEffect(() => {
    return () => {
      const nextPath = window.location.pathname;
      if (nextPath.includes("/doctors") || nextPath === "/") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    };
  }, []);

  useEffect(() => {
    const generateNext7Days = () => {
      const daysOfWeek = [
        "Chủ Nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      const tabs = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);

        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, "0");
        const day = String(nextDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        tabs.push({
          dateStr,
          labelDay: `${day}/${month}`,
          labelYear: `${year}`,
          dayName: i === 0 ? "Hôm nay" : daysOfWeek[nextDate.getDay()],
        });
      }
      setAvailableTabs(tabs);
      setSelectedDate(tabs[0].dateStr);
    };

    generateNext7Days();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowMonthCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const formatDateVN = (dateString: string) => {
    if (!dateString) return "";
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const [branchData, specialtyData, profileData] = await Promise.all([
          getAllBranches(),
          getAllSpecialties(),
          getProfile().catch(() => null),
        ]);

        setBranches(branchData);
        setSpecialties(specialtyData);
        setUserProfile(profileData);

        if (!doctorIdFromUrl) return;

        const doctorData = await getDoctorById(doctorIdFromUrl);

        if (!doctorData) return;

        setSelectedDoctor(doctorData);

        const bId = doctorData.branch?.id?.toString() || "";
        const sId = doctorData.specialty?.id?.toString() || "";

        setSelectedBranch(bId);
        setSelectedSpecialty(sId);
        setSelectedDoctorId(doctorData.id?.toString() || "");

        if (bId || sId) {
          const filteredDoctors = await getDoctorsByFilter(bId, sId);
          setDoctors(filteredDoctors);
        }

        const scheduleData = await getSchedulesByDoctorId(doctorData.id);
        setSchedules(scheduleData || []);

        const saved = sessionStorage.getItem(STORAGE_KEY);

        if (saved) {
          const data = JSON.parse(saved);

          if (
            data.selectedDoctorId?.toString() === doctorIdFromUrl?.toString()
          ) {
            setSelectedBranch(data.selectedBranch || "");
            setSelectedSpecialty(data.selectedSpecialty || "");
            setSelectedDoctorId(data.selectedDoctorId || "");
            setSelectedDate(data.selectedDate || "");
            setSymptom(data.symptom || "");
            setCccdFront(null);
            setCccdBack(null);

            if (data.selectedScheduleId && scheduleData) {
              const schedule = scheduleData.find(
                (s: Schedule) => s.id === data.selectedScheduleId,
              );
              if (schedule) {
                setSelectedSchedule(schedule);
              }
            }
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
          }
        }
        setIsHydrated(true);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    initData();
  }, [doctorIdFromUrl]);

  const handleFilterChange = async (branchId: string, specId: string) => {
    setSelectedBranch(branchId);
    setSelectedSpecialty(specId);
    setSelectedDoctorId("");
    setSelectedDoctor(null);
    setSchedules([]);
    setSelectedSchedule(null);

    if (branchId || specId) {
      try {
        const doctorData = await getDoctorsByFilter(branchId, specId);
        setDoctors(doctorData || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách bác sĩ filter:", err);
        setDoctors([]);
      }
    } else {
      setDoctors([]);
    }
  };

  const handleDoctorChange = async (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedSchedule(null);

    if (!doctorId) {
      setSelectedDoctor(null);
      setSchedules([]);
      return;
    }

    const doctor = doctors.find(
      (d) =>
        d.id?.toString() === doctorId.toString() ||
        d.doctor_id?.toString() === doctorId.toString(),
    );
    if (doctor) setSelectedDoctor(doctor);

    try {
      const data = await getSchedulesByDoctorId(doctorId);
      setSchedules(data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách ca khám của bác sĩ:", err);
      setSchedules([]);
    }
  };

  const handleBooking = async () => {
    if (!userProfile) {
      alert("Vui lòng đăng nhập để đặt lịch khám!");
      router.push("/login");
      return;
    }

    if (!selectedSchedule) {
      alert("Vui lòng chọn lịch khám!");
      return;
    }

    if (!symptom.trim()) {
      alert("Vui lòng nhập lý do khám!");
      return;
    }

    if (!cccdFront || !cccdBack) {
      alert("Vui lòng tải lên đầy đủ CCCD mặt trước và mặt sau!");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("userId", String(userProfile?.id));
      formData.append("scheduleId", String(selectedSchedule.id));
      formData.append(
        "price",
        String(selectedDoctor?.specialty?.price || selectedDoctor?.price || 0),
      );
      formData.append("symptom", symptom);
      formData.append("address", userProfile?.address || "");

      formData.append("cccdFront", cccdFront);
      formData.append("cccdBack", cccdBack);

      const res = await api.post("/bookings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const bookingId = res.data.id || res.data.booking?.id;

      if (!bookingId) throw new Error("Không lấy được bookingId");

      router.push(`/payment/${bookingId}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gặp lỗi trong quá trình đặt lịch!");
    }
  };

  const getNormalizedDbDate = (dbDateStr: string) => {
    if (!dbDateStr) return "";
    if (dbDateStr.includes("/")) {
      const [d, m, y] = dbDateStr.split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return dbDateStr;
  };

  const filteredSchedulesByDate = schedules.filter(
    (s) => getNormalizedDbDate(s.date) === selectedDate,
  );
  const currentTabInfo = availableTabs.find((t) => t.dateStr === selectedDate);

  const renderCalendarDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayCells = [];
    const todayStr = new Date().toISOString().split("T")[0];

    for (let i = 0; i < firstDayOfMonth; i++) {
      dayCells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentLoopDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const hasAvailableSlots = schedules.some(
        (s) =>
          getNormalizedDbDate(s.date) === currentLoopDateStr &&
          s.status === "AVAILABLE",
      );

      const isPast = currentLoopDateStr < todayStr;
      const isSelected = selectedDate === currentLoopDateStr;

      let dayClassName =
        "h-10 flex flex-col items-center justify-center text-xs font-bold rounded-xl transition-all relative font-['Times_New_Roman',serif] ";

      if (isPast) {
        dayClassName += "text-slate-300 cursor-not-allowed bg-slate-50/40";
      } else if (isSelected) {
        dayClassName +=
          "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-110 z-10";
      } else if (hasAvailableSlots) {
        dayClassName +=
          "bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:shadow-lg cursor-pointer";
      } else {
        dayClassName +=
          "text-slate-500 bg-slate-100 hover:bg-slate-200 cursor-pointer";
      }

      dayCells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isPast}
          className={dayClassName}
          onClick={() => {
            const daysOfWeek = [
              "Chủ Nhật",
              "Thứ 2",
              "Thứ 3",
              "Thứ 4",
              "Thứ 5",
              "Thứ 6",
              "Thứ 7",
            ];
            const dObj = new Date(year, month, day);

            if (!availableTabs.some((t) => t.dateStr === currentLoopDateStr)) {
              setAvailableTabs((prev) => {
                const updated = [
                  ...prev,
                  {
                    dateStr: currentLoopDateStr,
                    labelDay: `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}`,
                    labelYear: `${year}`,
                    dayName: daysOfWeek[dObj.getDay()],
                  },
                ];
                return updated.sort((a, b) =>
                  a.dateStr.localeCompare(b.dateStr),
                );
              });
            }

            setSelectedDate(currentLoopDateStr);
            setSelectedSchedule(null);
            setShowMonthCalendar(false);

            setTimeout(() => {
              const targetButton = scrollTabRefs.current[currentLoopDateStr];
              if (targetButton) {
                targetButton.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }
            }, 120);
          }}
        >
          <span>{day}</span>
          {currentLoopDateStr === todayStr && !isSelected && (
            <span className="absolute bottom-0.5 text-[7px] font-extrabold uppercase tracking-tighter text-blue-600 font-['Times_New_Roman',serif]">
              H.Nay
            </span>
          )}
        </button>,
      );
    }

    return dayCells;
  };

  const handlePrevMonth = () => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1,
        1,
      ),
    );
  };
  const handleNextMonth = () => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1,
        1,
      ),
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={48}
          />
          <p className="text-slate-600 font-medium font-['Times_New_Roman',serif]">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-20 font-['Times_New_Roman',serif]">
      {/* Header với nút quay lại */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 -ml-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors font-['Times_New_Roman',serif]">
              Quay lại
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Banner chào mừng */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight font-['Times_New_Roman',serif]">
              ĐẶT LỊCH KHÁM
            </h1>
          </div>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-['Times_New_Roman',serif]">
            Đặt lịch khám nhanh chóng, tiện lợi cùng đội ngũ bác sĩ hàng đầu.
            Vui lòng điền đầy đủ thông tin để chúng tôi có thể phục vụ bạn tốt
            nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- KHU VỰC CỘT TRÁI --- */}
          <div className="lg:col-span-8 space-y-6">
            {/* Khối 1: Chọn nội dung đặt lịch hẹn */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <h2 className="text-white font-black text-lg flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    1
                  </div>
                  Nội dung đặt hẹn
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <MapPin size={12} /> Cơ sở khám *
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all font-['Times_New_Roman',serif]"
                      value={selectedBranch}
                      onChange={(e) =>
                        handleFilterChange(e.target.value, selectedSpecialty)
                      }
                    >
                      <option value="">Chọn cơ sở</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id.toString()}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <Activity size={12} /> Chuyên khoa *
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all font-['Times_New_Roman',serif]"
                      value={selectedSpecialty}
                      onChange={(e) =>
                        handleFilterChange(selectedBranch, e.target.value)
                      }
                    >
                      <option value="">Chọn chuyên khoa</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id.toString()}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <User size={12} /> Bác sĩ *
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-['Times_New_Roman',serif]"
                      value={selectedDoctorId}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      disabled={doctors.length === 0}
                    >
                      <option value="">
                        {doctors.length > 0
                          ? "Chọn bác sĩ"
                          : "Chọn cơ sở & chuyên khoa trước"}
                      </option>
                      {doctors.map((d) => {
                        const actualDoctorId = d.id || d.doctor_id;
                        const doctorName =
                          d.user?.fullName ||
                          d.fullName ||
                          d.doctor?.fullName ||
                          `Bác sĩ mã số ${actualDoctorId}`;
                        return (
                          <option
                            key={actualDoctorId}
                            value={actualDoctorId?.toString()}
                          >
                            {doctorName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Khối 2: Khung chọn thời gian */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <h2 className="text-white font-black text-lg flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    2
                  </div>
                  Chọn thời gian khám
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="text-blue-500" size={20} />
                    <span className="font-medium font-['Times_New_Roman',serif]">
                      Lịch khám có sẵn
                    </span>
                  </div>

                  <div className="relative" ref={calendarRef}>
                    <button
                      type="button"
                      onClick={() => setShowMonthCalendar(!showMonthCalendar)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm font-['Times_New_Roman',serif]"
                    >
                      <CalendarIcon size={16} />
                      <span>Xem lịch tháng</span>
                    </button>

                    {showMonthCalendar && (
                      <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 w-72 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <span className="text-sm font-black text-blue-600 font-['Times_New_Roman',serif]">
                            Tháng{" "}
                            {String(
                              currentCalendarDate.getMonth() + 1,
                            ).padStart(2, "0")}{" "}
                            - {currentCalendarDate.getFullYear()}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black text-slate-400 mb-2 font-['Times_New_Roman',serif]">
                          <div className="text-red-500">CN</div>
                          <div>T2</div>
                          <div>T3</div>
                          <div>T4</div>
                          <div>T5</div>
                          <div>T6</div>
                          <div>T7</div>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                          {renderCalendarDays()}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold font-['Times_New_Roman',serif]">
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-md block"></span>{" "}
                            Có lịch trống
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 bg-slate-100 rounded-md block"></span>{" "}
                            Ngày nghỉ/Hết
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200">
                  {availableTabs.map((tab) => {
                    const isTabActive = selectedDate === tab.dateStr;
                    return (
                      <button
                        key={tab.dateStr}
                        type="button"
                        ref={(el) => {
                          scrollTabRefs.current[tab.dateStr] = el;
                        }}
                        onClick={() => {
                          setSelectedDate(tab.dateStr);
                          setSelectedSchedule(null);
                          scrollTabRefs.current[tab.dateStr]?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                          });
                        }}
                        className={`flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl border-2 transition-all shrink-0 font-['Times_New_Roman',serif] ${
                          isTabActive
                            ? "border-blue-500 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200 scale-105"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <span
                          className={`text-base font-black ${isTabActive ? "text-white" : "text-slate-800"} font-['Times_New_Roman',serif]`}
                        >
                          {tab.labelDay}
                        </span>
                        <span
                          className={`text-[10px] font-semibold mt-1 ${isTabActive ? "text-blue-100" : "text-slate-400"} font-['Times_New_Roman',serif]`}
                        >
                          {tab.labelYear}
                        </span>
                        <span
                          className={`text-[11px] font-bold mt-1 ${isTabActive ? "text-white" : "text-blue-600"} font-['Times_New_Roman',serif]`}
                        >
                          {tab.dayName}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-blue-800 flex items-center gap-2 font-['Times_New_Roman',serif]">
                    <CalendarIcon size={16} />
                    Ngày đã chọn:{" "}
                    <span className="text-blue-600">
                      {formatDateVN(selectedDate)} (
                      {currentTabInfo?.dayName || "Ngày đã chọn"})
                    </span>
                  </p>
                </div>

                {!selectedDoctorId ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-medium font-['Times_New_Roman',serif]">
                    <Clock className="mx-auto mb-2 text-slate-300" size={32} />
                    Vui lòng chọn thông tin bác sĩ để hệ thống hiển thị danh
                    sách giờ khám.
                  </div>
                ) : filteredSchedulesByDate.length === 0 ? (
                  <div className="p-8 text-center bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-200 text-amber-600 font-medium font-['Times_New_Roman',serif]">
                    <CalendarIcon
                      className="mx-auto mb-2 text-amber-400"
                      size={32}
                    />
                    Bác sĩ không có lịch làm việc hoặc tất cả các ca khám đều đã
                    được đặt hết trong ngày này. Vui lòng chọn ngày khác!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredSchedulesByDate.map((s) => {
                      const isBooked = s.status === "BOOKED";
                      const isSelected = selectedSchedule?.id === s.id;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedSchedule(s)}
                          className={`p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden font-['Times_New_Roman',serif] ${
                            isBooked
                              ? "border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed"
                              : isSelected
                                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle
                                className="text-blue-500"
                                size={16}
                              />
                            </div>
                          )}
                          <div className="w-full">
                            <p
                              className={`font-black text-lg ${isBooked ? "text-slate-400" : "text-slate-800"} font-['Times_New_Roman',serif]`}
                            >
                              {s.timeStart?.substring(0, 5)} -{" "}
                              {s.timeEnd?.substring(0, 5)}
                            </p>
                          </div>

                          {isBooked ? (
                            <span className="inline-block mt-2 text-slate-500 font-bold text-[10px] bg-slate-200 px-2 py-1 rounded-lg font-['Times_New_Roman',serif]">
                              Hết số
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-blue-600 font-bold text-[10px] uppercase mt-2 font-['Times_New_Roman',serif]">
                              <MapPin size={12} />{" "}
                              {s.room?.name || "Phòng bệnh"}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Khối 3: Thông tin khách hàng */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                <h2 className="text-white font-black text-lg flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    3
                  </div>
                  Thông tin khách hàng
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <User size={14} /> Họ và tên *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={userProfile?.fullName || ""}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-600 outline-none font-['Times_New_Roman',serif]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <CalendarIcon size={14} /> Ngày sinh *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={
                          userProfile?.dateOfBirth
                            ? new Date(
                                userProfile.dateOfBirth,
                              ).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"
                        }
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-600 outline-none font-['Times_New_Roman',serif]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <Phone size={14} /> Số điện thoại *
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={userProfile?.phone || ""}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-600 outline-none font-['Times_New_Roman',serif]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <Heart size={14} /> Giới tính *
                    </label>
                    <div className="flex gap-6 items-center h-[58px]">
                      <span className="font-medium text-slate-600 font-['Times_New_Roman',serif]">
                        {userProfile?.gender === "MALE"
                          ? "Nam"
                          : userProfile?.gender === "FEMALE"
                            ? "Nữ"
                            : "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <Mail size={14} /> Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        readOnly
                        value={userProfile?.email || ""}
                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-600 outline-none font-['Times_New_Roman',serif]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <MapPin size={14} /> Địa chỉ
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={userProfile?.address || "Chưa cập nhật địa chỉ"}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-500 outline-none cursor-not-allowed font-['Times_New_Roman',serif]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                          <Shield size={14} /> CCCD mặt trước *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setCccdFront(file);
                          }}
                          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 font-['Times_New_Roman',serif]"
                        />
                        {cccdFront && (
                          <img
                            src={URL.createObjectURL(cccdFront)}
                            className="w-32 h-24 object-cover rounded-lg border mt-2"
                            alt="CCCD front"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1 font-['Times_New_Roman',serif]">
                          <Shield size={14} /> CCCD mặt sau *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setCccdBack(file);
                          }}
                          className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 font-['Times_New_Roman',serif]"
                        />
                        {cccdBack && (
                          <img
                            src={URL.createObjectURL(cccdBack)}
                            className="w-32 h-24 object-cover rounded-lg border mt-2"
                            alt="CCCD back"
                          />
                        )}
                      </div>
                    </div>
                    {(!cccdFront || !cccdBack) && (
                      <p className="text-red-500 text-xs font-bold flex items-center gap-1 font-['Times_New_Roman',serif]">
                        <Info size={12} /> Bắt buộc tải lên đầy đủ CCCD mặt
                        trước và mặt sau
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2 pt-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1 font-['Times_New_Roman',serif]">
                      <Activity size={14} /> Lý do khám *
                    </label>
                    <textarea
                      placeholder="Vui lòng nhập chi tiết tình trạng sức khỏe hoặc triệu chứng của bạn..."
                      className="w-full p-5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 h-36 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none font-['Times_New_Roman',serif]"
                      value={symptom}
                      onChange={(e) => setSymptom(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: TỔNG HỢP CHI TIẾT HÓA ĐƠN --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                <h3 className="font-black text-xl tracking-tight flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <Award className="w-5 h-5 text-blue-400" />
                  Chi tiết đặt hẹn
                </h3>
                <p className="text-slate-400 text-xs mt-1 font-['Times_New_Roman',serif]">
                  Xác nhận thông tin trước khi đặt lịch
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div className="w-16 h-16 rounded-xl bg-white overflow-hidden border-2 border-white shadow-md shrink-0">
                    <img
                      src={
                        selectedDoctor?.user?.avatar ||
                        selectedDoctor?.avatar ||
                        "/default-doctor.png"
                      }
                      className="w-full h-full object-cover"
                      alt="Doctor Avatar"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1 font-['Times_New_Roman',serif]">
                      Bác sĩ phụ trách
                    </p>
                    <p className="font-black text-slate-900 text-lg leading-tight font-['Times_New_Roman',serif]">
                      BS.{" "}
                      {selectedDoctor?.user?.fullName ||
                        selectedDoctor?.fullName ||
                        "---"}
                    </p>
                    <p className="text-sm text-slate-500 font-medium font-['Times_New_Roman',serif]">
                      {selectedDoctor?.specialty?.name ||
                        specialties.find(
                          (s) => s.id.toString() === selectedSpecialty,
                        )?.name ||
                        "---"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm font-['Times_New_Roman',serif]">
                      <CalendarIcon size={16} /> Ngày khám:
                    </div>
                    <span className="text-slate-900 font-black font-['Times_New_Roman',serif]">
                      {selectedSchedule?.date
                        ? formatDateVN(selectedSchedule.date)
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm font-['Times_New_Roman',serif]">
                      <Clock size={16} /> Thời gian:
                    </div>
                    <span className="text-slate-900 font-black font-['Times_New_Roman',serif]">
                      {selectedSchedule
                        ? `${selectedSchedule.timeStart?.substring(0, 5)} - ${selectedSchedule.timeEnd?.substring(0, 5)}`
                        : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm font-['Times_New_Roman',serif]">
                      <MapPin size={16} /> Phòng khám:
                    </div>
                    <span className="text-blue-600 font-black font-['Times_New_Roman',serif]">
                      {selectedSchedule?.room?.name || "Hệ thống chỉ định"}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm font-['Times_New_Roman',serif]">
                      💰 Tổng tiền:
                    </div>
                    <span className="text-red-500 font-black text-2xl font-['Times_New_Roman',serif]">
                      {formatPrice(
                        selectedDoctor?.specialty?.price ||
                          selectedDoctor?.price ||
                          specialties.find(
                            (s) => s.id.toString() === selectedSpecialty,
                          )?.price ||
                          0,
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-['Times_New_Roman',serif]">
                    *Đã bao gồm VAT và phí dịch vụ
                  </p>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={
                    !userProfile ||
                    !selectedSchedule ||
                    !symptom.trim() ||
                    !cccdFront ||
                    !cccdBack
                  }
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-blue-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Times_New_Roman',serif]"
                >
                  {!userProfile ? "Đăng nhập để đặt lịch" : "Xác nhận đặt hẹn"}
                  <CheckCircle size={20} />
                </button>

                <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <Info className="text-amber-600 shrink-0" size={18} />
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed font-['Times_New_Roman',serif]">
                    Lưu ý: Đội ngũ CSKH sẽ liên hệ qua SĐT{" "}
                    <strong>{userProfile?.phone || "đã đăng ký"}</strong> để
                    hoàn tất thủ tục xác nhận ca khám.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
