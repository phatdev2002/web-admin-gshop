'use client'
import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/PageTitle';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Blocks, Plus, Search, UserSquareIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";


const ProductPage = () => {
  const [data, setData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Fetch categories
    fetch("https://gshopbackend.onrender.com/category/list")
      .then(response => response.json())
      .then(result => {
        console.log("Category API response:", result);
        const categoryList = result.categories || result.data || result;
        
        if (!Array.isArray(categoryList)) {
          console.error("Unexpected category API response format:", result);
          return;
        }

        const categoryMap: { [key: string]: string } = {};
        categoryList.forEach((item: any) => {
          categoryMap[item._id] = item.name_type;
        });
        setCategories(categoryMap);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    // Fetch products
    fetch("https://gshopbackend.onrender.com/product/list")
      .then(response => response.json())
      .then(result => {
        console.log("API response:", result);
        const productList = result.products || result.data || result;
        
        if (!Array.isArray(productList)) {
          console.error("Unexpected API response format:", result);
          return;
        }
        
        const formattedData = productList.map((item: any) => ({
          name: item.name,
          id_category: categories[item.id_category] || "Không xác định",
          price: item.price,
          status: item.status === "true" ? "Còn hàng" : "Hết hàng",
          quantity: item.quantity,
          rate: "-", // API không có thông tin đánh giá
        }));
        setData(formattedData);
      })
      .catch(error => console.error("Error fetching products:", error));
  }, [categories]);

  return (
    <div>
      <PageTitle title="Quản lý sản phẩm" />
      <div className='flex flex-row align-top my-5 justify-between'>
        <p className="text-lg">{data.length} sản phẩm</p>
        <Button variant='destructive'>
        <div className="mr-1">
          <Plus size={16} /> {/* Icon with size 16 */}
        </div>
          Thêm sản phẩm</Button>
      </div>
      <div className='flex flex-row justify-between my-5'>
        <div className="">
                <form>
                  <div className="relative ">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm" className="pl-8 bg-white" />
                  </div>
                </form>
              </div>
        <div className=''>
          <Button variant='outline' className='mr-2'>
            <div className="mr-1">
              <Blocks size={16} /> {/* Icon with size 16 */}
            </div>
              Loại Gundam</Button>
          <Button variant='outline'>
            <div className="mr-1">
              <UserSquareIcon size={16} /> {/* Icon with size 16 */}
            </div>
          Nhà cung cấp</Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductPage;

export type Product = {
  name: string;
  id_category: string;
  price: number;
  status: "Còn hàng" | "Hết hàng";
  quantity: number;
  rate: string;
};

export const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "Sản phẩm" },
  { accessorKey: "id_category", header: "Danh mục" },
  { accessorKey: "price", header: "Đơn giá" },
  { accessorKey: "status", header: "Trạng thái",
    cell:({row})=>(
      <div className={cn("font-medium w-fit px-4 py-2 rounded-lg",
        {
          "bg-red-200": row.getValue("status") === "Hết hàng",
          "bg-green-200": row.getValue("status") === "Còn hàng"
        }
      )}>
        {row.getValue('status')}
      </div>
    )
  },
  { accessorKey: "quantity", header: "Số lượng" },
  { accessorKey: "rate", header: "Đánh giá" },
];
