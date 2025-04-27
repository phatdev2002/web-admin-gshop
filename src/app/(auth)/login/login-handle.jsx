import { BASE_URL } from "@/constants";
const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Phản hồi từ server:", data); // Kiểm tra phản hồi

    if (data.status === true && data.data) {
      const user = data.data;
      
      // Lưu vào localStorage để kiểm tra sau này
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      return { success: true, user };
    } else {
      return { success: false, message: data.message || "Đăng nhập thất bại" };
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    return { success: false, message: "Không thể kết nối tới server." };
  }
};

export default loginUser;
