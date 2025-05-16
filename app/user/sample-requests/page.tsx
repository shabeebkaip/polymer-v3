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
import { format } from "date-fns";
import { useEffect, useState } from "react";

const SampleRequest = () => {
  const [requests, setRequests] = useState<any[]>([]);
  useEffect(() => {
    getUserSampleRequests().then((response) => {
      setRequests(response.data);
    });
  }, []);
  console.log("requests", requests);
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
                  ? format(new Date(item.createdAt), "MMM dd, yyyy")
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
