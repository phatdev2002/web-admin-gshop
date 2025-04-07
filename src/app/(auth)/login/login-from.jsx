"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";  // Thêm useEffect để kiểm tra localStorage
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import loginUser from "@/app/(auth)/login/login-handle";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống." }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra localStorage khi component mount
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      router.push("/admin/overview"); // Điều hướng đến trang admin nếu role là admin
    }
    if (role === "staff") {
      router.push("/staff/overview"); // Điều hướng đến trang staff nếu role là staff
    }
  }, [router]);

  const onSubmit = async (values) => {
    setLoading(true);
  
    try {
      const result = await loginUser(values.email, values.password);
  
      if (result.success) {
        const { user } = result;
  
        // Lưu thông tin vào localStorage
        localStorage.setItem("role", user.role);
  
        // Điều hướng theo vai trò
        if (user.role === "admin") {
          router.push("/admin/overview");
        } else if (user.role === "staff") {
          router.push("/staff/overview");
        } else {
          alert("Bạn không có quyền truy cập!");
        }
      } else {
        let errorMessage = "Lỗi đăng nhập!";
        if (result.message) {
          errorMessage = result.message; // Hiển thị lỗi cụ thể từ server nếu có
        }
        alert(errorMessage);
      }
    } catch (error) {
      let errorMessage = "Không thể kết nối tới server. Vui lòng thử lại sau!";
  
      if (error.response) {
        // Nếu server phản hồi lỗi cụ thể
        errorMessage = error.response.data?.message || "Đã xảy ra lỗi từ server!";
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        errorMessage = "Không nhận được phản hồi từ server!";
      } else {
        // Lỗi khác (ví dụ: lỗi cú pháp)
        errorMessage = `Lỗi: ${error.message}`;
      }
  
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 max-w-[400px] flex-shrink-0 w-full">
        <FormLabel>Email</FormLabel>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="example@gmail.com" 
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-0" />
        <FormLabel>Mật khẩu</FormLabel>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...field}
                />
              </FormControl>
              <div
                className="absolute top-0 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="!mt-8 w-full" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            onClick={() => toast.error("Chức năng này chưa được phát triển.")} 
            className="text-sm text-blue-500">
            Quên mật khẩu ?
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
