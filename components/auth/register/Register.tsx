"use client";

import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  useMemo,
} from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import Input from "@/components/shared/Input";
import { getIndustryList, imageUpload } from "@/apiServices/shared";
import { register } from "@/apiServices/auth";
import { getCountryList } from "@/lib/useCountries";
import { useUserInfo } from "@/lib/useUserInfo";

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
  const userType = searchParams.get("role");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
    phone: "",
    company: "",
    country_code: "+966",
    industry: "",
    address: "",
    location: "",
    company_logo: "",
    vat_number: "",
    user_type: userType || "buyer",
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

  const onFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    formData.append("file", files[0]);

    try {
      const { fileUrl } = await imageUpload(formData);
      setData((prev) => ({ ...prev, company_logo: fileUrl }));
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
      return "Please fill in all required fields.";
    }

    // Password confirmation
    if (data.password !== data.confirmPassword) {
      return "Passwords do not match.";
    }

    // Seller-specific validation
    if (data.user_type === "seller") {
      if (!data.vat_number || data.vat_number.trim() === "") {
        return "VAT number is required for sellers.";
      }
      if (!data.company_logo || data.company_logo.trim() === "") {
        return "Company logo is required for sellers.";
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
    const toastId = toast.loading("Registering user...");

    try {
      const response = await register(data);

      toast.dismiss(toastId);

      if (response?.status) {
        toast.success("Registration successful");
        Cookies.set("token", response.token);
        Cookies.set("userInfo", JSON.stringify(response.userInfo));
        setUser(response.userInfo);
        router.push("/");
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(response?.message || "Registration failed.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Register error:", error);
      toast.error("An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
      return false;
    }

    // Seller-specific validation
    if (data.user_type === "seller") {
      if (!data.vat_number || data.vat_number.trim() === "" || !data.company_logo || data.company_logo.trim() === "") {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      {/* Logo Section */}
      <div className="text-center">
        <Image
          src="/typography.svg"
          alt="Logo"
          width={70}
          height={35}
          className="h-7 w-auto cursor-pointer hover:opacity-80 transition-opacity mx-auto"
          onClick={() => router.push("/")}
        />
      </div>

      {/* Header Section */}
      <div className="text-center space-y-0 max-w-2xl">
        <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Create Your Account
        </h1>
        <p className="text-gray-600 text-xs">Join the Polymer Marketplace</p>
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-5xl">
        {/* Company Logo Upload Section */}
        <div className="mb-2 text-center">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Logo {data.user_type === "seller" ? "(Required)" : "(Optional)"}
          </p>
          {data?.company_logo ? (
            <div className="flex flex-col items-center gap-0">
              <div
                className="w-10 h-10 border border-green-100 shadow cursor-pointer hover:scale-105 transition-transform rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center"
                onClick={handleAvatarClick}
              >
                <Image
                  src={data.company_logo}
                  alt="Company Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-xs text-green-600 hover:text-green-700 font-medium mt-1"
              >
                Change
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
            <div
              className="inline-flex items-center gap-2 px-3 py-1 border border-dashed border-green-300 rounded-lg hover:border-green-400 cursor-pointer transition-colors bg-green-50/50 hover:bg-green-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-5 h-5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-green-600"
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
              </div>
              <span className="text-xs text-green-700 font-medium">
                Upload Logo
              </span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {/* Personal Information */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              First Name
            </label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={data.firstName}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Last Name
            </label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={data.lastName}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={data.email}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Phone Number with Country Code */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all duration-200">
              <select
                id="country_code"
                value={data.country_code}
                onChange={onFieldChange}
                className="px-2 py-2 bg-gray-50 text-xs border-r border-gray-300 rounded-l-lg focus:outline-none focus:bg-white"
              >
                {countries?.map((c, idx) => (
                  <option key={idx} value={c.dialCode}>
                    {c.code} {c.dialCode}
                  </option>
                ))}
              </select>
              <input
                type="text"
                id="phone"
                placeholder="Phone number"
                value={data.phone}
                onChange={onFieldChange}
                className="flex-1 px-3 py-2 text-sm rounded-r-lg border-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Company Name
            </label>
            <Input
              id="company"
              placeholder="Enter company name"
              value={data.company}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Website</label>
            <Input
              id="website"
              placeholder="https://company.com"
              value={data.website}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              VAT Number {data.user_type === "seller" ? "(Required)" : ""}
            </label>
            <Input
              id="vat_number"
              placeholder="Enter VAT number"
              value={data.vat_number || ""}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              value={data.industry}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select Industry</option>
              {industryList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Location
            </label>
            <select
              id="location"
              value={data.location}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="">Select Location</option>
              {countries.map((c, idx) => (
                <option key={idx} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 lg:col-span-2">
            <label className="text-xs font-medium text-gray-700">Address</label>
            <Input
              id="address"
              placeholder="Enter full address"
              value={data.address}
              onChange={onFieldChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={onFieldChange}
                placeholder="Create password"
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={data.confirmPassword}
                onChange={onFieldChange}
                placeholder="Confirm password"
                className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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

          {/* Register Button */}
          <div className="lg:col-span-4 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg 
                       hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 
                       disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] 
                       transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-1">
          <p className="text-gray-600 text-xs">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
