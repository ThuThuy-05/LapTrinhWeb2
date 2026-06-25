// ✅ File đúng - app/(patient)/patient/layout.tsx
import Header from "@/components/patient/Header";
import Footer from "@/components/patient/Footer";
import ChatBot from "@/components/ChatBot";

// import BannerList from "@/components/patient/BannerList";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {/* <BannerList /> */}
      <main className="min-h-screen">{children}</main>
      <ChatBot />

      <Footer />
    </div>
  );
}
