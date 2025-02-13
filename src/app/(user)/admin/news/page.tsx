"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

const newsData = [
  {
    id: 1,
    title: "Bandai Namco đầu tư 130 triệu USD vào Gundam Metaverse",
    date: "06/04/2024",
    description:
      "Công ty đồ chơi và trò chơi điện tử Bandai Namco Holdings đang đầu tư 15 tỉ yên (khoảng 130 triệu USD) để phát triển Gundam Metaverse...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 2,
    title: "Fan nói lời tạm biệt với mô hình Gundam cao 18m có thể cử động",
    date: "02/04/2024",
    description:
      "Gundam Factory Yokohama đã chính thức bế mạc Gundam RX-78F00 với vô vàn cảm xúc và sự tiếc nuối từ fan...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 3,
    title: "Triển lãm Gundam Expo 2024 thu hút hàng nghìn người tham dự",
    date: "10/05/2024",
    description:
      "Gundam Expo 2024 diễn ra tại Tokyo đã thu hút hàng nghìn fan hâm mộ với nhiều mô hình độc đáo...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 4,
    title: "Gundam Wing trở lại với phiên bản Remaster chất lượng cao",
    date: "15/03/2024",
    description:
      "Bản Remaster của Gundam Wing hứa hẹn sẽ đem lại hình ảnh sắc nét và trải nghiệm mới mẻ cho fan...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 5,
    title: "Mô hình Gundam hiếm được bán đấu giá với giá kỷ lục",
    date: "20/06/2024",
    description:
      "Một mô hình Gundam phiên bản giới hạn đã được bán với giá kỷ lục trong buổi đấu giá tại Nhật Bản...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 6,
    title: "Mobile Suit Gundam SEED FREEDOM ra mắt trailer mới",
    date: "01/07/2024",
    description:
      "Trailer mới của Mobile Suit Gundam SEED FREEDOM vừa được công bố, làm dấy lên sự mong chờ của fan...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 7,
    title: "Gundam Unicorn có phiên bản phát hành giới hạn tại rạp",
    date: "05/08/2024",
    description:
      "Một số rạp chiếu phim tại Nhật Bản sẽ phát hành phiên bản giới hạn của Gundam Unicorn trong tháng này...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 8,
    title: "Gundam xuất hiện tại sự kiện Comic-Con 2024",
    date: "18/07/2024",
    description:
      "Tại Comic-Con 2024, gian hàng Gundam thu hút đông đảo người tham dự với những mẫu mô hình đặc biệt...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 9,
    title: "Gundam Evolution cập nhật bản đồ và chế độ chơi mới",
    date: "23/09/2024",
    description:
      "Trò chơi Gundam Evolution vừa ra mắt bản cập nhật mới với bản đồ và chế độ chơi hấp dẫn hơn...",
    image: "/img/imgNews/ThumbnailsNews.png",
  },
  {
    id: 10,
    title: "Gundam Breaker Mobile tung sự kiện kỷ niệm 5 năm",
    date: "30/11/2024",
    description:
      "Sự kiện kỷ niệm 5 năm của Gundam Breaker Mobile hứa hẹn mang đến nhiều phần thưởng giá trị cho người chơi...",
    image: "/img/imgNews/ThumbnailsNews.png",
  }
];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = newsData.filter((news) =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.date.includes(searchTerm) // Tìm theo ngày
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
          <div key={news.id} className="flex gap-4 border-b pb-4">
            <Image src={news.image} alt={news.title} width={128} height={80} className="object-cover rounded-md" />
            <div>
              <h2 className="text-lg font-semibold">{news.title}</h2>
              <p className="text-sm text-gray-500">{news.date}</p>
              <p className="text-gray-700">{news.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}