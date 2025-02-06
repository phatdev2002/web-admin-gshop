"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"; 
import { useState } from "react";  // Import useState
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import loginUser from "@/app/(auth)/login/login-handle";
import { Eye, EyeOff } from "lucide-react";

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

  const [showPassword, setShowPassword] = useState(false);  // State để điều khiển hiển thị mật khẩu

  const onSubmit = async (values) => {
    try {
      const result = await loginUser(values.email, values.password);

      if (result.success) {
        const { user } = result;

        // Lưu token và role vào localStorage (nếu cần)
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
        if (result.message === "User not found!") {
          errorMessage = "Không tìm thấy người dùng!";
        } else if (result.message === "Invalid credentials!") {
          errorMessage = "Sai mật khẩu!";
        }
        alert(errorMessage);
      }
    } catch (error) {
      alert("Không thể kết nối tới server. Vui lòng thử lại sau!");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-[400px] flex-shrink-0 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"} // Điều chỉnh type của input
                  placeholder="Mật khẩu của bạn"
                  {...field}
                />
              </FormControl>
              <div
                className="absolute top-8 right-3  cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}  
              >
                {showPassword ? <Eye size={20}/> : <EyeOff size={20} />}  
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-8 w-full">Đăng nhập</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
