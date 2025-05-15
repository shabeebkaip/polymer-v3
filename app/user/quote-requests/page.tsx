"use client";

import {
  getUserQuoteRequests,
  getUserSampleRequests,
} from "@/apiServices/user";
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
  console.log("requests", requests);
  return (
    <div className="container mx-auto py-6">
      <h4 className="mb-6 text-xl text-[var(--dark-main)] ">Quote Requests</h4>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>SL NO</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Company</TableHead>
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
              <TableCell>{item.company || "--"}</TableCell>
              <TableCell className="capitalize">{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuoteRequests;
