'use client';

import React, { useState } from 'react';
import { Mail, UserCheck, Rocket, CheckCircle, AlertCircle } from 'lucide-react';
import { submitEarlyAccessRequest } from '@/apiServices/earlyAccess';

interface EarlyAccessFormProps {
  className?: string;
  compact?: boolean;
}

const EarlyAccessForm: React.FC<EarlyAccessFormProps> = ({ className = '', compact = false }) => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'buyer' | 'supplier'>('buyer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setStatus({ type: null, message: '' });
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitEarlyAccessRequest({
        email: email.trim(),
        userType,
      });

      if (response.success) {
        setStatus({
          type: 'success',
          message: response.message,
        });
        setEmail('');
        setUserType('buyer');
      } else {
        setStatus({
          type: 'error',
          message: response.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to submit request. Please try again.';
      
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${compact ? 'max-w-md' : 'max-w-lg'} mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
        {/* Form Header - Hidden on compact mode */}
        {!compact && (
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-3">
              <Rocket className="w-7 h-7 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Get Early Access
            </h2>
            <p className="text-sm text-gray-600">
              Join our exclusive early access program
            </p>
          </div>
        )}

        {/* Compact Header for Mobile */}
        {compact && (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Get Early Access
            </h2>
            <p className="text-xs text-gray-600">
              Join our exclusive early access program
            </p>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full pl-10 pr-4 ${compact ? 'py-2.5 text-sm' : 'py-3'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* User Type Selection - Compact Version */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType('buyer')}
              disabled={isSubmitting}
              className={`relative ${compact ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all ${
                userType === 'buyer'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <UserCheck className={`${compact ? 'w-6 h-6' : 'w-7 h-7'} ${
                  userType === 'buyer' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className={`${compact ? 'text-sm' : 'text-base'} font-semibold ${
                  userType === 'buyer' ? 'text-primary-700' : 'text-gray-700'
                }`}>
                  Buyer
                </span>
                {!compact && <span className="text-xs text-gray-500">Source polymers</span>}
              </div>
              {userType === 'buyer' && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setUserType('supplier')}
              disabled={isSubmitting}
              className={`relative ${compact ? 'p-3' : 'p-4'} rounded-lg border-2 transition-all ${
                userType === 'supplier'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <Rocket className={`${compact ? 'w-6 h-6' : 'w-7 h-7'} ${
                  userType === 'supplier' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className={`${compact ? 'text-sm' : 'text-base'} font-semibold ${
                  userType === 'supplier' ? 'text-primary-700' : 'text-gray-700'
                }`}>
                  Supplier
                </span>
                {!compact && <span className="text-xs text-gray-500">Sell polymers</span>}
              </div>
              {userType === 'supplier' && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status.type && (
          <div
            className={`${compact ? 'p-3' : 'p-4'} rounded-lg flex items-start gap-2 ${
              status.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`${compact ? 'text-xs' : 'text-sm'} ${
                status.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {status.message}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${compact ? 'py-2.5' : 'py-3'} bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${compact ? 'text-sm' : ''}`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              <span>Request Early Access</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        {!compact && (
          <p className="text-xs text-center text-gray-500">
            By requesting early access, you agree to receive email updates from PolymersHub.
          </p>
        )}
      </form>
    </div>
  );
};

export default EarlyAccessForm;
