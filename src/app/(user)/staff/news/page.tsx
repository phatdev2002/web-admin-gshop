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
    <div className="flex flex-col mb-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg">{filteredNews.length} bài đăng</h1>
        <div>
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc ngày (dd/mm/yyyy)"
                className="pl-8 bg-white w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredNews.map((news) => (
          <div key={news._id} className="bg-white border rounded-md overflow-hidden flex flex-col justify-between">
            <Image
              src={news.images?.[0] || "/default-image.jpg"}
              alt={news.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-base font-semibold mb-1 flex-grow">{news.title}</h2>
              {/* <p className="text-gray-500 flex-grow">
                {news.content.length > 130
                  ? `${news.content.slice(0, 130)}...`
                  : news.content}
              </p> */}
              <div className="flex justify-end mt-2">
                <p className="text-sm text-gray-800">{news.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
