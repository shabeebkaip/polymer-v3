'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

const AccountVerificationBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if banner was dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('accountVerificationBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store dismissal in session storage (will reset when browser is closed)
    sessionStorage.setItem('accountVerificationBannerDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <p className="text-xs font-medium text-gray-800">
                Account Verification Pending
              </p>
              <span className="text-xs text-gray-600 hidden sm:inline">
                — The PolymerHub team is reviewing your account.
              </span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-0.5 hover:bg-yellow-100 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountVerificationBanner;
