import RegisterFrom from "@/app/(auth)/register/register-from";

const RegisterPage = () => {
  return (
    <div className="flex h-screen">
      <div
        className="w-3/5 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/Banner.png')",
        }}
      ></div>
      <div className="w-2/5 flex flex-col justify-center items-center m-10">
        <div className="text-xl text-center mb-4">Đăng nhập</div>
        <div className="text-center mb-6">
          Chào mừng đến với hệ thống quản lý GShop
        </div>
        <div className="w-full flex justify-center">
          <RegisterFrom />
        </div>
      </div>

      
    </div>
  );
};

export default RegisterPage;
