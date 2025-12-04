"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDealQuoteRequestsByDealId } from '@/apiServices/user';
import { DealQuoteRequestByDealId, DealQuoteRequestsByDealIdResponse } from '@/types/quote';
import {
  ArrowLeft,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Eye,
  MessageSquare,
  Users,
  FileText,
  Download
} from 'lucide-react';

const DealQuoteRequestsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dealId = params?.id as string; // Route parameter is 'id', not 'dealId'
  
  const [data, setData] = useState<DealQuoteRequestsByDealIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dealId) {
      fetchDealQuoteRequests();
    }
  }, [dealId]);

  const fetchDealQuoteRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDealQuoteRequestsByDealId(dealId);
      setData(response);
    } catch (err: any) {
      console.error('Error fetching deal quote requests:', err);
      setError(err.message || 'Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  };

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          text: 'Accepted',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'responded':
        return {
          icon: MessageSquare,
          text: 'Responded',
          bgColor: 'bg-primary-50',
          textColor: 'text-primary-600',
          borderColor: 'border-primary-500/30'
        };
      case 'shipped':
        return {
          icon: Package,
          text: 'Shipped',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200'
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          text: 'Delivered',
          bgColor: 'bg-teal-100',
          textColor: 'text-teal-800',
          borderColor: 'border-teal-200'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Completed',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          text: 'Cancelled',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          icon: AlertTriangle,
          text: status || 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 ">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Quote Requests</h3>
                <p className="text-gray-600">
                  Please wait while we fetch the quote requests...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 ">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {error ? 'Error Loading Quote Requests' : 'No Data Available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {error || 'Unable to load quote requests for this deal.'}
                </p>
                <button
                  onClick={() => router.push('/user/promotions')}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Promotions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quoteRequests = data.data || [];
  const dealInfo = quoteRequests.length > 0 ? quoteRequests[0].deal : null;

  // Get statistics
  const pendingCount = quoteRequests.filter(req => req.status === 'pending').length;
  const acceptedCount = quoteRequests.filter(req => req.status === 'accepted').length;
  // Check if sellerResponse exists and has actual data (not just empty quotationDocument)
  const respondedCount = quoteRequests.filter(req => 
    req.sellerResponse && 
    req.sellerResponse.message && 
    req.sellerResponse.quotedPrice
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 ">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Back Button */}
          <button
            onClick={() => router.push('/user/promotions')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Title Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
                {dealInfo && (
                  <p className="text-sm text-gray-600 mt-1">{dealInfo.title}</p>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-xs text-yellow-600">Pending</div>
                <div className="text-lg font-bold text-yellow-800">{pendingCount}</div>
              </div>
              <div className="text-center px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-600">Accepted</div>
                <div className="text-lg font-bold text-green-800">{acceptedCount}</div>
              </div>
              <div className="text-center px-4 py-2 bg-primary-50 rounded-lg border border-primary-500/30">
                <div className="text-xs text-primary-600">Responded</div>
                <div className="text-lg font-bold text-primary-600">{respondedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Requests List */}
        <div className="space-y-4">
          {quoteRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quote Requests Yet</h3>
              <p className="text-gray-600">
                This deal hasn't received any quote requests from buyers yet.
              </p>
            </div>
          ) : (
            quoteRequests.map((request: DealQuoteRequestByDealId) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{request.buyer.company}</h3>
                        <p className="text-sm text-gray-600">{request.buyer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.text}
                      </div>
                      <button
                        onClick={() => router.push(`/user/promotions/${dealId}/quote-requests/${request._id}`)}
                        className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {/* Buyer Contact */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{request.buyer.email}</span>
                          </div>
                          {request.buyer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700">{String(request.buyer.phone)}</span>
                            </div>
                          )}
                          {request.buyer.location && request.buyer.location.trim() && request.buyer.location !== ',' && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-700">{request.buyer.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          Order Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium text-gray-900">{request.orderDetails.quantity} units</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Shipping:</span>
                            <span className="ml-2 font-medium text-gray-900">{request.orderDetails.shippingCountry}</span>
                          </div>
                          {request.orderDetails.paymentTerms && (
                            <div>
                              <span className="text-gray-600">Payment:</span>
                              <span className="ml-2 font-medium text-gray-900">{request.orderDetails.paymentTerms}</span>
                            </div>
                          )}
                          {request.orderDetails.deliveryDeadline && (
                            <div>
                              <span className="text-gray-600">Deadline:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {new Date(request.orderDetails.deliveryDeadline).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          Timeline
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Created:</span>
                            <span className="ml-2 font-medium text-gray-900">{formatDate(request.createdAt)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Updated:</span>
                            <span className="ml-2 font-medium text-gray-900">{formatDate(request.updatedAt)}</span>
                          </div>
                          {request.sellerResponse && request.sellerResponse.respondedAt && (
                            <div>
                              <span className="text-gray-600">Responded:</span>
                              <span className="ml-2 font-medium text-green-700">{formatDate(request.sellerResponse.respondedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Buyer Message */}
                    {request.message && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Buyer's Message
                        </h4>
                        <p className="text-gray-900 text-sm">{request.message}</p>
                      </div>
                    )}

                    {/* Seller Response */}
                    {request.sellerResponse && request.sellerResponse.message && request.sellerResponse.quotedPrice ? (
                      <div className="bg-primary-50 rounded-lg p-4 border border-primary-500/30">
                        <h4 className="text-sm font-medium text-primary-600 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Your Response
                        </h4>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-gray-600">Quoted Price</span>
                            <p className="font-bold text-gray-900">{formatCurrency(request.sellerResponse.quotedPrice!)}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Quantity</span>
                            <p className="font-bold text-gray-900">{request.sellerResponse.quotedQuantity} units</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Est. Delivery</span>
                            <p className="font-bold text-gray-900">
                              {request.sellerResponse.estimatedDelivery && new Date(request.sellerResponse.estimatedDelivery).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-900 text-sm mb-3">{request.sellerResponse.message}</p>
                        {request.sellerResponse.quotationDocument && (
                          <a
                            href={request.sellerResponse.quotationDocument.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium border border-primary-500/30"
                          >
                            <FileText className="w-4 h-4" />
                            {request.sellerResponse.quotationDocument.name}
                            <Download className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-yellow-800 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          No response yet. Click "View" to provide your quotation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DealQuoteRequestsPage;
