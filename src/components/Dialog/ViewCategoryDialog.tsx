"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Category } from "@/app/(user)/admin/products/category/columns"; // Đảm bảo đường dẫn đúng

type EditCategoryDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
  onUpdate: (updatedCategory: Category) => void;
};

const EditCategoryDialog = ({ isOpen, setIsOpen, category, onUpdate }: EditCategoryDialogProps) => {
  const [editedCategory, setEditedCategory] = useState({
    name_type: "",
  });

  useEffect(() => {
    if (category) {
      setEditedCategory({ name_type: category.name_type });
    }
  }, [category]);

  const handleSubmit = async () => {
    await onUpdate({ id: category.id, name_type: editedCategory.name_type, product_count: category.product_count });
    setIsOpen(false);
  };

  // Kiểm tra giá trị isOpen của dialog
  console.log("EditCategoryDialog isOpen:", isOpen);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-xl font-bold text-center">Chỉnh sửa thể loại</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="my-3">
              <label className="block text-sm font-medium">Tên thể loại</label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedCategory.name_type}
                onChange={(e) => setEditedCategory({ name_type: e.target.value })}
                required
              />
            </div>
            <div className="mt-4">
              <Button variant="destructive" className="w-full" onClick={handleSubmit}>
                Cập nhật
                
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditCategoryDialog;
