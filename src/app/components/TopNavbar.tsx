'use client'
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, Paintbrush2, Palette } from "lucide-react";
import Link from "next/link";

export default function TopNavbar({ setBgColor }: { setBgColor: (color: string) => void }) {
  interface User {
    name: string;
    role: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const pathname = usePathname();
  const colorInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChangeColor = (color: string) => {
    setBgColor(color);
    localStorage.setItem("bgColor", color);
  };

  return (
    <div className="flex justify-between items-center px-5 py-2  bg-white w-full relative">
      {/* Logo + Tiêu đề */}
      <div className="flex items-center">
        <Image src="/login/LogoAppGShop2.png" alt="Logo GShop" className=" top-4 left-4 h-10" width={100} height={40} />
        <h1 className="ml-24 text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Các nút chức năng */}
      <div className="flex items-center gap-4 relative">
        {/* Bảng chọn màu nằm bên trái nút */}
        <div className="relative flex items-center">
          {showColorPicker && (
            <div className="absolute right-10 flex gap-2 p-2 rounded-lg border bg-white shadow-md">
              {["#d6d6d6", "#e4c58a", "#e6a5a1", "#92b79d", "#8aa1c1", "#f0f0f0"].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => handleChangeColor(color)}
                />
              ))}
              <button
                className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={() => colorInputRef.current?.click()}
              >
                <Palette className="w-5 h-5 text-gray-700" />
              </button>
              <input
                ref={colorInputRef}
                type="color"
                className="absolute w-0 h-10 opacity-0"
                onChange={(e) => handleChangeColor(e.target.value)}
              />
            </div>
          )}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="rounded-full p-2 w-9 h-9 flex items-center justify-center cursor-pointer bg-blue-50 hover:bg-blue-100"
          >
            <Paintbrush2 className="w-5 h-5" />
          </button>
        </div>

        {/* Nút thông báo */}
        <Bell className="bg-blue-50 rounded-full p-2 w-9 h-9 cursor-pointer hover:bg-blue-100" />

        {/* Ảnh đại diện + Tên người dùng */}
        <Link href={user?.role === "admin" ? "/admin/profile" : "/staff/profile"}>
          <div className="flex items-center">
            <Image src="/img/avt.jpg" alt="avatar" width={40} height={40} className="rounded-full mr-2" />
            <p className="font-semibold">{user?.name}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
