"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  interface News {
    _id: string;
    title: string;
    date: string;
    content: string;
    images?: string[];
  }

  const [newsData, setNewsData] = useState<News[]>([]);

  useEffect(() => {
    fetch("https://gshopbackend.onrender.com/news/list")
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.status && Array.isArray(data.data)) {
          setNewsData(data.data);
        } else {
          console.error("Unexpected API format:", data);
          setNewsData([]);
        }
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  const filteredNews = newsData.filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.date.includes(searchTerm)
  );

  return (
    <div className="flex flex-col align-top mb-5 justify-between">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg">{filteredNews.length} bài đăng</h1>
        <div>
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề hoặc ngày (VD: 02/04)"
                className="pl-8 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <div key={news._id} className="flex gap-4 pb-2">
            <Image
              src={news.images?.[0] || "/default-image.jpg"}
              alt={news.title}
              width={100}
              height={100}
              className="w-[200px] h-[150px] object-cover rounded-md"
            />
            <div>
              <h2 className="text-lg font-semibold">{news.title}</h2>
              <p className="text-sm text-gray-500">{news.date}</p>
              <p className="text-gray-700">
                {news.content.length > 400
                  ? `${news.content.slice(0, 400)}...`
                  : news.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
