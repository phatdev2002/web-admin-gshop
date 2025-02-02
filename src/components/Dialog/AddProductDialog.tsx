"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
//import { fetchCategories } from "@/lib/api"; // Import hàm fetch danh mục

export const fetchCategories = async () => {
    const res = await fetch("https://gshopbackend.onrender.com/category/list");
    const result = await res.json();
    const categoryList = result.categories || result.data || result;
  
    if (!Array.isArray(categoryList)) throw new Error("Invalid category format");
  
    const categoryMap: { [key: string]: string } = {};
    categoryList.forEach((item: any) => {
      categoryMap[item._id] = item.name_type;
    });
  
    return categoryMap;
  };
  
  export const fetchProducts = async (categories: { [key: string]: string }) => {
    if (Object.keys(categories).length === 0) return [];
  
    const res = await fetch("https://gshopbackend.onrender.com/product/list");
    const result = await res.json();
    const productList = result.products || result.data || result;
  
    if (!Array.isArray(productList)) throw new Error("Invalid product format");
  
    return productList.map((item: any) => ({
      name: item.name,
      id_category: categories[item.id_category] || "Không xác định",
      price: item.price,
      status: item.status === "true" ? "Còn hàng" : "Hết hàng",
      quantity: item.quantity,
      rate: "-",
    }));
  };
  
type AddProductDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (newProduct: any) => void;
};

const AddProductDialog = ({ isOpen, setIsOpen, onSubmit }: AddProductDialogProps) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    id_category: "",
    price: "",
    status: "Còn hàng",
    quantity: "",
  });

  // Fetch danh mục sản phẩm
  const { data: categories = {}, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleSubmit = () => {
    onSubmit(newProduct);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
          {/* Nút đóng (X) */}
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-xl font-bold text-center">Thêm sản phẩm</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4">
            <div className="my-3">
              <label className="block text-sm font-medium">Tên sản phẩm</label>
              <Input
                type="text"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Danh mục</label>
              <select
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newProduct.id_category}
                onChange={(e) => setNewProduct({ ...newProduct, id_category: e.target.value })}
                required
              >
                <option value="">Chọn danh mục</option>
                {isLoading ? (
                  <option>Đang tải...</option>
                ) : (
                  Object.entries(categories).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Giá (VNĐ)</label>
              <Input
                type="number"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Số lượng</label>
              <Input
                type="number"
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Trạng thái</label>
              <select
                className="w-full p-2 border  rounded mt-1 bg-blue-50"
                value={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              >
                <option value="Còn hàng">Còn hàng</option>
                <option value="Hết hàng">Hết hàng</option>
              </select>
            </div>

            <Button className="w-full mt-4" variant="destructive" onClick={handleSubmit}>
              Thêm sản phẩm
            </Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddProductDialog;
