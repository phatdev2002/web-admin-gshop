import { Metadata } from "next";
import SideNavbarAdmin from "@/app/components/SideNavbarAdmin";
import { Geist, Geist_Mono } from "next/font/google";
import AuthGuard from "./AuthGuard"; // ⬅️ Import AuthGuard

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Định nghĩa metadata
export const metadata: Metadata = {
  title: "Gundam Shop Admin",
  description: "Trang quản lý của cửa hàng Gundam Shop",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard> {/* ⬅️ Kiểm tra đăng nhập */}
      <div className={`flex w-full h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Sidebar */}
        <SideNavbarAdmin />

        {/* Nội dung chính */}
        <div className="flex-1 min-h-screen w-full bg-blue-50 px-8 py-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
