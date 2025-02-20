import { Metadata } from "next";
import SideNavbarStaff from "@/app/components/SideNavbarStaff";
import { Geist, Geist_Mono } from "next/font/google";
import AuthGuard from "@/app/AuthGuard"; // ⬅️ Import AuthGuard

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
  title: "Gundam Shop Staff",
  description: "Trang quản lý của cửa hàng Gundam Shop",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="staff"> {/* ⬅️ Kiểm tra đăng nhập */}
      <div className={`flex w-full h-full ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Sidebar */}
        <SideNavbarStaff />

        {/* Nội dung chính */}
        <div className="flex-1  w-full px-8 py-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
