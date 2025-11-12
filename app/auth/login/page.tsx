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
import { useUserInfo } from "@/lib/useUserInfo";

const Login: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async () => {
    const toastId = toast.loading("Authenticating user..."); // Show loading toast
    setIsLoading(true);
    try {
      const response = await login(email, password);

      toast.dismiss(toastId); // Dismiss the loading toast

      if (response.status) {
        Cookies.set("token", response.token);
        Cookies.set("userInfo", JSON.stringify(response.userInfo));
        setUser(response.userInfo);

        toast.success("Login successful");

        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        setIsLoading(false);
        toast.error(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      setIsLoading(false);
      toast.dismiss(toastId); // Also dismiss on error
      console.error("Login error:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response === "object" &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Unauthorized: Incorrect email or password.");
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      {/* Logo Section */}
      <div className="text-center">
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

      {/* Header Section */}
      <div className="text-center space-y-2 max-w-lg">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            placeholder="your.email@company.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              placeholder="Enter your password"
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
        </div>

        {/* Login Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !email || !password}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl 
                   hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 
                   disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] 
                   transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-2">
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/user-type"
            className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
