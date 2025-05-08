"use client";
import Input from "@/components/shared/Input";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
    phone: "",
    company: "",
    countryCode: "+966",
    industry: "",
    address: "",
    location: "",
  });

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Your submit logic here
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <div>
        <Image
          src="/typography.svg"
          alt="Logo"
          width={100}
          height={50}
          className="h-16 w-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      <h4 className="text-4xl text-[var(--dark-main)]">Signup</h4>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
      >
        <div className="col-span-1 md:col-span-2">
          <Image
            src="/assets/Upload Photo.png"
            alt="Upload"
            width={100}
            height={50}
          />
        </div>

        <Input
          type="text"
          id="firstName"
          name="firstName"
          value={data.firstName}
          onChange={onFieldChange}
          required
          placeholder="First Name"
          className="w-full"
        />

        <Input
          type="text"
          id="lastName"
          name="lastName"
          value={data.lastName}
          onChange={onFieldChange}
          required
          placeholder="Last Name"
          className="w-full"
        />

        <Input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={onFieldChange}
          required
          placeholder="Email"
          className="w-full"
        />

        <div className="w-full col-span-1">
          <div className="flex">
            <select
              id="countryCode"
              name="countryCode"
              value={data.countryCode}
              onChange={onFieldChange}
              className="border border-[var(--input-border)] rounded-l-lg px-3 py-2 bg-white text-[var(--text-gray-tertiary)]"
            >
              <option value="+966">🇸🇦 +966</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
            </select>
            <input
              type="text"
              id="phone"
              name="phone"
              value={data.phone}
              onChange={onFieldChange}
              required
              placeholder="Phone Number"
              className="w-full rounded-r-lg border border-l-0 border-gray-300 px-4 py-2 text-sm focus:outline-none placeholder:text-[var(--text-gray-tertiary)]"
            />
          </div>
        </div>

        <Input
          type="text"
          id="company"
          name="company"
          value={data.company}
          onChange={onFieldChange}
          required
          placeholder="Company"
          className="w-full"
        />

        <Input
          type="text"
          id="website"
          name="website"
          value={data.website}
          onChange={onFieldChange}
          required
          placeholder="Website"
          className="w-full"
        />

        <select
          id="industry"
          name="industry"
          value={data.industry}
          onChange={onFieldChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none text-[var(--text-gray-tertiary)]"
        >
          <option value="" disabled className="text-gray-400">
            Select Industry
          </option>
          <option value="individual">Agricultural</option>
          <option value="company">Automotive</option>
          <option value="admin">Health Care</option>
        </select>

        <select
          id="location"
          name="location"
          value={data.location}
          onChange={onFieldChange}
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none text-[var(--text-gray-tertiary)]"
        >
          <option value="" disabled>
            Select Location
          </option>
          <option value="riyadh">Riyadh</option>
          <option value="jeddah">Jeddah</option>
          <option value="dammam">Dammam</option>
        </select>

        <div className="col-span-1 md:col-span-2">
          <Input
            type="text"
            id="address"
            name="address"
            value={data.address}
            onChange={onFieldChange}
            placeholder="Address"
            className="w-full"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 transition cursor-pointer"
          >
            Register
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-2 w-full">
        <hr className="w-3/4 border-t border-gray-200" />
      </div>
    </div>
  );
};

export default Login;
