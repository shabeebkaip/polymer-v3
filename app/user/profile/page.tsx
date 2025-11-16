"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useUserInfo } from "@/lib/useUserInfo";
import { getUserInfo } from "@/apiServices/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Save, X, User, Mail, Phone,  MapPin, Globe, Camera, FileText, Loader2 } from "lucide-react";
import { editUserProfile } from "@/apiServices/user";
import { toast } from "sonner";
import { UserType } from "@/types/user";
import { postFileUpload } from "@/apiServices/shared";




const Profile = () => {
  const { setUser: setUserStore } = useUserInfo();
  const [user, setUser] = useState<UserType | null>(null);
  const userLoading = !user;
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch user info from API on mount
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        const userObj = data?.userInfo || data;
        setUser(userObj);
        setEditedUser(userObj);
      } catch {
        toast.error("Failed to load user info");
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user || {});
  };

  const handleSave = async () => {
    if (!editedUser) return;

    // Basic validation
    if (!editedUser.firstName || !editedUser.lastName) {
      toast.error("First name and last name are required");
      return;
    }

    if (!editedUser.company) {
      toast.error("Company is required");
      return;
    }

    // Helper function to strip HTML tags and get text content
    const getTextContent = (html: string) => {
      return html ? html.replace(/<[^>]*>/g, '').trim() : '';
    };


    // Validate about_us length
    if (editedUser.about_us) {
      const aboutUsTextLength = getTextContent(editedUser.about_us).length;
      if (aboutUsTextLength > 2000) {
        toast.error("About Us section exceeds maximum length of 2000 characters");
        return;
      }
    }

    setIsSaving(true);
    try {
      // Prepare the data for API call
      const updateData: Partial<UserType> = {
        firstName: editedUser.firstName?.trim(),
        lastName: editedUser.lastName?.trim(),
        company: editedUser.company?.trim(),
        website: editedUser.website?.trim(),
        industry: editedUser.industry?.trim(),
        address: editedUser.address?.trim(),
        country_code: editedUser.country_code?.trim(),
        phone: editedUser.phone ? Number(editedUser.phone) : undefined,
        location: editedUser.location?.trim(),
        vat_number: editedUser.vat_number?.trim(),
        about_us: editedUser.about_us?.trim(), // Keep HTML content
        Expert_department: editedUser.Expert_department?.trim(),
        Expert_role: editedUser.Expert_role?.trim(),
      };

      // For sellers, ensure vat_number and company_logo are present
      if (user?.user_type === "seller") {
        if (!updateData.vat_number) {
          toast.error("VAT number is required for sellers");
          setIsSaving(false);
          return;
        }
        if (!editedUser.company_logo) {
          toast.error("Company logo is required for sellers");
          setIsSaving(false);
          return;
        }
        updateData.company_logo = editedUser.company_logo;
      }

      // Include avatar if changed
      if (editedUser.avatar && editedUser.avatar !== user?.avatar) {
        updateData.avatar = editedUser.avatar;
      }

      // Remove undefined or empty values
      Object.keys(updateData).forEach(key => {
        if ((updateData as Record<string, unknown>)[key] === undefined || (updateData as Record<string, unknown>)[key] === "") {
          delete (updateData as Record<string, unknown>)[key];
        }
      });

      const response = await editUserProfile(updateData);

      if (response.success) {
        // After save, fetch latest user info from API and update both local and store
        const latest = await getUserInfo();
        const latestUser = latest?.userInfo || latest;
        setUser(latestUser);
        setUserStore(latestUser);
        setEditedUser(latestUser);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        typeof error === "object" && error && "message" in error
          ? (error as { message?: string }).message || "Failed to update profile. Please try again."
          : "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload image using postFileUpload
      const { fileUrl } = await postFileUpload(formData);

      // Update local state with new image URL
      if (user?.user_type === "seller") {
        setUser(prev => prev ? { ...prev, company_logo: fileUrl } : null);
        setEditedUser(prev => ({ ...prev, company_logo: fileUrl }));
      } else {
        setUser(prev => prev ? { ...prev, avatar: fileUrl } : null);
        setEditedUser(prev => ({ ...prev, avatar: fileUrl }));
      }

      toast.success('Profile picture uploaded! Remember to save changes.');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="relative">
            {/* Blue highlight behind heading */}
            <span className="absolute left-0 top-2 h-8 w-[260px] bg-blue-200 rounded-md -z-10" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2 relative z-10 pl-2 pr-4">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
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
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
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
          <div className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl">
            <div className="text-center pb-4">
              <div className="relative mx-auto mb-6 w-fit">
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl mx-auto">
                  <AvatarImage 
                    src={user?.user_type === "seller" ? user?.company_logo : user?.avatar} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="bg-emerald-100 text-emerald-600 text-2xl font-semibold">
                    {user?.user_type === "seller" 
                      ? user?.company?.charAt(0) || "C"
                      : `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`
                    }
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={triggerImageUpload}
                      disabled={isUploadingImage}
                      className="absolute right-0 bottom-2 translate-x-1/2 w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 p-0 shadow-lg flex items-center justify-center disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </Button>
                  </>
                )}
              </div>
              <h2 className="text-2xl text-gray-900 font-semibold">
                {userLoading ? (
                  <Skeleton className="h-6 w-32 mx-auto" />
                ) : (
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.company || "User"
                )}
              </h2>
              {userLoading ? (
                <div className="text-gray-600 capitalize">
                  <Skeleton className="h-4 w-20 mx-auto mt-2" />
                </div>
              ) : (
                <p className="text-gray-600 capitalize mt-1">
                  {user?.user_type || "Member"}
                </p>
              )}
            </div>
            <div className="pt-4">
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  {userLoading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    <span className="text-sm">{user?.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  {userLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <span className="text-sm">
                      {`${user?.country_code || ""} ${user?.phone || ""}`.trim() || "Not provided"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {userLoading ? (
                    <Skeleton className="h-4 w-28" />
                  ) : (
                    <span className="text-sm">{user?.location || "Not provided"}</span>
                  )}
                </div>
                {user?.website && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    {userLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      <span className="text-sm truncate">{user?.website}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="shadow-xl border-0 p-8 rounded-2xl bg-white">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-2xl text-gray-900 font-semibold">
                <User className="w-6 h-6 text-emerald-600" />
                Personal Information
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      className="h-12 text-base transition-all duration-200 bg-gray-50 border-gray-200"
                      placeholder="Enter email address"
                      value={user?.email || ""}
                      readOnly
                      tabIndex={-1}
                    />
                  )}
                </div>

                {/* Phone and Country Code */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        id="country_code"
                        className={`h-12 text-base transition-all duration-200 w-24 ${
                          isEditing 
                            ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="+1"
                        value={isEditing ? editedUser?.country_code || "" : user?.country_code || ""}
                        onChange={(e) => handleInputChange("country_code", e.target.value)}
                        readOnly={!isEditing}
                      />
                      <Input
                        id="phone"
                        className={`h-12 text-base transition-all duration-200 flex-1 ${
                          isEditing 
                            ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter phone number"
                        value={isEditing ? editedUser?.phone || "" : user?.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        readOnly={!isEditing}
                        type="tel"
                      />
                    </div>
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

                {/* Industry */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                    Industry
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="industry"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter industry"
                      value={isEditing ? editedUser?.industry || "" : user?.industry || ""}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* VAT Number */}
                <div className="space-y-2">
                  <Label htmlFor="vat_number" className="text-sm font-medium text-gray-700">
                    VAT Number
                  </Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Input
                      id="vat_number"
                      className={`h-12 text-base transition-all duration-200 ${
                        isEditing 
                          ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="Enter VAT number"
                      value={isEditing ? editedUser?.vat_number || "" : user?.vat_number || ""}
                      onChange={(e) => handleInputChange("vat_number", e.target.value)}
                      readOnly={!isEditing}
                    />
                  )}
                </div>

                {/* Expert Fields - Only show for expert users */}
                {user?.user_type === "expert" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="Expert_department" className="text-sm font-medium text-gray-700">
                        Expert Department
                      </Label>
                      {userLoading ? (
                        <Skeleton className="h-12 w-full" />
                      ) : (
                        <Input
                          id="Expert_department"
                          className={`h-12 text-base transition-all duration-200 ${
                            isEditing 
                              ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                              : "bg-gray-50 border-gray-200"
                          }`}
                          placeholder="Enter expert department"
                          value={isEditing ? editedUser?.Expert_department || "" : user?.Expert_department || ""}
                          onChange={(e) => handleInputChange("Expert_department", e.target.value)}
                          readOnly={!isEditing}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="Expert_role" className="text-sm font-medium text-gray-700">
                        Expert Role
                      </Label>
                      {userLoading ? (
                        <Skeleton className="h-12 w-full" />
                      ) : (
                        <Input
                          id="Expert_role"
                          className={`h-12 text-base transition-all duration-200 ${
                            isEditing 
                              ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500" 
                              : "bg-gray-50 border-gray-200"
                          }`}
                          placeholder="Enter expert role"
                          value={isEditing ? editedUser?.Expert_role || "" : user?.Expert_role || ""}
                          onChange={(e) => handleInputChange("Expert_role", e.target.value)}
                          readOnly={!isEditing}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* About Us */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="about_us" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    About Us
                  </Label>
                  {isEditing && (
                    <p className="text-xs text-gray-600 mb-2">
                      Use the formatting tools to style your content. You can add bold text, lists, links, and more to create a professional company description.
                    </p>
                  )}
                  {userLoading ? (
                    <Skeleton className="h-40 w-full" />
                  ) : (
                    <RichTextEditor
                      value={isEditing ? editedUser?.about_us || "" : user?.about_us || ""}
                      onChange={(value) => handleInputChange("about_us", value)}
                      placeholder="Tell us about your company, expertise, mission, or what you do. You can format your text with bold, italic, lists, and more..."
                      readOnly={!isEditing}
                      maxLength={2000}
                      className="min-h-[160px]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
