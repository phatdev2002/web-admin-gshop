const logoutUser = () => {
    // Xóa token và role khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Điều hướng đến trang đăng nhập
    window.location.href = "/login";
  };
  
  export default logoutUser;
  