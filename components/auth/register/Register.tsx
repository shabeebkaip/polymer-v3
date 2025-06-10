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
import countryCodesList from "country-codes-list";

import Input from "@/components/shared/Input";
import { getIndustryList, imageUpload } from "@/apiServices/shared";
import { register } from "@/apiServices/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCountryList } from "@/lib/useCountries";

interface Industry {
  _id: string;
  name: string;
  bg: string;
  image?: string;
}
interface UploadedFile {
  fileUrl: string;
  id: string;
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
  const searchParams = useSearchParams();
  const userType = searchParams.get("role");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  console.log("countriesList", countries);

  useEffect(() => {
    getIndustryList().then((response) => {
      const industries = response?.data?.map((item: any) => ({
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
      // ✅ Update state with uploaded URL
      setData((prev) => ({ ...prev, company_logo: fileUrl }));
    } catch (error) {
      console.error("File upload failed", error);
      // optionally show toast or error message
    }
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Registering user...");

    try {
      const response = await register(data);

      toast.dismiss(toastId);

      if (response?.status) {
        toast.success("Registration successful");
        Cookies.set("token", response.token);
        Cookies.set("userInfo", JSON.stringify(response.userInfo));
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(response?.message || "Registration failed.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Register error:", error);
      toast.error("An unexpected error occurred during registration.");
    }
  };
  console.log("data", data);
  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <Image
        src="/typography.svg"
        alt="Logo"
        width={100}
        height={50}
        className="h-16 w-auto cursor-pointer"
        onClick={() => router.push("/")}
      />

      <h4 className="text-4xl text-[var(--dark-main)]">Signup</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="col-span-3">
          {data?.company_logo ? (
            <>
              <Avatar
                className="w-16 h-16"
                onClick={handleAvatarClick}
                style={{ cursor: "pointer" }}
              >
                <AvatarImage src={data?.company_logo} alt="Company Logo" />
                <AvatarFallback>
                  {data?.company?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
              />
            </>
          ) : (
            <div
              className="relative w-fit cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src="/assets/Upload Photo.png"
                alt="Upload"
                width={100}
                height={50}
                className="rounded-md object-contain"
              />
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

        <Input
          id="firstName"
          placeholder="First Name"
          value={data.firstName}
          onChange={onFieldChange}
        />
        <Input
          id="lastName"
          placeholder="Last Name"
          value={data.lastName}
          onChange={onFieldChange}
        />
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={onFieldChange}
        />

        <div className="w-full flex">
          <select
            id="country_code"
            value={data.country_code}
            onChange={onFieldChange}
            className="rounded-l-lg border border-gray-300 px-3 py-2 bg-white text-sm"
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
            placeholder="Phone"
            value={data.phone}
            onChange={onFieldChange}
            className="w-full rounded-r-lg border border-l-0 border-gray-300 px-4 py-2 text-sm"
          />
        </div>

        <Input
          id="company"
          placeholder="Company"
          value={data.company}
          onChange={onFieldChange}
        />
        <Input
          id="website"
          placeholder="Website"
          value={data.website}
          onChange={onFieldChange}
        />
        <Input
          id="vat_number"
          placeholder="VAT Number"
          value={data.vat_number || ""}
          onChange={onFieldChange}
        />

        <select
          id="industry"
          value={data.industry}
          onChange={onFieldChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">Select Industry</option>
          {industryList.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          id="location"
          value={data.location}
          onChange={onFieldChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">Select Location</option>
          {countries.map((c, idx) => (
            <option key={idx} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <Input
          id="address"
          placeholder="Address"
          value={data.address}
          onChange={onFieldChange}
          className="col-span-2"
        />

        <div className="relative w-full">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={onFieldChange}
            placeholder="Password"
            className="w-full pr-10"
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <div className="relative w-full">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={data.confirmPassword}
            onChange={onFieldChange}
            placeholder="Confirm Password"
            className="w-full pr-10"
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <div className="col-span-2">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
