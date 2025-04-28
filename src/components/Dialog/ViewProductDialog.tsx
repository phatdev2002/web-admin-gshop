"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Editor from "@/components/Editor";
import { BASE_URL } from "@/constants";

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

const fetchProductImages = async (id_product: string) => {
  if (!id_product) return [];
  const res = await fetch(`${BASE_URL}/image_product/list-images/${id_product}`);
  const result = await res.json();
  if (!result.status || !Array.isArray(result.data)) throw new Error("Invalid image format");

  return result.data.length > 0 ? result.data[0].image : []; // Lấy danh sách ảnh từ object đầu tiên
};


// Hàm xóa ảnh với thông báo Toast
const deleteProductImage = async (id_product: string, imageUrl: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/image_product/delete-image/${id_product}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imaUrlsRemove: [imageUrl] }),
      }
    );

    if (!res.ok) throw new Error("Xóa ảnh thất bại");

    const result = await res.json();
    toast.success("Xóa ảnh thành công!"); // Hiển thị thông báo
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error);
    toast.error("Lỗi khi xóa ảnh! ❌");
    throw error;
  }
};



const EditProductDialog = ({ isOpen, setIsOpen, onSubmit, productToEdit }: EditProductDialogProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [content, setContent] = useState("");
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
  ///////////// tải ảnh lên
  // Chọn ảnh
  // Hàm xử lý thay đổi hình ảnh
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      console.log("Selected files:", files); // Kiểm tra danh sách ảnh
      setSelectedImages(files); // Cập nhật state với các file đã chọn
    }
  };
  // Mô tả sản phẩm
  


  // Hàm upload hình ảnh
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
        toast.success("Ảnh đã được tải lên thành công!");
        setSelectedImages([]); // Xóa danh sách ảnh đã chọn
        queryClient.invalidateQueries({ queryKey: ["productImages", id_product] }); // Cập nhật danh sách ảnh
      } else {
        console.log(uploadResult.mess || "Tải ảnh lên thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại!");
    }
  };

////////////////////////////
  

  // Khởi tạo giá trị ban đầu dựa trên productToEdit
  

  const handleSubmit = async () => {
    try {
      console.log("Mô tả sản phẩm trước khi gửi: ", content);  // Kiểm tra mô tả
      
      const endpoint = `${BASE_URL}/product/update/${productToEdit._id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedProduct.name,
          price: Number(editedProduct.price),
          quantity: Number(editedProduct.quantity),
          description: content,  // Đảm bảo mô tả được gửi đúng
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
  
      setIsOpen(false);  // Đóng dialog sau khi cập nhật thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Lỗi khi cập nhật sản phẩm, vui lòng thử lại!");
    }
  };
  
  
  
  useEffect(() => {
    if (!isOpen) {
      setSelectedImages([]); // Xóa ảnh đã chọn khi đóng dialog
    }
  }, [isOpen]);
  const queryClient = useQueryClient();

  const handleDeleteImage = async (imgUrl: string) => {
    try {
      await deleteProductImage(productToEdit._id, imgUrl);
      queryClient.invalidateQueries({ queryKey: ["productImages", productToEdit._id] }); // Refresh danh sách ảnh
    } catch {
      alert("Xóa ảnh thất bại, vui lòng thử lại!");
    }
  };
  useEffect(() => {
    if (productToEdit) {
      setEditedProduct({
        ...productToEdit,
        price: productToEdit.price.toString(),
        quantity: productToEdit.quantity.toString(),
        viewer: productToEdit.viewer.toString(),
        description: productToEdit.description // Đảm bảo description được set
      });
      setContent(productToEdit.description);
    }
  }, [productToEdit]);
  
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex //items-center justify-center bg-black bg-opacity-50 overflow-x-auto">
        <div className="bg-white p-3 rounded-lg relative m-5 w-fit overflow-y-auto ">
          <button
            className="absolute top-3 right-3 text-red-600 hover:text-red-900"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-xl font-bold text-center mb-4">
            Chỉnh sửa sản phẩm
          </Dialog.Title>
          <div className="flex flex-row w-full">
            {/* /////////// */}
            <div className=" w-[400px] mr-5">
              <label className="block text-sm font-medium">Hình ảnh sản phẩm </label>
              {isLoading ? (
                <p>Đang tải ảnh...</p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* /////////// */}
                  {productImages.length > 0 ? (
                    productImages.map((imgUrl: string, index: number) => (
                      <div key={index} className="relative">
                        <Image
                          src={imgUrl}
                          alt="Ảnh sản phẩm"
                          width={index === 0 ? 384 : 70}  // ảnh đầu tiên sẽ có kích thước lớn
                          height={index === 0 ? 200 : 70}
                          className={`object-cover rounded border ${index === 0 ? "w-96 h-[200px]" : "w-[70px] h-[70px] block"}`}
                        />
                        <button
                          onClick={() => handleDeleteImage(imgUrl)}
                          className="absolute top-0 right-0 bg-red-500 rounded text-white w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Không có hình ảnh </p>
                  )}
                {/* /////////// */}
                </div>
              )}
              {/* ///////Chọn ảnh//// */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-blue-500 p-2 rounded hover:text-blue-600">
                    <ImagePlus/>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {/* Hiển thị số lượng file đã chọn */}
                  {selectedImages.length > 0 && (
                    <p className="text-sm ">Đã chọn {selectedImages.length} ảnh</p>
                  )}
                </div>
                {/* Nút tải ảnh lên */}
                {selectedImages.length > 0 && (
                  <Button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => uploadImages(productToEdit._id)}
                  >
                    <Upload/>
                    Tải ảnh lên
                  </Button>
                )}
                {/* Thông báo nếu chọn quá 10 file */}
                {selectedImages.length > 10 && (
                  <p className="text-red-500 text-sm mt-1">Bạn chỉ có thể tải lên tối đa 10 hình!</p>
                )}
              </div>
              {/* /////////// */}

            </div>
            {/* /////////// */}
            {/* /////////// */}
            <form onSubmit={(e) => e.preventDefault()} className="flex-1 w-full">
            {/* Tên sản phẩm */}
            <div className="">
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
              <label className="block text-sm font-medium">Tình trạng</label>
              <select
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                value={editedProduct.isActive ? "true" : "false"}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, isActive: e.target.value === "true" })
                }
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Ngừng hoạt động</option>
              </select>
            </div>
          </form>
            {/* /////////// */}
          </div> 
          <div className="my-1">
            <label className="block text-sm font-medium mb-1">Mô tả sản phẩm</label>
            <div className="w-full border rounded h-[550px] overflow-y-auto">
              <Editor 
                value={content}
                onChange={(newContent) => {
                  setContent(newContent);
                  setEditedProduct(prev => ({...prev, description: newContent}));
                }}
              />
            </div>
            

            </div>
          <Button
            className="w-full mt-3"
            variant="destructive"
            onClick={() => {
              handleSubmit();
              uploadImages(productToEdit._id);
            }}
          >
            Cập nhật sản phẩm
          </Button>

        </div>
      </div>
    </Dialog>
  );
};

export default EditProductDialog;
