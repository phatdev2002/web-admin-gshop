"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type AddCategoryDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (categoryName: string) => void;
};

const AddCategoryDialog = ({ isOpen, setIsOpen, onSubmit }: AddCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = () => {
    if (categoryName.trim() === "") return;
    onSubmit(categoryName);
    setCategoryName("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
          {/* Nút đóng (X) */}
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-xl font-bold text-center">Thêm thể loại</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4">
            <div className="my-3">
              <label className="block text-sm font-medium">Tên thể loại</label>
              <Input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>

            <Button className="w-full mt-4" variant="destructive" onClick={handleSubmit}>
              Thêm thể loại
            </Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddCategoryDialog;
