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
    
  return (
    <div className={`flex flex-col w-full h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}>
    <TopNavbar /> 
    <div className="flex-1 bg-blue-50 overflow-y-auto">
      {children}
    </div>
  </div>
  );
}
