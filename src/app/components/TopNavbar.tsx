'use client'
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, Paintbrush2, Palette } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function TopNavbar({ setBgColor }: { setBgColor: (color: string) => void }) {
  interface User {
    name: string;
    role: string;
    avatar?: string;
  }

  interface Order {
    _id: string;
    status: string;
    name: string;
    // Các thuộc tính khác nếu cần thiết
  }
  

  const [user, setUser] = useState<User | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const pathname = usePathname();
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const handledOrderIdsRef = useRef<string[]>([]); // lưu các ID đơn hàng đã xử lý thông báo

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

  useEffect(() => {
    const fetchUnprocessedOrders = async () => {
      try {
        const res = await axios.get("https://gshopbackend-1.onrender.com/order/list");
        const orders = res.data.data;

        const unprocessedOrders = orders.filter(
          (order: Order) => order.status === "Đang xử lý"
        );
        
        const newUnseen = unprocessedOrders.filter(
          (order: Order) => !handledOrderIdsRef.current.includes(order._id)
        );
        if (newUnseen.length > 0) {
          setNewOrdersCount(newUnseen.length);
          toast(
            <>
              <Bell className="inline-block w-5 h-5 mr-2" />
              Có {newUnseen.length} đơn hàng chưa xử lý!
            </>,
            {
              position: "top-right", // Đặt thông báo ở vị trí top
              duration: 5000, // Thời gian hiển thị thông báo (tùy chỉnh)
              icon: null, // Bạn có thể ẩn icon mặc định nếu cần
              style: {
                backgroundColor: "#fff", 
                color: "#ff4d4f",
                borderRadius: "8px", // Bo góc
                padding: "12px", // Khoảng cách trong thông báo
                marginTop: "40px", // Thêm khoảng cách phía trên
              },
            }
          );
          
          
        }
        
        

        // Cập nhật danh sách đã xử lý
        handledOrderIdsRef.current = unprocessedOrders.map((order: Order) => order._id);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      }
    };

    fetchUnprocessedOrders();
    const interval = setInterval(fetchUnprocessedOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleChangeColor = (color: string) => {
    setBgColor(color);
    localStorage.setItem("bgColor", color);
  };

  return (
    <div className="flex justify-between items-center px-5 py-2 bg-white w-full relative">
      <div className="flex items-center">
        <Image src="/login/LogoAppGShop2.png" alt="Logo GShop" className="top-4 left-4 h-10" width={100} height={40} />
        <h1 className="ml-24 text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Color Picker */}
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

        {/* Thông báo */}
        <div className="relative">
          <Bell
            className="bg-blue-50 rounded-full p-2 w-9 h-9 cursor-pointer hover:bg-blue-100"
            onClick={() => {
              if (newOrdersCount > 0) {
                toast(
                  <>
                    <Bell className="inline-block w-5 h-5 mr-2" />
                    Có {newOrdersCount} đơn hàng chưa xử lý!
                  </>,
                  {
                    position: "top-right", // Đặt thông báo ở vị trí top
                    duration: 5000, // Thời gian hiển thị thông báo (tùy chỉnh)
                    icon: null, // Bạn có thể ẩn icon mặc định nếu cần
                    style: {
                      backgroundColor: "#fff", 
                      color: "#ff4d4f",
                      borderRadius: "8px", // Bo góc
                      padding: "12px", // Khoảng cách trong thông báo
                      marginTop: "40px", // Thêm khoảng cách phía trên
                    },
                  }
                );
              
              } else {
                toast.info("Không có đơn hàng mới");
              }
            }}
          />
          {newOrdersCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {newOrdersCount}
            </span>
          )}
        </div>

        {/* Avatar + Tên */}
        <Link href={user?.role === "admin" ? "/admin/profile" : "/staff/profile"}>
          <div className="flex items-center">
            <Image
              src={user?.avatar || (user?.role === "staff" ? "/img/avtstaff.jpg" : "/img/avt.jpg")}
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full mr-2 w-8 h-8 object-cover"
            />
            <p className="font-semibold">{user?.name}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
