// AuthGuard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: string;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Dùng để theo dõi trạng thái loading

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role) {
      // Nếu người dùng đã đăng nhập và có vai trò
      if (role === "admin" && requiredRole === "admin") {
        // Nếu người dùng là admin và trang yêu cầu admin
        setLoading(false);
      } else if (role === "staff" && requiredRole === "staff") {
        // Nếu người dùng là staff và trang yêu cầu staff
        setLoading(false);
      } else {
        // Nếu vai trò không khớp với yêu cầu
        router.push("/"); // Chuyển hướng về trang chủ hoặc trang khác
      }
    } else {
      // Nếu chưa đăng nhập, chuyển hướng về trang login
      router.push("/login");
    }
  }, [requiredRole, router]);

  if (loading) {
    return <div className="h-screen flex w-screen items-center justify-center">Đang kiểm tra quyền truy cập...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
