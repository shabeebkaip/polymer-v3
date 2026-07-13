"use client";
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useDropdowns } from "@/lib/useDropdowns";
import { createProduct } from "@/apiServices/products";
import { QuickAddFormData } from "@/types/product";
import { getCountryList } from "@/lib/useCountries";
import type { ApplyPayload } from "@/types/ai";
import { useAiProcessing } from "@/lib/useAiProcessing";
import ProductPicker from "@/components/ai-import/ProductPicker";
import AiProcessingWidget from "@/components/ai-import/AiProcessingWidget";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CheckCircle2, ChevronDown, X,
  Loader2, Plus, Zap, ArrowRight, Package, Clock, AlertCircle,
  Sparkles, Globe, TrendingUp, MapPin, Brain,
} from "lucide-react";
import { toast } from "sonner";

const UOM_OPTIONS = [
  "Kilogram", "Gram", "Metric Ton", "Pound", "Liter", "Cubic Meter",
];

// The only form fields Quick Add exposes — AI fill is restricted to these
const QUICK_ADD_AI_FIELDS = [
  "polymerTypes", "productName", "chemicalFamily", "physicalForm",
  "countryOfOrigin", "minimum_order_quantity", "uom", "availability",
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
  const [submitted, setSubmitted] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // AI import state — parse/session lifecycle lives in useAiProcessing
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);
  const [aiFilledFields, setAiFilledFields] = useState<Record<string, { confidence: string }>>({});
  const aiFileInputRef = useRef<HTMLInputElement>(null);

  const clearAiField = (field: string) =>
    setAiFilledFields(prev => { const n = { ...prev }; delete n[field]; return n; });

  const aiCls = (field: string) => {
    const ai = aiFilledFields[field];
    if (!ai) return "";
    return ai.confidence === "low" || ai.confidence === "unknown"
      ? " border-orange-300 bg-orange-50/60 focus:border-orange-400"
      : " border-teal-200 bg-teal-50/30 focus:border-teal-400";
  };

  const [tooltipField, setTooltipField] = useState<string | null>(null);
  const aiTooltipMsg = (field: string) => {
    const conf = aiFilledFields[field]?.confidence;
    if (conf === "low") return "Claude wasn't certain about this value — please verify.";
    if (conf === "unknown") return "Claude couldn't determine this — fill it in manually.";
    return null;
  };

  const handleAiApply = useCallback(({ fields, aiFilledFields: filled, sessionId }: ApplyPayload) => {
    setForm(prev => ({ ...prev, ...(fields as Partial<QuickAddFormData>) }));
    setAiFilledFields(filled);
    setAiSessionId(sessionId);
  }, []);

  const aiP = useAiProcessing({
    isEditMode: false,
    allowedFields: QUICK_ADD_AI_FIELDS,
    onApply: handleAiApply,
  });
  const { openModal: aiOpenModal, handleFile: aiHandleFile } = aiP;

  const handleAiFile = useCallback((file: File) => {
    if (file.size > 20 * 1024 * 1024) { toast.error("File exceeds 20 MB limit."); return; }
    // "Modal open" = attended: single-product results auto-apply into the form
    aiOpenModal();
    aiHandleFile(file);
  }, [aiOpenModal, aiHandleFile]);

  const clearAiImport = () => {
    setAiSessionId(null);
    setAiFilledFields({});
    aiP.clearAiData();
  };

  const aiParsing = aiP.modalOpen && aiP.modalPhase === "parsing";
  const aiErrorPhase = aiP.modalOpen && ["rejected", "ocrFailed", "error"].includes(aiP.modalPhase);
  const catalogRemaining = aiP.catalogMemory
    ? aiP.catalogMemory.products.length - aiP.catalogMemory.usedIndices.size
    : 0;

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
      if (aiSessionId) { payload.createdVia = "ai"; payload.aiSessionId = aiSessionId; }

      const res = await createProduct(payload as any);
      if (res?.success || res?._id || res?.data?._id) {
        const pid = res._id || res.data?._id || res.data?.product?._id;
        setCreatedProductId(pid || null);
        setSubmitted(true);
        aiP.onFormSubmit();
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
    // Clear per-product AI state but keep catalogMemory — seller may add the
    // next product from the same catalog via "Use catalog again"
    setAiSessionId(null);
    setAiFilledFields({});
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
              <FieldWrapper num={1} required label="Polymer Types" hint="Select all polymer types you supply" aiState={aiFilledFields.polymerTypes?.confidence === "low" || aiFilledFields.polymerTypes?.confidence === "unknown" ? "low" : aiFilledFields.polymerTypes ? "filled" : undefined}>
                <>
                  <div onClick={() => { if (aiTooltipMsg("polymerTypes")) setTooltipField("polymerTypes"); }}>
                    <SearchableMultiSelect
                      options={polymersTypes}
                      selected={form.polymerTypes}
                      onToggle={(id) => {
                        clearAiField("polymerTypes");
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
                  </div>
                  {tooltipField === "polymerTypes" && aiTooltipMsg("polymerTypes") && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("polymerTypes")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>

            {/* Field 2: Chemical Family */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={2} label="Chemical Family" hint="Helps buyers filter by chemistry (e.g. Polyolefins, ABS)" aiState={aiFilledFields.chemicalFamily?.confidence === "low" || aiFilledFields.chemicalFamily?.confidence === "unknown" ? "low" : aiFilledFields.chemicalFamily ? "filled" : undefined}>
                <>
                  <div onClick={() => { if (aiTooltipMsg("chemicalFamily")) setTooltipField("chemicalFamily"); }}>
                    <SearchableSingleSelect
                      options={chemicalFamilies}
                      value={form.chemicalFamily || ""}
                      onChange={(id) => { clearAiField("chemicalFamily"); setForm((prev) => ({ ...prev, chemicalFamily: id })); }}
                      placeholder="Search and select a chemical family…"
                    />
                  </div>
                  {tooltipField === "chemicalFamily" && aiTooltipMsg("chemicalFamily") && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("chemicalFamily")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>
          </div>

          {/* Row 2: Product Name + Physical Form + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-x sm:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100">

            {/* Field 3: Product Name */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={3} label="Product Name" hint="A clear name helps buyers identify your product" aiState={aiFilledFields.productName?.confidence === "low" || aiFilledFields.productName?.confidence === "unknown" ? "low" : aiFilledFields.productName ? "filled" : undefined}>
                <>
                  <input
                    type="text"
                    value={form.productName || ""}
                    onFocus={() => { if (aiTooltipMsg("productName")) setTooltipField("productName"); }}
                    onChange={(e) => { clearAiField("productName"); setForm((prev) => ({ ...prev, productName: e.target.value })); }}
                    placeholder="e.g. LDPE Film, PP Homopolymer"
                    className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all placeholder:text-gray-400${aiCls("productName")}`}
                  />
                  {tooltipField === "productName" && aiTooltipMsg("productName") && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("productName")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>

            {/* Field 4: Physical Form */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={4} label="Physical Form" hint="How the material is supplied" aiState={aiFilledFields.physicalForm?.confidence === "low" || aiFilledFields.physicalForm?.confidence === "unknown" ? "low" : aiFilledFields.physicalForm ? "filled" : undefined}>
                <>
                  <div className="flex flex-wrap gap-2" onClick={() => { if (aiTooltipMsg("physicalForm")) setTooltipField("physicalForm"); }}>
                    {physicalForms.map((pf: { _id: string; name: string }) => {
                      const active = form.physicalForm === pf._id;
                      return (
                        <button
                          key={pf._id}
                          type="button"
                          onClick={() => { clearAiField("physicalForm"); setForm((prev) => ({ ...prev, physicalForm: prev.physicalForm === pf._id ? "" : pf._id })); }}
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
                  {tooltipField === "physicalForm" && aiTooltipMsg("physicalForm") && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("physicalForm")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>

            {/* Field 5: Country of Origin */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 sm:col-span-2 lg:col-span-1">
              <FieldWrapper num={5} label="Country of Origin" hint="Where is the material manufactured?" aiState={aiFilledFields.countryOfOrigin?.confidence === "low" || aiFilledFields.countryOfOrigin?.confidence === "unknown" ? "low" : aiFilledFields.countryOfOrigin ? "filled" : undefined}>
                <>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      value={form.countryOfOrigin || ""}
                      onFocus={() => { if (aiTooltipMsg("countryOfOrigin")) setTooltipField("countryOfOrigin"); }}
                      onChange={(e) => { clearAiField("countryOfOrigin"); setForm((prev) => ({ ...prev, countryOfOrigin: e.target.value })); }}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all text-gray-600 appearance-none"
                    >
                      <option value="">Select country…</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  {tooltipField === "countryOfOrigin" && aiTooltipMsg("countryOfOrigin") && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("countryOfOrigin")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>
          </div>

          {/* Row 3: MOQ | Availability | Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-x sm:divide-y-0 lg:divide-x divide-gray-100 border-t border-gray-100">

            {/* Field 6: MOQ + Unit */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={6} label="Min. Order Quantity" hint="Minimum amount buyers can order" aiState={aiFilledFields.minimum_order_quantity?.confidence === "low" || aiFilledFields.minimum_order_quantity?.confidence === "unknown" ? "low" : aiFilledFields.minimum_order_quantity ? "filled" : undefined}>
                <>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={form.minimum_order_quantity ?? ""}
                      onFocus={() => { if (aiTooltipMsg("minimum_order_quantity")) setTooltipField("minimum_order_quantity"); }}
                      onChange={(e) => { clearAiField("minimum_order_quantity"); setForm((prev) => ({ ...prev, minimum_order_quantity: e.target.value ? Number(e.target.value) : null })); }}
                      placeholder="e.g. 1000"
                      className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all placeholder:text-gray-400${aiCls("minimum_order_quantity")}`}
                    />
                    <select
                      value={form.uom || ""}
                      onFocus={() => { if (aiTooltipMsg("uom")) setTooltipField("uom"); }}
                      onChange={(e) => { clearAiField("uom"); setForm((prev) => ({ ...prev, uom: e.target.value })); }}
                      className="w-28 px-2 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all text-gray-600"
                    >
                      <option value="">Unit</option>
                      {UOM_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  {(tooltipField === "minimum_order_quantity" && aiTooltipMsg("minimum_order_quantity")) && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("minimum_order_quantity")}
                    </p>
                  )}
                  {(tooltipField === "uom" && aiTooltipMsg("uom")) && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("uom")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>

            {/* Field 7: Availability */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper num={7} label="Availability" hint="Let buyers know current stock status" aiState={aiFilledFields.availability?.confidence === "low" || aiFilledFields.availability?.confidence === "unknown" ? "low" : aiFilledFields.availability ? "filled" : undefined}>
                <>
                  <div className="flex flex-col gap-2" onClick={() => { if (aiTooltipMsg("availability")) setTooltipField("availability"); }}>
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = form.availability === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { clearAiField("availability"); setForm((prev) => ({ ...prev, availability: prev.availability === opt.value ? "" : opt.value })); }}
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
                  {tooltipField === "availability" && aiTooltipMsg("availability") && (
                    <p className="mt-1.5 text-xs text-orange-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />{aiTooltipMsg("availability")}
                    </p>
                  )}
                </>
              </FieldWrapper>
            </div>

            {/* Field 8: AI Catalog Import */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 sm:col-span-2 lg:col-span-1">
              <FieldWrapper num={8} label="AI Catalog Import" hint="Upload a catalog and Claude pre-fills the fields above">
                <input
                  ref={aiFileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.webp,.gif"
                  disabled={aiParsing}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleAiFile(f); e.target.value = ""; }}
                />

                {aiSessionId && !aiParsing ? (
                  /* Success state */
                  <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 border-2 border-teal-200 rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-teal-800 truncate">{aiP.uploadedFileName ?? "Catalog"}</p>
                      <p className="text-xs text-teal-600">{Object.keys(aiFilledFields).length} fields filled by Claude</p>
                      {catalogRemaining > 0 && (
                        <button type="button" onClick={aiP.reopenCatalogPicker}
                          className="mt-0.5 text-xs text-teal-600 underline underline-offset-2 hover:text-teal-700 transition-colors">
                          Use catalog again → ({catalogRemaining} more product{catalogRemaining !== 1 ? "s" : ""})
                        </button>
                      )}
                    </div>
                    <button type="button" aria-label="Clear AI data" onClick={clearAiImport}
                      className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : aiParsing ? (
                  /* Parsing state */
                  <div className="border-2 border-dashed border-teal-300 bg-teal-50/40 rounded-xl px-4 py-5 text-center cursor-not-allowed">
                    <div className="flex flex-col items-center gap-1">
                      <Loader2 className="w-7 h-7 text-teal-500 animate-spin motion-reduce:animate-none" />
                      {aiP.uploadedFileName && (
                        <p className="text-[11px] text-gray-500 truncate max-w-[200px] mt-1">{aiP.uploadedFileName}</p>
                      )}
                      <p className="text-xs font-medium text-gray-700">{aiP.loadingMsg}</p>
                      {aiP.loadingSubMsg && <p className="text-[11px] text-gray-500">{aiP.loadingSubMsg}</p>}
                      <button type="button" onClick={aiP.minimise}
                        style={{ minHeight: "44px" }}
                        className="flex items-center text-xs text-teal-600 underline underline-offset-2 hover:text-teal-700 transition-colors cursor-pointer">
                        Work in the background →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Idle dropzone */
                  <div
                    role="button"
                    tabIndex={0}
                    className="border-2 border-dashed rounded-xl px-4 py-6 text-center transition-all border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
                    onClick={() => aiFileInputRef.current?.click()}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); aiFileInputRef.current?.click(); } }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleAiFile(f); }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-teal-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-600">
                        <span className="text-teal-600 underline underline-offset-2">Browse</span> or drag & drop
                      </p>
                      <p className="text-xs text-gray-400">PDF, XLSX, CSV, JPG, PNG — up to 20 MB</p>
                    </div>
                  </div>
                )}

                {/* Catalog memory survives product creation — continue from the same catalog */}
                {!aiParsing && !aiSessionId && catalogRemaining > 0 && (
                  <button type="button" onClick={aiP.reopenCatalogPicker}
                    style={{ minHeight: "44px" }}
                    className="mt-1 flex items-center text-xs text-teal-600 underline underline-offset-2 hover:text-teal-700 transition-colors">
                    Use previous catalog again → ({catalogRemaining} more product{catalogRemaining !== 1 ? "s" : ""})
                  </button>
                )}

                {aiErrorPhase && (
                  <div className={`mt-2 flex items-start gap-2 p-3 rounded-lg border text-xs ${
                    aiP.modalPhase === "rejected" || aiP.modalErrorMsg.startsWith("This catalog took too long")
                      ? "bg-amber-50 border-amber-100 text-amber-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  }`}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>
                        {aiP.modalPhase === "rejected"
                          ? "No product data found. Make sure the file is a TDS or product catalog, not a brochure or SDS."
                          : aiP.modalPhase === "ocrFailed"
                          ? "This document couldn't be read. For best results, use a text-based PDF or a high-resolution scan (300 DPI+)."
                          : aiP.modalErrorMsg || "Upload failed — check your connection and try again."}
                      </p>
                      <button type="button" onClick={() => aiP.handleModalOpenChange(false)}
                        style={{ minHeight: "44px" }}
                        className="flex items-center font-semibold underline underline-offset-2">
                        Try again
                      </button>
                    </div>
                  </div>
                )}
              </FieldWrapper>
            </div>
          </div>

          {/* Multi-product picker (shadcn dialog) */}
          <Dialog
            open={aiP.modalOpen && aiP.modalPhase === "pick" && !!aiP.pickItems}
            onOpenChange={v => { if (!v) aiP.handleModalOpenChange(false); }}
          >
            <DialogContent className="max-w-lg w-full max-h-[90dvh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Choose a product
                </DialogTitle>
              </DialogHeader>
              {aiP.pickItems && (
                <ProductPicker
                  items={aiP.pickItems}
                  usedIndices={aiP.catalogMemory?.usedIndices}
                  onPick={aiP.pickProduct}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Background processing widget (after "Work in the background") */}
          <AiProcessingWidget
            bgState={aiP.bgState}
            bgFailReason={aiP.bgFailReason}
            fieldCount={aiP.fieldCount}
            pickCount={aiP.pickItems?.length ?? 0}
            loadingStage={aiP.loadingStage}
            fileName={aiP.uploadedFileName ?? undefined}
            onCancel={aiP.cancelBg}
            onApply={aiP.applyReady}
            onRetry={aiP.retry}
            onDismiss={aiP.dismissWidget}
          />

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
  num, label, hint, required, aiState, children,
}: {
  num: number; label: string; hint: string; required?: boolean;
  aiState?: "filled" | "low";
  children: React.ReactNode;
}) {
  const badgeCls = aiState === "low"
    ? "bg-orange-100"
    : aiState === "filled"
    ? "bg-teal-100"
    : required ? "bg-emerald-100" : "bg-gray-100";
  const textCls = aiState === "low"
    ? "text-orange-700"
    : aiState === "filled"
    ? "text-teal-700"
    : required ? "text-emerald-700" : "text-gray-500";

  return (
    <div className="flex items-start gap-4">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${badgeCls}`}>
        <span className={`text-xs font-bold ${textCls}`}>{num}</span>
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
