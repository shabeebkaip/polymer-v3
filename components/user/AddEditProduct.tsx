"use client";
import React, { useState } from "react";
import { useDropdowns } from "@/lib/useDropdowns";
import GeneralInformation from "./products/GeneralInformation";
import ProductDetails from "./products/ProductDetails";
import ProductImages from "./products/ProductImages";
import TechnicalProperties from "./products/TechnicalProperties";
import TradeInformation from "./products/TradeInformation";
import PackageInformation from "./products/PackageInformation";
import Environmental from "./products/Environmental";
import Certification from "./products/Certifications";
import Documents from "./products/Documents";
import { ProductFormData, ValidationErrors, RequiredField, AddEditProductProps } from "@/types/product";
import type { UploadedFile } from "@/types/shared";
import { Button } from "../ui/button";
import {
  Save, RotateCcw, ChevronDown, ChevronUp, CheckCircle2,
  Package, Truck, ImageIcon, Settings, Box, Shield, Upload,
  Eye, AlertCircle, MapPin, Tag, Layers,
} from "lucide-react";
import { createProduct, updateProduct } from "@/apiServices/products";
import { initialFormData } from "@/apiServices/constants/userProductCrud";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Completion helpers ───────────────────────────────────────────────────────
type SectionId = "core" | "images" | "trade" | "technical" | "packaging" | "compliance" | "documents";

function getSectionCompletion(data: ProductFormData): Record<SectionId, boolean> {
  return {
    core:
      !!data.productName?.trim() &&
      !!data.chemicalName?.trim() &&
      Array.isArray(data.polymerTypes) && data.polymerTypes.length > 0 &&
      !!data.physicalForm &&
      Array.isArray(data.industry) && data.industry.length > 0,
    images: Array.isArray(data.productImages) && data.productImages.length > 0,
    trade:
      !!data.minimum_order_quantity &&
      !!data.stock &&
      !!data.uom &&
      !!data.price &&
      Array.isArray(data.incoterms) && data.incoterms.length > 0,
    technical: !!(data.density || data.mfi || data.tensileStrength),
    packaging: Array.isArray(data.packagingType) && data.packagingType.length > 0,
    compliance: !!(data.recyclable || data.bioDegradable || data.fdaApproved || data.medicalGrade),
    documents: [data.safety_data_sheet, data.technical_data_sheet, data.certificate_of_analysis].some(
      doc => doc && typeof doc === "object" && Object.keys(doc).length > 0
    ),
  };
}

const SECTIONS: { id: SectionId; num: number; title: string; subtitle: string; icon: React.ElementType }[] = [
  { id: "core",       num: 1, title: "Core Details",               subtitle: "Add basic information about your product",     icon: Package  },
  { id: "images",     num: 2, title: "Product Images",             subtitle: "Upload high-quality images to showcase your product", icon: ImageIcon },
  { id: "trade",      num: 3, title: "Trade Information",          subtitle: "Set pricing, quantities, and trade terms",     icon: Truck    },
  { id: "technical",  num: 4, title: "Technical Properties",       subtitle: "Add technical specifications and properties",  icon: Settings },
  { id: "packaging",  num: 5, title: "Packaging",                  subtitle: "Provide packaging and pallet information",     icon: Box      },
  { id: "compliance", num: 6, title: "Compliance & Certifications",subtitle: "Add compliance documents and certificates",    icon: Shield   },
  { id: "documents",  num: 7, title: "Documents",                  subtitle: "Upload any additional documents",              icon: Upload   },
];

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  num, title, subtitle, icon: Icon, completed, hasError, defaultOpen, children,
}: {
  num: number; title: string; subtitle: string; icon: React.ElementType;
  completed: boolean; hasError: boolean; defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200
      ${hasError ? "border-red-200" : completed ? "border-emerald-200" : "border-gray-100"}
      ${open ? "shadow-md" : "hover:shadow-md"}
    `}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group rounded-t-2xl overflow-hidden"
      >
        {/* Number badge */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors
          ${completed ? "bg-emerald-600 text-white" : hasError ? "bg-red-500 text-white" : "bg-gray-900 text-white"}`}>
          {completed ? <CheckCircle2 className="w-4 h-4" /> : num}
        </div>

        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
          ${completed ? "bg-emerald-50" : hasError ? "bg-red-50" : "bg-gray-50"}`}>
          <Icon className={`w-4 h-4 ${completed ? "text-emerald-600" : hasError ? "text-red-500" : "text-gray-500"}`} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">{title}</span>
            {completed ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
            ) : hasError ? (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Needs Attention</span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Pending</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
        </div>

        {/* Chevron */}
        <div className="shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-gray-50 px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Molecular SVG Illustration ───────────────────────────────────────────────
function MoleculeIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
      <circle cx="100" cy="80" r="18" stroke="white" strokeWidth="2" />
      <circle cx="50"  cy="45" r="12" stroke="white" strokeWidth="1.5" />
      <circle cx="155" cy="50" r="14" stroke="white" strokeWidth="1.5" />
      <circle cx="40"  cy="115" r="10" stroke="white" strokeWidth="1.5" />
      <circle cx="160" cy="118" r="12" stroke="white" strokeWidth="1.5" />
      <circle cx="100" cy="148" r="9"  stroke="white" strokeWidth="1.5" />
      <line x1="100" y1="62"  x2="57"  y2="53"  stroke="white" strokeWidth="1.5" />
      <line x1="100" y1="62"  x2="148" y2="58"  stroke="white" strokeWidth="1.5" />
      <line x1="87"  y1="85"  x2="48"  y2="110" stroke="white" strokeWidth="1.5" />
      <line x1="113" y1="87"  x2="152" y2="110" stroke="white" strokeWidth="1.5" />
      <line x1="95"  y1="98"  x2="100" y2="139" stroke="white" strokeWidth="1.5" />
      <circle cx="100" cy="80"  r="6" fill="white" fillOpacity="0.4" />
      <circle cx="50"  cy="45"  r="4" fill="white" fillOpacity="0.3" />
      <circle cx="155" cy="50"  r="5" fill="white" fillOpacity="0.3" />
      <circle cx="40"  cy="115" r="3" fill="white" fillOpacity="0.3" />
      <circle cx="160" cy="118" r="4" fill="white" fillOpacity="0.3" />
      <circle cx="100" cy="148" r="3" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AddEditProduct = ({ product, id }: AddEditProductProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const {
    chemicalFamilies, polymersTypes, industry, physicalForms,
    packagingTypes, grades, incoterms, paymentTerms, productFamilies,
  } = useDropdowns();

  const [data, setData] = useState<ProductFormData>(product ?? initialFormData);
  const [error, setError] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);

  const onFieldChange = (
    key: keyof ProductFormData,
    value: string | number | boolean | UploadedFile[] | Record<string, unknown> | undefined,
  ) => setData(prev => ({ ...prev, [key]: value }));

  const onFieldError = (key: keyof ProductFormData) =>
    setError(prev => ({ ...prev, [key]: "" }));

  const resetForm = () => { setData(initialFormData); setError({}); };

  // Completion
  const completion = getSectionCompletion(data);
  const completedCount = Object.values(completion).filter(Boolean).length;
  const totalSections = SECTIONS.length;
  const completionPct = Math.round((completedCount / totalSections) * 100);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (!isEditMode) {
      const required: RequiredField[] = [
        { field: "productName", label: "Product Name" },
        { field: "chemicalName", label: "Chemical Name" },
        { field: "chemicalFamily", label: "Chemical Family" },
        { field: "polymerType", label: "Polymer Type" },
        { field: "physicalForm", label: "Physical Form" },
        { field: "minimum_order_quantity", label: "Minimum Order Quantity" },
        { field: "stock", label: "Stock" },
        { field: "uom", label: "Unit of Measure" },
        { field: "price", label: "Price" },
      ];
      required.forEach(({ field, label }) => {
        const v = data[field];
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))
          errs[field] = `${label} is required`;
      });
      if (data.industry.length === 0) errs.industry = "At least one industry is required";
      if (data.incoterms.length === 0) errs.incoterms = "At least one incoterm is required";
      if (data.productImages.length === 0) errs.productImages = "At least one product image is required";
      else if (data.productImages.some((img: UploadedFile) => !img.id || !img.name || !img.type || !img.fileUrl))
        errs.productImages = "Some images are missing required information. Please re-upload.";
    }
    if (data.fdaApproved && (!data.fdaCertificate?.id || !data.fdaCertificate?.fileUrl))
      errs.fdaCertificate = "FDA certificate is required when FDA Approved is enabled";
    if (data.medicalGrade && (!data.medicalCertificate?.id || !data.medicalCertificate?.fileUrl))
      errs.medicalCertificate = "Medical certificate is required when Medical Grade is enabled";
    return errs;
  };

  // ── Format & Submit ─────────────────────────────────────────────────────────
  const formatDataForAPI = (formData: ProductFormData) => {
    const fmt = { ...formData } as Record<string, unknown>;
    if (fmt.price) fmt.price = Number(fmt.price);
    if (fmt.leadTime && typeof fmt.leadTime !== "string") fmt.leadTime = String(fmt.leadTime);
    if (Array.isArray(fmt.paymentTerms) && fmt.paymentTerms.length > 0) fmt.paymentTerms = fmt.paymentTerms[0];
    else if (Array.isArray(fmt.paymentTerms)) delete fmt.paymentTerms;
    (["safety_data_sheet", "technical_data_sheet", "certificate_of_analysis"] as const).forEach(f => {
      if (Array.isArray(fmt[f])) fmt[f] = (fmt[f] as unknown[]).length > 0 ? (fmt[f] as unknown[])[0] : undefined;
    });
    const fieldMappings: Record<string, string> = {
      melt_flow_index: "mfi", tensile_strength: "tensileStrength",
      elongation_at_break: "elongationAtBreak", shore_hardness: "shoreHardness", water_absorption: "waterAbsorption",
    };
    Object.entries(fieldMappings).forEach(([k, v]) => { if (fmt[k] !== undefined) { fmt[v] = fmt[k]; delete fmt[k]; } });
    ["minimum_order_quantity","stock","density","mfi","tensileStrength","elongationAtBreak","shoreHardness","waterAbsorption"].forEach(f => {
      if (fmt[f] && typeof fmt[f] === "string") { const n = Number(fmt[f]); if (!isNaN(n)) fmt[f] = n; }
    });
    if (fmt.packagingWeight && typeof fmt.packagingWeight === "number") fmt.packagingWeight = String(fmt.packagingWeight);
    ["industry","grade","incoterms","packagingType","product_family"].forEach(f => {
      if (fmt[f] && !Array.isArray(fmt[f])) fmt[f] = [fmt[f]];
      else if (!fmt[f]) fmt[f] = [];
    });
    ["melting_point","glass_transition_temperature","heat_deflection_temperature","moisture_content","ash_content","dielectric_strength","volume_resistivity","flexural_modulus","grades"].forEach(f => delete fmt[f]);
    fmt.certificates = formData.certificates || [];
    if (!formData.fdaApproved) fmt.fdaCertificate = null;
    else if (formData.fdaCertificate && Object.keys(formData.fdaCertificate).length > 0) fmt.fdaCertificate = formData.fdaCertificate;
    if (!formData.medicalGrade) fmt.medicalCertificate = null;
    else if (formData.medicalCertificate && Object.keys(formData.medicalCertificate).length > 0) fmt.medicalCertificate = formData.medicalCertificate;
    Object.keys(fmt).forEach(key => {
      if (["certificates","fdaCertificate","medicalCertificate"].includes(key)) return;
      const v = fmt[key];
      if (v === "" || v === null || v === undefined || (Array.isArray(v) && v.length === 0)) delete fmt[key];
    });
    return fmt;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setError(errs);
      toast.error(`Fix ${Object.keys(errs).length} required field${Object.keys(errs).length > 1 ? "s" : ""} before submitting`);
      return;
    }
    setSaving(true);
    const toastId = toast.loading(isEditMode ? "Updating product…" : "Creating product…");
    try {
      const res = isEditMode
        ? await updateProduct(id as string, formatDataForAPI(data))
        : await createProduct(formatDataForAPI(data));
      if (res?.success) {
        toast.success(isEditMode ? "Product updated!" : "Product created!", { id: toastId });
        if (!isEditMode) setData(initialFormData);
        setTimeout(() => router.push("/user/products"), 800);
      } else {
        toast.error(isEditMode ? "Error updating product" : "Error creating product", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        ?? (err as { message?: string })?.message ?? "Something went wrong";
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Error groups per section
  const sectionErrors: Record<SectionId, boolean> = {
    core:       ["productName","chemicalName","chemicalFamily","polymerType","physicalForm","industry"].some(f => !!error[f as keyof ValidationErrors]),
    images:     !!error.productImages,
    trade:      ["minimum_order_quantity","stock","uom","price","incoterms"].some(f => !!error[f as keyof ValidationErrors]),
    technical:  false,
    packaging:  false,
    compliance: ["fdaCertificate","medicalCertificate"].some(f => !!error[f as keyof ValidationErrors]),
    documents:  false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-gray-50">

      {/* ── Sticky top bar ── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/user/products")}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
            >
              ← Back to Products
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetForm} className="hidden sm:flex items-center gap-1.5 text-gray-500 border-gray-200 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />Reset
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={saving}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 text-xs font-semibold">
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-0 py-6">
        <div className="flex flex-col xl:flex-row gap-6 items-start">

          {/* ── LEFT: Main form area ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Hero card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 p-6 sm:p-8 shadow-xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white rounded-full translate-y-32" />
              </div>
              <div className="absolute right-6 top-0 bottom-0 w-40 sm:w-52 flex items-center opacity-20 pointer-events-none">
                <MoleculeIllustration />
              </div>
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest mb-1">
                    {isEditMode ? "Edit Product" : "New Product"}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                    {isEditMode ? "Update Your Listing" : "Create New Product"}
                  </h1>
                  <p className="text-emerald-100 text-sm leading-relaxed max-w-md">
                    Build a professional product listing to attract verified buyers across the globe.
                  </p>
                </div>

                {/* Progress */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shrink-0 min-w-[180px]">
                  <p className="text-emerald-200 text-xs font-medium mb-1">Completion Progress</p>
                  <p className="text-white text-3xl font-bold mb-2">{completionPct}%</p>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                    <div
                      className="bg-white h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <p className="text-emerald-200 text-xs">{completedCount} of {totalSections} sections completed</p>
                </div>
              </div>
            </div>

            {/* Section cards */}
            {SECTIONS.map(sec => (
              <SectionCard
                key={sec.id}
                num={sec.num}
                title={sec.title}
                subtitle={sec.subtitle}
                icon={sec.icon}
                completed={completion[sec.id]}
                hasError={sectionErrors[sec.id]}
                defaultOpen={sec.id === "core"}
              >
                {sec.id === "core" && (
                  <>
                    <GeneralInformation data={data} onFieldChange={onFieldChange} error={error} onFieldError={onFieldError} />
                    <ProductDetails
                      data={data}
                      onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                      chemicalFamilies={chemicalFamilies} polymersTypes={polymersTypes}
                      industry={industry} physicalForms={physicalForms} productFamilies={productFamilies}
                      error={error} onFieldError={onFieldError}
                    />
                  </>
                )}
                {sec.id === "images" && <ProductImages data={data} onFieldChange={onFieldChange} />}
                {sec.id === "trade" && (
                  <TradeInformation
                    data={data}
                    onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                    incoterms={incoterms} paymentTerms={paymentTerms} error={error} onFieldError={onFieldError}
                  />
                )}
                {sec.id === "technical" && (
                  <TechnicalProperties
                    data={data}
                    onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                    grades={grades}
                  />
                )}
                {sec.id === "packaging" && (
                  <PackageInformation
                    data={data}
                    onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                    packagingTypes={packagingTypes}
                  />
                )}
                {sec.id === "compliance" && (
                  <>
                    <Environmental data={data} onFieldChange={onFieldChange} />
                    <Certification data={data} onFieldChange={onFieldChange} />
                  </>
                )}
                {sec.id === "documents" && <Documents data={data} onFieldChange={onFieldChange} />}
              </SectionCard>
            ))}

            {/* Footer */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button variant="outline" onClick={resetForm} className="flex items-center gap-2 text-gray-500 border-gray-200 text-sm">
                <RotateCcw className="w-4 h-4" />Reset Form
              </Button>
              <p className="text-xs text-gray-400 hidden sm:block">All changes are saved automatically</p>
              <Button onClick={handleSubmit} disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </div>

          {/* ── RIGHT: Sticky sidebar ── */}
          <div className="w-full xl:w-[300px] shrink-0 xl:sticky xl:top-20 flex flex-col gap-4">

            {/* Completion tracker */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">Product Completion</h3>
                <span className="text-xs font-bold text-emerald-600">{completionPct}% Complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                {SECTIONS.map(sec => {
                  const done = completion[sec.id];
                  const err = sectionErrors[sec.id];
                  return (
                    <div key={sec.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                          ${done ? "border-emerald-500 bg-emerald-500" : err ? "border-red-400" : "border-gray-300"}`}>
                          {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                          {err && !done && <AlertCircle className="w-3 h-3 text-red-400" />}
                        </div>
                        <span className="text-xs text-gray-600">{sec.title}</span>
                      </div>
                      <span className={`text-xs font-medium ${done ? "text-emerald-600" : err ? "text-red-500" : "text-gray-400"}`}>
                        {done ? "Completed" : err ? "Fix" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-gray-400" />
                <h3 className="font-semibold text-gray-900 text-sm">Live Preview</h3>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Image placeholder */}
                <div className="bg-gray-50 h-32 flex items-center justify-center border-b border-gray-100 relative">
                  {data.productImages?.[0]?.fileUrl ? (
                    <img src={data.productImages[0].fileUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-300">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">Draft</span>
                </div>

                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {data.productName || "Product Name"}
                  </p>
                  <p className="text-xs text-gray-400 truncate mb-2">
                    {data.chemicalName || "Chemical Name"}
                  </p>

                  {data.price && (
                    <p className="text-emerald-600 font-bold text-base mb-2">
                      ${Number(data.price).toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {data.uom || "unit"}</span>
                    </p>
                  )}

                  <div className="flex flex-col gap-1.5">
                    {data.minimum_order_quantity && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1"><Layers className="w-3 h-3" />Min. Order</span>
                        <span className="text-gray-700 font-medium">{Number(data.minimum_order_quantity).toLocaleString()} {data.uom || ""}</span>
                      </div>
                    )}
                    {data.countryOfOrigin && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />Origin</span>
                        <span className="text-gray-700 font-medium">{data.countryOfOrigin}</span>
                      </div>
                    )}
                    {data.productName && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1"><Tag className="w-3 h-3" />Category</span>
                        <span className="text-gray-700 font-medium truncate max-w-[100px]">{data.productName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pro tip */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">💡 Pro Tip</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Complete all required sections to increase visibility and attract more buyers. Products with images get <strong>3× more enquiries</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating save — edit mode */}
      {isEditMode && (
        <div className="fixed bottom-5 right-5 z-50">
          <Button onClick={handleSubmit} disabled={saving} size="lg"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl rounded-full px-6">
            <Save className="w-4 h-4" />{saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddEditProduct;
