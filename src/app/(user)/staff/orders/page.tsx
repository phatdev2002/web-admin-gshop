"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ViewOrderDialog from "@/components/Dialog/ViewOrderDialog";
import { BASE_URL } from "@/constants";

const API_ORDERS = `${BASE_URL}/order/list`;
const API_USERS = `${BASE_URL}/user/list`;

interface Order {
  id: string;
  id_user: string;
  id_payment: string;
  id_address: string;
  total_price: number;
  phone: string;
  shipping_fee: number;
  name: string; 
  amount: number;
  order_date: string;
  status: string;
  address?: string; // Make address optional if it's not always provided
}
function parseVNDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); // Added state for selected status

  const handleStatusClick = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null); // Reset if the same status is clicked again
    } else {
      setSelectedStatus(status); // Set the new selected status
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(API_ORDERS);
      if (response.data.status) {
        const apiData = response.data.data.map((order: {
          _id: string;
          id_user: string;
          id_payment: string;
          id_address: string;
          address?: string;
          name: string;
          phone: string;
          total_price: number;
          shipping_fee: number;
          date: string;
          status: string;
        }) => ({
          id: order._id,
          id_user: order.id_user,
          id_payment: order.id_payment,
          id_address: order.id_address,
          phone: order.phone,
          name: order.name, // Lấy trực tiếp từ API nếu có
          address: order.address, // Lấy trực tiếp từ API nếu có
          total_price: order.total_price,
          shipping_fee: order.shipping_fee,
          amount: order.total_price,
          order_date: order.date,
          status: order.status,
        })).reverse();
        setOrders(apiData);
      } else {
        setError("Dữ liệu không hợp lệ từ server.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API đơn hàng:", err);
      setError("Không thể tải dữ liệu đơn hàng! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_USERS);
      if (response.data.status) {
        const userMap: { [key: string]: string } = {};
        response.data.data.forEach((user: { _id: string; name: string }) => {
          userMap[user._id] = user.name;
        });
        setUsers(userMap);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API khách hàng:", err);
    }
  };

  // Filtering orders by both search and selected status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      (users[order.id_user]?.toLowerCase().includes(search.toLowerCase())) ||
      (order.address?.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      !selectedStatus || order.status === selectedStatus; // If no status selected, show all orders

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-row align-top mb-4 justify-between">
        <p className="bg-white p-2 text-black rounded-sm text-sm flex flex-row">
          Tổng đơn hàng: {filteredOrders.length || 0}
        </p>
        <Button variant="outline" onClick={fetchOrders}>
          Làm mới danh sách
        </Button>
      </div>
      <div className="flex gap-2 justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo ID, tên khách hàng hoặc địa chỉ"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-white w-96"
          />
        </div>
        <div className="flex gap-2 justify-between">
        <div>
          <button
            className={`${
              selectedStatus === "Đang xử lý" ? "bg-red-500 text-white" : "bg-white text-red-500"
            }  px-4 py-1 rounded-2xl mr-2`}
            onClick={() => handleStatusClick("Đang xử lý")}
          >
            Đang xử lý {orders.filter(order => order.status === "Đang xử lý").length}
          </button>
          <button
            className={`${
              selectedStatus === "Đang giao hàng" ? "bg-orange-700 text-white" : "bg-white text-orange-500"
            }  px-4 py-1 rounded-2xl mr-2`}
            onClick={() => handleStatusClick("Đang giao hàng")}
          >
            Đang giao hàng {orders.filter(order => order.status === "Đang giao hàng").length}
          </button>
          <button
            className={`${
              selectedStatus === "Đã giao" ? "bg-green-700 text-white" : "bg-white text-green-500"
            }  px-4 py-1 rounded-2xl mr-2`}
            onClick={() => handleStatusClick("Đã giao")}
          >
            Đã giao {orders.filter(order => order.status === "Đã giao").length}
          </button>
          <button
            className={`${
              selectedStatus === "Đã hủy" ? "bg-gray-700 text-white" : "bg-white text-gray-500"
            }  px-4 py-1 rounded-2xl`}
            onClick={() => handleStatusClick("Đã hủy")}
          >
            Đã hủy {orders.filter(order => order.status === "Đã hủy").length}
          </button>
        </div>
        
      </div>
      </div>
      

      

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <DataTable
          columns={columns(users, handleEdit)}
          data={filteredOrders}
        />
      )}

      <ViewOrderDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        order={selectedOrder ? { ...selectedOrder, address: selectedOrder.address,phone: selectedOrder.phone, name: selectedOrder.name|| "" } : null}
        
        users={users}
        addresses={{}} // tạm thời nếu chưa dùng
        payments={{}}  // tạm thời nếu chưa dùng
        refreshOrders={fetchOrders}
      />
    </div>
  );
};

export default OrderPage;

// ----------------------------
// Cột cho bảng đơn hàng
const columns = (
  users: { [key: string]: string },
  onEdit: (order: Order) => void
): ColumnDef<Order>[] => [
  { accessorKey: "id", header: "Mã đơn hàng" },
  {
    accessorKey: "name",
    header: "Khách hàng",
  },
  
  {
    accessorKey: "amount",
    header: "Tổng tiền thanh toán",
    cell: ({ getValue }) =>
      `${(getValue() as number).toLocaleString("vi-VN")} đ`,
  },
  {
    accessorKey: "order_date",
    header: "Ngày đặt",
    cell: ({ getValue }) => {
      const rawDate = getValue() as string;
      const date = parseVNDate(rawDate);
      if (isNaN(date.getTime())) return "Không rõ";
      return date.toLocaleDateString("vi-VN");
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = parseVNDate(rowA.getValue(columnId));
      const dateB = parseVNDate(rowB.getValue(columnId));
      return dateB.getTime() - dateA.getTime(); // Sắp xếp giảm dần
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusColors: { [key: string]: string } = {
        "Đã giao": "bg-green-500 text-white",
        "Đang xử lý": "bg-red-500 text-white",
        "Đang giao hàng": "bg-orange-400 text-black",
      };
      return (
        <span
          className={`px-2 py-1 rounded ${statusColors[status] || "bg-gray-200"}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <Edit
        size={20}
        className="text-blue-500 cursor-pointer"
        onClick={() => onEdit(row.original)}
      />
    ),
  },
];
