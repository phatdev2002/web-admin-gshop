// src/components/AddSupplierDialog.tsx

"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type AddSupplierDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (newSupplier: any) => void;
};

const AddSupplierDialog = ({ isOpen, setIsOpen, onSubmit }: AddSupplierDialogProps) => {
  const [newSupplier, setNewSupplier] = useState({
    supplier: "",
    email: "",
    sdt: "",
    investor_name: "",
    cooperation_day: "",
    address: "",
  });

  const handleSubmit = () => {
    onSubmit(newSupplier); // Pass newSupplier data back to the parent
    setIsOpen(false); // Close the modal
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
                value={newSupplier.supplier}
                onChange={(e) => setNewSupplier({ ...newSupplier, supplier: e.target.value })}
                required
              />
            </div>
            <div className="my-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              />
            </div>
            <div className="my-3">
              <label className="block text-sm font-medium">Số điện thoại</label>
              <input
                type="text"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newSupplier.sdt}
                onChange={(e) => setNewSupplier({ ...newSupplier, sdt: e.target.value })}
              />
            </div>
            <div className="my-3">
              <label className="block text-sm font-medium">Tên người đại diện</label>
              <input
                type="text"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newSupplier.investor_name}
                onChange={(e) => setNewSupplier({ ...newSupplier, investor_name: e.target.value })}
              />
            </div>
            <div className="my-3">
              <label className="block text-sm font-medium">Ngày hợp tác</label>
              <input
                type="date"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newSupplier.cooperation_day}
                onChange={(e) => setNewSupplier({ ...newSupplier, cooperation_day: e.target.value })}
              />
            </div>
            <div className="my-3">
              <label className="block text-sm font-medium">Địa chỉ</label>
              <input
                type="text"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
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

export default AddSupplierDialog;
