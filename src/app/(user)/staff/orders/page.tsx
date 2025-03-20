"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ViewOrderDialog from "@/components/Dialog/ViewOrderDialog";

const API_ORDERS = "https://gshopbackend.onrender.com/order/list";
const API_USERS = "https://gshopbackend.onrender.com/user/list";
//const API_ADDRESS = "https://gshopbackend.onrender.com/address/detail/";
//const API_PAYMENT = "https://gshopbackend.onrender.com/payment_method/detail/";

interface Order {
  id: string;
  id_user: string;
  id_payment: string;
  id_address: string;
  total_price: number;
  shipping_fee: number;
  amount: number;
  order_date: string;
  status: string;
}


const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  ///const [addresses, setAddresses] = useState<{ [key: string]: string }>({});
  //const [payments, setPayments] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          total_price: number; 
          shipping_fee: number; 
          date: string; 
          status: string; 
        }) => ({
          id: order._id,
          id_user: order.id_user,
          id_payment: order.id_payment,
          id_address: order.id_address,
          total_price: order.total_price,
          shipping_fee: order.shipping_fee,
          amount: order.total_price + order.shipping_fee,
          order_date: order.date,
          status: order.status,
        }));
  
        setOrders(apiData);
        //fetchAddresses(apiData);
        //fetchPayments(apiData);
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

  // const fetchAddresses = async (orders: Order[]) => {
  //   try {
  //     const addressMap: { [key: string]: string } = {};

  //     await Promise.all(
  //       orders.map(async (order) => {
  //         try {
  //           const res = await axios.get(API_ADDRESS + order.id_address);
  //           if (res.data.status && res.data.data) {
  //             const addr = res.data.data;
  //             addressMap[order.id_address] = `${addr.detail}, ${addr.commune}, ${addr.district}, ${addr.province}`;
  //           }
  //         } catch (error) {
  //           console.error(`Lỗi khi lấy địa chỉ ID ${order.id_address}:`, error);
  //         }
  //       })
  //     );

  //     setAddresses(addressMap);
  //   } catch (err) {
  //     console.error("Lỗi khi gọi API địa chỉ:", err);
  //   }
  // };

  // const fetchPayments = async (orders: Order[]) => {
  //   try {
  //     const paymentMap: { [key: string]: string } = {};

  //     await Promise.all(
  //       orders.map(async (order) => {
  //         try {
  //           const res = await axios.get(API_PAYMENT + order.id_payment);
  //           if (res.data.status && res.data.data) {
  //             paymentMap[order.id_payment] = res.data.data.name;
  //           }
  //         } catch (error) {
  //           console.error(`Lỗi khi lấy phương thức thanh toán ID ${order.id_payment}:`, error);
  //         }
  //       })
  //     );

  //     setPayments(paymentMap);
  //   } catch (err) {
  //     console.error("Lỗi khi gọi API phương thức thanh toán:", err);
  //   }
  // };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      (users[order.id_user] && users[order.id_user].toLowerCase().includes(search.toLowerCase())) ||
      false // Removed addresses filtering as addresses is not defined
  );

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <p className="bg-gray-500 text-white rounded-sm py-2 px-4 flex flex-row gap-2">
          {filteredOrders.length || 0} đơn hàng
        </p>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo ID, khách hàng hoặc địa chỉ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white w-72"
            />
          </div>
          <Button variant="outline" onClick={fetchOrders}>Làm mới</Button>
        </div>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

    {!loading && !error ? (
      <DataTable
        columns={columns(users, {}, {}, handleEdit)}
        data={filteredOrders}
      />
    ) : null}


      <ViewOrderDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        order={selectedOrder}
        users={users}
        addresses={{}} // Pass empty object or appropriate data
        payments={{}}  // Pass empty object or appropriate data
        refreshOrders={fetchOrders}  // <-- Truyền hàm làm mới danh sách đơn hàng
      />


    </div>
  );
};

export default OrderPage;

const columns = (
  users: { [key: string]: string },
  addresses: { [key: string]: string },
  payments: { [key: string]: string },
  onEdit: (order: Order) => void
): ColumnDef<Order>[] => [
  { accessorKey: "id", header: "Mã đơn hàng" },
  { 
    accessorKey: "id_user", 
    header: "Khách hàng", 
    cell: ({ getValue }) => users[getValue() as string] || "Không xác định" 
  },
  // { 
  //   accessorKey: "total_price", 
  //   header: "Tổng tiền sản phẩm", 
  //   cell: ({ getValue }) => `${(getValue() as number).toLocaleString("vi-VN")} đ`
  // },
  { 
    accessorKey: "amount", 
    header: "Tổng tiền thanh toán", 
    cell: ({ getValue }) => `${(getValue() as number).toLocaleString("vi-VN")} đ`
  },
  { accessorKey: "order_date", header: "Ngày đặt" },
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
      return <span className={`px-2 py-1 rounded ${statusColors[status] || "bg-gray-200"}`}>{status}</span>;
    },
  },
  { 
    accessorKey: "actions", 
    header: "", 
    cell: ({ row }) => 
      <Edit size={20} className="text-blue-500 cursor-pointer" onClick={() => onEdit(row.original)} /> 
  },
];
