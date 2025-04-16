"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type AddCategoryDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (newCategory: { category: string }) => void;
};

const AddCategoryDialog = ({ isOpen, setIsOpen, onSubmit }: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState({
    category: "",
  });

  const handleSubmit = async () => {
    try {
      // Gọi API thêm thể loại
      const res = await fetch("https://gshopbackend-1.onrender.com/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Backend mong đợi trường name_type
        body: JSON.stringify({ name_type: newCategory.category }),
      });

      if (!res.ok) {
        throw new Error("Thêm thể loại thất bại");
      }

      // Nếu thành công, gọi hàm onSubmit từ CategoryPage để refetch dữ liệu hoặc cập nhật UI
      onSubmit({ category: newCategory.category });

      // Reset dữ liệu nhập vào
      setNewCategory({ category: "" });

      // Đóng dialog sau khi thêm thành công
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
      alert("Có lỗi xảy ra khi thêm thể loại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          {/* Nút X đóng dialog */}
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-xl font-bold text-center">Thêm thể loại</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="my-3">
              <label className="block text-sm font-medium">Tên thể loại</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newCategory.category}
                onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                required
              />
            </div>
            <div className="mt-4">
              <Button
                variant="destructive"
                className={`w-full ${!newCategory.category ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSubmit}
                disabled={!newCategory.category}
              >
                Thêm
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddCategoryDialog;
