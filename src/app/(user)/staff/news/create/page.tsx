"use client";
import { useState } from "react";
import Editor from "@/components/Editor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Lấy thông tin user từ localStorage
      const userProfile = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userProfile._id) throw new Error("Không tìm thấy ID người dùng.");

      // 2️⃣ Gửi request tạo bài viết
      const response = await fetch("https://gshopbackend.onrender.com/news/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, id_user: userProfile._id }),
      });

      const result = await response.json();
      console.log("API /news/add response:", result);

      // Kiểm tra response trả về
      const newsId = result.data?._id; // Lấy _id từ `data` object
      if (!response.ok || !newsId) {
        throw new Error("Không tìm thấy ID bài viết!");
      }

      console.log("newsId:", newsId);
      let uploadedThumbnailUrl = "";

      // 3️⃣ Nếu có ảnh, tiến hành upload
      if (thumbnail) {
        const formData = new FormData();
        formData.append("image", thumbnail);

        //console.log("Upload URL:", `https://gshopbackend.onrender.com/news/upload-thumbnail?id_news=${newsId}`);

        try {
          const uploadResponse = await fetch(
            `https://gshopbackend.onrender.com/news/upload-thumbnail?id_news=${encodeURIComponent(newsId)}`,
            { method: "POST", body: formData }
          );

          const uploadResult = await uploadResponse.json();
          console.log("Upload thumbnail response:", uploadResult);

          if (!uploadResponse.ok || !uploadResult.status) {
            throw new Error(uploadResult.message || "Lỗi khi tải ảnh lên");
          }

          uploadedThumbnailUrl = uploadResult.thumbnail;
        } catch (uploadError) {
          console.error("Lỗi khi upload ảnh:", uploadError);
          throw new Error("Lỗi khi tải ảnh lên: " + (uploadError instanceof Error ? uploadError.message : ""));
        }
      }

      // 4️⃣ Nếu có ảnh, cập nhật bài viết với thumbnail
      if (uploadedThumbnailUrl) {
        await fetch(`https://gshopbackend.onrender.com/news/edit?_id=${newsId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thumbnail: uploadedThumbnailUrl }),
        });
      }

      toast.success("Tạo bài viết thành công!");
      router.push("/staff/news");
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Tạo bài viết mới</h2>

      {/* Tiêu đề */}
      <input
        type="text"
        placeholder="Tiêu đề bài viết"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      {/* Nội dung */}
      <Editor value={content} onChange={setContent} />

      {/* Upload ảnh */}
      <div className="mt-4">
        <p className="font-semibold">Thumbnail</p>
        <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="mt-2" />
      </div>

      {/* Nút tạo bài viết */}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Tạo bài viết"}
      </button>
    </div>
  );
}
