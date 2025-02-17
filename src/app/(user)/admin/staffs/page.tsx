'use client'
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, Plus } from "lucide-react";
import { CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton"; // Thêm Skeleton

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
}

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái error

  useEffect(() => {
    fetch("https://gshopbackend.onrender.com/user/list")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setEmployees(data.data.filter((employee: Employee) => employee.role === "staff"));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setError("Không thể tải dữ liệu.");
        setLoading(false);
      });
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <h1 className="text-lg">{filteredEmployees.length} nhân viên</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white w-64"
            />
          </div>
          <Button className="bg-red-500 text-white">
            <Plus size={16} className="mr-1" /> Thêm nhân viên
          </Button>
        </div>
      </div>

      {/* Hiển thị khi đang tải dữ liệu */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {/* Hiển thị khi có lỗi */}
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      {/* Hiển thị nếu có nhân viên */}
      {!loading && !error && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <CardContent key={employee._id}>
              <Image src={"/img/avtstaff.jpg"} alt={employee.name} width={80} height={80} className="rounded-full mx-auto mb-4" />
              <h2 className="text-center text-lg font-semibold">{employee.name}</h2>
              <p className="flex items-center justify-center text-gray-700">
                <Mail className="mr-2" /> {employee.email}
              </p>
              <p className="flex items-center justify-center text-gray-700">
                <Phone className="mr-2" /> {employee.phone_number}
              </p>
            </CardContent>
          ))}
        </div>
      )}

      {/* Hiển thị khi không có dữ liệu */}
      {!loading && !error && filteredEmployees.length === 0 && (
        <p className="text-gray-500 text-center">Không có nhân viên nào.</p>
      )}
    </div>
  );
}
