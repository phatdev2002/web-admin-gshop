"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Box, Edit, Plus, UserSquareIcon } from "lucide-react";
import AddCategoryDialog from "@/components/Dialog/AddCategoryDialog";
import EditCategoryDialog from "@/components/Dialog/ViewCategoryDialog";
import { columns as baseColumns, Category } from "./columns";
import { toast } from "sonner";
import Link from "next/link";

async function fetchCategories() {
  try {
    const categoryRes = await fetch("https://gshopbackend-1.onrender.com/category/list");
    if (!categoryRes.ok) throw new Error("Failed to fetch categories");
    const categoryData = await categoryRes.json();
    const categoryList = categoryData.category || categoryData.data || categoryData;
    if (!Array.isArray(categoryList)) throw new Error("Unexpected API format for categories");

    const productRes = await fetch("https://gshopbackend-1.onrender.com/product/list");
    if (!productRes.ok) throw new Error("Failed to fetch products");
    const productData = await productRes.json();
    const productList = productData.data || productData.products || productData;
    if (!Array.isArray(productList)) throw new Error("Unexpected API format for products");

    const productCountMap = productList.reduce((acc: Record<string, number>, product: { id_category: string }) => {
      if (product.id_category) {
        acc[product.id_category] = (acc[product.id_category] || 0) + 1;
      }
      return acc;
    }, {});

    return categoryList.map((item: { _id: string; name_type: string }) => ({
      id: item._id,
      name_type: item.name_type,
      product_count: productCountMap[item._id] || 0,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const CategoryPage = () => {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const handleAddCategory = async (newCategory: { category: string }) => {
    try {
      const res = await fetch("https://gshopbackend-1.onrender.com/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_type: newCategory.category }),
      });

      if (!res.ok) throw new Error("Thêm thể loại thất bại");

      toast.success("Thêm thể loại thành công!", {
        duration: 2000,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
      toast.error("Có lỗi xảy ra khi thêm thể loại. Vui lòng thử lại.", {
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    } finally {
      refetch();
      setIsAddOpen(false);
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      const res = await fetch(`https://gshopbackend-1.onrender.com/category/update/${updatedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_type: updatedCategory.name_type }),
      });
      if (!res.ok) throw new Error("Cập nhật thể loại thất bại");

      toast.success("Cập nhật thể loại thành công!", {
        duration: 2000,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Lỗi cập nhật thể loại:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thể loại. Vui lòng thử lại.", {
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    } finally {
      refetch();
      setIsEditOpen(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsEditOpen(true);
  };

  const getColumns = (handleEditCategory: (category: Category) => void) => {
    return baseColumns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }: { row: { original: Category } }) => (
            <button
              className="text-blue-600 hover:underline"
              onClick={() => handleEditCategory(row.original)}
            >
              <Edit size={20} className="text-blue-500 cursor-pointer" />
            </button>
          ),
        };
      }
      return col;
    });
  };

  const columns = getColumns(handleEditCategory);

  if (isLoading) return <div className="flex justify-center items-center h-64">Đang tải dữ liệu...</div>;
  if (isError) return <div className="text-red-500 text-center">Không thể tải danh sách thể loại. Vui lòng thử lại.</div>;
  const ClassNames = 'text-black';
  return (
    <div className={ClassNames}>
      <div className="flex flex-row align-top mb-4 justify-between">
        <p className="bg-white p-2 text-black rounded-sm text-sm flex flex-row ">Thể loại Gundam: {data?.length || 0}</p>
        <div>
          <Link href="/admin/products/" className="text-red-600 ">
            <Button variant="outline" className="mr-2 ">
              <Box size={16} className="mr-1"/>
              Xem sản phẩm
            </Button>
          </Link>
          <Link href="/admin/products/supplier"  className="text-green-600">
            <Button variant="outline" className="">
              <UserSquareIcon size={16} className="mr-1"  />
              Nhà cung cấp
            </Button>
          </Link>
        </div>
        
      </div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} className="border-gray-500">
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsAddOpen(true)} className="border-red-500">
            <Plus size={16} className="mr-1" />
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