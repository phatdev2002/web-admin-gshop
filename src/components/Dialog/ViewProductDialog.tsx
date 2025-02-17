import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EditProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (updatedProduct: {
    name: string;
    id_category: string;
    price: number;
    status: string;
    quantity: number;
    description: string;
    id_supplier: string;
  }) => void;
  productToEdit: {
    _id: string;
    name: string;
    id_category: string;
    price: number;
    status: string;
    quantity: number;
    description: string;
    id_supplier: string;
  };
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

const EditProductDialog = ({ isOpen, setIsOpen, onSubmit, productToEdit }: EditProductDialogProps) => {
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    id_category: "",
    price: "",
    status: "true",
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

  // Set initial data when productToEdit changes (for editing)
  useEffect(() => {
    if (productToEdit) {
      setEditedProduct({
        name: productToEdit.name,
        id_category: productToEdit.id_category,
        id_supplier: productToEdit.id_supplier,
        price: productToEdit.price.toString(),
        status: productToEdit.status,
        quantity: productToEdit.quantity.toString(),
        description: productToEdit.description,
      });
    }
  }, [productToEdit]);

  const handleSubmit = async () => {
    try {
      const endpoint = `https://gshopbackend.onrender.com/product/update/${productToEdit._id}`; // Update product

      const response = await fetch(endpoint, {
        method: "PUT", // Use PUT for update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedProduct.name,
          price: editedProduct.price,
          quantity: editedProduct.quantity,
          description: editedProduct.description,
          id_category: editedProduct.id_category,
          id_supplier: editedProduct.id_supplier,
          status: editedProduct.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const result = await response.json();
      console.log("Sản phẩm đã được cập nhật:", result);
      onSubmit({
        ...editedProduct,
        price: Number(editedProduct.price),
        quantity: Number(editedProduct.quantity),
      }); // Pass the updated product to the parent
      setIsOpen(false); // Close dialog
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Lỗi khi cập nhật sản phẩm, vui lòng thử lại!");
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

          <Dialog.Title className="text-xl font-bold text-center">
            Chỉnh sửa sản phẩm
          </Dialog.Title>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4">
            {/* Tên sản phẩm */}
            <div className="my-3">
              <label className="block text-sm font-medium">Tên sản phẩm</label>
              <Input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                required
              />
            </div>

            {/* Thể loại */}
            <div className="my-3">
              <label className="block text-sm font-medium">Thể loại</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.id_category}
                onChange={(e) => setEditedProduct({ ...editedProduct, id_category: e.target.value })}
                required
              >
                <option value="">Chọn thể loại</option>
                {categoriesLoading ? (
                  <option>Đang tải...</option>
                ) : (
                  Object.entries(categories).map(([id, name_type]) => (
                    <option key={id} value={id}>
                      {name_type}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Nhà cung cấp */}
            <div className="my-3">
              <label className="block text-sm font-medium">Nhà cung cấp</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.id_supplier}
                onChange={(e) => setEditedProduct({ ...editedProduct, id_supplier: e.target.value })}
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

            {/* Các trường còn lại */}
            <div className="my-3">
              <label className="block text-sm font-medium">Giá (VNĐ)</label>
              <Input
                type="number"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.price}
                onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Số lượng</label>
              <Input
                type="number"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.quantity}
                onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Mô tả</label>
              <Input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.description}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                required
              />
            </div>

            <div className="my-3">
              <label className="block text-sm font-medium">Tình trạng</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.status}
                onChange={(e) => setEditedProduct({ ...editedProduct, status: e.target.value })}
              >
                <option value="true">Còn hàng</option>
                <option value="false">Hết hàng</option>
              </select>
            </div>

            <Button className="w-full mt-4" variant="destructive" onClick={handleSubmit}>
              Cập nhật sản phẩm
            </Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProductDialog;
