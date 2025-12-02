"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import OTPVerification from "@/components/auth/OTPVerification";

const VerifyOTPContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      toast.error("Email is required");
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  const handleBack = () => {
    router.push("/auth/forgot-password");
  };

  return (
    <div className="">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl  p-8  ">
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
            <Link href="/" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
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
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              {"We've sent a 6-digit code to"}
            </p>
            <p className="text-primary-600 font-semibold mt-1 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {email}
            </p>
          </div>

          {/* OTP Verification Component */}
          <OTPVerification 
            email={email} 
            type="reset"
            onBack={handleBack}
          />

          {/* Info Box */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> Check your spam folder if you don't see the email. The code expires in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyOTPPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
};

export default VerifyOTPPage;
