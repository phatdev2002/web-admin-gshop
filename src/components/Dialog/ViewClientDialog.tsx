import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL } from "@/constants";
import { Textarea } from "@headlessui/react";

interface ViewClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

interface Address {
  detail: string;
  commune: string;
  district: string;
  province: string;
  selected: boolean;
}


const ViewClientDialog: React.FC<ViewClientDialogProps> = ({ isOpen, onClose, clientId }) => {
  interface ClientData {
    name: string;
    email: string;
    phone_number: string;
    avatar?: string;
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
  const [address, setAddress] = useState<string>("");



  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchProductName = async (productId: string) => {
      if (productNames[productId]) return;
      setIsLoadingProducts((prev) => ({ ...prev, [productId]: true }));
      try {
        const res = await fetch(`${BASE_URL}/product/detail/${productId}`);
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
        const res = await fetch(`${BASE_URL}/image_product/list-images/${productId}`);
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
        const res = await fetch(`${BASE_URL}/detail_order/list-by-order/${orderId}`);
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
    
    fetch(`${BASE_URL}/user/detail_user?_id=${clientId}`)
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

    fetch(`${BASE_URL}/order/list-order-user/${clientId}`)
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

  useEffect(() => {
    if (!clientId) return;
  
    // Reset địa chỉ trước khi fetch client mới
    setAddress("");
  
    fetch(`${BASE_URL}/address/list/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && Array.isArray(data.data)) {
          const selectedAddress = data.data.find((addr: Address) => addr.selected);
          if (selectedAddress) {
            const { detail, commune, district, province } = selectedAddress;
            setAddress(`${detail}, ${commune}, ${district}, ${province}`);
          }
        }
      })
      .catch(() => {
        console.error("Lỗi khi lấy địa chỉ.");
      });
  }, [clientId]);
  



  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <div className=" h-[580px] w-[1200px] rounded-lg relative ">    
          <div className="flex justify-end absolute  right-2 top-2 ">       
                <Button variant="outline" onClick={onClose} className="text-red-500 w-8 h-8 rounded-sm font-semibold">
                  X
                </Button> 
            </div>   
          <div className="flex flex-col">
            <div className="flex flex-row mb-5 gap-5 ">
            
            {isLoading ? (
              <Skeleton className="h-6 w-3/4" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
              <div className=" flex flex-col bg-gray-200 rounded-lg p-5">
                <div className="flex justify-center">
                  <Image
                    src={
                      clientData?.avatar && clientData.avatar.startsWith("http")
                        ? clientData.avatar
                        : "/img/avatar_trang.jpg"
                    }
                    alt="Avatar"
                    width={150}
                    height={150}
                    className="rounded-full object-cover w-36 h-36"
                  />
                </div>

                <div className="flex flex-col mt-4 w-full min-w-80">
                  <div className="mb-4 gap-2 flex flex-col">
                    <label className="block text-sm font-semibold">Tên khách hàng</label>
                    <Input value={clientData?.name || ''} readOnly className="bg-gray-100"/>
                  </div>
                    <div className="mb-4 gap-2 flex flex-col flex-1">
                      <label className="block text-sm font-semibold">Email</label>
                      <Input value={clientData?.email || ''} readOnly className="bg-gray-100"/>
                    </div>
                    <div className=" gap-2 flex flex-col flex-1">
                      <label className="block text-sm font-semibold">Số điện thoại</label>
                      <Input
                        value={
                          clientData?.phone_number
                            ? `${clientData.phone_number.slice(0, 4)} ${clientData.phone_number.slice(4, 7)} ${clientData.phone_number.slice(7)}`
                            : ''
                        }
                        readOnly
                        className="bg-gray-100"
                      />

                    </div>
                
                    <div className="mt-4 gap-2 flex flex-col">
                      <label className="block text-sm font-semibold">Địa chỉ</label>
                      <Textarea
                        value={address || "Chưa chọn địa chỉ giao hàng"}
                        readOnly
                        rows={3}
                        className="bg-gray-100 resize-none text-sm p-3 rounded-lg"
                      />
                    </div>

                </div>
              </div>
                
              </>
            )}


            <div className="h-[580px] py-5 pr-4">
              <label className="block text-sm font-semibold">Lịch sử đơn hàng</label>
              
              
            
            {isOrdersLoading ? (
              <Skeleton className="h-6 w-full mt-2" />
            ) : orderError ? (
              <p className="text-red-500">{orderError}</p>
            ) : (
              <div className="h-[500px] overflow-y-auto mt-4 rounded-lg p-0 w-[790px] flex-1 ">
                {orders.length === 0 ? (
                    <p className="text-gray-500 ">Không có đơn hàng nào.</p>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-blue-50">
                        <th className="text-left p-3">Mã đơn</th>
                        <th className="text-left p-3">Ngày</th>
                        <th className="text-right p-3">Tổng tiền</th>
                        <th className="text-right p-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <React.Fragment key={order._id}>
                          <tr className={"border bg-gray-200"}>
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
                              <tr key={product._id} className="border bg-gray-100">
                                <td className="flex justify-center " colSpan={1}>
                                  <Image
                                      src={productImages[product.id_product]?.[0] || "/default-thumbnail.jpg"}
                                      alt="Product"
                                      width={90}
                                      height={90}
                                      className="object-cover w-full h-24"
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
                          <tr><td colSpan={4} className="h-[20px] p-0"></td></tr>

                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
          </div> 
                
          </div>
        </div>
      </Dialog>
      
    </div>
  );
};

export default ViewClientDialog;
