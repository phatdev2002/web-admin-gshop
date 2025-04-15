'use client'
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import AddStaffDialog from "@/components/Dialog/AddStaffDialog";
import EditStaffDialog from "@/components/Dialog/EditStaffDialog";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  avatar: string;
  password: string;
}

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const fetchEmployees = () => {
    setLoading(true);
    fetch("https://gshopbackend-1.onrender.com/user/list_staff")
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setEmployees(data.data);
        } else {
          setError("Không thể tải dữ liệu nhân viên.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setError("Không thể tải dữ liệu.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = () => {
    if (!employeeToDelete) return;
    fetch(`https://gshopbackend-1.onrender.com/user/update-staff/${employeeToDelete._id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          fetchEmployees();
        } else {
          alert("Xóa nhân viên thất bại.");
        }
      })
      .catch(() => alert("Lỗi kết nối đến server."));
    setEmployeeToDelete(null);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{3})(?=\d)/g, '$1 ');
  };

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <h1 className="bg-white p-2 text-black rounded-sm text-sm flex flex-row ">Tổng nhân viên: {filteredEmployees.length}</h1>
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
          <AddStaffDialog onStaffAdded={fetchEmployees} />
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && filteredEmployees.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <CardContent key={employee._id} className="relative p-4 border rounded-lg shadow-md">
              <img 
                src={employee.avatar && employee.avatar.startsWith('http') ? employee.avatar : '/img/avtstaff.jpg'} 
                alt={employee.name} 
                width={80} 
                height={80} 
                className="rounded-full mx-auto mb-4 w-20 h-20 object-cover" 
              />

              <h2 className="text-center text-lg font-semibold">{employee.name}</h2>
              <p className="flex items-center justify-center text-gray-700">
                <Mail className="mr-2" /> {employee.email}
              </p>
              <p className="flex items-center justify-center text-gray-700">
                <Phone className="mr-2" /> {formatPhoneNumber(employee.phone_number)}
              </p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  onClick={() => setSelectedEmployee(employee)}
                  className="bg-blue-500 hover:bg-blue-600 w-7 h-7 text-white p-1 rounded"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setEmployeeToDelete(employee)}
                  className="bg-red-500 hover:bg-red-600 text-white w-7 h-7 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          ))}
        </div>
      )}

      {!loading && !error && filteredEmployees.length === 0 && (
        <p className="text-gray-500 text-center">Không có nhân viên nào.</p>
      )}

      {selectedEmployee && (
        <EditStaffDialog
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdated={fetchEmployees}
        />
      )}

      {employeeToDelete && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa nhân viên ${employeeToDelete.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setEmployeeToDelete(null)}
        />
      )}
    </div>
  );
}
