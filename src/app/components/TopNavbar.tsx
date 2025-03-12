'use client'
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, Paintbrush2, Palette } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function TopNavbar({ setBgColor }: { setBgColor: (color: string) => void }) {
  interface User {
    name: string;
    role: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const pathname = usePathname();
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  // Xác định tiêu đề trang từ đường dẫn
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

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleChangeColor = (color: string) => {
    setBgColor(color);
    localStorage.setItem("bgColor", color);
  };

  return (
    <div className="flex justify-between items-center px-5 py-2 border-b bg-white w-full relative">
      {/* Logo + Tiêu đề */}
      <div className="flex items-center">
        <Image src="/login/logoAppGShop2.png" alt="logo" width={100} height={50} />
        <h1 className="ml-24 text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Các nút chức năng */}
      <div className="flex items-center gap-4 relative">

        {/* Nút chọn màu nền */}
        <div className="relative flex items-center">
          <motion.button
            onClick={() => setShowColorPicker(!showColorPicker)}
            initial={{ x: 0 }}
            animate={{ x: showColorPicker ? -300 : 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-full p-2 w-9 h-9 flex items-center justify-center cursor-pointer ${
              showColorPicker ? "bg-blue-100" : "bg-blue-50"
            } hover:bg-blue-100`}
          >
            <Paintbrush2 className="w-5 h-5" />
          </motion.button>

          {/* Hiệu ứng xuất hiện và biến mất */}
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute left-[-260] top-[-5] transform -translate-y-1/2 flex gap-2 p-2 rounded-lg"
              >
                {/* Màu có sẵn */}
                {["#d6d6d6", "#e4c58a", "#e6a5a1", "#92b79d", "#8aa1c1", "#f0f0f0"].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => handleChangeColor(color)}
                  />
                ))}

                {/* Nút icon Palette để mở bộ chọn màu */}
                <button
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => colorInputRef.current?.click()}
                >
                  <Palette className="w-5 h-5 text-gray-700" />
                </button>

                {/* Input color ẩn */}
                <input
                  ref={colorInputRef}
                  type="color"
                  className="absolute w-0 h-10 opacity-0"
                  onChange={(e) => handleChangeColor(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nút thông báo */}
        <Bell className="bg-blue-50 rounded-full p-2 w-9 h-9 cursor-pointer hover:bg-blue-100" />

        {/* Ảnh đại diện + Tên người dùng */}
        <Link href="/admin/profile">
          <div className="flex items-center">
            <Image src="/img/avt.jpg" alt="avatar" width={40} height={40} className="rounded-full mr-2" />
            <p className="font-semibold">{user?.name}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
