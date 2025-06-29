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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Quote, Package, Calendar, User, Mail, TrendingUp, Filter, Search, Download, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuoteEnquiries = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const response = await getUserQuoteEnquiries();
        setEnquiries(response.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load quote enquiries");
        console.error("Error fetching enquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Filter enquiries based on search term
  const filteredEnquiries = enquiries.filter((item) =>
    item.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "outline";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  console.log("enquiries", enquiries);
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {loading ? (
        /* Full Page Loader */
        <div className="space-y-8">
          {/* Header Section Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-20 rounded-md" />
                <Skeleton className="h-10 w-20 rounded-md" />
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                      <Skeleton className="w-10 h-10 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search Section Skeleton */}
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Table Section Skeleton */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-14" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Actual Content */
        <>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Quote className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quote Enquiries</h1>
              <p className="text-gray-600 text-sm">
                Track and manage your quote requests
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Quotes</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {enquiries.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Quote className="w-5 h-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {enquiries.filter(e => e.status?.toLowerCase() === "pending").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">
                    {enquiries.filter(e => e.status?.toLowerCase() === "approved").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {enquiries.filter(e => {
                      const enquiryDate = new Date(e.createdAt);
                      const currentDate = new Date();
                      return enquiryDate.getMonth() === currentDate.getMonth() && 
                             enquiryDate.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product, email, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredEnquiries.length} of {enquiries.length} enquiries
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Quote className="w-5 h-5 text-blue-600" />
            Quote Requests List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900">SL NO</TableHead>
                    <TableHead className="font-semibold text-gray-900">Product</TableHead>
                    <TableHead className="font-semibold text-gray-900">Quantity</TableHead>
                    <TableHead className="font-semibold text-gray-900">Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Quote className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {searchTerm ? "No matching quote enquiries" : "No quote enquiries yet"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {searchTerm 
                                ? "Try adjusting your search criteria"
                                : "Quote enquiries will appear here once customers request quotes"
                              }
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnquiries.map((item, index) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          {enquiries.findIndex(e => e.id === item.id) + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 truncate max-w-xs">
                                {item.product?.productName || "Unknown Product"}
                              </p>
                              {item.product?.sku && (
                                <p className="text-xs text-gray-500">SKU: {item.product.sku}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">
                              {item.quantity || "--"}
                            </span>
                            {item.uom && (
                              <span className="text-sm text-gray-500">
                                {item.uom}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                  })
                                : "--"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${getStatusColor(item.status)} border font-medium`}
                          >
                            {item.status || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {item.user?.email || "Unknown User"}
                              </p>
                              {item.user?.name && (
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {item.user.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
};

export default QuoteEnquiries;
