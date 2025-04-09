"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CardContent } from "@/components/ui/Card";
import ChangePass from "@/components/Dialog/ChangePassDialog";
import { Button } from "@headlessui/react";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowRightIcon, ImageUp, LockIcon } from "lucide-react";

export type UserRole = "admin" | "user" | "manager" | "";

export interface UserProfile {
  name: string;
  role: UserRole;
  phone_number: string;
  _id: string; // UID
  email: string;
  avatar: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    role: "",
    phone_number: "",
    _id: "",
    email: "",
    avatar: "",
  });

  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Dọn dẹp URL tạm
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Xử lý khi chọn ảnh
  useEffect(() => {
    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  const fetchUserDetail = useCallback(async (_id: string) => {
    try {
      const response = await fetch(`https://gshopbackend-1.onrender.com/user/detail_user?_id=${_id}`);
      const result = await response.json();
      if (result.status) {
        setUser(result.data);
      } else {
        console.error("Không thể lấy thông tin người dùng");
        toast.error("Lỗi khi tải hồ sơ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      toast.error("Lỗi mạng khi tải hồ sơ");
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: UserProfile = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser._id) {
          fetchUserDetail(parsedUser._id);
        }
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", error);
        toast.error("Dữ liệu người dùng không hợp lệ");
      }
    }
  }, [fetchUserDetail]);

  const handleChangeAvatar = async () => {
    if (!selectedImage) {
      toast.error("Vui lòng chọn ảnh trước!");
      return;
    }

    // Kiểm tra kích thước ảnh
    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Ảnh phải nhỏ hơn 5MB");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(
        `https://gshopbackend-1.onrender.com/user/create-avatar/${user._id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status) {
        toast.success("Cập nhật ảnh đại diện thành công!");
        // Cập nhật dữ liệu cục bộ mà không cần tải lại trang
        setUser(prev => ({ ...prev, avatar: result.data.avatar }));
        localStorage.setItem("user", JSON.stringify({ ...user, avatar: result.data.avatar }));
        setSelectedImage(null);
      } else {
        toast.error(result.message || "Cập nhật ảnh thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh đại diện:", error);
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = () => {
    setIsChangePassOpen(true);
  };

  const handleUpdateProfile = async () => {
    // Kiểm tra tên
    if (!user.name.trim()) {
      setNameError("Tên không được để trống");
      return;
    } else {
      setNameError(null);
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(user.phone_number)) {
      setPhoneError("Số điện thoại phải có đúng 9 chữ số");
      return;
    } else {
      setPhoneError(null);
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("https://gshopbackend-1.onrender.com/user/update", {
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
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => setMessage(null), 3000);
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
    if (!user.avatar || user.avatar === "url1") {
      return "/default-thumbnail.jpg";
    }
    return user.avatar;
  };

  return (
    <>
      <CardContent className="flex flex-col md:flex-row relative">
        {/* Cột trái - Ảnh đại diện */}
        <div className="w-full md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
          <div className="w-40 h-40 mb-4 flex items-center justify-center relative">
            <Image
              src={getAvatar()}
              alt="Ảnh đại diện"
              width={160}
              height={160}
              className="w-40 h-40 rounded-full object-cover border-2 border-gray-200"
              priority
            />
            
            {imagePreview && (
              <div className="flex flex-row items-center">
                <ArrowRightIcon className="w-6 h-6 m-2 text-blue-500" />
                <div className="relative w-24 h-24">
                  <Image
                    src={imagePreview}
                    alt="Xem trước ảnh mới"
                    fill
                    className="rounded-full object-cover border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold text-center">
            {user.name || "Tên người dùng"}
          </h2>
          <p className="text-gray-500 text-center capitalize">
            {user.role || "Vai trò"}
          </p>

          {/* Điều khiển tải ảnh lên */}
          <div className="mt-4 flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatarUpload"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedImage(e.target.files[0]);
                }
              }}
            />

            <label
              htmlFor="avatarUpload"
              className="flex items-center text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition-colors cursor-pointer"
              title="Đổi ảnh đại diện"
            >
              <ImageUp className="w-5 h-5 mr-2" />
              <span>Đổi ảnh</span>
            </label>

            {selectedImage && (
              <div className="mt-2 flex flex-col items-center">
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {selectedImage.name}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleChangeAvatar}
                    disabled={isUploading}
                    className={`px-4 py-1 rounded transition-colors ${
                      isUploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {isUploading ? "Đang tải lên..." : "Lưu"}
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            className="mt-4 px-5 bg-white text-red-500 border border-red-500 py-2 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <LockIcon className="w-5 h-5 mr-2" />
            Đổi mật khẩu
          </button>
          <ChangePass 
            isOpen={isChangePassOpen} 
            onClose={() => setIsChangePassOpen(false)} 
            userId={user._id} 
          />
        </div>

        {/* Cột phải - Form thông tin */}
        <div className="w-full md:w-3/4 md:pl-6">
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa hồ sơ</h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.type === "success" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                className={`w-full p-2 border rounded ${
                  nameError ? "border-red-500" : "border-gray-300"
                } bg-blue-50 focus:bg-white`}
                value={user.name}
                onChange={(e) => {
                  setUser({ ...user, name: e.target.value });
                  setNameError(null);
                }}
                aria-invalid={!!nameError}
                aria-describedby="name-error"
              />
              {nameError && (
                <p id="name-error" className="text-red-500 text-sm mt-1">
                  {nameError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                className={`w-full p-2 border rounded ${
                  phoneError ? "border-red-500" : "border-gray-300"
                } bg-blue-50 focus:bg-white`}
                value={user.phone_number}
                onChange={(e) => {
                  setUser({ ...user, phone_number: e.target.value });
                  setPhoneError(null);
                }}
                aria-invalid={!!phoneError}
                aria-describedby="phone-error"
              />
              {phoneError && (
                <p id="phone-error" className="text-red-500 text-sm mt-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                value={user.email}
                readOnly
                disabled
              />
            </div>

            <div>
              <label htmlFor="code" className="block mb-1 font-medium">
                UID
              </label>
              <input
                id="code"
                type="text"
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                value={user._id}
                readOnly
                disabled
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className={`px-8 py-2 text-white rounded-xl transition-colors ${
                  isLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-red-500 hover:bg-red-600"
                }`}
                aria-busy={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ProfilePage;