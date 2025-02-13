const logoutUser = () => {
    // Xóa token và role khỏi localStorage
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    
    // Điều hướng đến trang đăng nhập
    window.location.href = "/login";
  };
  
  export default logoutUser;
  