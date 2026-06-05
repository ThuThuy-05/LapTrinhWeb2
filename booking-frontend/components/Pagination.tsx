"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Tạo mảng số trang [1, 2, 3, ...]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white border-t border-slate-100 rounded-b-[2.5rem]">
      {/* Thông tin bên trái */}
      <div className="hidden sm:block">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Trang <span className="text-indigo-600">{currentPage}</span> / {totalPages}
        </p>
      </div>

      {/* Cụm điều hướng ở giữa/phải */}
      <div className="flex items-center gap-2">
        {/* Nút Trước */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 transition-all border border-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* DANH SÁCH SỐ TRANG 1, 2, 3... */}
        <div className="flex gap-1.5">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                currentPage === page
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                  : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Nút Sau */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-30 transition-all border border-slate-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;