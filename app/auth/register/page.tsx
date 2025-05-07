"use client";
import Input from "@/components/shared/Input";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Login: React.FC = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
    phone: "",
    company
  });
  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {};

  return (
    <div className="flex flex-col items-start justify-center gap-6 ">
      <div>
        <Image
          src="/typography.svg"
          alt="Logo"
          width={100}
          height={50}
          className="h-16 w-auto"
        />
      </div>
      <h4 className="text-4xl text-[var(--dark-main)]">Signup</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 w-full ">
        <div className="col-span-2">
          <Image
            src="/assets/Upload Photo.png"
            alt="Logo"
            width={100}
            height={50}
            className=""
          />
        </div>
        <Input
          type="text"
          id="firstName"
          value={data.firstName}
          onChange={(e) => onFieldChange(e)}
          required
          placeholder="Email"
          className="w-full"
        />
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />

        <button
          type="submit"
          className="mt-4 px-4 py-3 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Login
        </button>
      </form>
      <div className="flex items-center justify-center gap-2 w-full">
        <hr className="w-3/4 border-t border-gray-200 " />
      </div>
      <div className="flex items-center justify-center gap-2 w-full">
        Don't you have an account?{" "}
        <Link href={"/auth/user-type"} className="text-blue-600">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
