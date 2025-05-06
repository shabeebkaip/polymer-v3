"use client";
import Input from "@/components/shared/Input";
import Image from "next/image";
import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

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
      <h4 className="text-4xl text-[var(--dark-main)]">Login</h4>
      <p>
        Access your Polymer Marketplace account to explore, buy, and sell
        high-quality polymers. Enter your credentials below to get started.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
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
    </div>
  );
};

export default Login;
