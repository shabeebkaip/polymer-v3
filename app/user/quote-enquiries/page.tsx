"use client";

import { getUserQuoteEnquiries } from "@/apiServices/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const QuoteEnquiries = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  useEffect(() => {
    getUserQuoteEnquiries().then((response) => {
      setEnquiries(response.data);
    });
  }, []);
  console.log("enquiries", enquiries);
  return (
    <div className="container mx-auto py-6">
      <h4 className="mb-6 text-xl text-[var(--dark-main)] ">
        Sample Enquiries
      </h4>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>SL NO</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.product?.productName}</TableCell>
              <TableCell>
                {item.quantity} {item?.uom}
              </TableCell>
              <TableCell>
                {item.createdAt
                  ? format(new Date(item.createdAt), "MMM dd, yyyy")
                  : "--"}
              </TableCell>
              <TableCell>{item?.status}</TableCell>
              <TableCell className="capitalize">{item?.user?.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuoteEnquiries;
