"use client";

import React, { useEffect, useState } from 'react';
import { getDashboard } from '@/apiServices/dashboard';
import { BuyerDashboard, SellerDashboard } from '@/types/dashboard';
import { BuyerDashboardView, SellerDashboardView } from '@/components/user/dashboard';
import { Loader2 } from 'lucide-react';

type DashboardData = BuyerDashboard | SellerDashboard;

const Dashboard = () => {
  const [dashboardType, setDashboardType] = useState<'buyer' | 'seller' | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();
        
        if (response.success) {
          setDashboardType(response.dashboardType);
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-sm text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {dashboardType === 'buyer' && <BuyerDashboardView data={dashboardData as BuyerDashboard} />}
      {dashboardType === 'seller' && <SellerDashboardView data={dashboardData as SellerDashboard} />}
    </>
  );
};

export default Dashboard;
