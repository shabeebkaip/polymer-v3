'use client';

import React, { useEffect, useRef, useState, ChangeEvent, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import Input from '@/components/shared/Input';
import { getIndustryList, imageUpload } from '@/apiServices/shared';
import { register } from '@/apiServices/auth';
import { getCountryList } from '@/lib/useCountries';
import { useUserInfo } from '@/lib/useUserInfo';

interface Industry {
  _id: string;
  name: string;
  bg: string;
  image?: string;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  website: string;
  phone: string;
  company: string;
  country_code: string;
  industry: string;
  address: string;
  location: string;
  company_logo: string;
  user_type?: string;
  vat_number?: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUserInfo();
  const searchParams = useSearchParams();
  const userType = searchParams.get('role');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      return 'Please fill in all required fields.';
    }

    // Password confirmation
    if (data.password !== data.confirmPassword) {
      return 'Passwords do not match.';
    }

    // Seller-specific validation
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
    const toastId = toast.loading('Registering user...');

    try {
      const response = await register(data);

      toast.dismiss(toastId);

      if (response?.status) {
        toast.success('Registration successful');
        Cookies.set('token', response.token);
        Cookies.set('userInfo', JSON.stringify(response.userInfo));
        setUser(response.userInfo);
        router.push('/');
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

  const isFormValid = () => {
    // Basic validation
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      return false;
    }

    // Seller-specific validation
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
    <>
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 flex flex-col gap-6 mx-auto">
        {/* Company Logo Upload Section */}
        <div className="text-center ">
          <Image
            src="/typography.svg"
            alt="Logo"
            width={90}
            height={40}
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity mx-auto"
            onClick={() => router.push('/')}
          />
        </div>
        <div className="text-center space-y-1 max-w-xl  mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm">Join the Polymer Marketplace</p>
        </div>
        <div className="flex flex-col items-center gap-2 mb-2">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Company Logo{' '}
            {data.user_type === 'seller' ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-gray-400">(optional)</span>
            )}
          </p>
          {data?.company_logo ? (
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-20 h-20 border-2 border-green-200 shadow cursor-pointer hover:scale-105 transition-transform rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center overflow-hidden"
                onClick={handleAvatarClick}
              >
                <Image
                  src={data.company_logo}
                  alt="Company Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Change Logo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <button
              type="button"
              className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-green-300 rounded-full bg-green-50 hover:border-green-400 hover:bg-green-100 transition-colors focus:outline-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                className="w-6 h-6 text-green-500 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-xs text-green-700 font-medium">Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
              />
            </button>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">First Name</label>
              <Input
                id="firstName"
                placeholder="First name"
                value={data.firstName}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Last Name</label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={data.lastName}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={data.email}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Phone Number</label>
              <div className="flex w-full rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all duration-200">
                <select
                  id="country_code"
                  value={data.country_code}
                  onChange={onFieldChange}
                  className="px-2 py-2 bg-gray-50 text-xs border-r border-gray-200 rounded-l-lg focus:outline-none focus:bg-white w-28 min-w-[80px]"
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
                  className="flex-1 px-3 py-2 text-sm rounded-r-lg border-0 focus:outline-none w-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Company Name</label>
              <Input
                id="company"
                placeholder="Company name"
                value={data.company}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Website</label>
              <Input
                id="website"
                placeholder="https://company.com"
                value={data.website}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                VAT Number{' '}
                {data.user_type === 'seller' ? <span className="text-red-500">*</span> : null}
              </label>
              <Input
                id="vat_number"
                placeholder="VAT number"
                value={data.vat_number || ''}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Industry</label>
              <select
                id="industry"
                value={data.industry}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select Industry</option>
                {industryList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
              <select
                id="location"
                value={data.location}
                onChange={onFieldChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select Location</option>
                {countries.map((c, idx) => (
                  <option key={idx} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Address</label>
            <Input
              id="address"
              placeholder="Full address"
              value={data.address}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={onFieldChange}
                  placeholder="Create password"
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword}
                  onChange={onFieldChange}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Register Button */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg text-base
                       hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300
                       disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]
                       transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-1">
          <p className="text-gray-500 text-xs">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
