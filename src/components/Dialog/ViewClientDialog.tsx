import React, { useEffect, useState } from "react";
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

  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && clientId) {
      setIsLoading(true);
      fetch(`https://gshopbackend.onrender.com/user/detail_user?_id=${clientId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setClientData(data.data);
          } else {
            setError("Không thể lấy thông tin khách hàng");
          }
          setIsLoading(false);
        })
        .catch(() => {
          setError("Lỗi kết nối đến server");
          setIsLoading(false);
        });
    }
  }, [isOpen, clientId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <Input value={clientData?.name} readOnly className="bg-white"/>
            </div>
            <div className="mb-4 gap-2 flex flex-col">
              <label className="block text-sm font-semibold">Email</label>
              <Input value={clientData?.email} readOnly  className="bg-white"/>
            </div>
            <div className="mb-4 gap-2 flex flex-col">
              <label className="block text-sm font-semibold">Số điện thoại</label>
              <Input value={clientData?.phone_number} readOnly  className="bg-white"/>
            </div>
          </>
        )}
      </DialogContent>
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </Dialog>
  );
};

export default ViewClientDialog;
