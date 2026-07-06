"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";

import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

export default function DoctorDateHome() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSearch = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;

    router.push(`/doctors?date=${date}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative overflow-visible rounded-[32px] bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 shadow-2xl">
        {" "}
        {/* Background */}
        <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl"></div>
        <div className="relative grid lg:grid-cols-[1.7fr_0.8fr] gap-10 items-center px-12 py-10">
          {" "}
          {/* LEFT */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur mb-5">
              <HeartPulse size={18} />

              <span className="text-sm font-semibold">
                Đặt lịch khám trực tuyến
              </span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight">
              Chọn ngày khám
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-4">
                <ShieldCheck className="text-white mb-3" size={28} />

                <h4 className="font-semibold">Đặt lịch nhanh</h4>

                <p className="text-sm text-blue-100 mt-2">
                  Không cần gọi điện, đặt ngay trong vài giây.
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-4">
                <Stethoscope className="text-white mb-3" size={28} />

                <h4 className="font-semibold">Bác sĩ uy tín</h4>

                <p className="text-sm text-blue-100 mt-2">
                  Hơn 100 bác sĩ chuyên khoa luôn sẵn sàng.
                </p>
              </div>
            </div>
          </div>
          {/* RIGHT */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-[390px] w-full justify-self-end">
            {" "}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center">
                <CalendarDays className="text-white" />
              </div>

              <div>
                <h3 className="font-bold text-xl text-slate-800">
                  Chọn ngày khám
                </h3>

                <p className="text-sm text-slate-500">
                  Chọn ngày để xem bác sĩ còn lịch
                </p>
              </div>
            </div>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date ?? new Date());
                }}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                showIcon
                icon={<CalendarDays size={20} className="text-sky-500" />}
                calendarIconClassName="react-datepicker__calendar-icon-right"
                className="w-full rounded-2xl border border-sky-200 bg-white pr-12 pl-4 py-4 text-lg shadow-md outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
            <button
              onClick={handleSearch}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-4 text-white font-bold text-lg hover:scale-[1.02] duration-300 shadow-lg flex justify-center items-center gap-3"
            >
              <Sparkles size={20} />
              Xem bác sĩ còn lịch
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
