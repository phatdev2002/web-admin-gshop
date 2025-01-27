"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import loginUser  from "@/app/(auth)/register/register-xuly";

// Định nghĩa schema form với Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string()
    .min(1, {
      message: "Mật khẩu không được để trống.",
    }),
});

const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      // Gọi hàm loginUser từ authService
      const result = await loginUser(values.email, values.password);
  
      if (result.success) {
        // Thành công - xử lý khi đăng nhập thành công
        //console.log("Đăng nhập thành công:", result);
        alert('Đăng nhập thành công!');
      } else {
        // Thất bại - hiển thị thông báo lỗi dựa trên message từ server
        let errorMessage = "Lỗi đăng nhập!";
  
        if (result.message === "User not found!") {
          errorMessage = "Không tìm thấy người dùng!";
        } else if (result.message === "Invalid credentials!") {
          errorMessage = "Sai mật khẩu!";
        }
  
        //console.error("Lỗi đăng nhập:", result.message);
        alert(errorMessage);
      }
    } catch (error) {
      // Xử lý lỗi kết nối hoặc lỗi không xác định
      //console.error("Lỗi kết nối:", error);
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
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mật khẩu của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-8 w-full">Đăng nhập</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
