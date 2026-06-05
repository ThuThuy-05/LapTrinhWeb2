"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 mt-20 text-white">
      {" "}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* CỘT 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="MedBooking"
                className="w-34 h-20 object-contain rounded-lg"
              />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống đặt lịch khám bệnh trực tuyến hiện đại, kết nối bệnh nhân
              và bác sĩ nhanh chóng.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-4">
              <FaFacebook
                className="text-slate-400 hover:text-blue-500 transition cursor-pointer"
                size={16}
              />
              <FaTwitter
                className="text-slate-400 hover:text-sky-400 transition cursor-pointer"
                size={16}
              />
              <FaInstagram
                className="text-slate-400 hover:text-pink-500 transition cursor-pointer"
                size={16}
              />
              <FaYoutube
                className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                size={16}
              />
            </div>
          </div>

          {/* CỘT 2 */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about">Giới thiệu</FooterLink>
              <FooterLink href="/doctors">Đội ngũ bác sĩ</FooterLink>
              <FooterLink href="/services">Dịch vụ</FooterLink>
              <FooterLink href="/contact">Liên hệ</FooterLink>
            </ul>
          </div>

          {/* CỘT 3 */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/faq">Câu hỏi thường gặp</FooterLink>
              <FooterLink href="/privacy">Chính sách bảo mật</FooterLink>
              <FooterLink href="/terms">Điều khoản sử dụng</FooterLink>
            </ul>
          </div>

          {/* CỘT 4 */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Liên hệ
            </h3>

            <ul className="space-y-3 text-slate-400 text-xs">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-cyan-400" />
                123 Nguyễn Huệ, Quận 1, TP.HCM
              </li>

              <li className="flex items-center gap-2">
                <Phone size={14} className="text-cyan-400" />
                1900 1234
              </li>

              <li className="flex items-center gap-2">
                <Mail size={14} className="text-cyan-400" />
                support@medbooking.vn
              </li>

              <li className="flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                Thứ 2 - Thứ 7: 7:00 - 20:00
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-slate-500 text-[10px] font-semibold tracking-widest uppercase">
            © Nguyễn Thị Thu Thủy - Thực tập tốt nghiệp 2026 
          </p>
        </div>
      </div>
    </footer>
  );
}

/* LINK COMPONENT */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-slate-400 hover:text-cyan-400 transition text-xs"
      >
        {children}
      </Link>
    </li>
  );
}
