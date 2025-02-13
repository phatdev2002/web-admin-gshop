'use client'
import { useEffect, useState } from "react";
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell } from "lucide-react";

export default function TopNavbar() {
    interface User {
        name: string;
        // Add other user properties here
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

    return (
        <div className=" flex justify-between items-center px-5 py-2 border-b bg-white w-full">
            <div className="flex items-center">
                <Image src="/login/logoAppGShop2.png" alt="logo" width={100} height={50}/>
                <h1 className="ml-24 text-xl font-semibold ">{getPageTitle()}</h1>
            </div>
            <div className="flex justify-between items-center">
                <Bell className="mr-2 bg-blue-50 rounded-full  p-2 w-9 h-9"/>
                <Image src="/img/avt.jpg" alt="avatar" width={40} height={40} className="rounded-full mr-2"/>
                <p className="font-semibold">{user?.name}</p>
            </div>
        </div>
    );
}
