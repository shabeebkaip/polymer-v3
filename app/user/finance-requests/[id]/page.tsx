"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFinanceRequestStore } from '@/stores/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Download,
  Globe,
  Target,
  Settings,
  Edit3,
  Send,
  X,
  TrendingUp,
  DollarSign,
  Banknote,
  Calculator,
  Shield,
  Percent,
  FileCheck
} from "lucide-react";

const FinanceRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { financeRequestDetail, loading, error, updating, fetchFinanceRequestDetail, updateStatus, clearFinanceRequestDetail } = useFinanceRequestStore();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const requestId = params.id as string;

  useEffect(() => {
    if (requestId) {
      fetchFinanceRequestDetail(requestId);
    }

    // Cleanup on unmount
    return () => {
      clearFinanceRequestDetail();
    };
  }, [requestId, fetchFinanceRequestDetail, clearFinanceRequestDetail]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !statusMessage.trim()) {
      alert('Please select a status and provide a message');
      return;
    }

    const success = await updateStatus(requestId, selectedStatus, statusMessage);
    if (success) {
      setShowStatusUpdate(false);
      setSelectedStatus('');
      setStatusMessage('');
    } else {
      alert('Failed to update status. Please try again.');
    }
  };

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

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading finance request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Request</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => fetchFinanceRequestDetail(requestId)}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!financeRequestDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
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
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Finance Request Details</h1>
              <p className="text-gray-600">ID: #{financeRequestDetail._id.slice(-8)}</p>
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
                  <Banknote className="w-6 h-6 text-blue-600" />
                  Finance Request Overview
                </h2>
                <div className={getStatusBadge(financeRequestDetail.status)}>
                  {getStatusIcon(financeRequestDetail.status)}
                  <span>{getStatusText(financeRequestDetail.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Finance Type</p>
                      <p className="font-semibold text-gray-900">{financeRequestDetail.financeType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Requested Amount</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(financeRequestDetail.amount, financeRequestDetail.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Purpose</p>
                      <p className="font-semibold text-gray-900">{financeRequestDetail.purpose}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {financeRequestDetail.duration && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold text-gray-900">{financeRequestDetail.duration} months</p>
                      </div>
                    </div>
                  )}

                  {financeRequestDetail.interestRate && (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
                      <Percent className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="font-semibold text-gray-900">{financeRequestDetail.interestRate}%</p>
                      </div>
                    </div>
                  )}

                  {financeRequestDetail.collateral && (
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Collateral</p>
                        <p className="font-semibold text-gray-900">{financeRequestDetail.collateral}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {financeRequestDetail.description && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{financeRequestDetail.description}</p>
                </div>
              )}
            </div>

            {/* Documents */}
            {financeRequestDetail.documents && financeRequestDetail.documents.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  Supporting Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {financeRequestDetail.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Document {index + 1}</p>
                        <p className="text-sm text-gray-500">Supporting file</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            {financeRequestDetail.statusMessage && financeRequestDetail.statusMessage.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Status History
                </h2>
                <div className="space-y-4">
                  {financeRequestDetail.statusMessage.map((status, index) => (
                    <div key={status._id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                      <div className="flex-shrink-0">
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 capitalize">{status.status.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(status.date)}
                          </span>
                        </div>
                        <p className="text-gray-700">{status.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Applicant Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {financeRequestDetail.user.firstName} {financeRequestDetail.user.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{financeRequestDetail.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{financeRequestDetail.user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{financeRequestDetail.user.company}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">
                      {financeRequestDetail.user.address}, {financeRequestDetail.user.city}, {financeRequestDetail.user.state}, {financeRequestDetail.user.country} {financeRequestDetail.user.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Timeline */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Request Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(financeRequestDetail.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Edit3 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900">{formatDate(financeRequestDetail.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowStatusUpdate(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Update Finance Request Status
            </DialogTitle>
            <DialogDescription>
              Change the status of this finance request and provide a message explaining the update.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                New Status
              </Label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Status Message
              </Label>
              <Textarea
                id="message"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Enter a message explaining this status update..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowStatusUpdate(false);
                setSelectedStatus('');
                setStatusMessage('');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || !statusMessage.trim() || updating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceRequestDetail;
