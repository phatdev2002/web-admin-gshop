"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";


const API_ORDER_DETAIL = "https://gshopbackend.onrender.com/detail_order/list-by-order/";
const API_PRODUCTS = "https://gshopbackend.onrender.com/product/list";
const API_USERS = "https://gshopbackend.onrender.com/user/list";
const API_UPDATE_ORDER = "https://gshopbackend.onrender.com/order/update/";

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

interface OrderDetail {
  id_product: string;
  product_name: string;
  quantity: number;
  unit_price: number;
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
      const details = response.data.data.map((item: { id_product: string; quantity: number; unit_price: number }) => ({
        id_product: item.id_product,
        product_name: products[item.id_product] || "Không xác định",
        quantity: item.quantity,
        unit_price: item.unit_price,
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
}, [products]); // Chỉ re-create khi `products` thay đổi

// Sử dụng trong useEffect
useEffect(() => {
  if (order && open) {
    fetchOrderDetails(order.id);
    fetchAddressDetail(order.id_address);
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
  
  const API_ADDRESS = "https://gshopbackend.onrender.com/address/detail/";
const API_PAYMENT = "https://gshopbackend.onrender.com/payment_method/detail/";

const [addressDetail, setAddressDetail] = useState<string>("");
const [paymentDetail, setPaymentDetail] = useState<string>("");

const fetchAddressDetail = async (id_address: string) => {
  try {
    const response = await axios.get(`${API_ADDRESS}${id_address}`);
    if (response.data.status) {
      const { detail, commune, district, province } = response.data.data;
      setAddressDetail(`${detail}, ${commune}, ${district}, ${province}`);
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết địa chỉ:", error);
    setAddressDetail("Lỗi khi tải địa chỉ");
  }
};

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
    fetchAddressDetail(order.id_address);
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
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center mb-4">Chi tiết đơn hàng</div>
        </DialogHeader>

        {order && (
          <div>
            <div>
              <p className="pb-5"><strong>Mã đơn hàng:</strong> {order.id}</p>

              <p><strong>Khách hàng:</strong> {usersList[order.id_user]?.name || "Không xác định"}</p>
              <p><strong>Số điện thoại:</strong> {usersList[order.id_user]?.phone_number || "Không có số điện thoại"}</p>
              <p><strong>Địa chỉ:</strong> {addressDetail}</p>

              <h3 className="mt-4 mb-2 font-semibold">Sản phẩm trong đơn hàng:</h3>
                {loading ? (
                  <p>Đang tải chi tiết đơn hàng...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : orderDetails.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {orderDetails.map((item, index) => (
                      <li key={index}>
                        <strong>{item.product_name}</strong> - {item.quantity} x {item.unit_price.toLocaleString()} VND
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có sản phẩm nào.</p>
                )}
              <p className="pt-4"><strong>Phương thức thanh toán:</strong> {paymentDetail} </p>
              <p><strong>Phí vận chuyển:</strong> {order.shipping_fee.toLocaleString()} VND</p>
              <p><strong>Tổng tiền:</strong> {order.amount.toLocaleString()} VND</p>
              
              <p className="pt-5"><strong>Ngày đặt hàng:</strong> {order.order_date}</p>
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

        

        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;
