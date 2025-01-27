import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SideNavbarAdmin from "@/app/components/SideNavbarAdmin";
import SideNavbarStaff from "@/app/components/SideNavbarStaff";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Over View",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*Sidebar*/}
        <SideNavbarStaff/>
        {/*Sidebar*/}
        <div className="p-8 w-full">{children}</div>
        
      </body>
    </html>
  );
}
