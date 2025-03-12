"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search, Plus, Blocks, UserSquareIcon, EditIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ViewProductDialog from "@/components/Dialog/ViewProductDialog";
import { Input } from "@/components/ui/input";
import AddProductDialog from "@/components/Dialog/AddProductDialog";
import { Product } from "@/types/Product";
import { toast } from "sonner";

// API Fetch Functions
const fetchCategories = async () => {
  const res = await fetch("https://gshopbackend.onrender.com/category/list");
  const result = await res.json();
  const categoryList = result.categories || result.data || result;

  if (!Array.isArray(categoryList)) throw new Error("Invalid category format");

  const categoryMap: { [key: string]: string } = {};
  categoryList.forEach((item: { _id: string; name_type: string }) => {
    categoryMap[item._id] = item.name_type;
  });

  return categoryMap;
};

const fetchProductImages = async (id_product: string) => {
  const res = await fetch(`https://gshopbackend.onrender.com/image_product/list-images/${id_product}`);
  const result = await res.json();
  
  if (result.status === false && result.mess === "Không có ảnh cho sản phẩm này") {
    return ""; // Trả về chuỗi rỗng nếu không có ảnh
  }

  const images = result.data[0]?.image || [];
  return images[0] || "";
};


const fetchProducts = async (categories: { [key: string]: string }) => {
  if (Object.keys(categories).length === 0) return [];

  const res = await fetch("https://gshopbackend.onrender.com/product/list");
  const result = await res.json();
  const productList = result.products || result.data || result;

  if (!Array.isArray(productList)) throw new Error("Invalid product format");

  const productsWithImages = await Promise.all(
    productList.map(async (item: {
      _id: string;
      name: string;
      id_category: string;
      price: number;
      isActive: string | boolean;
      quantity: number;
      description: string;
      id_supplier: string;
      viewer: number;
      status: string;
    }) => {
      const image = await fetchProductImages(item._id);
      return {
        _id: item._id,
        name: item.name,
        id_category: categories[item.id_category] || "Không xác định",
        price: item.price,
        isActive: Boolean(item.isActive),
        quantity: item.quantity,
        image: image,
        description: item.description,
        id_supplier: item.id_supplier,
        viewer: item.viewer,
        status: item.status,
      };
    })
  );

  return productsWithImages;
};

const ProductPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const { data: categories = {}, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: products = [], isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["products", categories],
    queryFn: () => fetchProducts(categories),
    enabled: Object.keys(categories).length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProduct = (product: Product) => {
    // Chuyển đổi id_category từ tên sang id nếu cần thiết
    const categoryId = Object.keys(categories).find(
      (key) => categories[key] === product.id_category
    ) || product.id_category;
    setSelectedProduct({ ...product, id_category: categoryId });
    setIsViewDialogOpen(true);
  };

  // Định nghĩa các cột cho DataTable
  const columns = [
    {
      accessorKey: "image",
      header: "Ảnh",
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
        return product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={96}
            height={96}
            className="object-cover rounded"
          />
        ) : (
          <span>Không có ảnh</span>
        );
      }
      
    },
    { accessorKey: "name", header: "Tên sản phẩm" },
    { accessorKey: "id_category", header: "Thể loại" },
    {
      accessorKey: "price",
      header: "Đơn giá",
      cell: ({ row }: { row: { getValue: (key: string) => number } }) => {
        const price = row.getValue("price");
        return price ? `${price.toLocaleString()} đ` : "-";
      },
    },
    
    { accessorKey: "quantity", header: "Số lượng" },
    { accessorKey: "viewer", header: "Lượt xem" },
    { accessorKey: "status", header: "Trạng thái" },
    {
      accessorKey: "isActive",
      header: "Tình trạng",
      cell: ({ row }: { row: { getValue: (key: string) => boolean } }) => (
        <div
          className={`font-medium w-fit px-4 py-2 rounded-lg ${
            row.getValue("isActive") ? "bg-green-300" : "bg-red-300"
          }`}
        >
          {row.getValue("isActive") ? "Đang HĐ" : "Ngừng HĐ "}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
        return (
          <Button size="sm" variant="logout" onClick={() => handleViewProduct(product)}>
            <EditIcon/>
          </Button>
        );
      },
    },
  ];

  const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
    if (!selectedProduct || !selectedProduct._id) {
      alert("Không thể cập nhật sản phẩm!");
      return;
    }
  
    const productData = {
      ...selectedProduct,
      ...updatedProduct,
      isActive:
        updatedProduct.isActive !== undefined
          ? updatedProduct.isActive
          : selectedProduct.isActive,
      description: updatedProduct.description || selectedProduct.description,
      id_category: updatedProduct.id_category || selectedProduct.id_category,
      id_supplier: updatedProduct.id_supplier || selectedProduct.id_supplier,
    };
  
    // In payload ra console để kiểm tra dữ liệu đầu vào
    console.log("Payload gửi đi:", productData);
  
    try {
      const response = await fetch(
        `https://gshopbackend.onrender.com/product/update/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
    
      const result = await response.json();
    
      if (result.status === true) {
        toast.success("Sản phẩm đã được cập nhật thành công!");
        refetchProducts();
      } else if (result.status === false) {
        toast(`Cập nhật sản phẩm thất bại: ${result.mess || "Có lỗi xảy ra"}`);
      }
    } catch (error) {
      toast("Lỗi khi cập nhật sản phẩm!");
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
    
  };
  

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between ">
        <p className="text-lg font-semibold">{filteredProducts.length} sản phẩm</p>
        <div className="flex gap-2 rounded-xl">
          <Button variant="outline" onClick={() => refetchProducts()} className="border ">
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsAddDialogOpen(true)} className="border ">
            <Plus size={16} className="mr-1" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div>
          <form>
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên"
                className="pl-8 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div>
          <Link href="/admin/products/category">
            <Button variant="outline" className="mr-2 border ">
              <Blocks size={16} className="mr-1" />
              Loại Gundam
            </Button>
          </Link>
          <Link href="/admin/products/supplier">
            <Button variant="outline" className="border ">
              <UserSquareIcon size={16} className="mr-1"  />
              Nhà cung cấp
            </Button>
          </Link>
        </div>
      </div>

      {isLoadingCategories || isLoadingProducts ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <DataTable<Product, unknown> columns={columns} data={filteredProducts} />
      )}

      {/* Dialog thêm sản phẩm */}
      <AddProductDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onSubmit={(newProduct) => {
          console.log("Sản phẩm mới:", newProduct);
          refetchProducts(); // Làm mới danh sách sản phẩm sau khi thêm
        }}
      />


      {/* Dialog xem chi tiết sản phẩm */}
      <ViewProductDialog
        isOpen={isViewDialogOpen}
        setIsOpen={setIsViewDialogOpen}
        productToEdit={selectedProduct as Product}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default ProductPage;
