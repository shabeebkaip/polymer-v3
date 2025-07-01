"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFinanceRequestDetail } from '@/apiServices/user';
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  AlertCircle,
  ArrowLeft,
  Globe,
  Target,
  TrendingUp,
  DollarSign,
  Banknote,
  Calculator,
  Shield,
  Package,
  Truck,
  CalendarDays
} from "lucide-react";

interface FinanceRequestDetail {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    address: string;
    phone: number;
  };
  productId: {
    _id: string;
    productName: string;
    chemicalName: string;
    description: string;
    productImages: Array<{
      id: string;
      name: string;
      type: string;
      fileUrl: string;
      _id: string;
    }>;
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
      address: string;
      phone: number;
    };
    color: string;
    countryOfOrigin: string;
    density: number;
    elongationAtBreak: number;
    manufacturingMethod: string;
    mfi: number;
    shoreHardness: number;
    tensileStrength: number;
    tradeName: string;
    waterAbsorption: number;
  };
  emiMonths: number;
  quantity: number;
  estimatedPrice: number;
  notes: string;
  status: string;
  productGrade: string;
  desiredDeliveryDate: string;
  destination: string;
  paymentTerms: string;
  requireLogisticsSupport: string;
  previousPurchaseHistory: string;
  additionalNotes: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

const FinanceRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [financeRequest, setFinanceRequest] = useState<FinanceRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = params.id as string;

  useEffect(() => {
    const fetchFinanceRequestDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFinanceRequestDetail(requestId);
        if (response.success) {
          setFinanceRequest(response.data);
        } else {
          setError(response.message || 'Failed to fetch finance request details');
        }
      } catch (error: any) {
        console.error('Error fetching finance request:', error);
        setError(error?.response?.data?.message || 'Failed to fetch finance request details');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchFinanceRequestDetail();
    }
  }, [requestId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case "under_review":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "under_review":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "under_review":
        return "Under Review";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateMonthlyEMI = (price: number, months: number) => {
    if (price && months) {
      return (price / months).toFixed(2);
    }
    return "0.00";
  };

  const getPaymentTermsText = (terms: string) => {
    switch (terms) {
      case "advance": return "Advance Payment";
      case "net30": return "Net 30 Days";
      case "net60": return "Net 60 Days";
      case "net90": return "Net 90 Days";
      case "cod": return "Cash on Delivery";
      case "lc": return "Letter of Credit";
      default: return terms;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600 font-medium">Loading finance request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Request</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!financeRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-6">The finance request you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/user/finance-requests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Finance Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto  py-8 ">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => router.push('/user/finance-requests')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Finance Requests
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finance Request Details</h1>
              <p className="text-gray-600">ID: #{financeRequest._id.slice(-8)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Request Overview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Banknote className="w-6 h-6 text-green-600" />
                  Finance Request Overview
                </h2>
                <div className={getStatusBadge(financeRequest.status)}>
                  {getStatusIcon(financeRequest.status)}
                  <span>{getStatusText(financeRequest.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Price</p>
                      <p className="font-semibold text-gray-900">
                        {financeRequest.estimatedPrice > 0 ? formatCurrency(financeRequest.estimatedPrice) : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">EMI Duration</p>
                      <p className="font-semibold text-gray-900">{financeRequest.emiMonths} months</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold text-gray-900">{financeRequest.quantity.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {financeRequest.estimatedPrice > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                      <Banknote className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Monthly EMI</p>
                        <p className="font-semibold text-gray-900">
                          ${calculateMonthlyEMI(financeRequest.estimatedPrice, financeRequest.emiMonths)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                    <FileText className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Terms</p>
                      <p className="font-semibold text-gray-900">{getPaymentTermsText(financeRequest.paymentTerms)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Logistics Support</p>
                      <p className="font-semibold text-gray-900">{financeRequest.requireLogisticsSupport}</p>
                    </div>
                  </div>
                </div>
              </div>

              {financeRequest.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Request Notes
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{financeRequest.notes}</p>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-green-600" />
                Product Information
              </h2>
              
              <div className="flex gap-6">
                {financeRequest.productId.productImages && financeRequest.productId.productImages.length > 0 && (
                  <div className="flex-shrink-0">
                    <img 
                      src={financeRequest.productId.productImages[0].fileUrl}
                      alt={financeRequest.productId.productName}
                      className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                    />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{financeRequest.productId.productName}</h3>
                    <p className="text-gray-600">{financeRequest.productId.chemicalName}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Trade Name</p>
                      <p className="font-medium text-gray-900">{financeRequest.productId.tradeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-medium text-gray-900">{financeRequest.productId.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Country of Origin</p>
                      <p className="font-medium text-gray-900">{financeRequest.productId.countryOfOrigin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Manufacturing Method</p>
                      <p className="font-medium text-gray-900">{financeRequest.productId.manufacturingMethod}</p>
                    </div>
                  </div>

                  {financeRequest.productId.description && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-700 leading-relaxed">{financeRequest.productId.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(financeRequest.previousPurchaseHistory || financeRequest.additionalNotes) && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-600" />
                  Additional Information
                </h2>
                
                <div className="space-y-6">
                  {financeRequest.previousPurchaseHistory && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Previous Purchase History</h3>
                      <p className="text-gray-700 leading-relaxed">{financeRequest.previousPurchaseHistory}</p>
                    </div>
                  )}
                  
                  {financeRequest.additionalNotes && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                      <p className="text-gray-700 leading-relaxed">{financeRequest.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Applicant Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {financeRequest.userId.firstName} {financeRequest.userId.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{financeRequest.userId.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{financeRequest.userId.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{financeRequest.userId.company}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{financeRequest.userId.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium text-gray-900">{financeRequest.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium text-gray-900">{financeRequest.destination || 'Not specified'}</p>
                  </div>
                </div>

                {financeRequest.desiredDeliveryDate && (
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Desired Delivery Date</p>
                      <p className="font-medium text-gray-900">{formatDate(financeRequest.desiredDeliveryDate)}</p>
                    </div>
                  </div>
                )}

                {financeRequest.productGrade && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Product Grade</p>
                      <p className="font-medium text-gray-900">{financeRequest.productGrade}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Request Timeline */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Request Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(financeRequest.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900">{formatDate(financeRequest.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Product Supplier
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Supplier</p>
                    <p className="font-medium text-gray-900">
                      {financeRequest.productId.createdBy.firstName} {financeRequest.productId.createdBy.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{financeRequest.productId.createdBy.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{financeRequest.productId.createdBy.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{financeRequest.productId.createdBy.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceRequestDetail;
