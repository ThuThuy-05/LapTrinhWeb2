import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {" "}
      {/* Thêm màu nền cho phần nội dung bên phải */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {" "}
        {/* min-w-0 giúp fix lỗi tràn ngang */}
        <Header />
        <main className="flex-1 p-8 animate-in fade-in duration-500">
          {children} {/* Bỏ max-w-7xl để nội dung tràn hết nếu bạn muốn */}
        </main>
      </div>
    </div>
  );
}
// "use client";

// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   const logout = () => {
//     // localStorage (nếu còn dùng)
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");

//     // ❗ XÓA COOKIE để middleware hết hiệu lực
//     document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
//     document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

//     // chuyển về login
//     router.push("/login");
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-5">
//         <h2 className="text-xl font-bold mb-6">ADMIN</h2>

//         <ul className="space-y-4">
//           <li>
//             <Link href="/admin" className="hover:text-blue-400">
//               Dashboard
//             </Link>
//           </li>

//           <li>
//             <Link href="/admin/users" className="hover:text-blue-400">
//               Users
//             </Link>
//           </li>

//           {/* ⭐ THÊM BANNER */}
//           <li>
//             <Link href="/admin/banner" className="hover:text-blue-400">
//               Banner
//             </Link>
//           </li>

//           <li>
//             <Link href="/admin/settings" className="hover:text-blue-400">
//               Settings
//             </Link>
//           </li>
//         </ul>

//         <button
//           onClick={logout}
//           className="mt-10 bg-red-500 w-full py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-6 bg-gray-100">{children}</div>
//     </div>
//   );
// }
