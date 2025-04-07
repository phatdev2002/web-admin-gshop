"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Blocks, Box, Plus } from "lucide-react";
import AddSupplierDialog from "@/components/Dialog/AddSupplierDialog";
import { columns } from "./colums";
import Link from "next/link";


// Loại dữ liệu nhà cung cấp
export type Supplier = {
  supplier: string;
  email: string;
  sdt: string;
  investor_name: string;
  cooperation_day: string;
  address: string;
};



// Fetch API function
const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    const res = await fetch("https://gshopbackend-1.onrender.com/supplier/list");
    if (!res.ok) throw new Error("Failed to fetch suppliers");

    const result = await res.json();
    const supplierList = result.supplier || result.data || result;

    if (!Array.isArray(supplierList)) throw new Error("Unexpected API format");

    // Format date for cooperation_day
    const formatDate = (date: string) => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    return supplierList.map((item: { 
      name: string; 
      email?: string; 
      phone_number?: string; 
      representative?: string; 
      cooperation_date?: string; 
      address?: string; 
    }) => ({
      supplier: item.name,
      email: item.email || "-",
      sdt: item.phone_number || "-",
      investor_name: item.representative || "-",
      cooperation_day: item.cooperation_date ? formatDate(item.cooperation_date) : "-",
      address: item.address || "-",
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    return [];
  }
};

const SupplierPage = () => {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Xử lý thêm nhà cung cấp mới (Chưa tích hợp API)
  const handleAddSupplier = (newSupplier: Supplier) => {
    console.log("New Supplier:", newSupplier);
    setIsOpen(false);
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p className="text-red-500">Không thể tải danh sách nhà cung cấp.</p>;

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <p className="bg-white p-2 text-black rounded-sm text-sm flex flex-row ">Nhà cung cấp: {data.length}</p>
        <div>
          <Link href="/admin/products/" className="text-red-600 ">
            <Button variant="outline" className="mr-2 ">
              <Box size={16} className="mr-1"/>
              Xem sản phẩm
            </Button>
          </Link>
          <Link href="/admin/products/category"  className="text-blue-600">
            <Button variant="outline" className="">
              <Blocks size={16} className="mr-1"  />
              Loại Gundam
            </Button>
          </Link>
        </div>
        
      </div>
      <div className="flex justify-end mb-4 gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <Plus size={16} className="mr-1" />
            Thêm nhà cung cấp
          </Button>
        </div>

      <DataTable columns={columns} data={data} />

      {/* Dialog thêm nhà cung cấp */}
      <AddSupplierDialog isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddSupplier} />
    </div>
  );
};

export default SupplierPage;
