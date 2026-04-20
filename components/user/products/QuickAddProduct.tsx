"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useDropdowns } from "@/lib/useDropdowns";
import { createProduct } from "@/apiServices/products";
import { postFileUpload } from "@/apiServices/shared";
import { QuickAddFormData } from "@/types/product";
import { UploadedFile } from "@/types/shared";
import {
  CheckCircle2, ChevronDown, Upload, X, FileText,
  Loader2, Plus, Zap, ArrowRight, Package, Clock, AlertCircle,
  Sparkles, Globe, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const UOM_OPTIONS = [
  "Kilogram", "Gram", "Metric Ton", "Pound", "Liter", "Cubic Meter",
];

const AVAILABILITY_OPTIONS = [
  {
    value: "In Stock",
    label: "In Stock",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBg: "bg-emerald-600",
    border: "border-emerald-200",
    activeBorder: "border-emerald-600",
  },
  {
    value: "On Request",
    label: "On Request",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    activeBg: "bg-blue-600",
    border: "border-blue-200",
    activeBorder: "border-blue-600",
  },
  {
    value: "Limited",
    label: "Limited",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    activeBg: "bg-amber-500",
    border: "border-amber-200",
    activeBorder: "border-amber-500",
  },
];

interface QuickAddProductProps {
  onSwitchToAdvanced: () => void;
  onSuccess?: (productId: string) => void;
}

export default function QuickAddProduct({ onSwitchToAdvanced, onSuccess }: QuickAddProductProps) {
  const { polymersTypes } = useDropdowns();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<QuickAddFormData>({
    polymerTypes: [],
    productName: "",
    minimum_order_quantity: null,
    uom: "",
    availability: "",
    productListFile: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuickAddFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [polymerDropdownOpen, setPolymerDropdownOpen] = useState(false);
  const [polymerSearch, setPolymerSearch] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPolymerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredPolymers = polymersTypes.filter((p: { _id: string; name: string }) =>
    p.name.toLowerCase().includes(polymerSearch.toLowerCase())
  );

  const togglePolymerType = (id: string) => {
    setForm((prev) => {
      const already = prev.polymerTypes.includes(id);
      return {
        ...prev,
        polymerTypes: already
          ? prev.polymerTypes.filter((t) => t !== id)
          : [...prev.polymerTypes, id],
      };
    });
    setErrors((prev) => ({ ...prev, polymerTypes: "" }));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploaded: UploadedFile = await postFileUpload(formData);
      setForm((prev) => ({ ...prev, productListFile: uploaded }));
    } catch {
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    multiple: false,
    disabled: uploadingFile,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof QuickAddFormData, string>> = {};
    if (form.polymerTypes.length === 0) {
      newErrors.polymerTypes = "Please select at least one polymer type";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        polymerTypes: form.polymerTypes,
        completionStatus: "quick",
      };
      if (form.productName?.trim()) payload.productName = form.productName.trim();
      if (form.minimum_order_quantity) payload.minimum_order_quantity = Number(form.minimum_order_quantity);
      if (form.uom) payload.uom = form.uom;
      if (form.availability) payload.availability = form.availability;
      if (form.productListFile) payload.productListFile = form.productListFile;

      const res = await createProduct(payload as any);
      if (res?.success || res?._id || res?.data?._id) {
        const pid = res._id || res.data?._id || res.data?.product?._id;
        setCreatedProductId(pid || null);
        setSubmitted(true);
        onSuccess?.(pid);
      } else {
        toast.error(res?.message || "Failed to add product. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPolymers = polymersTypes.filter(
    (p: { _id: string; name: string }) => form.polymerTypes.includes(p._id)
  );

  // ── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md" style={{ left: "calc(50% + 28px)" }}>
              <Sparkles className="w-4 h-4 text-yellow-800" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your product is now <span className="text-emerald-600">LIVE!</span>
          </h2>
          <p className="text-gray-500 mb-2 text-base leading-relaxed">
            Buyers worldwide can now discover and enquire about{" "}
            <span className="font-semibold text-gray-700">
              {selectedPolymers.map((p: { name: string }) => p.name).join(", ")}
            </span>
            {form.productName ? ` — ${form.productName}` : ""}.
          </p>

          <div className="flex items-center justify-center gap-6 my-6 py-4 border-y border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Globe className="w-4 h-4 text-emerald-500" />
              Visible globally
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Open for enquiries
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-amber-800 mb-1">Boost your visibility</p>
            <p className="text-xs text-amber-700">
              Products with complete details get <strong>3× more enquiries</strong>. Add images, certifications and pricing to stand out.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ polymerTypes: [], productName: "", minimum_order_quantity: null, uom: "", availability: "", productListFile: null });
                setCreatedProductId(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Another
            </button>
            <button
              onClick={() => {
                if (createdProductId) {
                  window.location.href = `/user/products/${createdProductId}`;
                } else {
                  onSwitchToAdvanced();
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-200"
            >
              Complete Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl px-8 py-7 mb-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-40 translate-x-40" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full translate-y-28 -translate-x-28" />
        </div>
        <div className="relative flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Add Materials</h1>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">
              List your polymers in under 20 seconds and start receiving enquiries from buyers worldwide.
            </p>
            <div className="flex items-center gap-5 mt-3">
              {["Goes live instantly", "No approval needed", "Edit anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-emerald-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2 shrink-0">
            {[
              { icon: Globe, label: "Global reach", sub: "Buyers in 50+ countries" },
              { icon: TrendingUp, label: "More enquiries", sub: "Go live in seconds" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{label}</p>
                  <p className="text-xs text-emerald-200">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Top two-column grid: Polymer Types + Grade */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-50">

            {/* ── Field 1: Polymer Types ── */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-700">1</span>
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-semibold text-gray-800 mb-0.5">
                    Polymer Types
                    <span className="ml-1.5 text-xs font-normal text-white bg-emerald-500 px-1.5 py-0.5 rounded-full">Required</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Select all polymer types you supply</p>

                  {selectedPolymers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedPolymers.map((p: { _id: string; name: string }) => (
                        <span key={p._id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          {p.name}
                          <button type="button" onClick={() => togglePolymerType(p._id)} className="w-3.5 h-3.5 rounded-full hover:bg-emerald-200 flex items-center justify-center transition-colors">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setPolymerDropdownOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        errors.polymerTypes
                          ? "border-red-300 bg-red-50 text-red-700"
                          : polymerDropdownOpen
                          ? "border-emerald-400 ring-2 ring-emerald-100 bg-white"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white text-gray-500"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        {selectedPolymers.length > 0 ? `${selectedPolymers.length} type${selectedPolymers.length > 1 ? "s" : ""} selected` : "Search and select polymer types…"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${polymerDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {polymerDropdownOpen && (
                      <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input autoFocus type="text" value={polymerSearch} onChange={(e) => setPolymerSearch(e.target.value)} placeholder="Search polymer types…" className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400 transition-colors" />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredPolymers.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-gray-400 text-center">No results</div>
                          ) : (
                            filteredPolymers.map((p: { _id: string; name: string }) => {
                              const selected = form.polymerTypes.includes(p._id);
                              return (
                                <button key={p._id} type="button" onClick={() => togglePolymerType(p._id)} className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${selected ? "bg-emerald-50 text-emerald-800" : "hover:bg-gray-50 text-gray-700"}`}>
                                  <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "bg-emerald-600 border-emerald-600" : "border-gray-300"}`}>
                                    {selected && (
                                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </span>
                                  <span className={selected ? "font-medium" : ""}>{p.name}</span>
                                </button>
                              );
                            })
                          )}
                        </div>
                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                          <button type="button" onClick={() => { setPolymerDropdownOpen(false); setPolymerSearch(""); }} className="w-full py-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            ✓ Done — {form.polymerTypes.length} selected
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.polymerTypes && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{errors.polymerTypes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Field 2: Grade / Product Name ── */}
            <div className="px-6 py-5 border-t lg:border-t-0 border-gray-50">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-500">2</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-0.5">
                    Grade / Product Name
                    <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Specific grade helps buyers find you faster</p>
                  <input
                    type="text"
                    value={form.productName || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, productName: e.target.value }))}
                    placeholder="e.g. PP Homopolymer H110MAS, LDPE Film Grade"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom three-column grid: MOQ | Availability | Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-50 border-t border-gray-50">

            {/* ── Field 3: MOQ + Unit ── */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-500">3</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-0.5">
                    Min. Order Quantity
                    <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Minimum amount buyers can order</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={form.minimum_order_quantity ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, minimum_order_quantity: e.target.value ? Number(e.target.value) : null }))}
                      placeholder="e.g. 1000"
                      className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all placeholder:text-gray-400"
                    />
                    <select
                      value={form.uom || ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, uom: e.target.value }))}
                      className="w-28 px-2 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all text-gray-600"
                    >
                      <option value="">Unit</option>
                      {UOM_OPTIONS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Field 4: Availability ── */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-500">4</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-0.5">
                    Availability
                    <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Let buyers know current stock status</p>
                  <div className="flex flex-col gap-2">
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = form.availability === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, availability: prev.availability === opt.value ? "" : opt.value }))}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                            active ? `${opt.activeBg} ${opt.activeBorder} text-white shadow-sm` : `bg-gray-50 border-gray-200 ${opt.color} hover:bg-white hover:border-gray-300`
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : ""}`} />
                          <span className={`text-xs font-semibold ${active ? "text-white" : ""}`}>{opt.label}</span>
                          {active && <span className="ml-auto text-white/80 text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Field 5: Product List Upload ── */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-500">5</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-0.5">
                    Upload Product List
                    <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-3">Share your full catalogue with buyers</p>

                  {form.productListFile ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-emerald-800 truncate">
                          {form.productListFile.originalFilename || form.productListFile.name || "Uploaded file"}
                        </p>
                        <p className="text-xs text-emerald-600">Successfully uploaded</p>
                      </div>
                      <button type="button" onClick={() => setForm((prev) => ({ ...prev, productListFile: null }))} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-all ${
                        isDragActive ? "border-emerald-400 bg-emerald-50" : uploadingFile ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed" : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {uploadingFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
                          <p className="text-xs text-gray-500 font-medium">Uploading…</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-xs font-medium text-gray-600">
                            {isDragActive ? "Drop here" : <>Drag & drop or <span className="text-emerald-600 underline underline-offset-2">browse</span></>}
                          </p>
                          <p className="text-xs text-gray-400">PDF, XLS, XLSX</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA Footer ── */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:max-w-xs flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Adding Materials…</>
              ) : (
                <><Zap className="w-4 h-4" />Add Materials<ArrowRight className="w-4 h-4 ml-0.5" /></>
              )}
            </button>
            <p className="text-xs text-gray-400">
              Need more fields?{" "}
              <button type="button" onClick={onSwitchToAdvanced} className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-2 transition-colors">
                Add Detailed Product
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
