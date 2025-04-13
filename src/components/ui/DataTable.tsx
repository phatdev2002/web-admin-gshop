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
          {totalPages <= 4 ? (
            // Hiển thị toàn bộ khi tổng trang ≤ 4
            Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(i)}
                className={pageIndex === i ? "bg-red-500 text-white" : ""}
              >
                {i + 1}
              </Button>
            ))
          ) : (
            <>
              {/* Trang đầu tiên */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                className={pageIndex === 0 ? "bg-red-500 text-white" : ""}
              >
                1
              </Button>

              {/* Trang 2 và 3 nếu đang ở đầu */}
              {pageIndex <= 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(1)}
                    className={pageIndex === 1 ? "bg-red-500 text-white" : ""}
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(2)}
                    className={pageIndex === 2 ? "bg-red-500 text-white" : ""}
                  >
                    3
                  </Button>
                  <span className="px-2 text-gray-500">...</span>
                </>
              )}

              {/* Ở giữa */}
              {pageIndex > 1 && pageIndex < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex - 1)}
                  >
                    {pageIndex}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex)}
                    className="bg-red-500 text-white"
                  >
                    {pageIndex + 1}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(pageIndex + 1)}
                  >
                    {pageIndex + 2}
                  </Button>
                  <span className="px-2 text-gray-500">...</span>
                </>
              )}

              {/* Ở gần cuối */}
              {pageIndex >= totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(totalPages - 3)}
                    className={pageIndex === totalPages - 3 ? "bg-red-500 text-white" : ""}
                  >
                    {totalPages - 2}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(totalPages - 2)}
                    className={pageIndex === totalPages - 2 ? "bg-red-500 text-white" : ""}
                  >
                    {totalPages - 1}
                  </Button>
                </>
              )}

              {/* Trang cuối */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(totalPages - 1)}
                className={pageIndex === totalPages - 1 ? "bg-red-500 text-white" : ""}
              >
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
