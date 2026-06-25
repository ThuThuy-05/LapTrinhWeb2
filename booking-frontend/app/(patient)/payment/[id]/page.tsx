"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { createPayment, PaymentMethod } from "@/services/paymentService";
import {
  Loader2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  DoorOpen,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Building2,
  Heart,
  FileText,
  Wallet,
  Landmark,
  Smartphone,
} from "lucide-react";

type InsuranceType = "NONE" | "BHYT" | "PRIVATE";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [insurance, setInsurance] = useState<InsuranceType>("NONE");
  const [method, setMethod] = useState<PaymentMethod>("VNPAY");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Không thể tải thông tin lịch khám.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-slate-500 font-medium text-sm font-['Times_New_Roman',serif]">
          Đang tải thông tin thanh toán...
        </p>
      </div>
    );
  }

  const originPrice = booking?.schedule?.doctor?.specialty?.price || 0;
  let discount = 0;

  if (insurance === "BHYT") discount = originPrice * 0.8;
  if (insurance === "PRIVATE") discount = originPrice * 0.3;

  const finalPrice = Math.max(originPrice - discount, 0);

  const rawDate = booking?.schedule?.date;
  let examDate = "25-05-2026";

  if (rawDate) {
    if (rawDate.includes("-") && rawDate.split("-")[0].length === 4) {
      const [year, month, day] = rawDate.split("-");
      examDate = `${day}-${month}-${year}`;
    } else {
      examDate = rawDate;
    }
  }

  const handlePayment = async () => {
    if (isProcessing) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setIsProcessing(true);

      if (method === "CASH") {
        await createPayment({
          bookingId: id,
          amount: finalPrice,
          method: "CASH",
        });
        setSuccessMessage(
          "Đặt lịch khám thành công! Vui lòng thanh toán tại quầy lễ tân.",
        );
        setIsProcessing(false);
        return;
      }

      if (method === "BANK_QR") {
        if (isProcessing) return;

        setIsProcessing(true);

        await createPayment({
          bookingId: id,
          amount: finalPrice,
          method: "BANK_QR",
        });

        router.push(`/payment/qr/${id}?amount=${finalPrice}`);
        return;
      }
      const response = await createPayment({
        bookingId: id,
        amount: finalPrice,
        method: "VNPAY",
      });

      setIsProcessing(false);

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      setErrorMessage("Không thể khởi tạo liên kết thanh toán VNPAY.");
    } catch (error: any) {
      console.error("PAYMENT ERROR:", error);
      setIsProcessing(false);
      setErrorMessage(
        error.response?.data?.message || "Đã xảy ra lỗi trong quá trình xử lý.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-12 font-['Times_New_Roman',serif]">
      {/* Header với nút quay lại */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
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

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Banner trang trí */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <h1 className="text-xl md:text-2xl font-black tracking-tight font-['Times_New_Roman',serif]">
                THANH TOÁN ĐẶT LỊCH
              </h1>
            </div>
            <p className="text-blue-100 text-xs md:text-sm max-w-2xl font-['Times_New_Roman',serif]">
              Vui lòng kiểm tra lại thông tin khám bệnh và chọn phương thức
              thanh toán phù hợp. Giao dịch được bảo mật tuyệt đối.
            </p>
          </div>
        </div>

        {/* Thông báo */}
        {errorMessage && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 text-sm animate-in slide-in-from-top-2 duration-300 font-['Times_New_Roman',serif]">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-start gap-3 text-sm animate-in slide-in-from-top-2 duration-300 font-['Times_New_Roman',serif]">
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
            <span className="flex-1 font-medium">{successMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          {/* BÊN TRÁI: THÔNG TIN LỊCH KHÁM */}
          <div className="lg:col-span-5 space-y-4">
            {/* Card thông tin bệnh nhân */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                <h2 className="text-white font-bold text-sm flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <FileText size={16} className="text-blue-400" />
                  Thông tin đặt khám
                </h2>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <User className="text-blue-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-['Times_New_Roman',serif]">
                      Bác sĩ đảm nhiệm
                    </p>
                    <p className="font-bold text-slate-800 text-base font-['Times_New_Roman',serif]">
                      {booking?.schedule?.doctor?.user?.fullName ||
                        "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Stethoscope size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-['Times_New_Roman',serif]">
                      Chuyên khoa
                    </p>
                    <p className="font-semibold text-slate-700 font-['Times_New_Roman',serif]">
                      {booking?.schedule?.doctor?.specialty?.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-['Times_New_Roman',serif]">
                        Ngày khám
                      </p>
                      <p className="font-black text-blue-600 text-sm font-['Times_New_Roman',serif]">
                        {examDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Clock size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-['Times_New_Roman',serif]">
                        Giờ khám
                      </p>
                      <p className="font-bold text-slate-700 font-['Times_New_Roman',serif]">
                        {booking?.schedule?.timeStart?.substring(0, 5) ||
                          "--:--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <DoorOpen size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-['Times_New_Roman',serif]">
                      Phòng khám
                    </p>
                    <p className="font-semibold text-slate-700 font-['Times_New_Roman',serif]">
                      {booking?.schedule?.room?.name}
                    </p>
                  </div>
                </div>

                {booking?.symptom && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-1 font-['Times_New_Roman',serif]">
                      Triệu chứng lâm sàng
                    </p>
                    <p className="text-xs text-slate-700 italic leading-relaxed font-['Times_New_Roman',serif]">
                      {booking?.symptom}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin bảo mật */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={14} />
                <p className="text-[10px] font-medium font-['Times_New_Roman',serif]">
                  Thông tin được bảo mật theo chuẩn SSL 256-bit
                </p>
              </div>
            </div>
          </div>

          {/* BÊN PHẢI: CẤU HÌNH THANH TOÁN */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. CHỌN BẢO HIỂM */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <ShieldCheck size={16} className="text-blue-400" />
                  Chọn loại bảo hiểm áp dụng
                </h3>
              </div>
              <div className="p-5">
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    {
                      key: "NONE",
                      label: "Không áp dụng",
                      desc: "Tính theo giá gốc",
                      icon: <CreditCard size={16} />,
                      color: "slate",
                    },
                    {
                      key: "BHYT",
                      label: "BHYT",
                      desc: "Giảm 80% chi phí",
                      icon: <Heart size={16} />,
                      color: "blue",
                    },
                    {
                      key: "PRIVATE",
                      label: "Bảo hiểm tư nhân",
                      desc: "Giảm 30% chi phí",
                      icon: <Building2 size={16} />,
                      color: "cyan",
                    },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setInsurance(item.key as InsuranceType)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group font-['Times_New_Roman',serif] ${
                        insurance === item.key
                          ? `border-${item.color}-500 bg-${item.color}-50/40 ring-2 ring-${item.color}-500/20 shadow-md`
                          : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 ${insurance === item.key ? `text-${item.color}-600` : "text-slate-400"}`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-bold text-sm ${insurance === item.key ? `text-${item.color}-700` : "text-slate-700"} font-['Times_New_Roman',serif]`}
                          >
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-['Times_New_Roman',serif]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      {insurance === item.key && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle
                            size={14}
                            className={`text-${item.color}-500`}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <Wallet size={16} className="text-blue-400" />
                  Phương thức thanh toán
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "VNPAY",
                      name: "VNPAY",
                      fullname: "Cổng thanh toán VNPAY",
                      icon: <Landmark size={20} />,
                      color: "blue",
                    },
                   
                    {
                      id: "BANK_QR",
                      name: "QR Banking",
                      fullname: "Quét mã chuyển khoản",
                      icon: <Landmark size={20} />,
                      color: "green",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id as PaymentMethod)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 group font-['Times_New_Roman',serif] ${
                        method === item.id
                          ? `border-${item.color}-500 bg-${item.color}-50/40 ring-2 ring-${item.color}-500/20 shadow-md`
                          : "border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`${method === item.id ? `text-${item.color}-600` : "text-slate-400"}`}
                        >
                          {item.icon}
                        </div>
                        <span
                          className={`text-sm font-bold ${method === item.id ? `text-${item.color}-700` : "text-slate-700"} font-['Times_New_Roman',serif]`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-['Times_New_Roman',serif]">
                          {item.fullname}
                        </span>
                      </div>
                      {method === item.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle
                            size={14}
                            className={`text-${item.color}-500`}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. CHI TIẾT HÓA ĐƠN */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2 font-['Times_New_Roman',serif]">
                  <CreditCard size={16} className="text-blue-400" />
                  Chi tiết chi phí
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600 text-sm font-['Times_New_Roman',serif]">
                      Giá khám gốc
                    </span>
                    <span className="font-bold text-slate-800 font-['Times_New_Roman',serif]">
                      {originPrice.toLocaleString()} ₫
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-blue-600 text-sm font-medium font-['Times_New_Roman',serif]">
                        Mức giảm trừ bảo hiểm
                      </span>
                      <span className="font-bold text-blue-600 font-['Times_New_Roman',serif]">
                        -{discount.toLocaleString()} ₫
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 mt-2">
                    <span className="font-bold text-slate-800 text-base font-['Times_New_Roman',serif]">
                      Tổng số tiền
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600 tracking-tight font-['Times_New_Roman',serif]">
                        {finalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 ml-1 font-['Times_New_Roman',serif]">
                        ₫
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full mt-4 py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 font-['Times_New_Roman',serif] ${
                    isProcessing
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Đang xử lý giao dịch...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      <span>Tiến hành thanh toán</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400 font-['Times_New_Roman',serif]">
                      Thanh toán an toàn
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="flex items-center gap-1">
                    <Lock size={12} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400 font-['Times_New_Roman',serif]">
                      Mã hóa SSL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Lock nếu chưa có
const Lock = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
