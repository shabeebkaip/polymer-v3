"use client";

import { getUserQuoteRequests } from "@/apiServices/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";

const QuoteRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    getUserQuoteRequests().then((response) => {
      setRequests(response.data);
    });
  }, []);

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.product?.productName}</TableCell>
                <TableCell>
                  {item.quantity} {item?.uom}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.createdBy?.company || "--"}
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
                <TableCell className="capitalize">{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuoteRequests;
