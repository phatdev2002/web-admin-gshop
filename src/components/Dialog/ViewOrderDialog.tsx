"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Dialog, DialogHeader} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "@/app/(user)/admin/orders/columns";

const API_ORDER_DETAIL = "https://gshopbackend-1.onrender.com/detail_order/list-by-order/";
const API_PRODUCTS = "https://gshopbackend-1.onrender.com/product/list";
const API_USERS = "https://gshopbackend-1.onrender.com/user/list";
const API_UPDATE_ORDER = "https://gshopbackend-1.onrender.com/order/update/";



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
  address?: string; // Make address optional if it's not always provided
}


interface OrderDetail {
  id_product: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  product_image: string;
}

interface User {
  _id: string;
  name: string;
  phone_number: string;
}

interface ViewOrderDialogProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    users: { [key: string]: string };
    addresses: { [key: string]: string };
    payments: { [key: string]: string };
    refreshOrders: () => void; 
  }
  

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({ open, onClose, order, refreshOrders }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<{ [key: string]: string }>({});
  const [usersList, setUsersList] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(order?.status || "Đang xử lý");
  const [, setUpdating] = useState(false);
  

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_PRODUCTS);
      if (response.data.status) {
        const productMap: { [key: string]: string } = {};
        response.data.data.forEach((product: { _id: string; name: string }) => {
          productMap[product._id] = product.name;
        });
        setProducts(productMap);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_USERS);
      if (response.data.status) {
        const userMap: { [key: string]: User } = {};
        response.data.data.forEach((user: User) => {
          userMap[user._id] = user;
        });
        setUsersList(userMap);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  // Định nghĩa fetchOrderDetails với useCallback
  const fetchOrderDetails = useCallback(async (orderId: string) => {
  setLoading(true);
  setError("");
  try {
    const response = await axios.get(API_ORDER_DETAIL + orderId);
    if (response.data.status) {
      const details = await Promise.all(response.data.data.map(async (item: { id_product: string; quantity: number; unit_price: number; address: string }) => {
        const imageResponse = await axios.get(`https://gshopbackend-1.onrender.com/image_product/list-images/${item.id_product}`);
        const imageUrl = imageResponse.data.status && Array.isArray(imageResponse.data.data) && imageResponse.data.data.length > 0
          ? imageResponse.data.data[0].image[1]
          : '';
        return {
          id_product: item.id_product,
          product_name: products[item.id_product] || "Không xác định",
          quantity: item.quantity,
          unit_price: item.unit_price,
          product_image: imageUrl,
          address: item.address,
        };
      }));

      setOrderDetails(details);

    } else {
      setOrderDetails([]);
    }
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    setError("Không thể tải chi tiết đơn hàng!");
  } finally {
    setLoading(false);
  }
}, [products]);

  
  

// Sử dụng trong useEffect
useEffect(() => {
  if (order && open) {
    fetchOrderDetails(order.id);
    fetchPaymentDetail(order.id_payment);
    setStatus(order.status);
  }
}, [order, open, fetchOrderDetails]);

// Định nghĩa handleStatusChange

  const handleStatusChange = async (newStatus: string) => {
    if (!order || newStatus === status) return; // Không làm gì nếu trạng thái không thay đổi
  
    setUpdating(true);
    try {
      const response = await axios.put(`${API_UPDATE_ORDER}${order.id}`, { status: newStatus });
      if (response.data.status) {
        toast("Cập nhật trạng thái thành công!");
        setStatus(newStatus); // Cập nhật UI
        refreshOrders(); // Cập nhật danh sách đơn hàng
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      alert("Không thể cập nhật trạng thái đơn hàng!");
    } finally {
      setUpdating(false);
    }
  };
  
const API_PAYMENT = "https://gshopbackend-1.onrender.com/payment_method/detail/";

const [paymentDetail, setPaymentDetail] = useState<string>("");


const fetchPaymentDetail = async (id_payment: string) => {
  try {
    const response = await axios.get(`${API_PAYMENT}${id_payment}`);
    if (response.data.status) {
      setPaymentDetail(response.data.data.name || "Không có thông tin thanh toán");
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết thanh toán:", error);
    setPaymentDetail("Lỗi khi tải phương thức thanh toán");
  }
};


useEffect(() => {
  if (order) {
    fetchOrderDetails(order.id);
    fetchPaymentDetail(order.id_payment);
    setStatus(order.status);
  }
}, [order, open]);
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (order && open) {
      fetchOrderDetails(order.id);
      setStatus(order.status);
    }
  }, [order, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="bg-gray-200 rounded-lg min-w-[800px] w-96 max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex justify-center mb-4">Chi tiết đơn hàng</div>
        </DialogHeader>

        {order && (
          <div>
            <div>
              <p className="pb-4"><strong>Mã đơn hàng:</strong> {order.id}</p>

              <p><strong>Khách hàng:</strong> {usersList[order.id_user]?.name || "Không xác định"}</p>
              <p><strong>Địa chỉ:</strong> {order?.address || "Không có địa chỉ"}</p>


              <h3 className="mt-4 mb-2 font-semibold">Sản phẩm trong đơn hàng:</h3>
              {loading ? (
                  <p>Đang tải chi tiết đơn hàng...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : orderDetails.length > 0 ? (
                  <DataTable columns={columns} data={orderDetails} />
                ) : (
                  <p>Không có sản phẩm nào.</p>
                )}

              <p className="pt-4"><strong>Phương thức thanh toán:</strong> {paymentDetail} </p>
              <p><strong>Phí vận chuyển:</strong> {order.shipping_fee.toLocaleString()} VND</p>
              <p><strong>Tổng tiền:</strong> {order.amount.toLocaleString()} VND</p>
              
              <p className="pt-4"><strong>Ngày đặt hàng:</strong> {order.order_date}</p>
            </div>

            {/* Thay đổi trạng thái đơn hàng */}
            <div className="mt-3 flex flex-col">
              <label className="font-semibold mb-2">Trạng thái đơn hàng:</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className={`
                    ${status === "Đang xử lý" ? "bg-red-100 text-red-700 border-red-500" : ""}
                    ${status === "Đang giao hàng" ? "bg-orange-100 text-orange-700 border-orange-500" : ""}
                    ${status === "Đã giao" ? "bg-green-100 text-green-700 border-green-500" : ""}
                    border rounded-lg px-4 py-2 font-semibold
                `}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Đang xử lý" disabled={status !== "Đang xử lý"} className="text-red-500">🔴 Đang xử lý</SelectItem>
                <SelectItem value="Đang giao hàng" disabled={status !== "Đang xử lý"} className="text-orange-500">🟠 Đang giao hàng</SelectItem>
                <SelectItem value="Đã giao" disabled={status !== "Đang giao hàng"} className="text-green-500">🟢 Đã giao</SelectItem>
                <SelectItem value="Đã hủy" disabled={status === "Đã giao"} className="text-gray-500">❌ Đã hủy</SelectItem>
              </SelectContent>
              </Select>
            </div>
          </div>
        )}

        

        <div className="absolute top-10 right-72">
          <Button onClick={onClose} className="bg-gray-200 text-red-500 hover:bg-gray-300">x</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewOrderDialog;
