"use client";

import { useEffect, useState } from "react";
import { getUserQuoteRequests } from "@/apiServices/user";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// 1. Status type & map
type Status =
  | "pending"
  | "responded"
  | "negotiation"
  | "approved"
  | "rejected"
  | "cancelled"
  | "fulfilled";

const statusMap: Record<
  Status,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "text-yellow-600 bg-yellow-200",
  },
  responded: {
    label: "Responded",
    className: "text-blue-600 bg-blue-100",
  },
  negotiation: {
    label: "Negotiation",
    className: "text-green-600 bg-green-100",
  },
  approved: {
    label: "Approved",
    className: "text-green-600 bg-green-100",
  },
  rejected: {
    label: "Rejected",
    className: "text-red-600 bg-red-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "text-gray-600 bg-gray-100",
  },
  fulfilled: {
    label: "Fulfilled",
    className: "text-green-600 bg-green-100",
  },
};

// 2. Types for nested fields
interface Product {
  productName?: string;
}

interface CreatedBy {
  company?: string;
}

// 3. Type for a quote request
export interface QuoteRequest {
  id: string;
  product?: Product;
  quantity: number;
  uom?: string;
  createdBy?: CreatedBy;
  createdAt?: string;
  status: Status;
}

// 4. API response shape (customize if needed)
interface QuoteRequestsResponse {
  data: QuoteRequest[];
}

const QuoteRequests = () => {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);

  useEffect(() => {
    let mounted = true;
    getUserQuoteRequests().then((response: QuoteRequestsResponse) => {
      if (mounted) setRequests(response.data ?? []);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Render status badge with fallback
  const renderStatus = (status: Status) => {
    const statusData = statusMap[status] || statusMap["pending"];
    return <Badge className={`${statusData.className} py-1 px-3`}>{statusData.label}</Badge>;
  };

  return (
    <div className="container md:mx-auto px-4 py-6">
      <h4 className="mb-4 text-xl font-semibold text-[var(--dark-main)]">
        Quote Requests
      </h4>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px] border text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>SL NO</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((item, idx) => (
              <TableRow key={item.id ?? idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.product?.productName ?? "--"}</TableCell>
                <TableCell>
                  {item.quantity} {item.uom ?? ""}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.createdBy?.company ?? "--"}
                </TableCell>
                <TableCell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    : "--"}
                </TableCell>
                <TableCell className="capitalize">
                  {renderStatus(item.status)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button variant="outline" className="border cursor-pointer border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition hover:text-[var(--green-main)] ">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteRequests;
