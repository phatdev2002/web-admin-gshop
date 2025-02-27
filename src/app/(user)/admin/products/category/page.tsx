"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddCategoryDialog from "@/components/Dialog/AddCategoryDialog";
import EditCategoryDialog from "@/components/Dialog/ViewCategoryDialog";
import { columns as baseColumns, Category } from "./columns";
import { toast } from "sonner"
import { ClassNames } from "@emotion/react";


// Fetch API function
const fetchCategories = async () => {
  // Lấy danh sách thể loại
  const categoryRes = await fetch("https://gshopbackend.onrender.com/category/list");
  if (!categoryRes.ok) throw new Error("Failed to fetch categories");
  const categoryData = await categoryRes.json();
  const categoryList = categoryData.category || categoryData.data || categoryData;
  if (!Array.isArray(categoryList)) throw new Error("Unexpected API format");

  // Lấy danh sách sản phẩm
  const productRes = await fetch("https://gshopbackend.onrender.com/product/list");
  if (!productRes.ok) throw new Error("Failed to fetch products");
  const productData = await productRes.json();
  const productList = productData.data || productData.products || productData;
  if (!Array.isArray(productList)) throw new Error("Unexpected API format");

  // Đếm số lượng sản phẩm theo id_category
  const productCountMap = productList.reduce((acc: Record<string, number>, product: { id_category: string }) => {
    if (product.id_category) {
      acc[product.id_category] = (acc[product.id_category] || 0) + 1;
    }
    return acc;
  }, {});

  // Gán số lượng sản phẩm vào danh sách thể loại
  return categoryList.map((item: { _id: string; name_type: string }) => ({
    id: item._id,
    name_type: item.name_type,
    product_count: productCountMap[item._id] || 0, // mặc định là 0 nếu không có sản phẩm
  }));
};

const CategoryPage = () => {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // Xử lý thêm thể loại
  const handleAddCategory = async (newCategory: { category: string }) => {
    try {
      const res = await fetch("https://gshopbackend.onrender.com/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_type: newCategory.category }),
      });

      if (!res.ok) throw new Error("Thêm thể loại thất bại");

      refetch();
      setIsAddOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
      alert("Có lỗi xảy ra khi thêm thể loại. Vui lòng thử lại.");
    }
  };

  // Xử lý cập nhật thể loại
  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      const res = await fetch(`https://gshopbackend.onrender.com/category/update/${updatedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_type: updatedCategory.name_type }),
      });
      if (!res.ok) throw new Error("Cập nhật thể loại thất bại");

      refetch();
      setIsEditOpen(false);
      toast("Cập nhật thể loại thành công!", {
        duration: 2000,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Lỗi cập nhật thể loại:", error);
      toast("Có lỗi xảy ra khi cập nhật thể loại. Vui lòng thử lại.")
    }
  };

  // Hàm mở dialog chỉnh sửa với thể loại hiện tại
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsEditOpen(true);
  };

  // Tùy chỉnh cột để truyền hàm handleEdit cho cột actions
  const columns = baseColumns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: { row: { original: Category } }) => (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => handleEditCategory(row.original)}
          >
            Chỉnh sửa
          </button>
        ),
      };
    }
    return col;
  });

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Không thể tải danh sách thể loại.</p>;

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <p className="text-lg">{data?.length || 0} thể loại Gundam</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} className="border border-gray-500">
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsAddOpen(true)} className="border border-red-500">
            <div className="mr-1">
              <Plus size={16} />
            </div>
            Thêm thể loại
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data} />

      <AddCategoryDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} onSubmit={handleAddCategory} />
      {currentCategory && (
        <EditCategoryDialog
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          category={currentCategory}
          onUpdate={handleUpdateCategory}
        />
      )}
    </div>
  );
};

export default CategoryPage;
