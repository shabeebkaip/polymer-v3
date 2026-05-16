"use client";
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useDropdowns } from "@/lib/useDropdowns";
import { createProduct } from "@/apiServices/products";
import { postFileUpload } from "@/apiServices/shared";
import { QuickAddFormData } from "@/types/product";
import { UploadedFile } from "@/types/shared";
import { getCountryList } from "@/lib/useCountries";
import {
  CheckCircle2, ChevronDown, Upload, X, FileText,
  Loader2, Plus, Zap, ArrowRight, Package, Clock, AlertCircle,
  Sparkles, Globe, TrendingUp, MapPin,
} from "lucide-react";
import { toast } from "sonner";

const UOM_OPTIONS = [
  "Kilogram", "Gram", "Metric Ton", "Pound", "Liter", "Cubic Meter",
];

const AVAILABILITY_OPTIONS = [
  {
    value: "In Stock", label: "In Stock", icon: CheckCircle2,
    color: "text-emerald-600", activeBg: "bg-emerald-600",
    border: "border-emerald-200", activeBorder: "border-emerald-600",
  },
  {
    value: "On Request", label: "On Request", icon: Clock,
    color: "text-blue-600", activeBg: "bg-blue-600",
    border: "border-blue-200", activeBorder: "border-blue-600",
  },
  {
    value: "Limited", label: "Limited", icon: AlertCircle,
    color: "text-amber-600", activeBg: "bg-amber-500",
    border: "border-amber-200", activeBorder: "border-amber-500",
  },
];

interface QuickAddProductProps {
  onSwitchToAdvanced: () => void;
  onSuccess?: (productId: string) => void;
}

// Single-select searchable dropdown for Chemical Family
function SearchableSingleSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { _id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedItem = options.find((o) => o._id === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
          open ? "border-emerald-400 ring-2 ring-emerald-100 bg-white"
          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white text-gray-500"
        }`}
      >
        <span className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          {selectedItem ? <span className="text-gray-800">{selectedItem.name}</span> : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedItem && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="w-4 h-4 rounded-full hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-gray-400" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
          <div className="max-h-44 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-400 text-center">No results</div>
            ) : filtered.map((o) => (
              <button key={o._id} type="button"
                onClick={() => { onChange(o._id); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                  value === o._id ? "bg-emerald-50 text-emerald-800 font-medium" : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {value === o._id && (
                  <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>{o.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable searchable multi-select dropdown used for Polymer Types
function SearchableMultiSelect({
  options,
  selected,
  onToggle,
  placeholder,
  error,
}: {
  options: { _id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedItems = options.filter((o) => selected.includes(o._id));

  return (
    <div className="relative" ref={ref}>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedItems.map((p) => (
            <span key={p._id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
              {p.name}
              <button type="button" onClick={() => onToggle(p._id)} className="w-3.5 h-3.5 rounded-full hover:bg-emerald-200 flex items-center justify-center">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
          error ? "border-red-300 bg-red-50 text-red-700"
          : open ? "border-emerald-400 ring-2 ring-emerald-100 bg-white"
          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white text-gray-500"
        }`}
      >
        <span className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          {selectedItems.length > 0 ? `${selectedItems.length} selected` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
          <div className="max-h-44 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-400 text-center">No results</div>
            ) : filtered.map((o) => {
              const isSelected = selected.includes(o._id);
              return (
                <button key={o._id} type="button" onClick={() => onToggle(o._id)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${isSelected ? "bg-emerald-50 text-emerald-800" : "hover:bg-gray-50 text-gray-700"}`}
                >
                  <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600" : "border-gray-300"}`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={isSelected ? "font-medium" : ""}>{o.name}</span>
                </button>
              );
            })}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <button type="button" onClick={() => { setOpen(false); setSearch(""); }}
              className="w-full py-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              ✓ Done — {selected.length} selected
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

export default function QuickAddProduct({ onSwitchToAdvanced, onSuccess }: QuickAddProductProps) {
  const { polymersTypes, chemicalFamilies, physicalForms } = useDropdowns();
  const countries = useMemo(() => getCountryList().sort((a, b) => a.name.localeCompare(b.name)), []);

  const [form, setForm] = useState<QuickAddFormData>({
    polymerTypes: [],
    productName: "",
    chemicalFamily: "",
    physicalForm: "",
    countryOfOrigin: "",
    minimum_order_quantity: null,
    uom: "Metric Ton",
    availability: "",
    productListFile: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuickAddFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

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
    if (form.polymerTypes.length === 0) newErrors.polymerTypes = "Please select at least one polymer type";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        polymerTypes: form.polymerTypes,
        completionStatus: "quick",
      };
      if (form.productName?.trim()) payload.productName = form.productName.trim();
      if (form.chemicalFamily) payload.chemicalFamily = form.chemicalFamily;
      if (form.physicalForm) payload.physicalForm = form.physicalForm;
      if (form.countryOfOrigin?.trim()) payload.countryOfOrigin = form.countryOfOrigin.trim();
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

  const resetForm = () => {
    setForm({ polymerTypes: [], productName: "", chemicalFamily: "", physicalForm: "", countryOfOrigin: "", minimum_order_quantity: null, uom: "Metric Ton", availability: "", productListFile: null });
    setCreatedProductId(null);
    setSubmitted(false);
  };

  // ── Success Screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md" style={{ left: "calc(50% + 28px)" }}>
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
              <Globe className="w-4 h-4 text-emerald-500" />Visible globally
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-blue-500" />Open for enquiries
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-amber-800 mb-1">Boost your visibility</p>
            <p className="text-xs text-amber-700">
              Products with complete details get <strong>3× more enquiries</strong>. Add images, certifications and pricing to stand out.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={resetForm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
              <Plus className="w-4 h-4" />Add Another
            </button>
            <button
              onClick={() => { if (createdProductId) window.location.href = `/user/products/${createdProductId}`; else onSwitchToAdvanced(); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-200">
              Complete Details<ArrowRight className="w-4 h-4" />
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
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl px-4 py-5 sm:px-8 sm:py-7 mb-6 shadow-lg">
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit}>

          {/* Row 1: Polymer Types + Chemical Family */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

            {/* Field 1: Polymer Types */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={1} required label="Polymer Types" hint="Select all polymer types you supply">
                <SearchableMultiSelect
                  options={polymersTypes}
                  selected={form.polymerTypes}
                  onToggle={(id) => {
                    setForm((prev) => ({
                      ...prev,
                      polymerTypes: prev.polymerTypes.includes(id)
                        ? prev.polymerTypes.filter((t) => t !== id)
                        : [...prev.polymerTypes, id],
                    }));
                    setErrors((prev) => ({ ...prev, polymerTypes: "" }));
                  }}
                  placeholder="Search and select polymer types…"
                  error={errors.polymerTypes}
                />
              </FieldWrapper>
            </div>

            {/* Field 2: Chemical Family */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={2} label="Chemical Family" hint="Helps buyers filter by chemistry (e.g. Polyolefins, ABS)">
                <SearchableSingleSelect
                  options={chemicalFamilies}
                  value={form.chemicalFamily || ""}
                  onChange={(id) => setForm((prev) => ({ ...prev, chemicalFamily: id }))}
                  placeholder="Search and select a chemical family…"
                />
              </FieldWrapper>
            </div>
          </div>

          {/* Row 2: Product Name + Physical Form + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-x sm:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100">

            {/* Field 3: Product Name */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={3} label="Product Name" hint="A clear name helps buyers identify your product">
                <input
                  type="text"
                  value={form.productName || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, productName: e.target.value }))}
                  placeholder="e.g. LDPE Film, PP Homopolymer"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all placeholder:text-gray-400"
                />
              </FieldWrapper>
            </div>

            {/* Field 4: Physical Form */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={4} label="Physical Form" hint="How the material is supplied">
                <div className="flex flex-wrap gap-2">
                  {physicalForms.map((pf: { _id: string; name: string }) => {
                    const active = form.physicalForm === pf._id;
                    return (
                      <button
                        key={pf._id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, physicalForm: prev.physicalForm === pf._id ? "" : pf._id }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                          active
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
                        }`}
                      >
                        {pf.name}
                      </button>
                    );
                  })}
                </div>
              </FieldWrapper>
            </div>

            {/* Field 5: Country of Origin */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 sm:col-span-2 lg:col-span-1">
              <FieldWrapper num={5} label="Country of Origin" hint="Where is the material manufactured?">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={form.countryOfOrigin || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, countryOfOrigin: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all text-gray-600 appearance-none"
                  >
                    <option value="">Select country…</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </FieldWrapper>
            </div>
          </div>

          {/* Row 3: MOQ | Availability | Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-x sm:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100">

            {/* Field 6: MOQ + Unit */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={6} label="Min. Order Quantity" hint="Minimum amount buyers can order">
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
                    {UOM_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </FieldWrapper>
            </div>

            {/* Field 7: Availability */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={7} label="Availability" hint="Let buyers know current stock status">
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
              </FieldWrapper>
            </div>

            {/* Field 8: Product List Upload */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 sm:col-span-2 lg:col-span-1">
              <FieldWrapper num={8} label="Upload Product List" hint="Share your full catalogue with buyers">
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
                    <button type="button" onClick={() => setForm((prev) => ({ ...prev, productListFile: null }))}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-all ${
                      isDragActive ? "border-emerald-400 bg-emerald-50"
                      : uploadingFile ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                      : "border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30"
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
                          {isDragActive ? "Drop here" : <><span className="text-emerald-600 underline underline-offset-2">Browse</span> or drag & drop</>}
                        </p>
                        <p className="text-xs text-gray-400">PDF, XLS, XLSX</p>
                      </div>
                    )}
                  </div>
                )}
              </FieldWrapper>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-col sm:flex-row items-center gap-4">
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

// Reusable field wrapper with number badge, label and hint
function FieldWrapper({
  num, label, hint, required, children,
}: {
  num: number; label: string; hint: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${required ? "bg-emerald-100" : "bg-gray-100"}`}>
        <span className={`text-xs font-bold ${required ? "text-emerald-700" : "text-gray-500"}`}>{num}</span>
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-semibold text-gray-800 mb-0.5">
          {label}
          {required
            ? <span className="ml-1.5 text-xs font-normal text-white bg-emerald-500 px-1.5 py-0.5 rounded-full">Required</span>
            : <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>}
        </label>
        <p className="text-xs text-gray-400 mb-3">{hint}</p>
        {children}
      </div>
    </div>
  );
}
