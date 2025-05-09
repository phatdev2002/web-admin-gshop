import LoginFrom from "@/app/(auth)/login/login-from";
import Image from 'next/image';

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full relative">
        <Image src="/login/LogoAppGShop2.png" alt="Logo GShop" className="absolute top-4 right-4 h-10" width={100} height={40} />
      {/* Banner */}
      <div
        className="w-3/5 h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/login/Bannerfullhd.jpeg')",
        }}
      ></div>

      {/* Login Form */}
      <div className="w-2/5 flex flex-col justify-center items-center m-10">
        <div className="text-4xl text-center mb-4 font-bold">Đăng nhập</div>
        <div className="text-center mb-6">
          Chào mừng đến với hệ thống quản lý GShop
        </div>
        <div className="w-full flex justify-center">
          <LoginFrom />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
