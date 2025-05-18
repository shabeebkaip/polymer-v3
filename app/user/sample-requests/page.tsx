"use client";

import { getUserSampleRequests } from "@/apiServices/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const SampleRequest = () => {
  const [requests, setRequests] = useState<any[]>([]);
  useEffect(() => {
    getUserSampleRequests().then((response) => {
      setRequests(response.data);
    });
  }, []);
  return (
    <div className="container mx-auto py-6">
      <h4 className="mb-6 text-xl text-[var(--dark-main)] ">Sample Requests</h4>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>SL NO</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Company</TableHead>
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
              <TableCell>{item.createdBy?.company || "--"}</TableCell>
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
  );
};

export default SampleRequest;
