"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddCategoryDialog from "@/components/Dialog/AddCategoryDialog";
import { columns } from "./columns";


// Fetch API function
const fetchCategories = async () => {
  const res = await fetch("https://gshopbackend.onrender.com/category/list");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const result = await res.json();

  const categoryList = result.category || result.data || result;
  if (!Array.isArray(categoryList)) throw new Error("Unexpected API format");

  // Format date for cooperation_day
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return categoryList.map((item: { name_type: string; email?: string; phone_number?: string; representative?: string; cooperation_date?: string; address?: string }) => ({
    name_type: item.name_type,
    email: item.email || "-",
    sdt: item.phone_number || "-",
    investor_name: item.representative || "-",
    sales: "-", // Add a default value for sales
    cooperation_day: item.cooperation_date ? formatDate(item.cooperation_date) : "-",
    address: item.address || "-",
  }));
};

const CategoryPage = () => {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleAddCategory = async (newCategory: { category: string }) => {
    try {
        const res = await fetch("https://gshopbackend.onrender.com/category/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name_type: newCategory.category }), // Chỉnh đúng key theo API
        });

        if (!res.ok) throw new Error("Thêm thể loại thất bại");

        refetch(); // Cập nhật lại danh sách sau khi thêm thành công
        setIsOpen(false);
    } catch (error) {
        console.error("Lỗi khi thêm thể loại:", error);
        alert("Có lỗi xảy ra khi thêm thể loại. Vui lòng thử lại.");
    }
};


  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Không thể tải danh sách thể loại.</p>;

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <p className="text-lg">{data?.length || 0} thể loại Gundam</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <div className="mr-1">
              <Plus size={16} />
            </div>
            Thêm thể loại
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data} />

      <AddCategoryDialog isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddCategory} />
    </div>
  );
};

export default CategoryPage;





// "use client"
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import PageTitle from "@/components/PageTitle";
// import { DataTable } from "@/components/ui/DataTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import AddCategoryDialog from "@/components/Dialog/AddCategoryDialog";

// // Define Category type
// type Category = {
//   name_type: string;
//   investor_name: string;
//   sdt: string;
//   email: string;
//   sales: string;
// };

// // Fetch API function
// const fetchCategories = async () => {
//   const res = await fetch("https://gshopbackend.onrender.com/category/list");
//   if (!res.ok) throw new Error("Không thể tải danh sách thể loại");

//   const result = await res.json();
//   const categoryList = result.category || result.data || result;

//   if (!Array.isArray(categoryList)) throw new Error("Dữ liệu thể loại không hợp lệ");

//   return categoryList.map((item: { name_type: string }) => ({
//     name_type: item.name_type,
//     investor_name: "-",
//     sdt: "-",
//     email: "-",
//     sales: "-",
//   }));
// };

// const CategoryPage = () => {
//   const { data = [], isLoading, isError, refetch } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//   });

//   const [isOpen, setIsOpen] = useState(false);

//   const handleAddCategory = async (categoryName: string) => {
//       try {
//         const res = await fetch("https://gshopbackend.onrender.com/category/create", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name_type: categoryName }),
//         });
  
//         if (!res.ok) throw new Error("Thêm thể loại thất bại");
  
//         // Sau khi thêm thể loại thành công, làm mới danh sách
//         refetch();
//         setIsOpen(false); // Đóng dialog
//       } catch (error) {
//         console.error("Lỗi khi thêm thể loại:", error);
//         alert("Có lỗi xảy ra khi thêm thể loại. Vui lòng thử lại.");
//       }
//     };

//   if (isLoading) return <p>Đang tải dữ liệu...</p>;
//   if (isError) return <p>Không thể tải danh sách thể loại.</p>;

//   return (
//     <div>
//       <PageTitle title="Quản lý thể loại Gundam" />
//       <div className="flex flex-row align-top my-5 justify-between">
//         <p className="text-lg">{data?.length || 0} loại Gundam</p>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => refetch()}>
//             Làm mới danh sách
//           </Button>
//           <Button variant="destructive" onClick={() => setIsOpen(true)}>
//             <Plus size={16} className="mr-1" />
//             Thêm thể loại
//           </Button>

//           <AddCategoryDialog isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddCategory} />
//         </div>
//       </div>
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// };

// export default CategoryPage;

// export const columns: ColumnDef<Category>[] = [
//   { accessorKey: "name_type", header: "Thể loại" },
//   { accessorKey: "investor_name", header: "Tên nhà đầu tư" },
//   { accessorKey: "email", header: "Email" },
//   { accessorKey: "sdt", header: "Số điện thoại" },
//   { accessorKey: "sales", header: "Doanh số" },
// ];