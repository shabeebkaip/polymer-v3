'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { verifyRegistrationOtp, resendRegistrationOtp, verifyPasswordResetOtp, requestPasswordReset } from '@/apiServices/auth';
import { useUserInfo } from '@/lib/useUserInfo';
import { OTPVerificationProps } from '@/types/auth';

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack, type = 'register' }) => {
  const router = useRouter();
  const { setUser } = useUserInfo();
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (!email) return;
    
    // Use different resend API based on type
    const resp = type === 'register' 
      ? await resendRegistrationOtp(email)
      : await requestPasswordReset(email);
    
    if (resp?.status) {
      toast.success('Verification code resent');
      setResendTimer(60);
      setOtp(''); // Clear OTP on resend
    } else {
      toast.error(resp?.message || 'Unable to resend code');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Enter 6-digit code');
      return;
    }
    setVerifyingOtp(true);
    
    // Use different verify API based on type
    const resp = type === 'register'
      ? await verifyRegistrationOtp(email, otp)
      : await verifyPasswordResetOtp(email, otp);
    
    setVerifyingOtp(false);
    
    if (resp?.status) {
      if (type === 'register') {
        toast.success('Email verified successfully');
        Cookies.set('token', resp.token);
        Cookies.set('userInfo', JSON.stringify(resp.userInfo));
        setUser(resp.userInfo);
        router.push('/');
      } else {
        toast.success('OTP verified successfully');
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }
    } else {
      toast.error(resp?.message || 'Invalid code');
      setOtp(''); // Clear OTP on error
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/[^0-9]/g, '');
    if (!val) {
      const newOtp = otp.split('');
      newOtp[index] = '';
      setOtp(newOtp.join(''));
      return;
    }
    const newOtp = otp.padEnd(6, ' ').split('');
    newOtp[index] = val;
    const joined = newOtp.join('').replace(/\s/g, '');
    setOtp(joined);
    
    // Auto-focus next input
    const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
    if (next) next.focus();
  };

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            inputMode="numeric"
            maxLength={1}
            value={otp[i] || ''}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            id={`otp-${i}`}
            className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
          />
        ))}
      </div>

      {/* Resend Section */}
      <div className="text-center space-y-3">
        <p className="text-gray-600 text-sm">{`Didn't receive the code?`}</p>
        <button
          disabled={resendTimer > 0}
          onClick={handleResend}
          className="text-green-600 disabled:text-gray-400 font-medium hover:underline text-sm"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
        </button>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerifyOtp}
        disabled={otp.length !== 6 || verifyingOtp}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl
                  hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300
                  disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]
                  transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {verifyingOtp ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </span>
        ) : (
          'Verify & Continue'
        )}
      </button>

      {/* Back Link */}
      {onBack && (
        <button
          onClick={onBack}
          className="w-full text-sm text-gray-600 hover:text-gray-700 underline font-medium"
        >
          {type === 'register' ? 'Edit registration details' : 'Back to forgot password'}
        </button>
      )}
    </div>
  );
};

export default OTPVerification;
