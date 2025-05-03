"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Editor from "@/components/Editor";
import { BASE_URL } from "@/constants";

interface AddProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (newProduct: {
    name: string;
    id_category: string;
    price: number;
    isActive: boolean;
    quantity: number;
    description: string;
    id_supplier: string;
  }) => void;
}

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/category/list`);
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
  const res = await fetch(`${BASE_URL}/supplier/list`);
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
    price: 1,
    isActive: true,
    quantity: 1,
    description: "",
    id_supplier: "",
  });

  const [content, setContent] = useState(""); // dùng cho Editor

  const { data: categories = {}, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: suppliers = {}, isLoading: suppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImages(files);
    }
  };

  const uploadImages = async (id_product: string) => {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append("image", image);
    });

    try {
      const uploadResponse = await fetch(
        `${BASE_URL}/image_product/upload/${id_product}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadResult = await uploadResponse.json();
      if (uploadResponse.ok && uploadResult.status === true) {
        toast.success("Sản phẩm đã được thêm thành công!");
      } else {
        toast.error(uploadResult.mess || "Tải ảnh lên thất bại!");
      }
    } catch {
      toast.error("Không thể kết nối đến server. Vui lòng thử lại!");
    }
  };

  const isFormValid =
    newProduct.name.trim() !== "" &&
    newProduct.id_category.trim() !== "" &&
    newProduct.id_supplier.trim() !== "" &&
    newProduct.price > 0 &&
    newProduct.quantity > 0 &&
    content.trim() !== "" &&
    selectedImages.length > 0 &&
    selectedImages.length <= 10;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/product/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, description: content }),
      });

      const result = await response.json();

      if (response.ok && result.status === true) {
        const id_product = result?.data?._id;
        await uploadImages(id_product);
        onSubmit({ ...newProduct, description: content });

        setNewProduct({
          name: "",
          id_category: "",
          price: 1,
          isActive: true,
          quantity: 1,
          description: "",
          id_supplier: "",
        });
        setContent("");
        setSelectedImages([]);
        setIsOpen(false);
      } else {
        toast.error(result.mess || "Thêm sản phẩm thất bại!");
      }
    } catch{
      toast.error("Không thể kết nối đến server. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNewProduct({
      name: "",
      id_category: "",
      price: 1,
      isActive: true,
      quantity: 1,
      description: "",
      id_supplier: "",
    });
    setSelectedImages([]);
    setContent("");
  };
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };
  

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <div className="fixed inset-0 flex //items-center justify-center bg-black bg-opacity-50 overflow-x-auto">
        <div className="bg-white p-3 rounded-lg relative m-5 w-fit overflow-y-auto ">
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={handleClose}
          >
            <X size={20} />
          </button>

          <div className="text-xl font-bold text-center">Thêm sản phẩm</div>
          <form onSubmit={(e) => e.preventDefault()} className="mt-1 w-full">
            <div className="flex flex-row">
            <div className="my-3 w-96 mr-10">
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="p-2 border rounded bg-blue-50 hover:bg-blue-100"
                >
                  <ImagePlus size={24} className="text-blue-500" />
                </button>

                <span className="text-sm text-gray-500">{selectedImages.length} hình đã chọn</span>
              </div>

              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {selectedImages.length > 10 && (
                <p className="text-red-500 text-sm mt-1">Bạn chỉ có thể tải lên tối đa 10 hình!</p>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      width={index === 0 ? 500: 70}
                      height={index === 0 ? 500 : 70}
                      className={`object-cover rounded border ${
                        index === 0 ? "w-96 h-[200px]" : "w-[70px] h-[70px]"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-sm p-1 hover:bg-red-600"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

            </div>


              <div className="flex flex-col w-96">
                <div className="my-0">
                  <label className="text-sm font-medium">Tên sản phẩm</label>
                  <Input
                    type="text"
                    className="w-full p-2 border rounded mt-1 bg-blue-50"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="my-2">
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

                <div className="my-2">
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

                <div className="my-2">
                  <label className="block text-sm font-medium">Giá (VNĐ)</label>
                  <Input
                    type="number"
                    className="w-full p-2 border rounded mt-1 bg-blue-50"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="my-2">
                  <label className="block text-sm font-medium">Số lượng</label>
                  <Input
                    type="number"
                    className="w-full p-2 border rounded mt-1 bg-blue-50"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantity: Number(e.target.value) })
                    }
                    required
                  />
                </div>

                

                <div className="my-2">
                  <label className="block text-sm font-medium">Trạng thái</label>
                  <select
                    className="w-full p-2 border rounded mt-1 bg-blue-50"
                    value={newProduct.isActive ? "Đang HĐ" : "Ngừng HĐ"}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, isActive: e.target.value === "Đang HĐ" })
                    }
                  >
                    <option value="Đang HĐ">Đang HĐ</option>
                    <option value="Ngừng HĐ">Ngừng HĐ</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="my-2">
              <label className="block text-sm font-medium">Mô tả</label>
              <div className="w-full border rounded max-h-[500px] min-h-[150px] overflow-y-auto">
                <Editor value={content} onChange={setContent}/>
              </div>
            </div>
            <Button
              className={`w-full mt-4 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
              variant="destructive"
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Đang thêm..." : "Thêm sản phẩm"}
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AddProductDialog;
