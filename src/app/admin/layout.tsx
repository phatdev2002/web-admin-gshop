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
        {/* Sidebar */}
        <SideNavbarAdmin />
        {/* Sidebar */}

        <div className="flex-1 h-full bg-blue-50 px-8 py-5 min-h-[750px] overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
