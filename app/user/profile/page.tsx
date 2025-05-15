"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserInfo } from "@/lib/useUserInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const Profile = () => {
  const { user } = useUserInfo();
  console.log(user, "user");

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.company_logo} alt="Company Logo" />
              <AvatarFallback>{user?.company?.charAt(0) || "C"}</AvatarFallback>
            </Avatar>
            <p className="text-lg text-gray-700">{user?.company}</p>
          </div>
        </div>
        <div>
          <Label htmlFor="firstName" className="block mb-1">
            First Name
          </Label>
          <Input
            className="h-12 text-lg px-4"
            placeholder="First Name"
            value={user?.firstName}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="block mb-1">
            Last Name
          </Label>
          <Input
            className="h-12 text-lg px-4"
            placeholder="Last Name"
            value={user?.lastName}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="email" className="block mb-1">
            Email
          </Label>
          <Input
            className="h-12 text-lg px-4"
            placeholder="Email"
            value={user?.email}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="phone" className="block mb-1">
            Phone
          </Label>
          <Input
            id="phone"
            className="h-12 text-lg px-4"
            placeholder="Phone"
            value={`${user?.country_code || ""} ${user?.phone || ""}`}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="company" className="block mb-1">
            Company
          </Label>
          <Input
            id="company"
            className="h-12 text-lg px-4"
            placeholder="Company"
            value={user?.company}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="country" className="block mb-1">
            Country
          </Label>
          <Input
            id="country"
            className="h-12 text-lg px-4"
            placeholder="Country"
            value={user?.location}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="address" className="block mb-1">
            Address
          </Label>
          <Input
            id="address"
            className="h-12 text-lg px-4"
            placeholder="Address"
            value={user?.address}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="city" className="block mb-1">
            website
          </Label>
          <Input
            id="city"
            className="h-12 text-lg px-4"
            placeholder="City"
            value={user?.website}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
