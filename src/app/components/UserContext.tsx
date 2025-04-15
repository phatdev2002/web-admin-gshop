// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho thông tin người dùng
interface UserProfile {
  name: string;
  avatar: string;
}

interface UserContextType {
  user: UserProfile | null;
  updateUser: (user: UserProfile) => void;
}

// Tạo context với giá trị mặc định là null
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Tạo Provider để cung cấp thông tin người dùng cho các component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Hàm cập nhật thông tin người dùng
  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
