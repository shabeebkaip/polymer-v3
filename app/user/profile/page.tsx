"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserInfo } from "@/lib/useUserInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Save, X, User, Mail, Phone, Building, MapPin, Globe, Camera } from "lucide-react";

const Profile = () => {
  const { user } = useUserInfo();
  const userLoading = !user;
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});

  // Update editedUser when user data loads
  React.useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user || {});
  };

  const handleSave = () => {
    // TODO: Implement API call to save user data
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
    // After successful API call, you would update the user data
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  console.log(user, "user");

  return (
    <div className="container mx-auto px-4 py-6 ">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>
          {!userLoading && (
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="text-center pb-2">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={user?.user_type === "seller" ? user?.company_logo : user?.avatar} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl font-semibold">
                    {user?.user_type === "seller" 
                      ? user?.company?.charAt(0) || "C"
                      : `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`
                    }
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl text-gray-900">
                {userLoading ? (
                  <Skeleton className="h-6 w-32 mx-auto" />
                ) : (
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.company || "User"
                )}
              </CardTitle>
              <p className="text-gray-600 capitalize">
                {userLoading ? (
                  <Skeleton className="h-4 w-20 mx-auto mt-2" />
                ) : (
                  user?.user_type || "Member"
                )}
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">
                    {userLoading ? <Skeleton className="h-4 w-32" /> : user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">
                    {userLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      `${user?.country_code || ""} ${user?.phone || ""}`.trim() || "Not provided"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">
                    {userLoading ? <Skeleton className="h-4 w-28" /> : user?.location || "Not provided"}
                  </span>
                </div>
                {user?.website && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm truncate">
                      {userLoading ? <Skeleton className="h-4 w-32" /> : user?.website}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                <User className="w-5 h-5 text-emerald-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="firstName"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter first name"
                      value={isEditing ? editedUser?.firstName || "" : user?.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="lastName"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter last name"
                      value={isEditing ? editedUser?.lastName || "" : user?.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="email"
                      type="email"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter email address"
                      value={isEditing ? editedUser?.email || "" : user?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="phone"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter phone number"
                      value={
                        isEditing 
                          ? `${editedUser?.country_code || ""} ${editedUser?.phone || ""}`.trim()
                          : `${user?.country_code || ""} ${user?.phone || ""}`.trim()
                      }
                      onChange={(e) => {
                        // For simplicity, storing the full phone number as one field
                        // You might want to split country_code and phone separately
                        handleInputChange("phone", e.target.value);
                      }}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                    Company
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="company"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter company name"
                      value={isEditing ? editedUser?.company || "" : user?.company || ""}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Country/Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Country/Location
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="location"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter location"
                      value={isEditing ? editedUser?.location || "" : user?.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="address"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter full address"
                      value={isEditing ? editedUser?.address || "" : user?.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Website */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                    Website
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="website"
                      type="url"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter website URL"
                      value={isEditing ? editedUser?.website || "" : user?.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
