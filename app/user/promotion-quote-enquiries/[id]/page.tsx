'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDealQuoteRequestDetail, updateDealQuoteRequestStatus } from '@/apiServices/user';
import { SellerResponse, CommentSection } from '@/components/user/deal-quote-requests';
import { getStatusConfig } from '@/lib/config/status.config';
import { formatDate } from '@/lib/utils';
import { useUserInfo } from '@/lib/useUserInfo';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Package,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  Truck,
  MessageSquare,
  Gift,
  FileText,
  Tags,
  RefreshCw,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DealQuoteRequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string; // Request ID from /promotion-quote-enquiries/[id]
  const { user } = useUserInfo();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    if (requestId) {
      fetchRequestDetail();
    }
  }, [requestId]);

  useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
    }
  }, [request]);

  const fetchRequestDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDealQuoteRequestDetail(requestId);
      if (response.success) {
        setRequest(response.data);
      } else {
        setError(response.message || 'Failed to load request details');
      }
    } catch (err: any) {
      console.error('Error fetching deal quote request detail:', err);
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmitted = () => {
    // Refresh data after response submission
    fetchRequestDetail();
  };

  const handleOpenStatusModal = () => {
    setSelectedStatus(request.status);
    setStatusMessage('');
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === request.status) {
      toast.info('Please select a different status');
      return;
    }

    setUpdatingStatus(true);

    try {
      const message = statusMessage.trim() || undefined;
      const response = await updateDealQuoteRequestStatus(requestId, selectedStatus, message);
      if (response.success) {
        toast.success('Status updated successfully');
        setStatusMessage('');
        setIsStatusModalOpen(false);
        fetchRequestDetail();
      } else {
        toast.error(response.message || 'Failed to update status');
        setSelectedStatus(request.status);
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update status');
      setSelectedStatus(request.status);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-primary-50/30 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Request Details</h3>
            <p className="text-gray-600 text-center">
              Please wait while we fetch the deal quote request information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-primary-50/30 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Request</h3>
            <p className="text-gray-600 text-center mb-6">
              {error || 'Unable to load the deal quote request details.'}
            </p>
            <button
              onClick={() => router.push('/user/promotion-quote-enquiries')}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Quote Enquiries
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-6 ">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <button
            onClick={() => router.push('/user/promotion-quote-enquiries')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deal Quote Request Details</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Request ID: #{requestId.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.text}
              </div>
              <Button
                onClick={handleOpenStatusModal}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Product Information</h2>
              </div>

              {request.deal?.product && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-0.5">
                      {request.deal.product.productName}
                    </h3>
                    {request.deal.product.tradeName && (
                      <p className="text-gray-600 text-sm">{request.deal.product.tradeName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {request.deal.product.chemicalName && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="text-xs text-gray-600">Chemical Name</label>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">
                          {request.deal.product.chemicalName}
                        </p>
                      </div>
                    )}
                    {request.deal.product.tradeName && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="text-xs text-gray-600">Trade Name</label>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">
                          {request.deal.product.tradeName}
                        </p>
                      </div>
                    )}
                    {request.deal.product.color && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="text-xs text-gray-600">Color</label>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">
                          {request.deal.product.color}
                        </p>
                      </div>
                    )}
                    {request.deal.product.countryOfOrigin && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="text-xs text-gray-600">Country of Origin</label>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">
                          {request.deal.product.countryOfOrigin}
                        </p>
                      </div>
                    )}
                    {request.deal.product.density && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="text-xs text-gray-600">Density</label>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">
                          {request.deal.product.density}
                        </p>
                      </div>
                    )}
                    {request.deal.product.mfi && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <label className="text-xs text-gray-600">MFI</label>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">
                          {request.deal.product.mfi}
                        </p>
                      </div>
                    )}
                  </div>

                  {request.deal.product.productImages &&
                    request.deal.product.productImages.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-4 h-4 text-gray-400" />
                          <label className="text-xs font-semibold text-gray-900">
                            Product Images
                          </label>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {request.deal.product.productImages.map((image: any) => (
                            <div key={image._id || image.id} className="flex-shrink-0">
                              <img
                                src={image.fileUrl}
                                alt={image.name || request.deal.product.productName}
                                className="w-28 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Request Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Request Details</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <label className="text-xs text-gray-600">Quantity</label>
                  </div>
                  <p className="font-bold text-gray-900">
                    {request.orderDetails?.quantity?.toLocaleString() || 0} Kilogram
                  </p>
                </div>

                <div className="col-span-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <label className="text-xs text-gray-600">Annual Volume</label>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {request.orderDetails?.quantity?.toLocaleString() || 0} Kilogram
                  </p>
                </div>

                {request.orderDetails?.deliveryDeadline && (
                  <div className="col-span-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <label className="text-xs text-gray-600">Needed By</label>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {new Date(request.orderDetails.deliveryDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>

              {request.orderDetails?.shippingCountry && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <label className="text-xs text-gray-600">Shipping Country</label>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {request.orderDetails.shippingCountry}
                  </p>
                </div>
              )}

              {request.message && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <label className="text-sm font-semibold text-gray-900">Message</label>
                  </div>
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
              )}
            </div>

            {/* Status Update Modal */}
            <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-primary-500" />
                    Update Status
                  </DialogTitle>
                  <DialogDescription>
                    Update the request status and optionally add a message for the buyer.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status:{' '}
                      <span className="font-bold text-gray-900">
                        {getStatusConfig(request.status).text}
                      </span>
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={updatingStatus}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Pending</option>
                      <option value="responded">Responded</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      disabled={updatingStatus}
                      placeholder="Add a note about this status change..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsStatusModalOpen(false)}
                    disabled={updatingStatus}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || selectedStatus === request.status}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Seller Response - Response Form or View Response */}
            <SellerResponse
              request={request}
              sellerResponse={request.sellerResponse}
              onResponseSubmitted={handleResponseSubmitted}
              currentUserRole={user?.user_type as 'buyer' | 'seller' | 'admin'}
            />

            {/* Comments Section */}
            <CommentSection
              dealQuoteRequestId={requestId}
              currentUserId={request.seller?._id || ''}
              userRole="seller"
            />
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Requested By */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Requested By</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{request.buyer?.name || 'N/A'}</h4>
                  <p className="text-sm text-gray-600">{request.buyer?.company || 'N/A'}</p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm">{request.buyer?.company || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm break-all">{request.buyer?.email || 'N/A'}</p>
                  </div>
                  {request.buyer?.phone && (
                    <div className="flex items-center gap-2.5 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm">{String(request.buyer.phone)}</p>
                    </div>
                  )}
                  {request.buyer?.address &&
                    typeof request.buyer.address === 'string' &&
                    request.buyer.address.trim() && (
                      <div className="flex items-start gap-2.5 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{request.buyer.address}</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Status Timeline</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {getStatusConfig(request.status).text}
                    </p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                </div>

                {request.statusHistory &&
                  request.statusHistory.length > 0 &&
                  request.statusHistory
                    .filter((history: any) => history.status !== request.status)
                    .reverse()
                    .map((history: any) => (
                      <div key={history._id || history.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {getStatusConfig(history.status).text}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(history.date)}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealQuoteRequestDetailPage;
