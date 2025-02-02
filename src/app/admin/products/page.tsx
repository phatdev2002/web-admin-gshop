"use client";

import React, { useState } from "react";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Blocks, Plus, Search, UserSquareIcon } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AddProductDialog from "@/components/Dialog/AddProductDialog";

// API Fetch Functions
const fetchCategories = async () => {
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

const fetchProducts = async (categories: { [key: string]: string }) => {
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

const ProductPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = {}, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: products = [], isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["products", categories],
    queryFn: () => fetchProducts(categories),
    enabled: Object.keys(categories).length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Lọc sản phẩm theo tên
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageTitle title="Quản lý sản phẩm" />

      {/* Thanh công cụ */}
      <div className="flex flex-row align-top my-5 justify-between">
        <p className="text-lg">{filteredProducts.length} sản phẩm</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetchProducts()}>
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-1" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Thanh tìm kiếm & Nút điều hướng */}
      <div className="flex flex-row justify-between my-5">
        <div>
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm"
                className="pl-8 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div>
          <Link href="/admin/products/category">
            <Button variant="outline" className="mr-2">
              <Blocks size={16} className="mr-1" />
              Loại Gundam
            </Button>
          </Link>
          <Link href="/admin/products/supplier">
            <Button variant="outline">
              <UserSquareIcon size={16} className="mr-1" />
              Nhà cung cấp
            </Button>
          </Link>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      {isLoadingCategories || isLoadingProducts ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <DataTable columns={columns} data={filteredProducts} />
      )}

      {/* Dialog thêm sản phẩm */}
      <AddProductDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onSubmit={(newProduct) => console.log("Sản phẩm mới:", newProduct)}
      />
    </div>
  );
};

export default ProductPage;

// Định nghĩa kiểu dữ liệu sản phẩm
export type Product = {
  name: string;
  id_category: string;
  price: number;
  status: "Còn hàng" | "Hết hàng";
  quantity: number;
  rate: string;
};

// Định nghĩa cột cho bảng
export const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "Sản phẩm" },
  { accessorKey: "id_category", header: "Danh mục" },
  { accessorKey: "price", header: "Đơn giá" },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div
        className={`font-medium w-fit px-4 py-2 rounded-lg ${
          row.getValue("status") === "Hết hàng" ? "bg-red-200" : "bg-green-200"
        }`}
      >
        {row.getValue("status")}
      </div>
    ),
  },
  { accessorKey: "quantity", header: "Số lượng" },
  { accessorKey: "rate", header: "Đánh giá" },
];
