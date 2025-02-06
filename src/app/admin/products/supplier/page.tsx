"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddSupplierDialog from "@/components/Dialog/AddSupplierDialog";

// Fetch API function
const fetchSuppliers = async () => {
  const res = await fetch("https://gshopbackend.onrender.com/supplier/list");
  if (!res.ok) throw new Error("Failed to fetch suppliers");
  const result = await res.json();

  const supplierList = result.supplier || result.data || result;
  if (!Array.isArray(supplierList)) throw new Error("Unexpected API format");

  // Format date for cooperation_day
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return supplierList.map((item: { name: string; email?: string; phone_number?: string; representative?: string; cooperation_date?: string; address?: string }) => ({
    supplier: item.name,
    email: item.email || "-",
    sdt: item.phone_number || "-",
    investor_name: item.representative || "-",
    cooperation_day: item.cooperation_date ? formatDate(item.cooperation_date) : "-",
    address: item.address || "-",
  }));
};

const SupplierPage = () => {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleAddSupplier = (newSupplier: Supplier) => {
    console.log("New Supplier:", newSupplier);
    // Here, you can make the API call to add the supplier
    setIsOpen(false);
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Không thể tải danh sách nhà cung cấp.</p>;

  return (
    <div>
      <PageTitle title="Quản lý nhà cung cấp" />
      <div className="flex flex-row align-top my-5 justify-between">
        <p className="text-lg">{data?.length || 0} nhà cung cấp</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <div className="mr-1">
              <Plus size={16} />
            </div>
            Thêm nhà cung cấp
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data} />

      {/* Add Supplier Dialog */}
      <AddSupplierDialog isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={handleAddSupplier} />
    </div>
  );
};

export default SupplierPage;

// Loại dữ liệu
export type Supplier = {
  supplier: string;
  email: string;
  sdt: string;
  investor_name: string;
  cooperation_day: string;
  address: string;
};

// Định nghĩa cột cho bảng
export const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "supplier", header: "Nhà cung cấp" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "sdt", header: "Số điện thoại" },
  { accessorKey: "investor_name", header: "Tên người đại diện" },
  { accessorKey: "cooperation_day", header: "Ngày hợp tác" },
  { accessorKey: "address", header: "Địa chỉ" },
];
