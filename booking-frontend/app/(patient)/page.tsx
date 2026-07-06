// app/page.tsx
"use client";

import BannerList from "@/components/patient/BannerList";
import BranchHome from "@/components/patient/BranchHome";
import DoctorHome from "@/components/patient/DoctorHome";
import SpecialtyHome from "@/components/patient/SpecialtyHome";
import PostHome from "@/components/patient/PostHome";
import DoctorDateHome from "@/components/patient/DoctorDateHome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <BannerList />
      <DoctorDateHome />
      <SpecialtyHome />
      <DoctorHome />
      <BranchHome />
      <PostHome />
    </div>
  );
}
