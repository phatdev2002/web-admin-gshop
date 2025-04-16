"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Supplier } from "@/app/(user)/admin/products/supplier/page";

type EditSupplierDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialData?: Supplier;
  onSubmit: () => void;
};

const EditSupplierDialog = ({
  isOpen,
  setIsOpen,
  initialData,
  onSubmit,
}: EditSupplierDialogProps) => {
  const [form, setForm] = useState<Supplier>({
    _id: "",
    name: "",
    email: "",
    sdt: "",
    investor_name: "",
    cooperation_day: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        cooperation_day: formatDateToYYYYMMDD(initialData.cooperation_day || ""),
      });
    }
  }, [initialData]);
  

  const handleChange = (key: keyof Supplier, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  function formatDateToYYYYMMDD(input: string) {
    const parts = input.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return input;
  }
  

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!form.name.trim()) newErrors.name = "Không được để trống";
    if (!form.email.trim()) newErrors.email = "Không được để trống";
    else if (!emailRegex.test(form.email)) newErrors.email = "Email không hợp lệ";

    if (!form.sdt.trim()) newErrors.sdt = "Không được để trống";
    else if (!phoneRegex.test(form.sdt)) newErrors.sdt = "Số điện thoại phải 10 số";

    if (!form.investor_name.trim()) newErrors.investor_name = "Không được để trống";
    if (!form.cooperation_day.trim()) newErrors.cooperation_day = "Không được để trống";
    if (!form.address.trim()) newErrors.address = "Không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!form._id) {
      toast.error("Thiếu ID nhà cung cấp!");
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://gshopbackend-1.onrender.com/supplier/update/${form._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone_number: form.sdt,
            representative: form.investor_name,
            cooperation_date: form.cooperation_day,
            address: form.address,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        toast.error(text || "Cập nhật thất bại!");
        return;
      }

      toast.success("Cập nhật nhà cung cấp thành công!");
      onSubmit();
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Không thể cập nhật nhà cung cấp.");
    } finally {
      setLoading(false);
    }
  };

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

          <Dialog.Title className="text-xl font-bold text-center mb-4">
            Chỉnh sửa nhà cung cấp
          </Dialog.Title>

          {/* Form */}
          {[
            { label: "Tên", key: "name" },
            { label: "Email", key: "email" },
            { label: "Số điện thoại", key: "sdt" },
            { label: "Người đại diện", key: "investor_name" },
            { label: "Địa chỉ", key: "address" },
          ].map(({ label, key }) => (
            <div key={key} className="my-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{label}</label>
                {errors[key] && (
                  <span className="text-sm text-red-600">{errors[key]}</span>
                )}
              </div>
              <input
                type="text"
                className={`w-full p-2 border rounded mt-1 ${
                  errors[key] ? "border-red-500 bg-red-50" : "bg-blue-50"
                }`}
                value={String(form[key as keyof Supplier] || "")}
                onChange={(e) => handleChange(key as keyof Supplier, e.target.value)}
              />
            </div>
          ))}

          {/* Ngày hợp tác */}
          <div className="my-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Ngày hợp tác</label>
              {errors.cooperation_day && (
                <span className="text-sm text-red-600">{errors.cooperation_day}</span>
              )}
            </div>
            <input
              type="date"
              className={`w-full p-2 border rounded mt-1 ${
                errors.cooperation_day ? "border-red-500 bg-red-50" : "bg-blue-50"
              }`}
              value={form.cooperation_day}
              onChange={(e) => handleChange("cooperation_day", e.target.value)}
            />
          </div>

          {/* Button */}
          <div className="mt-4">
            <button
              className="w-full p-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditSupplierDialog;
