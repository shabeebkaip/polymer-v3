'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuoteEnquiriesStore } from '@/stores/quoteEnquiriesStore';
import { getReceivedQuoteEnquiryDetail, updateQuoteEnquiryStatus } from '@/apiServices/user';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Factory,
  AlertCircle,
  ArrowLeft,
  Settings,
  Edit3,
  Send,
  X,
  DollarSign,
  ShoppingCart,
  Weight,
} from 'lucide-react';
import Image from 'next/image';
import { StatusOption } from '@/types/quote';

const QuoteEnquiryDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { enquiryDetail, error, setEnquiryDetail, clearEnquiryDetail, setLoading, setError } =
    useQuoteEnquiriesStore();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [localUpdating, setLocalUpdating] = useState(false);

  const statusOptions: StatusOption[] = [
    {
      value: 'pending',
      label: 'Pending Review',
      description: 'Quote enquiry is pending review',
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    {
      value: 'responded',
      label: 'Quote Provided',
      description: 'Quote has been provided to the buyer',
      icon: Send,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      value: 'negotiation',
      label: 'Under Negotiation',
      description: 'Quote is being negotiated',
      icon: Edit3,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      value: 'approved',
      label: 'Approved',
      description: 'Quote has been approved by buyer',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      value: 'rejected',
      label: 'Rejected',
      description: 'Quote has been rejected',
      icon: XCircle,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      description: 'Quote enquiry has been cancelled',
      icon: X,
      color: 'text-gray-600 bg-gray-50 border-gray-200',
    },
  ];

  const fetchEnquiryDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoadingDetail(true);
      setLoading(true);
      setError(null);

      const response = await getReceivedQuoteEnquiryDetail(id);

      if (response.success && response.data) {
        setEnquiryDetail(response.data);
      } else {
        setError(response.message || 'Failed to fetch quote enquiry details');
        toast.error('Failed to load quote enquiry details');
      }
    } catch (error) {
      console.error('Error fetching quote enquiry detail:', error);
      if (typeof error === 'object' && error && 'message' in error) {
        setError(
          (error as { message?: string }).message || 'Failed to fetch quote enquiry details'
        );
      } else {
        setError('Failed to fetch quote enquiry details');
      }
      toast.error('Error loading quote enquiry details');
    } finally {
      setLoadingDetail(false);
      setLoading(false);
    }
  }, [id, setEnquiryDetail, setLoading, setError]);

  useEffect(() => {
    fetchEnquiryDetail();

    return () => {
      clearEnquiryDetail();
    };
  }, [fetchEnquiryDetail, clearEnquiryDetail]);

  const handleStatusChange = async () => {
    if (!selectedStatus || !enquiryDetail) return;

    try {
      setLocalUpdating(true);

      const response = await updateQuoteEnquiryStatus(
        enquiryDetail._id,
        selectedStatus,
        statusMessage
      );

      if (response.success) {
        toast.success('Quote enquiry status updated successfully');
        setStatusModalOpen(false);
        setSelectedStatus('');
        setStatusMessage('');

        // Refresh the data
        await fetchEnquiryDetail();
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setLocalUpdating(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status);
    if (!statusOption) return null;

    const IconComponent = statusOption.icon;
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${statusOption.color}`}
      >
        <IconComponent className="w-4 h-4" />
        {statusOption.label}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loadingDetail) {
    return (
      <div className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !enquiryDetail) {
    return (
      <div className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Enquiry Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The quote enquiry you are looking for does not exist or has been removed.'}
          </p>
          <Button
            onClick={() => router.push('/user/quote-enquiries')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quote Enquiries
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
      <div className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 rounded-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                    Quote Enquiry Details
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Enquiry ID: #{enquiryDetail._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-4">
                {getStatusDisplay(enquiryDetail.status)}
                <Button
                  onClick={() => router.push('/user/quote-enquiries')}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Enquiries
                </Button>

                <Button
                  onClick={() => {
                    setStatusModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 shadow-lg"
                  disabled={localUpdating}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-2 space-y-8">
            {/* Product Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {enquiryDetail.product?.productName}
                    </h3>
                    <p className="text-gray-600">
                      {enquiryDetail.product?.description || 'No description available'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Chemical Name</p>
                      <p className="font-semibold text-gray-900">
                        {enquiryDetail.product?.chemicalName || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Trade Name</p>
                      <p className="font-semibold text-gray-900">
                        {enquiryDetail.product?.tradeName || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Country Of Origin </p>
                      <p className="font-semibold text-gray-900">
                        {enquiryDetail?.product?.countryOfOrigin || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Color</p>
                      <p className="font-semibold text-gray-900">
                        {enquiryDetail.product?.color || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Product Image */}
                  {enquiryDetail.product?.productImages &&
                    enquiryDetail.product.productImages.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-3">Product Image</p>
                        <Image
                          src={enquiryDetail.product.productImages[0].fileUrl}
                          alt={enquiryDetail.product.productName}
                          width={400}
                          height={128}
                          className="w-full h-32 object-cover rounded-lg"
                          style={{ objectFit: 'cover' }}
                          priority
                        />
                      </div>
                    )}

                  {/* Technical Specifications */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Density</p>
                      <p className="font-semibold text-gray-900">
                        {enquiryDetail.product?.density || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">MFI (g/10 min)</p>
                      <p className="font-semibold text-gray-900">
                        {enquiryDetail.product?.mfi || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Requirements */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quote Requirements</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Weight className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Quantity</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {enquiryDetail?.orderDetails?.quantity}
                  </p>
                  <p className="text-sm text-gray-600">{enquiryDetail?.orderDetails?.uom}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Expected Delivery</h3>
                  </div>
                  <p className="text-sm font-medium text-blue-600">
                    {enquiryDetail?.orderDetails?.deliveryDate
                      ? formatDate(enquiryDetail?.orderDetails?.deliveryDate)
                      : 'Not specified'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Pricing</h3>
                  </div>
                  <p className="text-sm font-medium text-purple-600">
                    {enquiryDetail?.orderDetails.pricing || 'Quote Required'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Packaging Type</p>
                    <p className="font-semibold text-gray-900">
                      {enquiryDetail?.orderDetails?.packagingType?.name || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Packaging Size</p>
                    <p className="font-semibold text-gray-900">
                      {enquiryDetail?.orderDetails?.packagingSize || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Incoterm</p>
                    <p className="font-semibold text-gray-900">
                      {enquiryDetail?.orderDetails?.incoterm?.name || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Expected Annual Volume</p>
                    <p className="font-semibold text-gray-900">
                      {enquiryDetail?.orderDetails?.expectedAnnualVolume
                        ? `${enquiryDetail?.orderDetails?.expectedAnnualVolume} ${enquiryDetail?.orderDetails?.uom}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Destination</p>
                    <p className="font-semibold text-gray-900">
                      {enquiryDetail.destination || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">City</p>
                    <p className="font-semibold text-gray-900">{enquiryDetail.city || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Country</p>
                    <p className="font-semibold text-gray-900">{enquiryDetail.country || 'N/A'}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Post Code</p>
                    <p className="font-semibold text-gray-900">{enquiryDetail.postCode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application & Message */}
            {(enquiryDetail.application || enquiryDetail.message) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
                </div>

                {enquiryDetail.application && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Application</h3>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <p className="text-gray-800 leading-relaxed">{enquiryDetail.application}</p>
                    </div>
                  </div>
                )}

                {enquiryDetail.message && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Message</h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {enquiryDetail.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            {/* Buyer Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-3 rounded-xl">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Buyer Information</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{enquiryDetail.user?.name}</h3>
                    <p className="text-green-600 font-medium">{enquiryDetail.user?.company}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {enquiryDetail.user?.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{enquiryDetail.user.email}</span>
                    </div>
                  )}

                  {enquiryDetail.user?.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">{enquiryDetail.user.phone}</span>
                    </div>
                  )}

                  {enquiryDetail.user?.address && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {enquiryDetail.user.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Supplier Information */}
            {enquiryDetail.product?.createdBy && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                    <Factory className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Product Supplier</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Factory className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {enquiryDetail.product.createdBy.firstName}{' '}
                        {enquiryDetail.product.createdBy.lastName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {enquiryDetail.product.createdBy.company}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {enquiryDetail.product.createdBy.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {enquiryDetail.product.createdBy.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 font-medium">
                        {enquiryDetail.product.createdBy.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Status Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Current Status:</span>
                  <div className="ml-2">{getStatusDisplay(enquiryDetail.status)}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Created:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(enquiryDetail.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Last Updated:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(enquiryDetail.updatedAt)}
                  </span>
                </div>

                {enquiryDetail.open_request && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-green-700 font-medium">Open Request:</span>
                    <span className="text-green-800 font-bold">Yes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setStatusModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 shadow-lg"
                  disabled={localUpdating}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Update Status
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 py-3"
                  onClick={() => router.push('/user/quote-enquiries')}
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Back to All Enquiries
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {statusModalOpen && (
          <Dialog
            open={true}
            onOpenChange={(open) => {
              console.log('Dialog open state changing to:', open);
              if (!open) {
                setStatusModalOpen(false);
              }
            }}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  Update Quote Enquiry Status
                </DialogTitle>
                <DialogDescription>
                  Change the status of this quote enquiry and add a message for the buyer.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium mb-3 block">
                    New Status
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSelectedStatus(option.value)}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-colors text-sm ${
                            selectedStatus === option.value
                              ? option.color
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          title={option.description}
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0" />
                          <div className="font-medium truncate">{option.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Add a message for the buyer..."
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    className="mt-2"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusModalOpen(false);
                    setSelectedStatus('');
                    setStatusMessage('');
                  }}
                  disabled={localUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusChange}
                  disabled={!selectedStatus || localUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {localUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default QuoteEnquiryDetails;
