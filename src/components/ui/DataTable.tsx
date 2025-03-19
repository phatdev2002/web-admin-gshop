"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0); // Quản lý trang hiện tại

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, pagination: { pageIndex, pageSize: 10 } },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      setPageIndex((prev) =>
        typeof updater === "function" ? updater({ pageIndex: prev, pageSize: 10 }).pageIndex : updater.pageIndex
      );
    },
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div>
      {/* Bảng hiển thị dữ liệu */}
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" && <ChevronUp className="w-4 h-4 text-blue-500" />}
                        {header.column.getIsSorted() === "desc" && <ChevronDown className="w-4 h-4 text-blue-500" />}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-100 transition">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  Không tìm thấy kết quả, thử tìm kiếm lại hoặc làm mới danh sách.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Điều hướng phân trang */}
      <div className="flex items-center justify-center space-x-2 py-4">
        {/* Nút "Trở lại" */}
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Trở lại
        </Button>

        <div className="flex space-x-2">
          {/* Hiển thị trang đầu tiên nếu trang hiện tại cách xa đầu */}
          {currentPage > 3 && (
            <>
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)}>
                1
              </Button>
              <span className="px-2 text-gray-500">...</span>
            </>
          )}

          {/* Hiển thị 3 trang trước và sau trang hiện tại */}
          {Array.from({ length: totalPages }, (_, index) => {
            if (index >= currentPage - 2 && index <= currentPage + 2) {
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(index)}
                  className={currentPage === index + 1 ? "bg-red-500 text-white" : ""}
                >
                  {index + 1}
                </Button>
              );
            }
          })}

          {/* Hiển thị trang cuối cùng nếu trang hiện tại cách xa cuối */}
          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(totalPages - 1)}>
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* Nút "Tiếp theo" */}
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
