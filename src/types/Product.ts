export interface Product {
  _id: string;
  name: string;
  id_category: string;
  price: number; // Đổi từ string -> number
  isActive: boolean;
  quantity: number; // Đổi từ string -> number
  description: string;
  id_supplier: string;
  status: string;
  viewer: number;
  image?: string; // Nếu có ảnh, thêm vào để tránh lỗi
}
