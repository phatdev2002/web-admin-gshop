'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditStaffDialogProps {
  employee: {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditStaffDialog({ employee, onClose, onUpdated }: EditStaffDialogProps) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone_number);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = () => {
    setLoading(true);
    setError(null);
    
    fetch("https://gshopbackend-1.onrender.com/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        phone_number: phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          onUpdated();
          onClose();
        } else {
          setError("Cập nhật thất bại. Vui lòng thử lại.");
        }
      })
      .catch(() => setError("Không thể kết nối với máy chủ."))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex justify-center items-center">
            <DialogHeader>
            <div >Chỉnh sửa nhân viên</div>
            </DialogHeader>
        </div>
        <div className="space-y-2 p-2">
            <p>Email</p>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled className="text-black bg-white"/>
            <p>Họ và tên</p>
            <Input placeholder="Tên nhân viên" value={name} onChange={(e) => setName(e.target.value)} className="bg-white"/>
            <p>Số điện thoại</p>
            <Input placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white"/>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline"  onClick={onClose} disabled={loading}>Hủy</Button>
            <Button variant="destructive" onClick={handleUpdate} disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</Button>
            </div>
        </div>
        </DialogContent>

    </Dialog>
  );
}
