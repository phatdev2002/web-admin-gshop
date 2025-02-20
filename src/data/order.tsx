export const hardcodedOrders = [
    { nameclient: "Nguyen Duc Phat", pay: "Tiền mặt", amount: 1500000, order_date: new Date("2025-02-19"), status: 1 },
    { nameclient: "Le Minh Tu", pay: "Chuyển khoản", amount: 2000000, order_date: new Date("2025-02-18"), status: 2 },
    { nameclient: "Tran Thi Lan", pay: "Tiền mặt", amount: 800000, order_date: new Date("2025-02-15"), status: 3 },
    ...Array.from({ length: 100 }, (_, i) => {
      const names = [
        "Nguyen Van A", "Tran Thi B", "Le Van C", "Pham Thi D", "Hoang Van E", "Bui Thi F", "Dang Van G", "Do Thi H", "Vu Van I", "Ngo Thi K",
        "Phan Van L", "Trinh Thi M", "Ly Van N", "Quach Thi O", "La Van P", "Mai Thi Q", "Duong Van R", "Cao Thi S", "Tieu Van T", "Tan Thi U",
        "Mac Van V", "Chu Thi W", "Dinh Van X", "Truong Thi Y", "Vuong Van Z", "Ton Thi AA", "Luu Van BB", "Trinh Thi CC", "Han Van DD", "Quyen Thi EE"
      ];
      return {
        nameclient: names[i % names.length],
        pay: i % 2 === 0 ? "Tiền mặt" : "Chuyển khoản",
        amount: Math.floor(Math.random() * 5000000) + 500000,
        order_date: new Date(
          Math.floor(Math.random() * 2) + 2024, 
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1 
        ),
        status: (i % 3) + 1,
      };
    })
  ];
  
  export const timeFilters = [
    { label: "Hôm nay", value: "today" },
    { label: "Tuần này", value: "week" },
    { label: "Tháng này", value: "month" },
    { label: "Năm nay", value: "year" },
    { label: "Tất cả", value: "all" },
  ];
  