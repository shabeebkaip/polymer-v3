'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductQuoteRequestDetail, updateProductQuoteRequestStatus } from '@/apiServices/user';
import { ProductQuoteSellerResponse } from '@/components/user/product-quote-requests';
import { GenericCommentSection } from '@/components/shared/GenericCommentSection';
import { getStatusConfig } from '@/lib/config/status.config';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useUserInfo } from '@/lib/useUserInfo';
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
import { Textarea } from '@/components/ui/textarea';
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
  FileText,
  Tags,
  Clock,
  CheckCircle,
  Globe,
  User,
} from 'lucide-react';
import Image from 'next/image';

interface ProductQuoteRequestDetail {
  _id: string;
  productId: {
    _id: string;
    productName: string;
    chemicalName?: string;
    tradeName?: string;
    countryOfOrigin?: string;
    description?: string;
    density?: string;
    mfi?: string | number;
    color?: string;
    productImages?: Array<{ fileUrl: string; _id: string }>;
    createdBy?: {
      firstName?: string;
      lastName?: string;
      company?: string;
      email?: string;
      phone?: string;
    };
  };
  buyerId: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone?: number;
    address?: string;
  };
  sellerId: string;
  desiredQuantity: number;
  uom?: string;
  shippingCountry?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  deliveryDeadline?: string;
  paymentTerms?: string;
  application?: string;
  gradeId?: {
    _id: string;
    name: string;
  };
  incotermId?: {
    _id: string;
    name: string;
  };
  packagingTypeId?: {
    _id: string;
    name: string;
  };
  message?: string;
  openRequest?: boolean;
  status: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
  currentStatus: string;
  sellerResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: string | number;
    estimatedDelivery?: string;
    quotationDocument?: {
      id: string;
      name: string;
      type: string;
      fileUrl: string;
      viewUrl: string;
      uploadedAt: string;
    };
    respondedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ProductQuoteRequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;
  const { user } = useUserInfo();

  const [request, setRequest] = useState<ProductQuoteRequestDetail | null>(null);
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
      setSelectedStatus(request.currentStatus);
    }
  }, [request]);

  const fetchRequestDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProductQuoteRequestDetail(requestId);
      if (response.success) {
        setRequest(response.data);
      } else {
        setError(response.message || 'Failed to load request details');
      }
    } catch (err: any) {
      console.error('Error fetching product quote request detail:', err);
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
    setSelectedStatus(request?.currentStatus || '');
    setStatusMessage('');
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!request) return;

    if (selectedStatus === request.currentStatus) {
      toast.info('Please select a different status');
      return;
    }

    // Validate message for rejected/cancelled status
    if ((selectedStatus === 'rejected' || selectedStatus === 'cancelled') && !statusMessage.trim()) {
      toast.error(`Message is required when status is ${selectedStatus}`);
      return;
    }

    setUpdatingStatus(true);

    try {
      const message = statusMessage.trim() || undefined;
      const response = await updateProductQuoteRequestStatus(requestId, selectedStatus, message);
      if (response.success) {
        toast.success('Status updated successfully');
        setStatusMessage('');
        setIsStatusModalOpen(false);
        fetchRequestDetail();
      } else {
        toast.error(response.message || 'Failed to update status');
        setSelectedStatus(request.currentStatus);
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update status');
      setSelectedStatus(request.currentStatus);
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
              Please wait while we fetch the product quote request information...
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
              {error || 'Unable to load the product quote request details.'}
            </p>
            <button
              onClick={() => router.push('/user/product-quote-enquiries')}
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

  const statusConfig = getStatusConfig(request.currentStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <button
            onClick={() => router.push('/user/product-quote-enquiries')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Quote Request</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Request ID: {request._id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.text}
              </div>
              <Button
                onClick={handleOpenStatusModal}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Update Status
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-500" />
                Product Information
              </h3>

              <div className="space-y-4">
                {/* Product Images */}
                {request.productId?.productImages && request.productId.productImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {request.productId.productImages.slice(0, 4).map((image, index) => (
                      <div key={image._id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={image.fileUrl}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-xl text-gray-900 mb-2">
                    {request.productId?.productName}
                  </h4>
                  {request.productId?.tradeName && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Trade Name:</span> {request.productId.tradeName}
                    </p>
                  )}
                  {request.productId?.chemicalName && (
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Chemical Name:</span> {request.productId.chemicalName}
                    </p>
                  )}
                  {request.productId?.description && (
                    <p className="text-gray-600 mt-3">{request.productId.description}</p>
                  )}
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {request.productId?.countryOfOrigin && (
                    <div>
                      <span className="text-sm text-gray-500">Country of Origin</span>
                      <p className="font-medium text-gray-900">{request.productId.countryOfOrigin}</p>
                    </div>
                  )}
                  {request.productId?.color && (
                    <div>
                      <span className="text-sm text-gray-500">Color</span>
                      <p className="font-medium text-gray-900">{request.productId.color}</p>
                    </div>
                  )}
                  {request.productId?.density && (
                    <div>
                      <span className="text-sm text-gray-500">Density</span>
                      <p className="font-medium text-gray-900">{request.productId.density}</p>
                    </div>
                  )}
                  {request.productId?.mfi && (
                    <div>
                      <span className="text-sm text-gray-500">MFI</span>
                      <p className="font-medium text-gray-900">{request.productId.mfi}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Order Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Quantity</span>
                  <p className="font-bold text-lg text-gray-900">
                    {request.desiredQuantity?.toLocaleString()} {request.uom || ''}
                  </p>
                </div>

                {request.gradeId && (
                  <div>
                    <span className="text-sm text-gray-500">Grade</span>
                    <p className="font-medium text-gray-900">{request.gradeId.name}</p>
                  </div>
                )}

                {request.incotermId && (
                  <div>
                    <span className="text-sm text-gray-500">Incoterm</span>
                    <p className="font-medium text-gray-900">{request.incotermId.name}</p>
                  </div>
                )}

                {request.packagingTypeId && (
                  <div>
                    <span className="text-sm text-gray-500">Packaging</span>
                    <p className="font-medium text-gray-900">{request.packagingTypeId.name}</p>
                  </div>
                )}

                {request.application && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">Application</span>
                    <p className="font-medium text-gray-900">{request.application}</p>
                  </div>
                )}

                {request.paymentTerms && (
                  <div>
                    <span className="text-sm text-gray-500">Payment Terms</span>
                    <p className="font-medium text-gray-900">{request.paymentTerms}</p>
                  </div>
                )}

                {request.deliveryDeadline && (
                  <div>
                    <span className="text-sm text-gray-500">Delivery Deadline</span>
                    <p className="font-medium text-gray-900">
                      {new Date(request.deliveryDeadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary-500" />
                Shipping Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {request.shippingCountry && (
                  <div>
                    <span className="text-sm text-gray-500">Country</span>
                    <p className="font-medium text-gray-900">{request.shippingCountry}</p>
                  </div>
                )}
                {request.shippingCity && (
                  <div>
                    <span className="text-sm text-gray-500">City</span>
                    <p className="font-medium text-gray-900">{request.shippingCity}</p>
                  </div>
                )}
                {request.shippingState && (
                  <div>
                    <span className="text-sm text-gray-500">State</span>
                    <p className="font-medium text-gray-900">{request.shippingState}</p>
                  </div>
                )}
                {request.shippingPincode && (
                  <div>
                    <span className="text-sm text-gray-500">Pincode</span>
                    <p className="font-medium text-gray-900">{request.shippingPincode}</p>
                  </div>
                )}
                {request.shippingAddress && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">Address</span>
                    <p className="font-medium text-gray-900">{request.shippingAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Buyer Message */}
            {request.message && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Buyer's Message
                </h4>
                <p className="text-gray-900">{request.message}</p>
              </div>
            )}

            {/* Seller Response */}
            <ProductQuoteSellerResponse
              request={request}
              sellerResponse={request.sellerResponse}
              onResponseSubmitted={handleResponseSubmitted}
              currentUserRole="seller"
            />

            {/* Comments Section */}
            {user && user._id && (
              <GenericCommentSection
                quoteRequestId={request._id}
                currentUserId={user._id}
                commentType="product-quote"
                userRole={(user.role as 'buyer' | 'seller' | 'admin') || 'seller'}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Buyer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-500" />
                Buyer Information
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Company</span>
                  <p className="font-semibold text-gray-900">{request.buyerId?.company}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Contact Person</span>
                  <p className="font-medium text-gray-900">
                    {request.buyerId?.firstName} {request.buyerId?.lastName}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${request.buyerId?.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {request.buyerId?.email}
                    </a>
                  </div>
                </div>

                {request.buyerId?.phone && (
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${request.buyerId.phone}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {request.buyerId.phone}
                      </a>
                    </div>
                  </div>
                )}

                {request.buyerId?.address && (
                  <div>
                    <span className="text-sm text-gray-500">Address</span>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{request.buyerId.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Status Timeline
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <StatusIcon className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{statusConfig.text}</p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                </div>

                {request.status &&
                  request.status
                    .slice()
                    .reverse()
                    .map((history) => {
                      const historyConfig = getStatusConfig(history.status);
                      const HistoryIcon = historyConfig.icon;
                      return (
                        <div key={history._id} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <HistoryIcon className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{historyConfig.text}</p>
                            {history.message && (
                              <p className="text-xs text-gray-600 mt-0.5">{history.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">{formatDate(history.date)}</p>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Change the status of this product quote request. Current status: <strong>{getStatusConfig(request.currentStatus).text}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Message {(selectedStatus === 'rejected' || selectedStatus === 'cancelled') && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Textarea
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder={`Enter a message for this status update${(selectedStatus === 'rejected' || selectedStatus === 'cancelled') ? ' (required)' : ' (optional)'}...`}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsStatusModalOpen(false);
                setSelectedStatus(request.currentStatus);
                setStatusMessage('');
              }}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={updatingStatus || selectedStatus === request.currentStatus}
            >
              {updatingStatus ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductQuoteRequestDetailPage;
