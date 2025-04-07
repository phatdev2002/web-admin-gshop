"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Import icon X
import { toast } from "sonner";

interface ChangePassProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ChangePass: React.FC<ChangePassProps> = ({ isOpen, onClose, userId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = !newPassword && !confirmPassword; // Chỉ bị mờ khi cả hai ô đều chưa nhập

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      setError("Mật khẩu phải có ít nhất 4 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không trùng khớp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://gshopbackend-1.onrender.com/user/changPass", { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newPassword, confirmPassword }),
      });

      const text = await response.text();
      console.log("Raw Response:", text); // Debug phản hồi

      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi đổi mật khẩu.");
      }

      toast.success("Đổi mật khẩu thành công!");
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Có lỗi xảy ra khi đổi mật khẩu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}> 
      <DialogContent>
        {/* Tiêu đề + nút đóng */}
        <div className="flex justify-between items-center mb-4">
          <DialogHeader>
            <p className="text-lg font-semibold">Đổi mật khẩu</p>
          </DialogHeader>
          <button
            className="text-red-600 hover:text-red-900 p-1 rounded-md"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form nhập mật khẩu */}
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full p-2 border rounded mt-1 bg-blue-50"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            className="w-full p-2 border rounded mt-1 bg-blue-50"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className="text-gray-500 text-sm italic">Mật khẩu phải có ít nhất 4 ký tự.</p>
          
          {error && <p className="text-red-500">{error}</p>}

          {/* Nút xác nhận */}
          <div className="flex justify-end">
            <Button 
              variant={"destructive"} 
              onClick={handleChangePassword} 
              disabled={isDisabled || loading}
              className={`w-full ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePass;
