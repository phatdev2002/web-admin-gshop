const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://gshopbackend.onrender.com/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Phản hồi từ server:", data); // Kiểm tra dữ liệu phản hồi

    // Kiểm tra nếu `data.data` tồn tại và có ít nhất một phần tử
    if (data.status === true && Array.isArray(data.data) && data.data.length > 0) {
      const user = data.data[0]; // Lấy user đầu tiên từ mảng

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
