"use client";

import React from 'react';
import { BuyerDashboard } from '@/types/dashboard';
import {
  FileText,
  Clock,
  CheckCircle,
  Package,
  Send,
  TrendingUp,
  Building2,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Props {
  data: BuyerDashboard;
}

const BuyerDashboardView: React.FC<Props> = ({ data }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Prepare chart data
  const monthlyChartData = data.charts.monthlyQuoteRequests.map((item, index) => ({
    name: monthNames[item.month - 1],
    quotes: item.count,
    samples: data.charts.monthlySampleRequests[index]?.count || 0,
  }));

  // Status distribution for quote requests
  const quoteStatusData = [
    { name: 'Pending', value: data.cards.quoteRequests.pending, color: '#F59E0B' },
    { name: 'Responded', value: data.cards.quoteRequests.responded, color: '#3B82F6' },
    { name: 'Accepted', value: data.cards.quoteRequests.accepted, color: '#10B981' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      responded: 'bg-blue-100 text-blue-700 border-blue-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      sent: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
          <p className="text-gray-600">{`Welcome back! Here's your business overview.`}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Quote Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.quoteRequests.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Total Quote Requests</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {data.cards.quoteRequests.pending} Pending
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                {data.cards.quoteRequests.accepted} Accepted
              </span>
            </div>
          </div>

          {/* Sample Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-purple-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-purple-50 p-2.5 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.sampleRequests.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Sample Requests</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-purple-600">
                <Send className="w-3 h-3" />
                {data.cards.sampleRequests.sent} Sent
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="w-3 h-3" />
                {data.cards.sampleRequests.delivered} Delivered
              </span>
            </div>
          </div>

          {/* Deal Quote Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-green-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-green-50 p-2.5 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <Calendar className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.dealQuoteRequests.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Deal Quote Requests</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {data.cards.dealQuoteRequests.pending} Pending
              </span>
            </div>
          </div>

          {/* Responded Quotes Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-emerald-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-emerald-50 p-2.5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.quoteRequests.responded}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Responded Quotes</p>
            <div className="text-xs text-gray-600 font-semibold">
              {Math.round((data.cards.quoteRequests.responded / data.cards.quoteRequests.total) * 100)}% response rate
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Request Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#9CA3AF"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="quotes" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Quote Requests"
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="samples" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Sample Requests"
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quote Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quote Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={quoteStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {quoteStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {quoteStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Quote Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quote Requests</h2>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.recentActivity.quoteRequests.length > 0 ? (
                data.recentActivity.quoteRequests.slice(0, 5).map((quote) => (
                  <div key={quote._id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{quote.product}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <Building2 className="w-3 h-3 inline mr-1" />
                          {quote.sellerCompany} • {quote.seller}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Qty: {quote.desiredQuantity}</span>
                      <span>{formatDate(quote.createdAt)}</span>
                    </div>
                    {quote.sellerResponse && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                        <p className="text-green-700 font-medium">Price: ${quote.sellerResponse.quotedPrice.toLocaleString()}</p>
                        <p className="text-gray-600 mt-1">{quote.sellerResponse.message}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No recent quote requests</p>
              )}
            </div>
          </div>

          {/* Recent Sample Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sample Requests</h2>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {data.recentActivity.sampleRequests.length > 0 ? (
                data.recentActivity.sampleRequests.slice(0, 5).map((sample) => (
                  <div key={sample._id} className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{sample.product}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Quantity: {sample.quantity} units
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(sample.status)}`}>
                        {sample.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(sample.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No recent sample requests</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Sellers Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.insights.topSellers.length > 0 ? (
              data.insights.topSellers.map((seller, index) => (
                <div key={seller._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{seller.name}</h4>
                    <p className="text-xs text-gray-600 truncate">{seller.company}</p>
                    <p className="text-xs text-green-600 mt-1 font-medium">{seller.requestCount} requests</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">No seller insights available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardView;
