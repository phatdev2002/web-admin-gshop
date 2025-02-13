import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AddProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (newProduct: {
    name: string;
    id_category: string;
    price: string;
    status: string;
    quantity: string;
    description: string;
    id_supplier: string;
  }) => void;
}

export const fetchCategories = async () => {
  const res = await fetch("https://gshopbackend.onrender.com/category/list");
  const result = await res.json();
  const categoryList = result.categories || result.data || result;
  
  if (!Array.isArray(categoryList)) throw new Error("Invalid category format");
  
  const categoryMap: { [key: string]: string } = {};
  categoryList.forEach((item: { _id: string; name_type: string }) => {
    categoryMap[item._id] = item.name_type;
  });
  
  return categoryMap;
};

export const fetchSuppliers = async () => {
  const res = await fetch("https://gshopbackend.onrender.com/supplier/list");
  const result = await res.json();
  const supplierList = result.suppliers || result.data || result;
  
  if (!Array.isArray(supplierList)) throw new Error("Invalid supplier format");
  
  const supplierMap: { [key: string]: string } = {};
  supplierList.forEach((item: { _id: string; name: string }) => {
    supplierMap[item._id] = item.name;
  });
  
  return supplierMap;
};

const AddProductDialog = ({ isOpen, setIsOpen, onSubmit }: AddProductDialogProps) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    id_category: "",
    price: "",
    status: "Còn hàng",
    quantity: "",
    description: "",
    id_supplier: "",
  });

  const { data: categories = {}, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: suppliers = {}, isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://gshopbackend.onrender.com/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          quantity: newProduct.quantity,
          description: newProduct.description,
          id_category: newProduct.id_category,
          id_supplier: newProduct.id_supplier,
          status: newProduct.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      console.log("Sản phẩm mới đã được thêm:", result);
      onSubmit(newProduct);
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Lỗi khi thêm sản phẩm, vui lòng thử lại!");
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

          <Dialog.Title className="text-xl font-bold text-center">Thêm sản phẩm</Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4">
            <div className="my-3">
              <label className="block text-sm font-medium">Tên sản phẩm</label>
              <Input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Danh mục</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newProduct.id_category}
                onChange={(e) => setNewProduct({ ...newProduct, id_category: e.target.value })}
                required
              >
                <option value="">Chọn danh mục</option>
                {categoriesLoading ? (
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
              <label className="block text-sm font-medium">Nhà cung cấp</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newProduct.id_supplier}
                onChange={(e) => setNewProduct({ ...newProduct, id_supplier: e.target.value })}
                required
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliersLoading ? (
                  <option>Đang tải...</option>
                ) : (
                  Object.entries(suppliers).map(([id, name]) => (
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
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Số lượng</label>
              <Input
                type="number"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Mô tả</label>
              <Input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Trạng thái</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
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
