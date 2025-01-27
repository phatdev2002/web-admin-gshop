"use client"
import { Nav } from "@/components/ui/nav";
import React, { useState } from "react";
import Image from "next/image";

import {
  BoxIcon,
  
  ChartNoAxesCombined,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Newspaper,
  ShoppingCart,
  Users2,
  UserSquare2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button";

type Props = {}

export default function SideNavbarAdmin({}: Props){
  const [isCollapsed, setIsCollapsed] = useState(false)

  function toggleSidebar(){
    setIsCollapsed(!isCollapsed)
  }

    return (
        <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24">
          <Image
            src={isCollapsed ? "/logo/LogoAppG.png" : "/login/LogoAppGShop2.png"}
            alt="Logo GShop"
            width={isCollapsed ? 30 : 100} // Thay đổi chiều rộng theo trạng thái
            height={isCollapsed ? 50 : 50} // Giữ nguyên hoặc thay đổi chiều cao nếu cần
            className={`absolute top-8`} // Thay đổi kích thước bằng className
            priority
          />
          <div className="absolute right-[-20px] top-7">
            <Button onClick={toggleSidebar} variant='secondary'>
            <ChevronRight/>
            </Button>
          </div>
            <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Tổng quan",
                href:"/admin/overview",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Báo cáo",
                href:"/admin/reports",
                icon: ChartNoAxesCombined,
                variant: "ghost",
              },
              {
                title: "Sản phẩm",
                href:"/admin/products",
                icon: BoxIcon,
                variant: "ghost",
              },
              {
                title: "Đơn hàng",
                href:"/admin/orders",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Nhân viên",
                href:"/admin/staffs",
                icon: UserSquare2Icon,
                variant: "ghost",
              },
              {
                title: "Khách hàng",
                href:"/admin/clients",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Tin tức",
                href:"/admin/news",
                icon: Newspaper,
                variant: "ghost",
              },
            ]}
          />
          <div className="mt-10 mr-2 w-full text-center">
            {isCollapsed ? (
              <Button variant="logout" size="icon">
                <LogOut />
              </Button>
            ) : (
              <Button variant="logout">
                <LogOut />
                Đăng xuất
              </Button>
            )}
          </div>
        </div>
    )
}