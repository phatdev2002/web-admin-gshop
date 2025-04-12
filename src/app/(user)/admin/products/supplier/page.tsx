"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Blocks, Box, Plus } from "lucide-react";
import AddSupplierDialog from "@/components/Dialog/AddSupplierDialog";
import { columns } from "./colums";
import Link from "next/link";
import EditSupplierDialog from "@/components/Dialog/EditSupplierDialog";


// Loại dữ liệu nhà cung cấp
export type Supplier = {
  _id: string;
  supplier: string;
  email: string;
  sdt: string;
  investor_name: string;
  cooperation_day: string;
  address: string;
  onEdit?: (supplier: Supplier) => void;
};



// Fetch API function
  const fetchSuppliers = async (): Promise<Supplier[]> => {
    try {
      const res = await fetch("https://gshopbackend-1.onrender.com/supplier/list");
      if (!res.ok) throw new Error("Failed to fetch suppliers");

      const result = await res.json();

  console.log("Kết quả từ API:", result); // debug ở đây

  let supplierList = [];

  if (Array.isArray(result)) {
    supplierList = result;
  } else if (Array.isArray(result.supplier)) {
    supplierList = result.supplier;
  } else if (Array.isArray(result.data)) {
    supplierList = result.data;
  } else {
    console.warn("API không trả về mảng hợp lệ:", result);
    return [];
  }


    // Format date for cooperation_day
    const formatDate = (date: string) => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    return supplierList.map((item: { 
      _id: string;
      name: string; 
      email?: string; 
      phone_number?: string; 
      representative?: string; 
      cooperation_date?: string; 
      address?: string; 
    }) => ({
      _id: item._id,
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
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Supplier | null>(null);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const [isOpen, setIsOpen] = useState(false);
  // In SupplierPage component
  const dataWithAction = Array.isArray(data)
  ? data.map((item) => ({
      ...item,
      onEdit: (supplier: Supplier) => {
        setEditData(supplier);
        setIsOpenEdit(true);
      },
    }))
  : [];

  


  

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

        <DataTable columns={columns} data={dataWithAction} />


      {/* Dialog thêm nhà cung cấp */}
        <AddSupplierDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSubmit={() => {
            refetch();
          }}
        />
        <EditSupplierDialog
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          initialData={editData || undefined}
          onSubmit={() => {
            refetch();
          }}
        />


    </div>
  );
};

export default SupplierPage;
