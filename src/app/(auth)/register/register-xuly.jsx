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
    console.log("Phản hồi từ server:", data);

    //Kiểm tra status từ phản hồi của server
    if (data.status === true) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message || "Đăng nhập thất bại" };
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    return { success: false, message: "Không thể kết nối tới server." };
  }
};

// const onSubmit = async (e) => {
//   e.preventDefault();
//   const result = await loginUser(email, password);

//   // Kiểm tra kết quả trả về
//   if (result.success) {
//     console.log("Đăng nhập thành công!");
//   } else {
//     console.log("Đăng nhập thất bại:", result.message);
//   }
// };

export default loginUser;