"use client";
import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import { News } from "@/types/News";
import Image from "next/image";
import { toast } from "sonner";

export interface UserProfile {
  name: string;
  role: string;
  phone_number: string;
  _id: string; // UID
  email: string;
}

interface ViewNewsDialogProps {
  news: News | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ViewNewsDialog({ news, onClose, onUpdate }: ViewNewsDialogProps) {
  const [content, setContent] = useState(news?.content || "");
  const [title, setTitle] = useState(news?.title || "");
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState("Đang tải...");
  const [authorLoading, setAuthorLoading] = useState(true);
  const thumbnails = news?.thumbnail ? news.thumbnail.split(",") : [];
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(news?.thumbnail || "");


  useEffect(() => {
    if (news) {
      setContent(news.content || "");
      setTitle(news.title || "");
      setThumbnailUrl(news.thumbnail || "");
    }
  }, [news]);

  useEffect(() => {
    if (!news?.id_user) return;
    const fetchUserName = async () => {
      try {
        const response = await fetch("https://gshopbackend.onrender.com/user/list");
        const data = await response.json();
        const userList = Array.isArray(data) ? data : data.data;
        if (!Array.isArray(userList)) throw new Error("Unexpected response format");
        const author = userList.find((user) => user._id === news.id_user);
        setAuthorName(author?.name ?? "Không xác định");
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
        setAuthorName("Lỗi khi tải tên tác giả");
      } finally {
        setAuthorLoading(false);
      }
    };
    fetchUserName();
  }, [news?.id_user]);

  const handleThumbnailUpload = async () => {
    if (!thumbnail || !news?._id) return;
    const formData = new FormData();
    formData.append("image", thumbnail);
    try {
      const response = await fetch(`https://gshopbackend.onrender.com/news/upload-thumbnail?id_news=${news._id}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Lỗi khi tải ảnh lên");
      const data = await response.json();
      setThumbnailUrl(data.thumbnail);
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      toast.error("Không thể tải ảnh lên");
    }
  };

  const getValidThumbnail = (thumbnail?: string) => {
    if (!thumbnail) return "/default-thumbnail.jepg"; // Ảnh mặc định
    const firstImage = thumbnail.split(",")[0].trim(); // Lấy ảnh đầu tiên và loại bỏ khoảng trắng
  
    // Kiểm tra nếu ảnh không có "http" hoặc "/uploads/" thì không hợp lệ
    if (!firstImage.startsWith("http") && !firstImage.startsWith("/uploads/")) {
      return "/default-thumbnail.jpg";
    }
    return firstImage;
  };
  

  const handleSubmit = async () => {
    if (!news?._id) return;
    setLoading(true);
    try {
      await handleThumbnailUpload();
      const userProfile = JSON.parse(localStorage.getItem("user") || "{}") as UserProfile;
      if (!userProfile._id) {
        toast.error("Không tìm thấy ID người dùng.");
        return;
      }
      const response = await fetch(`https://gshopbackend.onrender.com/news/edit?_id=${news._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, id_user: userProfile._id, thumbnail: thumbnailUrl }),
      });
      if (!response.ok) throw new Error("Lỗi khi cập nhật tin tức");
      toast.success("Cập nhật thành công!");
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tin tức");
    } finally {
      setLoading(false);
    }
  };

  if (!news) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

      <div className="bg-gray-200 px-5 py-5 rounded-lg h-[650px] w-[850px] overflow-y-auto relative">
        {/* Ảnh bài viết */}
        <div>
          <p className="font-semibold">Thumbnail</p>
          <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="mt-2" />

          {thumbnails.length > 0 ? (
            thumbnails.map((image, index) => (
              <Image 
                key={index} 
                src={getValidThumbnail(image)} 
                alt={`Chưa có ảnh`} 
                width={500} 
                height={300} 
                className="w-[350px] max-h-60 my-4 rounded-lg" 
                priority={index === 0} // Prioritize the first image
              />
            ))
          ) : (
            <p className="text-gray-500 italic">Không có ảnh Thumbnail</p>
          )}

        </div>

        {/* Thông tin bài viết */}
        <div className="mt-4">
          <div>
            <p className="font-semibold">ID bài viết</p>
            <input type="text" value={news._id} readOnly className="border rounded p-2 w-full my-2 bg-gray-300" />
          </div>
          <div className="flex justify-between">
            <div className="mr-4 flex-1">
              <p className="font-semibold">Ngày đăng</p>
              <input type="text" value={news.date} readOnly className="border rounded p-2 w-full my-2 bg-gray-300" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Tác giả</p>
              <input type="text" value={authorLoading ? "Đang tải..." : authorName} readOnly className="border rounded p-2 w-full my-2 bg-gray-300" />
            </div>
          </div>

          {/* Chỉnh sửa tiêu đề và nội dung */}
          <p className="font-semibold">Tiêu đề</p>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded p-2 w-full mt-2" />

          <p className="my-2 font-semibold">Nội dung</p>
          <Editor value={content} onChange={setContent} />

          {/* Nút cập nhật */}
          <div className="flex justify-end">
            <button 
              onClick={handleSubmit} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition" 
              disabled={loading}
              aria-label="Cập nhật bài viết"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật bài viết"}
            </button>
          </div>
        </div>
      </div>

      {/* Nút đóng */}
      <div className="top-7 right-72 z-0 flex justify-end absolute">
        <button 
          onClick={onClose} 
          aria-label="Đóng hộp thoại" 
          className="text-red-500 hover:text-red-600 p-2 bg-gray-100 w-10 h-10 rounded-lg"
        >
          ✖
        </button>
      </div>
    </div>
  );
}