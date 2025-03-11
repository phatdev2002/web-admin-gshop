'use client'
import { useEffect, useState } from "react";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/app/components/BtnDarkMode";

export default function TopNavbar() {
  interface User {
    name: string;
    role: string; // admin hoặc staff
  }

  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // Định nghĩa tên trang dựa vào pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/admin/overview": return "Tổng quan hệ thống";
      case "/admin/reports": return "Báo cáo doanh thu";
      case "/admin/products": return "Quản lý sản phẩm";
      case "/admin/products/category": return "Quản lý thể loại";
      case "/admin/products/supplier": return "Quản lý nhà cung cấp";
      case "/admin/orders": return "Quản lý đơn hàng";
      case "/admin/staffs": return "Quản lý nhân viên";
      case "/admin/clients": return "Quản lý khách hàng";
      case "/admin/news": return "Quản lý tin tức";
      case "/admin/profile": return "Thông tin của tôi";
      case "/admin/news/create": return "Tạo bài viết";
      
      case "/staff/profile": return "Thông tin của tôi";
      case "/staff/overview": return "Tổng quan hệ thống";
      case "/staff/orders": return "Quản lý đơn hàng";
      case "/staff/clients": return "Quản lý khách hàng";
      case "/staff/news": return "Quản lý tin tức";
      default: return "Trang mới";
    }
  };

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Chọn ảnh đại diện dựa trên vai trò người dùng
  const getAvatar = () => {
    if (user?.role === "staff") {
      return "/img/avtstaff.jpg"; // Đổi ảnh nếu là nhân viên
    }
    return "/img/avt.jpg"; // Mặc định cho admin
  };

  
  // Xác định đường dẫn profile dựa trên vai trò
  const getProfileLink = () => {
    if (user?.role === "staff") {
      return "/staff/profile";
    }
    return "/admin/profile";
  };

  return (
    <div className="flex justify-between items-center px-5 py-2 border-b bg-[#d1d1d1] w-full">
      <div className="flex items-center">
        <Image src="/login/logoAppGShop2.png" alt="logo" width={100} height={50} />
        <h1 className="ml-24 text-xl font-semibold ">{getPageTitle()}</h1>
      </div>
      <div className="flex justify-between items-center gap-4">
        <ModeToggle/>
        <Bell className=" bg-blue-50 rounded-full p-2 w-9 h-9" />
        <Link href={getProfileLink()}>
          <div className="flex items-center">
            <Image src={getAvatar()} alt="avatar" width={40} height={40} className="rounded-full mr-2" />
            <p className="font-semibold ">{user?.name}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
