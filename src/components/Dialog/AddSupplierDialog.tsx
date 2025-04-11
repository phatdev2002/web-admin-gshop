"use client";
import React, { useState } from "react"; // Ensure React is imported for JSX
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type AddSupplierDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (newSupplier: {
    name: string;
    email: string;
    phone_number: string;
    representative: string;
    cooperation_date: string;
    address: string;
  }) => void;
};

const AddSupplierDialog = ({
  isOpen,
  setIsOpen,
  onSubmit,
}: AddSupplierDialogProps) => {
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone_number: "",
    representative: "",
    cooperation_date: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{9}$/;

    if (!newSupplier.name.trim()) {
      newErrors.name = "Không được để trống";
    }

    if (!newSupplier.email.trim()) {
      newErrors.email = "Không được để trống";
    } else if (!emailRegex.test(newSupplier.email)) {
      newErrors.email = "Vui lòng nhập email hợp lệ (ví dụ: abc@xyz.vn)";
    }

    if (!newSupplier.phone_number.trim()) {
      newErrors.phone_number = "Không được để trống";
    } else if (!phoneRegex.test(newSupplier.phone_number)) {
      newErrors.phone_number = "Số điện thoại phải gồm 9 số";
    }

    if (!newSupplier.representative.trim()) {
      newErrors.representative = "Không được để trống";
    }

    if (!newSupplier.cooperation_date.trim()) {
      newErrors.cooperation_date = "Không được để trống";
    }

    if (!newSupplier.address.trim()) {
      newErrors.address = "Không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "https://gshopbackend-1.onrender.com/supplier/add",
        newSupplier
      );

      if ((response.status === 200 || response.status === 201) && response.data.status === true) {
        onSubmit(newSupplier);
        setIsOpen(false);
        setNewSupplier({
          name: "",
          email: "",
          phone_number: "",
          representative: "",
          cooperation_date: "",
          address: "",
        });
        setErrors({});
        toast.success("Thêm nhà cung cấp thành công!");
      } else {
        const errorMessage = response.data?.mess || "Thêm nhà cung cấp thất bại!";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Lỗi gửi yêu cầu:", error);
      toast.error("Không thể thêm nhà cung cấp. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const digitsOnly = value.replace(/\D/g, '');
      const truncatedValue = digitsOnly.slice(0, 9);
      setNewSupplier({ ...newSupplier, [name]: truncatedValue });
    } else {
      setNewSupplier({ ...newSupplier, [name]: value });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setNewSupplier({
          name: "",
          email: "",
          phone_number: "",
          representative: "",
          cooperation_date: "",
          address: "",
        });
        setErrors({});
      }}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-red-600 hover:text-red-900"
          onClick={() => {
            setIsOpen(false);
            setNewSupplier({
              name: "",
              email: "",
              phone_number: "",
              representative: "",
              cooperation_date: "",
              address: "",
            });
            setErrors({});
          }}
        >
          <X size={20} />
        </button>


          <Dialog.Title className="text-xl font-bold text-center">
            Thêm nhà cung cấp
          </Dialog.Title>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* TÊN */}
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Tên</label>
                {errors.name && <span className="text-sm text-red-600">{errors.name}</span>}
              </div>
              <input
                type="text"
                name="name"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.name ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={newSupplier.name}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Email</label>
                {errors.email && <span className="text-sm text-red-600">{errors.email}</span>}
              </div>
              <input
                type="text"
                name="email"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.email ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={newSupplier.email}
                onChange={handleChange}
              />
            </div>

            {/* SỐ ĐIỆN THOẠI */}
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Số điện thoại</label>
                {errors.phone_number && (
                  <span className="text-sm text-red-600">{errors.phone_number}</span>
                )}
              </div>
              <input
                type="text"
                name="phone_number"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.phone_number ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={newSupplier.phone_number}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="123456789"
              />
            </div>

            {/* NGƯỜI ĐẠI DIỆN */}
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Người đại diện</label>
                {errors.representative && (
                  <span className="text-sm text-red-600">{errors.representative}</span>
                )}
              </div>
              <input
                type="text"
                name="representative"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.representative ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={newSupplier.representative}
                onChange={handleChange}
              />
            </div>

            {/* NGÀY HỢP TÁC */}
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Ngày hợp tác</label>
                {errors.cooperation_date && (
                  <span className="text-sm text-red-600">{errors.cooperation_date}</span>
                )}
              </div>
              <input
                type="date"
                name="cooperation_date"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.cooperation_date ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={newSupplier.cooperation_date}
                onChange={handleChange}
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* ĐỊA CHỈ */}
            <div className="my-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Địa chỉ</label>
                {errors.address && (
                  <span className="text-sm text-red-600">{errors.address}</span>
                )}
              </div>
              <input
                type="text"
                name="address"
                className={`w-full p-2 border rounded mt-1 ${
                  errors.address ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={newSupplier.address}
                onChange={handleChange}
              />
            </div>

            {/* BUTTON */}
            <div className="mt-4">
              <Button
                variant="destructive"
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Thêm nhà cung cấp"}
              </Button>
            </div>
          </form>


        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSupplierDialog;
