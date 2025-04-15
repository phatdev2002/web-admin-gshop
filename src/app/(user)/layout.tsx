"use client";
import { useState, useEffect } from "react";
import TopNavbar from "@/app/components/TopNavbar";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [bgColor, setBgColor] = useState("#f0f0f0");

  useEffect(() => {
    const storedColor = localStorage.getItem("bgColor");
    if (storedColor) {
      setBgColor(storedColor);
    }
  }, []);

  return (
    <div
      className={`flex flex-col w-full h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <TopNavbar setBgColor={setBgColor} />
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: bgColor }}>
        {children}
      </div>
    </div>
  );
}
