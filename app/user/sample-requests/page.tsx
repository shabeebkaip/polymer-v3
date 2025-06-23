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
import SampleRequestDetailModal from "@/components/user/sampleRequests/SampleRequestDetailModal";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const SampleRequest = () => {
  const [requests, setRequests] = useState<any[]>([]);
  useEffect(() => {
    getUserSampleRequests().then((response) => {
      setRequests(response.data);
    });
  }, []);
  return (
    <div className="container md:mx-auto px-4 py-6">
      <div className="flex flex-col gap-1 mb-3">
        <h4 className="text-xl text-[var(--dark-main)] ">Sample Requests</h4>
        <p className="text-[var(--text-gray-primary)] max-w-3xl text-sm">
          Here you can find all the sample requests you have made. You can check
          the status of each request and the details of the products you have
          requested.
        </p>
      </div>
      <Table className="border">
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead>SL NO</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((item, index) => (
            <TableRow key={index} >
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
              <TableCell>
                {item.status === "pending" ? (
                  <span className="text-yellow-500">Pending</span>
                ) : item.status === "approved" ? (
                  <span className="text-green-500">Approved</span>
                ) : item.status === "rejected" ? (
                  <span className="text-red-500">Rejected</span>
                ) : item.status === "fullfilled" ? (
                  <span className="text-blue-500">Fullfilled</span>
                ) : (
                  <span className="text-gray-500">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <SampleRequestDetailModal mode="view" requestDetails={item} />
                  <SampleRequestDetailModal mode="edit" requestDetails={item} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SampleRequest;
