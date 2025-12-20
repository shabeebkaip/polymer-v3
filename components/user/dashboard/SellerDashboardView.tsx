"use client";

import React from 'react';
import { SellerDashboard } from '@/types/dashboard';
import {
  Package,
  FileText,
  Clock,
  CheckCircle,
  Send,
  Tag,
  TrendingUp,
  Building2,
  DollarSign,
  Users,
  Activity,
  ShoppingCart
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface Props {
  data: SellerDashboard;
}

const SellerDashboardView: React.FC<Props> = ({ data }) => {
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
      approved: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your products and track your business performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {/* Products Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.products.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">My Products</p>
            <div className="text-xs text-green-600 font-semibold">
              +{data.cards.products.newThisMonth} this month
            </div>
          </div>

          {/* Quote Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-purple-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-purple-50 p-2.5 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.quoteRequests.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Quote Requests</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {data.cards.quoteRequests.pending}
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                {data.cards.quoteRequests.accepted}
              </span>
            </div>
          </div>

          {/* Sample Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-green-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-green-50 p-2.5 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <Send className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.sampleRequests.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Sample Requests</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3" />
                {data.cards.sampleRequests.pending}
              </span>
              <span className="flex items-center gap-1 text-purple-600">
                <Send className="w-3 h-3" />
                {data.cards.sampleRequests.sent}
              </span>
            </div>
          </div>

          {/* Best Deals Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-emerald-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-emerald-50 p-2.5 rounded-lg">
                <Tag className="w-5 h-5 text-emerald-600" />
              </div>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.bestDeals.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Best Deals</p>
            <div className="text-xs text-green-600 font-semibold">
              {data.cards.bestDeals.approved} approved
            </div>
          </div>

          {/* Deal Quote Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all hover:border-orange-300">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-orange-50 p-2.5 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <Activity className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{data.cards.dealQuoteRequests.total}</h3>
            <p className="text-sm text-gray-600 font-medium mb-2">Deal Quotes</p>
            <div className="text-xs text-amber-600 font-semibold">
              {data.cards.dealQuoteRequests.pending} pending
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Trends Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Request Trends</h2>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSamples" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="quotes" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorQuotes)"
                  name="Quote Requests"
                />
                <Area 
                  type="monotone" 
                  dataKey="samples" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorSamples)"
                  name="Sample Requests"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quote Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quote Status</h2>
            <ResponsiveContainer width="100%" height={250}>
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
                  <div key={quote._id} className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{quote.product}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <Building2 className="w-3 h-3 inline mr-1" />
                          {quote.buyerCompany} • {quote.buyer}
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
                  <div key={sample._id} className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition-colors rounded-r">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{sample.productName}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <Users className="w-3 h-3 inline mr-1" />
                          {sample.buyerCompany} • {sample.buyerName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(sample.status)}`}>
                        {sample.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Qty: {sample.quantity} units</span>
                      <span>{formatDate(sample.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No recent sample requests</p>
              )}
            </div>
          </div>
        </div>

        {/* Best Deals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Best Deals</h2>
            <Tag className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentActivity.bestDeals.length > 0 ? (
              data.recentActivity.bestDeals.slice(0, 6).map((deal) => (
                <div key={deal._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{deal.product}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deal.status)}`}>
                      {deal.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Original:</span>
                      <span className="line-through text-gray-500">${deal.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Offer:</span>
                      <span className="font-semibold text-green-600">${deal.offerPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Valid until:</span>
                      <span>{formatDate(deal.validity)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">No recent best deals</p>
            )}
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Buyers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Buyers</h2>
            <div className="space-y-3">
              {data.insights.topBuyers.length > 0 ? (
                data.insights.topBuyers.map((buyer, index) => (
                  <div key={buyer._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{buyer.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{buyer.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{buyer.requestCount}</p>
                      <p className="text-xs text-gray-500">requests</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No buyer insights available</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
            <div className="space-y-3">
              {data.insights.topProducts.length > 0 ? (
                data.insights.topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{product.productName}</h4>
                      <p className="text-xs text-gray-600">${product.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-600">{product.requestCount}</p>
                      <p className="text-xs text-gray-500">requests</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No product insights available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardView;
