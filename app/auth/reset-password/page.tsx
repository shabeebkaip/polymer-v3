'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { resetPassword } from '@/apiServices/auth';
import Link from 'next/link';
import Image from 'next/image';

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email is required');
      router.push('/auth/forgot-password');
    }
  }, [email, router]);

  const passwordRequirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /[0-9]/, text: 'One number' },
    { regex: /[^A-Za-z0-9]/, text: 'One special character' },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.regex.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error('Please enter a new password');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(email, password);

      if (response.status) {
        toast.success(response.message || 'Password reset successfully!');
        // Navigate to login page
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-md">
        <div className="p-4">
          {/* Back Button */}
          <Link
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          {/* Logo */}
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="h-20 w-auto mx-auto"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Password must contain:</p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        req.regex.test(password) ? 'text-green-500' : 'text-gray-300'
                      }`}
                    />
                    <span className={req.regex.test(password) ? 'text-green-700' : 'text-gray-600'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid || password !== confirmPassword}
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </div>

        {/* Success Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Almost there!</strong>{' '}
            {` Once you reset your password, you'll be redirected to the login page.`}
          </p>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
