"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDealQuoteRequestsByDealId } from '@/apiServices/user';
import { DealQuoteRequestByDealId, DealQuoteRequestsByDealIdResponse } from '@/types/quote';
import {
  ArrowLeft,
  Package,
  DollarSign,
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
  TrendingUp,
  Users,
  FileText,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      case 'in_progress':
        return {
          icon: TrendingUp,
          text: 'In Progress',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Quote Requests</h3>
                <p className="text-gray-600 max-w-md">
                  Please wait while we fetch the quote requests for this deal...
                </p>
                
                {/* Loading Progress Dots */}
                <div className="flex space-x-1 mt-4 justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {error ? 'Error Loading Quote Requests' : 'No Data Available'}
                </h3>
                <p className="text-gray-600 max-w-md mb-6">
                  {error || 'Unable to load quote requests for this deal.'}
                </p>
                <button
                  onClick={() => router.push('/user/promotions')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-7xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative">
            {/* Back Button */}
            <button
              onClick={() => router.push('/user/promotions')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Promotions
            </button>

            {/* Title Section */}
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {data.meta.total}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Quote Requests
                </h1>
                {dealInfo && (
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    {dealInfo.title}
                  </p>
                )}
                
                {/* Stats Badges */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border px-3 py-1 text-sm font-semibold">
                    <Clock className="w-4 h-4 mr-2" />
                    {pendingCount} Pending
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200 border px-3 py-1 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {acceptedCount} Accepted
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 border px-3 py-1 text-sm font-semibold">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {respondedCount} Responded
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Information Card */}
        {dealInfo && (
          <div className="mx-auto max-w-7xl mb-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Package className="h-5 w-5" />
                  Deal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-600">Product</span>
                    <p className="text-gray-900 font-semibold mt-1">{dealInfo.productName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-600">Total Requests</span>
                    <p className="text-blue-700 font-bold text-lg mt-1">{data.meta.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quote Requests List */}
        <div className="mx-auto max-w-7xl space-y-6">
          {quoteRequests.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
              <CardContent className="py-12">
                <div className="text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quote Requests Yet</h3>
                  <p className="text-gray-600">
                    This deal hasn't received any quote requests from buyers yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            quoteRequests.map((request: DealQuoteRequestByDealId) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={request._id} className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow">
                  <CardHeader className="border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="w-5 h-5 text-gray-600" />
                          <CardTitle className="text-xl">{request.buyer.company}</CardTitle>
                          <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 ml-8">{request.buyer.name}</p>
                      </div>
                      <button
                        onClick={() => router.push(`/user/promotions/${dealId}/quote-requests/${request._id}`)}
                        className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-colors duration-200 font-medium flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
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
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Buyer's Message
                        </h4>
                        <p className="text-blue-800 text-sm">{request.message}</p>
                      </div>
                    )}

                    {/* Seller Response */}
                    {request.sellerResponse && request.sellerResponse.message && request.sellerResponse.quotedPrice ? (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Your Response
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-green-700">Quoted Price</span>
                            <p className="font-bold text-green-800">{formatCurrency(request.sellerResponse.quotedPrice!)}</p>
                          </div>
                          <div>
                            <span className="text-xs text-green-700">Quantity</span>
                            <p className="font-bold text-green-800">{request.sellerResponse.quotedQuantity} units</p>
                          </div>
                          <div>
                            <span className="text-xs text-green-700">Est. Delivery</span>
                            <p className="font-bold text-green-800">
                              {request.sellerResponse.estimatedDelivery && new Date(request.sellerResponse.estimatedDelivery).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="text-green-800 text-sm mb-3">{request.sellerResponse.message}</p>
                        {request.sellerResponse.quotationDocument && (
                          <a
                            href={request.sellerResponse.quotationDocument.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            {request.sellerResponse.quotationDocument.name}
                            <Download className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          No Response Yet
                        </h4>
                        <p className="text-yellow-800 text-sm">
                          You haven't responded to this quote request yet. Click "View Details" to provide your quotation.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DealQuoteRequestsPage;
