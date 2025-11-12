'use client';

import React, { useEffect, useRef, useState, ChangeEvent, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Upload, CheckCircle2 } from 'lucide-react';

import Input from '@/components/shared/Input';
import { getIndustryList, imageUpload } from '@/apiServices/shared';
import { register } from '@/apiServices/auth';
import { getCountryList } from '@/lib/useCountries';
import OTPVerification from '@/components/auth/OTPVerification';
import { Industry, Country, RegisterData } from '@/types/auth';

const Register: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get('role');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '',
    phone: '',
    company: '',
    country_code: '+966',
    industry: '',
    address: '',
    location: '',
    company_logo: '',
    vat_number: '',
    user_type: userType || 'buyer',
  });

  const countries = useMemo<Country[]>(() => {
    return getCountryList().filter((c): c is Country => c !== null);
  }, []);

  useEffect(() => {
    getIndustryList().then((response) => {
      const industries = response?.data?.map((item: { _id: string; name: string; bg: string }) => ({
        _id: item._id,
        name: item.name,
        image: item.bg,
        bg: item.bg,
      }));
      setIndustryList(industries);
    });
  }, []);

  const onFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const { fileUrl } = await imageUpload(formData);
      setData((prev) => ({ ...prev, company_logo: fileUrl }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('File upload failed', error);
      toast.error('Failed to upload logo');
    }
  };

  const validateForm = () => {
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      return 'Please fill in all required fields.';
    }

    if (data.password !== data.confirmPassword) {
      return 'Passwords do not match.';
    }

    if (data.user_type === 'seller') {
      if (!data.vat_number || data.vat_number.trim() === '') {
        return 'VAT number is required for sellers.';
      }
      if (!data.company_logo || data.company_logo.trim() === '') {
        return 'Company logo is required for sellers.';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
      const response = await register(data);
      toast.dismiss(toastId);

      if (response?.status) {
        toast.success('Registration successful! Check your email for the verification code.');
        setOtpStep(true);
      } else {
        toast.error(response?.message || 'Registration failed.');
        setIsLoading(false);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Register error:', error);
      toast.error('An unexpected error occurred during registration.');
      setIsLoading(false);
    }
  };

  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep === 1) {
      if (!data.firstName || !data.lastName || !data.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    if (currentStep === 2) {
      if (!data.password || !data.confirmPassword) {
        toast.error('Please enter and confirm your password');
        return;
      }
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (data.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isFormValid = () => {
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      return false;
    }

    if (data.user_type === 'seller') {
      if (
        !data.vat_number ||
        data.vat_number.trim() === '' ||
        !data.company_logo ||
        data.company_logo.trim() === ''
      ) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      {/* Logo Section */}
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity mx-auto"
          onClick={() => router.push('/')}
        />
      </div>

      {/* Header Section */}
      {!otpStep && (
        <div className="text-center space-y-2 max-w-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join the Polymer Marketplace in 3 simple steps
          </p>
        </div>
      )}
      {otpStep && (
        <div className="text-center space-y-2 max-w-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-sm">{`We've sent a 6-digit code to ${data.email}`}</p>
        </div>
      )}

      {/* Progress Indicator */}
      {!otpStep && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${
                    currentStep >= step ? 'text-green-700' : 'text-gray-400'
                  }`}>
                    {step === 1 && 'Personal'}
                    {step === 2 && 'Security'}
                    {step === 3 && 'Business'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Form Content */}
      {!otpStep && (
        <div className="w-full max-w-2xl">
          <>
            {/* STEP 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  <p className="text-sm text-gray-600 mt-1">Let's start with your basic details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={data.firstName}
                      onChange={onFieldChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={data.lastName}
                      onChange={onFieldChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={data.email}
                    onChange={onFieldChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll send a verification code to this email</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="country_code"
                      value={data.country_code}
                      onChange={onFieldChange}
                      className="px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 w-32"
                    >
                      {countries?.map((c, idx) => (
                        <option key={idx} value={c.dialCode}>
                          {c.code} {c.dialCode}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="text"
                      id="phone"
                      placeholder="Phone number"
                      value={data.phone}
                      onChange={onFieldChange}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Security */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                  <p className="text-sm text-gray-600 mt-1">Create a strong password to protect your account</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={onFieldChange}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={data.confirmPassword}
                      onChange={onFieldChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-red-700 font-medium">Passwords do not match</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Business Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">Business Details</h2>
                  <p className="text-sm text-gray-600 mt-1">Tell us about your company</p>
                </div>

                {/* Company Logo Upload */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Company Logo{' '}
                    {data.user_type === 'seller' ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      <span className="text-gray-500 font-normal">(Optional)</span>
                    )}
                  </label>
                  {data?.company_logo ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <div className="w-16 h-16 border border-green-300 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Image
                          src={data.company_logo}
                          alt="Company Logo"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Logo uploaded</p>
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className="text-xs text-green-600 hover:text-green-700 font-medium mt-0.5"
                        >
                          Change logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-all duration-200 focus:outline-none"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Upload Company Logo</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={data.company}
                      onChange={onFieldChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <Input
                      id="website"
                      placeholder="https://company.com"
                      value={data.website}
                      onChange={onFieldChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      VAT Number{' '}
                      {data.user_type === 'seller' ? <span className="text-red-500">*</span> : null}
                    </label>
                    <Input
                      id="vat_number"
                      placeholder="Enter VAT number"
                      value={data.vat_number || ''}
                      onChange={onFieldChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={data.industry}
                      onChange={onFieldChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Select Industry</option>
                      {industryList.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <select
                    id="location"
                    value={data.location}
                    onChange={onFieldChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">Select Location</option>
                    {countries.map((c, idx) => (
                      <option key={idx} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    id="address"
                    placeholder="Full business address"
                    value={data.address}
                    onChange={onFieldChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6 pt-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl
                            hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
              {currentStep < totalSteps && (
                <button
                  onClick={nextStep}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl
                            hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300
                            transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              {currentStep === totalSteps && (
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl
                            hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300
                            disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]
                            transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </>
        </div>
      )}

      {/* OTP Verification */}
      {otpStep && (
        <OTPVerification 
          email={data.email} 
          onBack={() => setOtpStep(false)}
        />
      )}
    </div>
  );
};

export default Register;
