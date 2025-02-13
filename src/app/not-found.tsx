"use client";

import { useRouter } from "next/navigation"; // Import useRouter

const NotFoundPage = () => {
  const router = useRouter(); // Khởi tạo router

  // Hàm xử lý khi nhấn nút
  const handleLoginRedirect = () => {
    router.push("/login"); // Chuyển hướng đến trang login
  };

  return (
    <div className="h-screen w-full flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-500 mb-5">G Shop</h1>
        <h1 className="text-xl font-bold text-red-500">404 - Trang không tìm thấy</h1>
        
        {/* Thêm nút chuyển hướng */}
        <button
          onClick={handleLoginRedirect}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Chuyển đến Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;