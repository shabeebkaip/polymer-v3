import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
}

export interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  resultsHeader?: {
    title: string;
    isFiltered?: boolean;
    totalCount?: number;
  };
}

export function GenericTable<T>({
  data,
  columns,
  loading = false,
  emptyState,
  pagination,
  resultsHeader
}: GenericTableProps<T>) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="relative mx-auto mb-4 w-10 h-10">
          <div className="absolute inset-0 rounded-full border-3 border-green-200"></div>
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-green-600 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-900 mb-1">Loading...</p>
        <p className="text-xs text-gray-600">Please wait</p>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {emptyState.icon}
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {emptyState.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
          {emptyState.description}
        </p>
        {emptyState.action}
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      {resultsHeader && data.length > 0 && (
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {resultsHeader.title}
                {resultsHeader.isFiltered ? " (Filtered)" : ""}
              </h3>
              {resultsHeader.totalCount !== undefined && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                  {resultsHeader.totalCount}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-gray-200">
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={`font-semibold text-gray-700 py-3 text-xs ${column.className || ''}`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={index} 
              className="hover:bg-gray-50 transition-colors border-gray-200"
            >
              {columns.map((column) => (
                <TableCell key={column.key} className="py-3">
                  {column.render(item, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Showing <span className="font-semibold text-gray-900">{((pagination.currentPage - 1) * pagination.pageSize) + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}</span> of <span className="font-semibold text-gray-900">{pagination.totalItems}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pagination.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-3 h-3" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNumber = pagination.totalPages - 4 + i;
                  } else {
                    pageNumber = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => pagination.onPageChange(pageNumber)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        pagination.currentPage === pageNumber
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
