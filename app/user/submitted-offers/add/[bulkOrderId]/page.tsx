"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Send,
  Package,
  DollarSign,
  Clock,
  Upload,
  X,
  MapPin,
  Loader2,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useUserInfo } from "@/lib/useUserInfo";
import { sellerSubmitOffer } from "@/apiServices/user";
import { getIncoterms, postFileUpload, type UploadedFile } from "@/apiServices/shared";
import { getBuyerOpportunities } from "@/apiServices/dealsAndRequests";
import { BulkOrder } from "@/types/user";

// Zod schema for form validation
const offerSchema = z.object({
  pricePerUnit: z.number({ 
    required_error: "Price is required",
    invalid_type_error: "Price must be a number"
  }).min(0.01, "Price must be greater than 0"),
  
  availableQuantity: z.number({ 
    required_error: "Available quantity is required",
    invalid_type_error: "Quantity must be a number"
  }).int("Quantity must be a whole number").min(1, "Quantity must be at least 1"),
  
  deliveryTimeInDays: z.number({ 
    required_error: "Delivery time is required",
    invalid_type_error: "Delivery time must be a number"
  }).int("Delivery time must be a whole number").min(1, "Delivery time must be at least 1 day"),
  
  incotermAndPackaging: z.string({ 
    required_error: "Please select an incoterm"
  }).min(1, "Please select an incoterm"),
  
  message: z.string().optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

const SubmitOffer = () => {
  const router = useRouter();
  const params = useParams();
  const bulkOrderId = params.bulkOrderId as string;
  const { user } = useUserInfo();

  // State management
  const [bulkOrder, setBulkOrder] = useState<BulkOrder | null>(null);
  const [incoterms, setIncoterms] = useState<{_id: string, name: string}[]>([]);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // React Hook Form setup with Zod validation
  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      pricePerUnit: 0,
      availableQuantity: 0,
      deliveryTimeInDays: 7,
      incotermAndPackaging: "",
      message: "",
    },
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load incoterms
        const incotermsResponse = await getIncoterms();
        if (incotermsResponse.success) {
          setIncoterms(incotermsResponse.data);
        }

        // Load bulk order details
        const bulkOrdersResponse = await getBuyerOpportunities();
        if (bulkOrdersResponse.data) {
          // Handle both new and old API structures
          const dataArray = bulkOrdersResponse.data || bulkOrdersResponse;
          const foundOrder = dataArray.find((order: { id: string; _id: string }) => 
            order.id === bulkOrderId || order._id === bulkOrderId
          );
          if (foundOrder) {
            setBulkOrder(foundOrder);
            // Pre-fill quantity if available
            form.setValue('availableQuantity', foundOrder.quantity);
          } else {
            toast.error("Bulk order not found");
            router.back();
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load order details");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (bulkOrderId) {
      loadData();
    }
  }, [bulkOrderId, router, form]);

  // Form submission handler
  const onSubmit = async (data: OfferFormData) => {
    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    if (!bulkOrder) {
      toast.error("Bulk order information not available");
      return;
    }

    try {
      setIsSubmitting(true);

      const offerData = {
        bulkOrderId: bulkOrderId,
        supplierId: user._id,
        pricePerUnit: data.pricePerUnit,
        availableQuantity: data.availableQuantity,
        deliveryTimeInDays: data.deliveryTimeInDays,
        incotermAndPackaging: data.incotermAndPackaging,
        message: data.message || "",
        ...(uploadedFile && {
          offerDocument: {
            id: uploadedFile.id,
            name: uploadedFile.name,
            type: uploadedFile.type,
            fileUrl: uploadedFile.fileUrl,
          }
        }),
      };

      const response = await sellerSubmitOffer(offerData);
      
      if (response.success) {
        toast.success("Offer submitted successfully!");
        router.push("/user/submitted-offers");
      } else {
        toast.error(response.message || "Failed to submit offer");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit offer";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, DOCX, JPG, and PNG files are allowed");
      return;
    }

    try {
      setIsUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
      const uploadResponse = await postFileUpload(formDataUpload);
      setUploadedFile(uploadResponse);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="container mx-auto px-4 py-6 ">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Order Details</h3>
              <p className="text-gray-600 max-w-md">
                Please wait while we fetch the bulk order information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-4 py-6 ">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 mb-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-200/15 to-green-200/15 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="bg-white/80 border-gray-200 hover:bg-white/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div className="relative flex-shrink-0">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <Send className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Submit Your Offer
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  {bulkOrder ? `For ${bulkOrder.product.productName}` : "Loading product information..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        {bulkOrder && (
          <div className="space-y-6">
            {/* Order Information Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Package className="h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Product Info */}
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {bulkOrder.product.productName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {bulkOrder.product.tradeName && (
                        <p>Trade Name: {bulkOrder.product.tradeName}</p>
                      )}
                      {bulkOrder.product.chemicalName && (
                        <p>Chemical Name: {bulkOrder.product.chemicalName}</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Required Quantity</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {bulkOrder.quantity.toLocaleString()} {bulkOrder.uom}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Delivery Date</Label>
                    <p className="text-gray-900">{formatDate(bulkOrder.delivery_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Location</Label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {bulkOrder.city}, {bulkOrder.country}
                    </p>
                  </div>

                  {/* Buyer Info */}
                  <div className="lg:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">Buyer Information</Label>
                    <div className="bg-white/60 p-3 rounded-lg mt-1">
                      <p className="font-medium text-gray-900">
                        {bulkOrder?.user?.firstName} {bulkOrder?.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{bulkOrder?.user?.company}</p>
                      <p className="text-sm text-gray-600">{bulkOrder?.user?.email}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {bulkOrder.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Buyer Message */}
                  {bulkOrder.message && (
                    <div className="lg:col-span-3">
                      <Label className="text-sm font-medium text-gray-600">Buyer Message</Label>
                      <div className="bg-white/60 p-3 rounded-lg mt-1">
                        <p className="text-gray-700">{bulkOrder.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Offer Submission Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <DollarSign className="h-5 w-5" />
                  Your Offer Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Per Unit */}
                    <div className="space-y-2">
                      <Label htmlFor="pricePerUnit" className="text-sm font-medium">
                        Price Per Unit (USD) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="pricePerUnit"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          {...form.register('pricePerUnit', { valueAsNumber: true })}
                        />
                      </div>
                      {form.formState.errors.pricePerUnit && (
                        <p className="text-sm text-red-600">{form.formState.errors.pricePerUnit.message}</p>
                      )}
                    </div>

                    {/* Available Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="availableQuantity" className="text-sm font-medium">
                        Available Quantity ({bulkOrder.uom}) *
                      </Label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="availableQuantity"
                          type="number"
                          min="1"
                          placeholder={bulkOrder.quantity.toString()}
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          {...form.register('availableQuantity', { valueAsNumber: true })}
                        />
                      </div>
                      {form.formState.errors.availableQuantity && (
                        <p className="text-sm text-red-600">{form.formState.errors.availableQuantity.message}</p>
                      )}
                    </div>

                    {/* Delivery Time */}
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTimeInDays" className="text-sm font-medium">
                        Delivery Time (Days) *
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="deliveryTimeInDays"
                          type="number"
                          min="1"
                          placeholder="7"
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          {...form.register('deliveryTimeInDays', { valueAsNumber: true })}
                        />
                      </div>
                      {form.formState.errors.deliveryTimeInDays && (
                        <p className="text-sm text-red-600">{form.formState.errors.deliveryTimeInDays.message}</p>
                      )}
                    </div>

                    {/* Incoterm & Packaging */}
                    <div className="space-y-2">
                      <Label htmlFor="incotermAndPackaging" className="text-sm font-medium">
                        Incoterm & Packaging *
                      </Label>
                      <Select 
                        onValueChange={(value) => form.setValue('incotermAndPackaging', value)}
                        value={form.watch('incotermAndPackaging')}
                      >
                        <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100">
                          <SelectValue placeholder="Select incoterm and packaging" />
                        </SelectTrigger>
                        <SelectContent>
                          {incoterms.map((incoterm) => (
                            <SelectItem key={incoterm._id} value={incoterm.name}>
                              {incoterm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.incotermAndPackaging && (
                        <p className="text-sm text-red-600">{form.formState.errors.incotermAndPackaging.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Message - Full Width */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Additional Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Add any additional information about your offer..."
                      rows={3}
                      className="bg-gray-50/50 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      {...form.register('message')}
                    />
                  </div>

                  {/* File Upload - Full Width */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Supporting Documents (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                      {uploadedFile ? (
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {uploadedFile.name || "Document uploaded"}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeUploadedFile}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            {isUploading ? (
                              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                            ) : (
                              <Upload className="h-8 w-8 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-600">
                              {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
                            </span>
                            <span className="text-xs text-gray-500">
                              PDF, DOC, DOCX, JPG, PNG (max 10MB)
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button - Full Width */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || form.formState.isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 text-base font-medium"
                    >
                      {isSubmitting || form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Offer...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Offer
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitOffer;