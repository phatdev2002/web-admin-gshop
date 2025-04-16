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
    password: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditStaffDialog({ employee, onClose, onUpdated }: EditStaffDialogProps) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [phone, setPhone] = useState(employee.phone_number);
  const [password, setPass] = useState(employee.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = () => {
    setLoading(true);
    setError(null);

    const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        setError("Số điện thoại phải có 10 chữ số.");
        setLoading(false);
        return;
      }
    
    fetch("https://gshopbackend-1.onrender.com/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        phone_number: phone,
        password,
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
        <div className="flex justify-center items-center m-5">
            <DialogHeader>
            <div >Chỉnh sửa nhân viên</div>
            </DialogHeader>
        </div>
        <div className="space-y-2 m-5">
            <p>Email</p>
            <Input placeholder="Email" value={email} readOnly onChange={(e) => setEmail(e.target.value)} className="text-black bg-gray-200"/>
            <p>Họ và tên</p>
            <Input placeholder="Tên nhân viên" value={name} onChange={(e) => setName(e.target.value)} className="bg-blue-100"/>
            <p>Số điện thoại</p>
            <Input placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-blue-100"/>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p>Mật khẩu</p>
            <Input placeholder="Mật khẩu" value={password} onChange={(e) => setPass(e.target.value)} readOnly className="bg-blue-100"/>
            <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline"  onClick={onClose} disabled={loading}>Hủy</Button>
            <Button variant="destructive" onClick={handleUpdate} disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</Button>
            </div>

        </div>
        </DialogContent>

    </Dialog>
  );
}
