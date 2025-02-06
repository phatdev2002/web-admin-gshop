

"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type AddCategoryDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (newCategory: { category: string; }) => void;
};
 
const AddCategoryDialog = ({ isOpen, setIsOpen, onSubmit }: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState({
    category: "",
  });

  const handleSubmit = () => {
    onSubmit({ category: newCategory.category }); // Giữ nguyên vì CategoryPage đã sửa lại
    setIsOpen(false);
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

          <Dialog.Title className="text-xl font-bold text-center">Thêm nhà cung cấp</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="my-3">
              <label className="block text-sm font-medium">Nhà cung cấp</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newCategory.category}
                onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
                required
              />
            </div>
            <div className="mt-4">
              <Button variant="destructive" className="w-full" onClick={handleSubmit}>
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
