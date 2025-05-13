"use client";

import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/shared/Input";
import { login } from "@/apiServices/auth";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async () => {
    const toastId = toast.loading("Authenticating user..."); // Show loading toast

    try {
      const response = await login(email, password);

      toast.dismiss(toastId); // Dismiss the loading toast

      if (response.status) {
        Cookies.set("token", response.token);
        Cookies.set("userInfo", JSON.stringify(response.userInfo));

        toast.success("Login successful");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error: any) {
      toast.dismiss(toastId); // Also dismiss on error
      console.error("Login error:", error);

      if (error?.response?.status === 401) {
        toast.error("Unauthorized: Incorrect email or password.");
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    }
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

      <h4 className="text-4xl text-[var(--dark-main)]">Login</h4>
      <p>
        Access your Polymer Marketplace account to explore, buy, and sell
        high-quality polymers. Enter your credentials below to get started.
      </p>

      <div className="w-full flex flex-col gap-6">
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
          placeholder="Email"
        />

        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            placeholder="Password"
            className="w-full pr-10"
          />
          <div
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 px-4 py-3 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Login
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 w-full">
        <hr className="w-3/4 border-t border-gray-200" />
      </div>

      <div className="flex items-center justify-center gap-2 w-full">
        Don&apos;t have an account?
        <Link href="/auth/user-type" className="text-blue-600">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
