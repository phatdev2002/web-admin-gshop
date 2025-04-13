import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

const ViewClientDialog: React.FC<ViewClientDialogProps> = ({ isOpen, onClose, clientId }) => {
  interface ClientData {
    name: string;
    email: string;
    phone_number: string;
  }

  interface OrderData {
    _id: string;
    total_price: number;
    shipping_fee: number;
    status: string;
    date: string;
  }

  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderError, setOrderError] = useState("");

  interface OrderDetail {
    _id: string;
    id_product: string;
    quantity: number;
    unit_price: number;
  }

  const [orderDetails, setOrderDetails] = useState<Record<string, OrderDetail[]>>({});
  const [isLoadingDetails, setIsLoadingDetails] = useState<Record<string, boolean>>({});
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [productImages, setProductImages] = useState<Record<string, string[]>>({}); // Store images here
  const [isLoadingProducts, setIsLoadingProducts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchProductName = async (productId: string) => {
      if (productNames[productId]) return;
      setIsLoadingProducts((prev) => ({ ...prev, [productId]: true }));
      try {
        const res = await fetch(`https://gshopbackend-1.onrender.com/product/detail/${productId}`);
        const data = await res.json();
        if (data.status) {
          setProductNames((prev) => ({ ...prev, [productId]: data.data.name }));
        }
      } catch (error) {
        console.error("Error fetching product name:", error);
      } finally {
        setIsLoadingProducts((prev) => ({ ...prev, [productId]: false }));
      }
    };

    const fetchProductImages = async (productId: string) => {
      if (productImages[productId]) return;
      try {
        const res = await fetch(`https://gshopbackend-1.onrender.com/image_product/list-images/${productId}`);
        const data = await res.json();
        if (data.status) {
          setProductImages((prev) => ({ ...prev, [productId]: data.data[0]?.image || [] }));
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    const fetchOrderDetails = async (orderId: string) => {
      setIsLoadingDetails((prev) => ({ ...prev, [orderId]: true }));
      try {
        const res = await fetch(`https://gshopbackend-1.onrender.com/detail_order/list-by-order/${orderId}`);
        const data = await res.json();
        if (data.status) {
          setOrderDetails((prev) => ({ ...prev, [orderId]: data.data }));
          data.data.forEach((product: OrderDetail) => {
            fetchProductName(product.id_product);
            fetchProductImages(product.id_product); // Fetch images
          });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoadingDetails((prev) => ({ ...prev, [orderId]: false }));
      }
    };

    setIsLoading(true);
    setIsOrdersLoading(true);
    
    fetch(`https://gshopbackend-1.onrender.com/user/detail_user?_id=${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setClientData(data.data);
        } else {
          setError("Unable to fetch client information.");
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError("Connection error.");
        setIsLoading(false);
      });

    fetch(`https://gshopbackend-1.onrender.com/order/list-order-user/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setOrders(data.data.reverse());
          data.data.forEach((order: OrderData) => {
            fetchOrderDetails(order._id);
          });
        } else {
          setOrderError("Unable to fetch order history.");
        }
        setIsOrdersLoading(false);
      })
      .catch(() => {
        setOrderError("Connection error.");
        setIsOrdersLoading(false);
      });
  }, [isOpen, clientId]);

  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <div className="p-5">

        
        <div className="flex justify-center mb-5"><p className="font-semibold">Thông tin khách hàng</p></div>
        <DialogContent>
          {isLoading ? (
            <Skeleton className="h-6 w-3/4" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="mb-4 gap-2 flex flex-col">
                <label className="block text-sm font-semibold">Tên khách hàng</label>
                <Input value={clientData?.name || ''} readOnly className="bg-white"/>
              </div>
              <div className=" gap-2 flex flex-row flex-1">
                <div className="mb-4 gap-2 flex flex-col flex-1">
                  <label className="block text-sm font-semibold">Email</label>
                  <Input value={clientData?.email || ''} readOnly className="bg-white"/>
                </div>
                <div className="mb-4 gap-2 flex flex-col flex-1">
                  <label className="block text-sm font-semibold">Số điện thoại</label>
                  <Input value={clientData?.phone_number || ''} readOnly className="bg-white"/>
                </div>
              </div>
            </>
          )}

          <div className=" mb-4">
            <label className="block text-sm font-semibold">Lịch sử đơn hàng</label>
            {isOrdersLoading ? (
              <Skeleton className="h-6 w-full mt-2" />
            ) : orderError ? (
              <p className="text-red-500">{orderError}</p>
            ) : (
              <div className="max-h-80 overflow-y-auto mt-2 border rounded-lg p-0">
                {orders.length === 0 ? (
                  <p className="text-gray-500">Không có đơn hàng nào.</p>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="bg-white">
                        <th className="text-left p-3">Mã đơn</th>
                        <th className="text-left p-3">Ngày</th>
                        <th className="text-right p-3">Tổng tiền</th>
                        <th className="text-right p-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <React.Fragment key={order._id}>
                          <tr className={`border ${index % 2 === 0 ? "bg-white" : "bg-white"}`}>
                            <td className="p-3 font-medium">{order._id}</td>
                            <td className="p-3">{order.date}</td>
                            <td className="p-3 text-right font-semibold">{order.total_price.toLocaleString()} đ</td>
                            <td className={`p-3 text-right font-medium ${
                                order.status === "Đã giao" ? "text-green-600" : 
                                order.status === "Đang xử lý" ? "text-red-500" : 
                                order.status === "Đang giao hàng" ? "text-orange-500" : "text-gray-700"
                              }`}>
                              {order.status}
                            </td>
                          </tr>
                          

                          {isLoadingDetails[order._id] ? (
                            <tr><td colSpan={4} className="text-center">Đang tải sản phẩm...</td></tr>
                          ) : (
                            orderDetails[order._id]?.map((product) => (
                              <tr key={product._id} className="bg-gray-100">
                                <td className="flex justify-center" colSpan={1}>
                                  <Image
                                      src={productImages[product.id_product]?.[1] || "/default-thumbnail.jpg"}
                                      alt="Product"
                                      width={80}
                                      height={80}
                                      className="object-cover"
                                    />
                                </td>
                                
                                <td className="pl-3" colSpan={1}>
                                  {isLoadingProducts[product.id_product] ? "Đang tải..." : productNames[product.id_product] || "Không tìm thấy"}
                                </td>
                                <td className="p-3 text-right">
                                  {product.unit_price.toLocaleString()} đ
                                </td>
                                <td className="p-3 text-right">SL: {product.quantity}</td>
                                
                              </tr>
                            ))
                          )}

                          <tr><td colSpan={4} className="h-3"></td></tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </DialogContent>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
        </div>
      </Dialog>
      
    </div>
  );
};

export default ViewClientDialog;
