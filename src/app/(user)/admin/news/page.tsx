"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ViewNewsDialog from "@/components/Dialog/ViewNewsDialog"; // Import Dialog
import { News } from "@/types/News";
import { BASE_URL } from "@/constants";
import { toast } from "sonner";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);


  // Hàm lấy danh sách tin tức từ server
  const fetchNews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/news/list`);
      const data = await response.json();

      if (data.status && Array.isArray(data.data)) {
        setNewsData(data.data);
      } else {
        console.error("Unexpected API format:", data);
        setNewsData([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);


  const filteredNews = [...newsData]
  .sort((a, b) => {
    // So sánh ngày trước
    const dateA = a.date.split("/").reverse().join("-"); // dd/mm/yyyy -> yyyy-mm-dd
    const dateB = b.date.split("/").reverse().join("-");
    const dateCompare = new Date(dateB).getTime() - new Date(dateA).getTime();

    if (dateCompare !== 0) {
      return dateCompare; // Ngày khác nhau thì ưu tiên ngày
    }

    // Nếu ngày bằng nhau, so tiếp thời gian
    const [hourA, minuteA] = a.time.split(":").map(Number);
    const [hourB, minuteB] = b.time.split(":").map(Number);
    const totalMinutesA = hourA * 60 + minuteA;
    const totalMinutesB = hourB * 60 + minuteB;

    return totalMinutesB - totalMinutesA; // Giờ mới hơn lên trước
  })
  .filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.date.includes(searchTerm)
  );





  const getValidThumbnail = (thumbnail?: string) => {
    if (!thumbnail) return "/adas.jpg"; // Ảnh mặc định
    const firstImage = thumbnail.split(",")[0].trim(); // Lấy URL đầu tiên và bỏ khoảng trắng
    return firstImage.startsWith("http") ? firstImage : "/default-thumbnail.jpg";
  };

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/news/delete?_id=${_id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (data.status) {
        toast.success("Xoá bài viết thành công!");
        fetchNews();
      } else {
        alert("Xoá thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi xoá bài viết:", error);
      alert("Đã xảy ra lỗi khi xoá bài viết!");
    } finally {
      setShowConfirm(false);
      setNewsToDelete(null);
    }
  };
  
  function adjustTimeToVietnam(utcTimeString: string) {
    const [hours, minutes] = utcTimeString.split(":").map(Number);
    let adjustedHours = hours + 7;
  
    if (adjustedHours >= 24) {
      adjustedHours -= 24; // Nếu cộng 7h bị vượt qua 24h, vòng lại
    }
  
    const formattedHours = adjustedHours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}`;
  }
  
  
  
  

  return (
    <div>
      {/* Thanh tìm kiếm & Button tạo bài viết */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="bg-white p-2 text-black rounded-sm text-sm flex flex-row ">Tổng bài viết đã đăng: {filteredNews.length}</h1>

        <div className="flex gap-4">
          {/* Input tìm kiếm */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc ngày (dd/mm/yyyy)"
              className="pl-10 bg-white w-96 border rounded-md shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Button tạo bài viết */}
          <button
            onClick={() => router.push("/admin/news/create")}
            className="px-4 flex items-center gap-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
          >
            <PlusCircle size={20} /> Tạo bài viết
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <p className="text-center">Đang tải tin tức...</p>}

      {/* Danh sách tin tức */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
      {filteredNews.map((news) => (
        <div
          key={news._id}
          className="block h-full group relative"
        >
          <div
            onClick={() => setSelectedNews(news)}
            className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-full cursor-pointer"
          >
            <Image
              src={getValidThumbnail(news.thumbnail)}
              alt={news.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold flex-grow">{news.title}</h2>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600 mt-1">{adjustTimeToVietnam(news.time)}</p>
                <p className="text-sm text-gray-600 mt-1">{news.date}</p>
              </div>
              
            </div>
          </div>

          {/* Nút xoá */}
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              setNewsToDelete(news);
              setShowConfirm(true);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-sm w-6 h-6 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
            title="Xoá bài viết"
          >
            X
          </button>
        </div>
      ))}

      </div>

      {/* Không tìm thấy kết quả */}
      {!loading && filteredNews.length === 0 && (
        <p className="text-center text-gray-500 mt-6">Không tìm thấy bài viết nào!</p>
      )}

      {/* Dialog Xem Chi Tiết */}
      <ViewNewsDialog 
        news={selectedNews} 
        onClose={() => setSelectedNews(null)} 
        onUpdate={fetchNews} 
      />
      {showConfirm && newsToDelete && (
        <ConfirmDialog
          title="Xác nhận xoá"
          message={`Bạn có chắc muốn xoá bài viết "${newsToDelete.title}"?`}
          onConfirm={() => handleDelete(newsToDelete._id)}
          onCancel={() => {
            setShowConfirm(false);
            setNewsToDelete(null);
          }}
        />
      )}

    </div>
  );
}
