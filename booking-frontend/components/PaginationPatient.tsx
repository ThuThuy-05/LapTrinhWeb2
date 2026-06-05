"use client";

import React from "react";

interface PaginationPatientProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationPatient = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationPatientProps) => {
  if (totalPages <= 1) return null;

  // Hàm tạo mảng số trang hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      {/* Nút Trước */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-1 font-['Times_New_Roman',serif] ${
          currentPage === 1
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md border border-slate-200"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Trước
      </button>

      {/* Danh sách số trang */}
      <div className="flex gap-2">
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 font-['Times_New_Roman',serif] ${
              currentPage === page
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                : page === "..."
                  ? "bg-transparent text-slate-400 cursor-default"
                  : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Nút Sau */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-1 font-['Times_New_Roman',serif] ${
          currentPage === totalPages
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-md border border-slate-200"
        }`}
      >
        Sau
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default PaginationPatient;
