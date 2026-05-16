"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useUserInfo } from "@/lib/useUserInfo";
import { getUserInfo } from "@/apiServices/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React, { useState, useMemo } from "react";
import { getCountryList } from "@/lib/useCountries";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Save, X, User, Mail, Phone, MapPin, Globe, Camera, FileText, Loader2 } from "lucide-react";
import { editUserProfile } from "@/apiServices/user";
import { toast } from "sonner";
import { UserType } from "@/types/user";
import { postFileUpload, getIndustryList } from "@/apiServices/shared";
import MultiSelect from "@/components/shared/MultiSelect";
import { Industry } from "@/types/auth";




// Normalize industry from API — can be a single string (old data) or string[]
const normalizeIndustry = (industry: unknown): string[] => {
  if (!industry) return [];
  if (Array.isArray(industry)) return industry;
  if (typeof industry === "string") return [industry];
  return [];
};

const Profile = () => {
  const { setUser: setUserStore } = useUserInfo();
  const [user, setUser] = useState<UserType | null>(null);
  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const userLoading = !user;
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const countries = useMemo(() => getCountryList().sort((a, b) => a.name.localeCompare(b.name)), []);

  // Fetch user info and industry list on mount
  React.useEffect(() => {
    getIndustryList().then((res) => {
      const industries = (res?.data || []).map((item: { _id: string; name: string; bg: string }) => ({
        _id: item._id,
        name: item.name,
        bg: item.bg,
        image: item.bg,
      }));
      setIndustryList(industries);
    }).catch(() => {});

    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        const raw = data?.data || data?.userInfo || data;
        const userObj = { ...raw, industry: normalizeIndustry(raw?.industry) };
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
    setFieldErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user || {});
    setFieldErrors({});
  };

  const handleSave = async () => {
    if (!editedUser) return;

    // Inline field validation
    const errors: Record<string, string> = {};
    if (!editedUser.firstName?.trim()) errors.firstName = "First name is required";
    if (!editedUser.lastName?.trim()) errors.lastName = "Last name is required";
    if (!editedUser.company?.trim()) errors.company = "Company is required";

    const getTextContent = (html: string) => html ? html.replace(/<[^>]*>/g, '').trim() : '';
    if (editedUser.about_us && getTextContent(editedUser.about_us).length > 2000) {
      errors.about_us = "About Us exceeds maximum length of 2000 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSaving(true);
    try {
      // Prepare the data for API call
      const updateData: Partial<UserType> = {
        firstName: editedUser.firstName?.trim(),
        lastName: editedUser.lastName?.trim(),
        company: editedUser.company?.trim(),
        website: editedUser.website?.trim(),
        industry: editedUser.industry,
        address: editedUser.address?.trim(),
        country_code: editedUser.country_code?.trim(),
        phone: editedUser.phone ? Number(editedUser.phone) : undefined,
        location: editedUser.location?.trim(),
        vat_number: editedUser.vat_number?.trim(),
        about_us: editedUser.about_us?.trim(), // Keep HTML content
        Expert_department: editedUser.Expert_department?.trim(),
        Expert_role: editedUser.Expert_role?.trim(),
      };

      // Include company_logo for sellers if present
      if (user?.user_type === "seller" && editedUser.company_logo) {
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
        const rawLatest = latest?.data || latest?.userInfo || latest;
        const latestUser = { ...rawLatest, industry: normalizeIndustry(rawLatest?.industry) };
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
    setEditedUser(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
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
                    <>
                      <Input
                        id="firstName"
                        className={`h-12 text-base transition-all duration-200 ${
                          fieldErrors.firstName ? "border-red-400 focus:border-red-500" :
                          isEditing ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter first name"
                        value={isEditing ? editedUser?.firstName || "" : user?.firstName || ""}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        readOnly={!isEditing}
                      />
                      {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                    </>
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
                    <>
                      <Input
                        id="lastName"
                        className={`h-12 text-base transition-all duration-200 ${
                          fieldErrors.lastName ? "border-red-400 focus:border-red-500" :
                          isEditing ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter last name"
                        value={isEditing ? editedUser?.lastName || "" : user?.lastName || ""}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        readOnly={!isEditing}
                      />
                      {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
                    </>
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
                    <div className="grid grid-cols-[90px_1fr] gap-2 items-stretch h-12">
                      <Select
                        value={isEditing ? editedUser?.country_code || "" : user?.country_code || ""}
                        onValueChange={(val) => handleInputChange("country_code", val)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className={`w-full h-12 text-sm ${!isEditing ? "bg-gray-50 border-gray-200" : "border-emerald-300"}`}>
                          <SelectValue placeholder="+?" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {countries.map((c) => (
                            <SelectItem key={c.code} value={c.dialCode}>
                              {c.dialCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        className={`h-12 text-base w-full transition-all duration-200 ${
                          isEditing
                            ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Phone number"
                        value={String(isEditing ? editedUser?.phone ?? "" : user?.phone ?? "")}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        readOnly={!isEditing}
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
                    <>
                      <Input
                        id="company"
                        className={`h-12 text-base transition-all duration-200 ${
                          fieldErrors.company ? "border-red-400 focus:border-red-500" :
                          isEditing ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          : "bg-gray-50 border-gray-200"
                        }`}
                        placeholder="Enter company name"
                        value={isEditing ? editedUser?.company || "" : user?.company || ""}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        readOnly={!isEditing}
                      />
                      {fieldErrors.company && <p className="text-xs text-red-500 mt-1">{fieldErrors.company}</p>}
                    </>
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
                  <Label className="text-sm font-medium text-gray-700">Industry</Label>
                  {userLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : isEditing ? (
                    <MultiSelect
                      label=""
                      placeholder="Select industries"
                      options={industryList}
                      selected={editedUser?.industry || []}
                      onChange={(ids) => setEditedUser(prev => ({ ...prev, industry: ids }))}
                    />
                  ) : (
                    <div className="h-12 px-3 flex items-center bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                      {(user?.industry || []).length > 0
                        ? industryList
                            .filter(i => (user?.industry || []).includes(i._id))
                            .map(i => i.name)
                            .join(", ") || user?.industry?.join(", ")
                        : <span className="text-gray-400">Not provided</span>}
                    </div>
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
                    <>
                      <RichTextEditor
                        value={isEditing ? editedUser?.about_us || "" : user?.about_us || ""}
                        onChange={(value) => handleInputChange("about_us", value)}
                        placeholder="Tell us about your company, expertise, mission, or what you do. You can format your text with bold, italic, lists, and more..."
                        readOnly={!isEditing}
                        maxLength={2000}
                        className="min-h-[160px]"
                      />
                      {fieldErrors.about_us && <p className="text-xs text-red-500 mt-1">{fieldErrors.about_us}</p>}
                    </>
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
