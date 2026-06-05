
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/doctors",
    "/specialties",
    "/hospitals",
    "/services",
    "/news",
    "/promotions",
    "/contact",
  ];

  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // ❌ KHÔNG CHECK AUTH NỮA (vì bạn dùng localStorage)
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const role = request.cookies.get("role")?.value;
//   const path = request.nextUrl.pathname;

//   // chưa login
//   if (!token) {
//     if (
//       path.startsWith("/admin") ||
//       path.startsWith("/doctor") ||
//       path.startsWith("/patient")
//     ) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   // check role
//   if (path.startsWith("/admin") && role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (path.startsWith("/doctor") && role !== "DOCTOR") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (path.startsWith("/patient") && role !== "PATIENT") {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // login rồi thì đá về đúng trang
//   if (path === "/login" && token) {
//     if (role === "ADMIN")
//       return NextResponse.redirect(new URL("/admin", request.url));
//     if (role === "DOCTOR")
//       return NextResponse.redirect(new URL("/doctor", request.url));
//     return NextResponse.redirect(new URL("/patient", request.url));
//   }

//   return NextResponse.next();
// }
