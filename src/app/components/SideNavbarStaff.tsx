"use client"
import { Nav } from "@/components/ui/nav";
import React, { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Newspaper,
  ShoppingCart,
  Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button";
import logoutUser from "@/app/(auth)/logout/logout-handle";

type Props = object

export default function SideNavbarAdmin({}: Props){
  const [isCollapsed, setIsCollapsed] = useState(false)

  function toggleSidebar(){
    setIsCollapsed(!isCollapsed)
  }

    return (
        <div className="relative min-w-[80px] h-auto //shadow-2xl bg-white px-1 pb-10 pt-1 ">
          {/* <Image
            src={isCollapsed ? "/logo/LogoAppG.png" : "/login/LogoAppGShop2.png"}
            alt="Logo GShop"
            width={isCollapsed ? 46 : 120} // Thay đổi chiều rộng theo trạng thái
            height={isCollapsed ? 50 : 50} // Giữ nguyên hoặc thay đổi chiều cao nếu cần
            className={`absolute top-8 pl-2`} // Thay đổi kích thước bằng className
            priority
          /> */}
          <div className="absolute right-[-20px] bottom-5">
            <Button onClick={toggleSidebar} variant='btnright' className="w-9 text-black/100 hover:text-black/100 hover:bg-blue-50">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
          
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Tổng quan",
                href:"/staff/overview",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Đơn hàng",
                href:"/staff/orders",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Khách hàng",
                href:"/staff/clients",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Tin tức",
                href:"/staff/news",
                icon: Newspaper,
                variant: "ghost",
              },
            ]}
          />
          <div className="absolute mt-10 mr-0 ml-4 bottom-5">
            {isCollapsed ? (
              <Button variant="logout" size="icon" onClick={() => logoutUser()}>
              <LogOut />
            </Button>
            ) : (
              <Button variant="logout" onClick={() => logoutUser()}>
              <LogOut />
              Đăng xuất
            </Button>
            )}
          </div>
          
        </div>
    )
}

////////////
import {
  
} from "lucide-react"



///////////////