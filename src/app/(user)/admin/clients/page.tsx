"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Thêm Skeleton từ ShadCN

// Fetch API function
const fetchClients = async () => {
  const res = await fetch("https://gshopbackend.onrender.com/user/list");
  if (!res.ok) throw new Error("Failed to fetch clients");
  const result = await res.json();

  const clientList = result.client || result.data || result;
  if (!Array.isArray(clientList)) throw new Error("Unexpected API format");

  return clientList.map((item: { name: string; email?: string; phone_number?: string; role?: string }) => ({
    clientname: item.name,
    email: item.email || "-",
    sdt: item.phone_number || "-",
    role: item.role || "-",
  }));
};

const ClientPage = () => {
  const [search, setSearch] = useState("");
  const { data = [], isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 60000, // Dữ liệu không gọi lại trong 60 giây
  });

  // Lọc chỉ những khách hàng có role là 'user'
  const filteredData = data.filter((client) => client.role.toLowerCase() === 'user' && 
    client.clientname.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <p className="text-lg">{filteredData?.length || 0} khách hàng</p>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white w-64"
            />
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Đang tải..." : "Làm mới danh sách"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : isError ? (
        <p className="text-red-500">Không thể tải danh sách khách hàng.</p>
      ) : filteredData.length > 0 ? (
        <DataTable columns={columns} data={filteredData} />
      ) : (
        <p className="text-gray-500 text-center">Không tìm thấy khách hàng nào .</p>
      )}
    </div>
  );
};

export default ClientPage;

// Loại dữ liệu
export type Client = {
  clientname: string;
  email: string;
  sdt: string;
  role: string;
};

// Định nghĩa cột cho bảng
export const columns: ColumnDef<Client>[] = [
  { accessorKey: "clientname", header: "Tên khách hàng" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "sdt", header: "Số điện thoại" },
  { accessorKey: "role", header: "Vai trò" },
];
