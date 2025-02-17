"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Search, Plus, Blocks, UserSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ViewProductDialog from "@/components/Dialog/ViewProductDialog";
import { Input } from "@/components/ui/input";
import AddProductDialog from "@/components/Dialog/AddProductDialog";
import { Product } from "@/types/Product"; 


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
  const images = result.data[0]?.image || [];
  return images[1] || "";
};

const fetchProducts = async (categories: { [key: string]: string }) => {
  if (Object.keys(categories).length === 0) return [];

  const res = await fetch("https://gshopbackend.onrender.com/product/list");
  const result = await res.json();
  const productList = result.products || result.data || result;

  if (!Array.isArray(productList)) throw new Error("Invalid product format");

  const productsWithImages = await Promise.all(
    productList.map(async (item: { _id: string; name: string; id_category: string; price: number; status: string; quantity: number; description: string; id_supplier: string }) => {
      const image = await fetchProductImages(item._id);
      return {
        _id: item._id,
        name: item.name,
        id_category: categories[item.id_category] || "Không xác định",
        price: item.price,
        status: item.status === "true" ? "true" : "false",
        quantity: item.quantity,
        image: image,
        description: item.description,
        id_supplier: item.id_supplier,
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
    setSelectedProduct({
      ...product,
      id_category: Object.keys(categories).find(
        (key) => categories[key] === product.id_category
      ) || product.id_category, // Đảm bảo ID đúng
    });
    setIsViewDialogOpen(true);
  };

  // Định nghĩa cột bên trong ProductPage để có thể sử dụng handleViewProduct
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
      },
    },

    { accessorKey: "name", header: "Sản phẩm" },
    { accessorKey: "id_category", header: "Thể loại" },
    {
      accessorKey: "price",
      header: "Đơn giá",
      cell: ({ row }: { row: { getValue: (key: string) => number } }) => {
        const price = row.getValue("price");
        return price ? `${price.toLocaleString()} đ` : "-";
      },
    },
    
    //{ accessorKey: "description", header: "Ghi chú" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: { getValue: (key: string) => string } }) => (
        <div
          className={`font-medium w-fit px-4 py-2 rounded-lg ${
            row.getValue("status") === "false" ? "bg-red-200" : "bg-green-200"
          }`}
        >
          {row.getValue("status") === "true" ? "Còn hàng" : "Hết hàng"}
        </div>
      ),
    },
    { accessorKey: "quantity", header: "Số lượng" },
    //{ accessorKey: "rate", header: "Đánh giá" },
    {
      accessorKey: "actions",
      header: "Hành động",
      cell: ({ row }: { row: { original: Product } }) => {
        const product = row.original;
      
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewProduct(product)}
          >
            Chỉnh sửa
          </Button>
        );
      },
    },
  ];
  const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
    if (!selectedProduct?._id) return;
  
    // Ensure that all necessary fields are passed to the update request
    const productData = {
      ...selectedProduct,
      ...updatedProduct, // Override existing fields with the updated values
      //status: updatedProduct.status || selectedProduct.status, // Ensure status is set correctly
      status: updatedProduct.status !== undefined ? updatedProduct.status : selectedProduct.status,

      description: updatedProduct.description || selectedProduct.description, // Ensure description is included
      id_category: updatedProduct.id_category || selectedProduct.id_category, // Ensure id_category is included
      id_supplier: updatedProduct.id_supplier || selectedProduct.id_supplier, // Ensure id_supplier is included
    };
  
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
  
      if (response.ok) {
        alert("Sản phẩm đã được cập nhật thành công!");
        refetchProducts(); // Refetch the list of products to get the updated data
      } else {
        alert(`Cập nhật sản phẩm thất bại: ${result.mess || "Có lỗi xảy ra"}`);
      }
    } catch (error) {
      alert("Lỗi khi cập nhật sản phẩm!");
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      console.log("handleUpdateProduct:", handleUpdateProduct);

    }
  };
  
  
  

  return (
    <div>
      <div className="flex flex-row align-top mb-5 justify-between">
        <p className="text-lg">{filteredProducts.length} sản phẩm</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetchProducts()}>
            Làm mới danh sách
          </Button>
          <Button variant="destructive" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-1" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-between my-5">
        <div>
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm"
                className="pl-8 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div>
          <Link href="/admin/products/category">
            <Button variant="outline" className="mr-2">
              <Blocks size={16} className="mr-1" />
              Loại Gundam
            </Button>
          </Link>
          <Link href="/admin/products/supplier">
            <Button variant="outline">
              <UserSquareIcon size={16} className="mr-1" />
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
        onSubmit={(newProduct) => console.log("Sản phẩm mới:", newProduct)}
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
