import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface EditProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (updatedProduct: {
    name: string;
    price: number;
    quantity: number;
    description: string;
    id_category: string;
    id_supplier: string;
    status: string;
    viewer: number;
    isActive: boolean;
  }) => void;
  productToEdit: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    id_category: string;
    id_supplier: string;
    status: string;
    viewer: number;
    isActive: boolean;
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

const fetchProductImages = async (id_product: string) => {
  if (!id_product) return [];
  const res = await fetch(`https://gshopbackend.onrender.com/image_product/list-images/${id_product}`);
  const result = await res.json();
  if (!result.status || !Array.isArray(result.data)) throw new Error("Invalid image format");

  return result.data.length > 0 ? result.data[0].image : []; // Lấy danh sách ảnh từ object đầu tiên
};



const EditProductDialog = ({ isOpen, setIsOpen, onSubmit, productToEdit }: EditProductDialogProps) => {
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    id_category: "",
    price: "",
    isActive: true,
    quantity: "",
    description: "",
    id_supplier: "",
    status: "",
    viewer: "",
  });

  const { data: categories = {}, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: suppliers = {}, isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const { data: productImages = [], isLoading } = useQuery({
    queryKey: ["productImages", productToEdit?._id], // Dấu "?" để tránh lỗi nếu productToEdit là undefined
    queryFn: () => fetchProductImages(productToEdit!._id), // Dùng "!" để đảm bảo rằng _id có giá trị hợp lệ
    enabled: !!productToEdit?._id, // Chỉ chạy query khi có _id hợp lệ
  });
  
  

  // Khởi tạo giá trị ban đầu dựa trên productToEdit
  useEffect(() => {
    if (productToEdit) {
      setEditedProduct({
        name: productToEdit.name,
        id_category: productToEdit.id_category,
        id_supplier: productToEdit.id_supplier,
        price: productToEdit.price.toString(),
        isActive: productToEdit.isActive,
        quantity: productToEdit.quantity.toString(),
        description: productToEdit.description,
        status: productToEdit.status,
        viewer: productToEdit.viewer.toString(),
      });
    }
  }, [productToEdit]);

  const handleSubmit = async () => {
    try {
      const endpoint = `https://gshopbackend.onrender.com/product/update/${productToEdit._id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedProduct.name,
          price: Number(editedProduct.price),
          quantity: Number(editedProduct.quantity),
          description: editedProduct.description,
          id_category: editedProduct.id_category,
          id_supplier: editedProduct.id_supplier,
          isActive: editedProduct.isActive,
          status: editedProduct.status,
          viewer: Number(editedProduct.viewer),
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
        viewer: Number(editedProduct.viewer),
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Lỗi khi cập nhật sản phẩm, vui lòng thử lại!");
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-fit relative">
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-xl font-bold text-center">
            Chỉnh sửa sản phẩm
          </Dialog.Title>
          <div className="flex flex-row space-y-4">
            {/* /////////// */}
            <div className="my-2 max-w-[400px]">
              <label className="block text-sm font-medium">Hình ảnh sản phẩm </label>
              <p className="italic text-gray-600 text-sm">Không thể chỉnh sửa</p>
              {isLoading ? (
                <p>Đang tải ảnh...</p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {productImages.length > 0 ? (
                    productImages.map((imgUrl: string, index: number) => (
                      <Image key={index} src={imgUrl} alt="Ảnh sản phẩm" 
                      width={80} 
                      height={80} 
                      className={`object-cover rounded border ${index === 0 ? "w-96 h-[200px]" : "w-[70px] h-[70px] block"}`} />
                    ))
                  ) : (
                    <p>Không có hình ảnh nào</p>
                  )}
                </div>
              )}
            </div>
            {/* /////////// */}
            {/* /////////// */}
            <form onSubmit={(e) => e.preventDefault()} className="mt-2">
            {/* Tên sản phẩm */}
            <div className="my-1">
              <label className="block text-sm font-medium">Tên sản phẩm</label>
              <Input
                type="text"
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
                required
              />
            </div>

            <div className="my-2">
              <label className="block text-sm font-medium">Thể loại</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.id_category}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, id_category: e.target.value })
                }
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

            <div className="my-2">
              <label className="block text-sm font-medium">Nhà cung cấp</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50 pr-8"
                value={editedProduct.id_supplier}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, id_supplier: e.target.value })
                }
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
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <label className="block text-sm font-medium">Giá (VNĐ)</label>
                <Input
                  type="number"
                  className="w-full p-2 border rounded mt-1 bg-blue-50"
                  value={editedProduct.price}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="">
                <label className="block text-sm font-medium">Số lượng</label>
                <Input
                  type="number"
                  className="w-full p-2 border rounded mt-1 bg-blue-50"
                  value={editedProduct.quantity}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, quantity: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="my-2">
                <label className="block text-sm font-medium">Lượt xem</label>
                <Input
                
                  type="number"
                  className="w-full p-2 border rounded mt-1 bg-gray-200"
                  value={editedProduct.viewer}
                  readOnly
                />
              </div>
              <div className="my-2">
                <label className="block text-sm font-medium">Status</label>
                <Input
                  type="text"
                  className="w-full p-2 border rounded mt-1 bg-gray-200"
                  value={editedProduct.status} 
                  readOnly
                />
              </div>
            </div>

            <div className="my-1">
              <label className="block text-sm font-medium">Mô tả</label>
              <textarea
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.description}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="my-2">
              <label className="block text-sm font-medium">Tình trạng</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.isActive ? "true" : "false"}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, isActive: e.target.value === "true" })
                }
              >
                <option value="true">Đang HĐ</option>
                <option value="false">Ngừng HĐ</option>
              </select>
            </div>
          </form>
            {/* /////////// */}
          </div>

          
          <Button className="w-full mt-3" variant="destructive" onClick={handleSubmit}>
              Cập nhật sản phẩm
            </Button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProductDialog;
