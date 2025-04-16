'use client'
import { useState } from "react";
import { Dialog} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddStaffDialog({ onStaffAdded }: { onStaffAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Hàm kiểm tra email hợp lệ
    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return emailRegex.test(email);
    };

    

    // Xử lý mở dialog (reset input)
    const handleOpen = () => {
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setMessage(null);
        setOpen(true);
    };

    const handleAddStaff = async () => {
        if (!name || !email || !phone || !password) {
            setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" });
            return;
        }

        if (!isValidEmail(email)) {
            setMessage({ type: "error", text: "Email phải có dạng example@gmail.com!" });
            return;
        }

        if (phone.length !== 10) {
            setMessage({ type: "error", text: "Số điện thoại phải có đúng 10 chữ số!" });
            return;
        }

        setMessage(null);
        const response = await fetch("https://gshopbackend-1.onrender.com/user/create-staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone_number: phone, password }),
        });

        const data = await response.json();

        if (response.ok && data.status) {
            setMessage({ type: "success", text: data.message || "Thêm nhân viên thành công!" });
            onStaffAdded();
            setTimeout(() => {
                setOpen(false);
                setMessage(null);
            }, 2000);
        } else {
            setMessage({ type: "error", text: data.message || "Có lỗi xảy ra, thử lại!" });
        }
    };

    return (
        <div>
            <Button variant={'destructive'} onClick={handleOpen}>
                <Plus size={16} className="mr-1" /> Thêm nhân viên
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <div className="p-5">
                    <div className="flex justify-center items-center">
                        <h1 className="mb-2 font-semibold">Thêm nhân viên</h1>
                    </div>

                    {message && (
                        <p className={`text-sm text-center ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
                            {message.text}
                        </p>
                    )}
                    <p>Tên nhân viên</p>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="my-2 bg-blue-100" />

                    <p>Email</p>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="my-2 bg-blue-100" />

                    <p>Số điện thoại</p>
                    <Input
                        type="text" // Giữ type="text" để tránh dấu mũi tên trên mobile
                        placeholder=""
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // Chỉ cho phép số
                                setPhone(value);
                            }
                        }}
                        className="my-2 bg-blue-100"
                    />


                    <p>Mật khẩu</p>
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} className="my-2 bg-blue-100" />

                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                        <Button onClick={handleAddStaff} className="bg-red-500 hover:bg-red-600 rounded-2xl">Lưu</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
