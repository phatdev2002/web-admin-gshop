"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/Card";
import ChangePass from "@/components/Dialog/ChangePassDialog";
import { Button } from "@headlessui/react";

export interface UserProfile {
  name: string;
  role: string;
  phone_number: string;
  _id: string; // UID
  email: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    role: "",
    phone_number: "",
    _id: "",
    email: "",
  });

  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: UserProfile = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu user:", error);
      }
    }
  }, []);

  const handleChangeAvatar = () => {
    console.log("Change avatar clicked!");
  };

  const handleChangePassword = () => {
    setIsChangePassOpen(true);
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    setMessage(null);
  
    try {
      const response = await fetch("https://gshopbackend.onrender.com/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          phone_number: user.phone_number,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
        localStorage.setItem("user", JSON.stringify(user));
      
        // Kích hoạt sự kiện storage để các component khác nhận thay đổi
        window.dispatchEvent(new Event("storage"));
      
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: "error", text: result.message || "Cập nhật thất bại!" });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      setMessage({ type: "error", text: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
    } finally {
      setIsLoading(false);
    }
  };
  

  const getAvatar = () => {
    return user.role === "staff" ? "/img/avtstaff.jpg" : "/img/avt.jpg";
  };

  return (
    <>
      <CardContent className="flex flex-row relative">
        <div className="w-1/4 flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4">
            <Image
              src={getAvatar()}
              alt="Avatar"
              width={200}
              height={200}
              className="rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-center">
            {user.name || "Tên người dùng"}
          </h2>
          <p className="text-gray-500 text-center">{user.role || "Vai trò"}</p>
          <button
            onClick={handleChangeAvatar}
            className="mt-4 px-5 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
          >
            Cập nhật ảnh đại diện
          </button>
          <button
            onClick={handleChangePassword}
            className="mt-2 px-5 bg-white text-red-500 border border-red-500 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Đổi mật khẩu cá nhân
          </button>
          <ChangePass isOpen={isChangePassOpen} onClose={() => setIsChangePassOpen(false)} userId={user._id} />
        </div>

        <div className="w-2/3 pl-6">
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hồ sơ</h2>
          
          {/* Thông báo */}
          {message && (
            <div
              className={`absolute top-0 right-0 m-4 p-3 rounded shadow-md ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">
              Họ và tên
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border rounded mt-1 bg-blue-50"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-1 font-medium">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="text"
              className="w-full p-2 border rounded mt-1 bg-blue-50"
              value={user.phone_number}
              onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded mt-1 bg-gray-100"
              value={user.email}
              //onChange={(e) => setUser({ ...user, email: e.target.value })}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="code" className="block mb-1 font-medium">
              UID
            </label>
            <input
              id="code"
              type="text"
              className="w-full p-2 border rounded mt-1 bg-gray-100"
              value={user._id}
              readOnly
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateProfile}
              className={`px-14 text-white py-2 rounded-xl transition-colors ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ProfilePage;
