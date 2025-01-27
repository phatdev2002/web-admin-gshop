"use client"
import { Nav } from "@/components/ui/nav";
import React, { useState } from "react";


import {
  ChevronRight,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button";

type Props = {}

export default function SideNavbar({}: Props){
  const [isCollapsed, setIsCollapsed] = useState(false)

  function toggleSidebar(){
    setIsCollapsed(!isCollapsed)
  }

    return (
        <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24">
          <div className="absolute right-[-20px] top-7">
            <Button onClick={toggleSidebar} variant='secondary'>
            <ChevronRight/>
            </Button>
          </div>
          
            <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Overview",
                href:"/",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Users",
                href:"/user",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Orders",
                href:"/orders",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Setting",
                href:"/setting",
                icon: Settings,
                variant: "ghost",
              },
            ]}
          />
        </div>
    )
}