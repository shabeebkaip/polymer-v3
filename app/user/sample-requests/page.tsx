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
import { set } from "date-fns";
import { useEffect, useState } from "react";

const dummyData = [
  {
    id: 1,
    name: "Alice Johnson",
    company: "Innovatech Ltd.",
    email: "alice@innovatech.com",
  },
  {
    id: 2,
    name: "Bob Smith",
    company: "TechCorp Inc.",
    email: "bob@techcorp.com",
  },
  {
    id: 3,
    name: "Charlie Lee",
    company: "Alpha Systems",
    email: "charlie@alpha.com",
  },
];

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

export default SampleRequest;
