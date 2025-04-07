"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ViewNewsDialog from "@/components/Dialog/ViewNewsDialog"; // Import Dialog
import { News } from "@/types/News";
import { BASE_URL } from "@/constants";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const router = useRouter();

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
    const dateA = a.date.split("/").reverse().join("-"); // Chuyển từ dd/mm/yyyy thành yyyy-mm-dd
    const dateB = b.date.split("/").reverse().join("-");
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  })
  .filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.date.includes(searchTerm)
  );



  const getValidThumbnail = (thumbnail?: string) => {
    if (!thumbnail) return "/adas.jpg"; // Ảnh mặc định
    const firstImage = thumbnail.split(",")[0].trim(); // Lấy URL đầu tiên và bỏ khoảng trắng
    return firstImage.startsWith("http") ? firstImage : "/phong.jpg";
  };
  
  

  return (
    <div>
      {/* Thanh tìm kiếm & Button tạo bài viết */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="bg-gray-500 text-white rounded-sm py-2 px-4 flex flex-row gap-2">{filteredNews.length} bài đăng</h1>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <div
            key={news._id}
            onClick={() => setSelectedNews(news)}
            className="block h-full cursor-pointer"
          >
            <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-full">
            <Image
              src={getValidThumbnail(news.thumbnail)}
              alt={news.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold flex-grow">{news.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{news.date}</p>
              </div>
            </div>
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
    </div>
  );
}
