// components/patient/BannerList.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { Banner, getBanners } from "@/services/bannerService";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
  Pause,
  Play,
} from "lucide-react";

export default function BannerList() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  // FETCH BANNERS
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const data = await getBanners();
        const activeBanners = data.filter((banner: Banner) => banner.active);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Fetch banners error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  // AUTO PLAY
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  // NAVIGATION
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [banners.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // TOUCH SWIPE
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // NO DATA
  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative w-full overflow-hidden group">
      {/* MAIN BANNER */}
      <div
        className="relative w-full h-[400px] md:h-[450px] lg:h-[500px] transition-transform duration-700 ease-out"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* BACKGROUND IMAGE - object-contain để lấy hết ảnh */}
        <div className="absolute inset-0">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title || "Banner"}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* GRADIENT OVERLAY - SÁNG HƠN */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* CONTENT */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col justify-center max-w-2xl animate-fadeIn">
            {/* BADGE */}
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white/90 text-xs font-semibold tracking-wide">
                🏥 MEDICAL HEALTH CARE CENTER
              </span>
            </div>

            {/* TITLE - THU NHỎ FONT */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-slideUp">
              {currentBanner.title || "Đặt lịch khám bệnh trực tuyến dễ dàng"}
            </h1>

            {/* DESCRIPTION - THU NHỎ */}
            <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed max-w-xl animate-slideUp animation-delay-100">
              {currentBanner.description ||
                "Tìm bác sĩ phù hợp, xem lịch khám và đặt lịch nhanh chóng mọi lúc mọi nơi."}
            </p>

            {/* BUTTONS */}
            <div className="mt-5 flex flex-wrap gap-3 animate-slideUp animation-delay-200">
              <a
                href="/doctors"
                className="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold text-white text-sm transition-all duration-300 shadow-lg shadow-blue-500/30 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Đặt lịch ngay
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </a>

              <a
                href="/specialties"
                className="px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:scale-105"
              >
                Xem chuyên khoa
              </a>
            </div>

            {/* STATS - THU NHỎ GỌN */}
            <div className="mt-6 flex gap-6 animate-slideUp animation-delay-300">
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">
                  50+
                </div>
                <div className="text-xs text-white/60">Bác sĩ chuyên khoa</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">
                  1000+
                </div>
                <div className="text-xs text-white/60">Bệnh nhân mỗi ngày</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">
                  24/7
                </div>
                <div className="text-xs text-white/60">Hỗ trợ trực tuyến</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREV BUTTON */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={20} />
          </button>

          {/* NEXT BUTTON */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>

          {/* DOTS NAVIGATION */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="transition-all duration-300"
              >
                {index === currentIndex ? (
                  <CircleDot
                    size={18}
                    className="text-blue-400 drop-shadow-lg"
                  />
                ) : (
                  <Circle
                    size={18}
                    className="text-white/40 hover:text-white/70 transition"
                  />
                )}
              </button>
            ))}
          </div>

          {/* AUTO PLAY CONTROL */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute bottom-4 right-4 p-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full text-white transition-all duration-300 z-10"
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          {/* PROGRESS BAR */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-[5000ms] ease-linear"
              style={{
                width: isAutoPlaying ? "100%" : "0%",
                transitionTimingFunction: "linear",
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}
