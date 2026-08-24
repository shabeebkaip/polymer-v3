"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDropdowns } from "@/lib/useDropdowns";
import { createProduct } from "@/apiServices/products";
import { QuickAddFormData } from "@/types/product";
import { getCountryList } from "@/lib/useCountries";
import {
  CheckCircle2, ChevronDown, X,
  Loader2, Zap, ArrowRight, Package, Clock, AlertCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

const UOM_OPTIONS = [
  "Kilogram", "Gram", "Metric Ton", "Pound", "Liter", "Cubic Meter",
];

// Exported so the "Found in Your Catalogue" surface (CatalogFindings.tsx,
// §14.3) can reuse the same option set verbatim for its availability chip.
export const AVAILABILITY_OPTIONS = [
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

// Shared draft — one in-progress "new product" draft per browser tab, read/written
// by both QuickAddProduct and the detailed form (app/user/products/add/page.tsx).
export const QUICK_ADD_DRAFT_KEY = "polymer-v3:quickAddDraft";
export const QUICK_ADD_DRAFT_TTL_MS = 5 * 60_000;

const INITIAL_QUICK_FORM: QuickAddFormData = {
  polymerTypes: [],
  productName: "",
  chemicalFamily: "",
  physicalForm: "",
  countryOfOrigin: "",
  minimum_order_quantity: null,
  uom: "Metric Ton",
  availability: "",
  productListFile: null,
};

function isPristine(f: QuickAddFormData): boolean {
  return (
    f.polymerTypes.length === 0 &&
    !f.productName &&
    !f.chemicalFamily &&
    !f.physicalForm &&
    !f.countryOfOrigin &&
    f.minimum_order_quantity == null &&
    !f.availability
  );
}

function readQuickAddDraft(): QuickAddFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUICK_ADD_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as { ts: number; values: QuickAddFormData };
    if (!draft?.ts || !draft.values || Date.now() - draft.ts > QUICK_ADD_DRAFT_TTL_MS) return null;
    return { ...INITIAL_QUICK_FORM, ...draft.values };
  } catch {
    return null;
  }
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

  // Start blank on every render path (server + first client render) so hydration
  // never mismatches, then hydrate from a fresh (<=5min) shared draft, if any, in
  // an effect right after mount (T16 item 2 — was a lazy useState initializer,
  // which reads sessionStorage during the render itself and can diverge from SSR).
  // ponytail: non-destructive read here; the detailed form may still need the draft.
  const [form, setForm] = useState<QuickAddFormData>(INITIAL_QUICK_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof QuickAddFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  useEffect(() => {
    const draft = readQuickAddDraft();
    if (draft) setForm(draft);
  }, []);

  const handleSwitchToAdvanced = () => {
    if (isPristine(form)) {
      sessionStorage.removeItem(QUICK_ADD_DRAFT_KEY);
    } else {
      sessionStorage.setItem(QUICK_ADD_DRAFT_KEY, JSON.stringify({ ts: Date.now(), values: form }));
    }
    onSwitchToAdvanced();
  };

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

      const res = await createProduct(payload as any);
      if (res?.success || res?._id || res?.data?._id) {
        const pid = res._id || res.data?._id || res.data?.product?._id;
        // ponytail: placeholder success feedback — full in-modal aria-live success view is Milestone 2 (DESIGN_SPEC §5.5)
        toast.success("Product created", {
          description: form.productName
            ? `${form.productName} is now visible to buyers.`
            : "Your product is now visible to buyers.",
        });
        sessionStorage.removeItem(QUICK_ADD_DRAFT_KEY);
        onSuccess?.(pid);
        resetForm();
      } else {
        toast.error(res?.message || "Failed to add product. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_QUICK_FORM);
  };

  // ── Form ────────────────────────────────────────────────────────
  // ponytail: marketing hero + full-screen success takeover removed (page chrome,
  // out of place inside a dialog). In-modal success/aria-live state is Milestone 2.
  return (
    <div className="flex flex-col h-full min-h-0">
      <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">

          {/* Row 1: Polymer Types — the only required field, anchor card (DESIGN_SPEC §12.4) */}
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="rounded-2xl bg-emerald-50/40 border border-emerald-100 p-4 sm:p-5">
              <FieldWrapper
                required
                label="Polymer Types"
                hint="Select all polymer types you supply. This is the only required field — everything else can be added later."
              >
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
          </div>

          {/* Row 2: Product Name + Chemical Family */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border-t border-gray-100">

            {/* Product Name */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper label="Product Name" hint="A clear name helps buyers identify your product.">
                <input
                  type="text"
                  value={form.productName || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, productName: e.target.value }))}
                  placeholder="e.g. LDPE Film, PP Homopolymer"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 focus:bg-white hover:border-gray-300 transition-all placeholder:text-gray-400"
                />
              </FieldWrapper>
            </div>

            {/* Chemical Family */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper label="Chemical Family" hint="Helps buyers filter by chemistry (e.g. Polyolefins, ABS).">
                <SearchableSingleSelect
                  options={chemicalFamilies}
                  value={form.chemicalFamily || ""}
                  onChange={(id) => setForm((prev) => ({ ...prev, chemicalFamily: id }))}
                  placeholder="Search and select a chemical family…"
                />
              </FieldWrapper>
            </div>
          </div>

          {/* Row 3: Physical Form + Availability — one-tap chip fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border-t border-gray-100">

            {/* Physical Form */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper label="Physical Form" hint="How you supply this product.">
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

            {/* Availability */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <FieldWrapper label="Availability" hint="Let buyers know current stock status.">
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
          </div>

          {/* Row 4: Progressive disclosure — Country of Origin + MOQ (DESIGN_SPEC §12.5) */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-100">
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/40">
              <button
                type="button"
                onClick={() => setDisclosureOpen((v) => !v)}
                aria-expanded={disclosureOpen}
                aria-controls="quick-add-disclosure-panel"
                className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-sm font-medium text-gray-700"
              >
                <span>
                  {disclosureOpen
                    ? "Hide Country of Origin & Min. Order Quantity"
                    : "Add Country of Origin & Min. Order Quantity"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${disclosureOpen ? "rotate-180" : ""}`} />
              </button>
              {disclosureOpen && (
                <div id="quick-add-disclosure-panel" className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Country of Origin */}
                  <div>
                    <FieldWrapper label="Country of Origin" hint="Where is this product manufactured?">
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

                  {/* Min. Order Quantity + Unit */}
                  <div>
                    <FieldWrapper label="Min. Order Quantity" hint="Minimum quantity buyers can order.">
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

                </div>
              )}
            </div>
          </div>

        </div>{/* end scrollable body */}

        {/* CTA Footer — fixed outside the scrollable body (DESIGN_SPEC §2.1) */}
        <div className="shrink-0 px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 sm:max-w-xs flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 hover:-translate-y-0.5"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Adding Product…</>
            ) : (
              <><Zap className="w-4 h-4" />Add Product<ArrowRight className="w-4 h-4 ml-0.5" /></>
            )}
          </button>
          <p className="text-xs text-gray-400">
            Need more fields?{" "}
            <button type="button" onClick={handleSwitchToAdvanced} className="text-emerald-600 font-semibold hover:text-emerald-700 underline underline-offset-2 transition-colors">
              Add Detailed Product
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

// Reusable field wrapper — label + hint. No numbered badge (DESIGN_SPEC §12.4):
// only the sole required field (Polymer Types) gets a "Required" pill; the 6
// optional fields get no pill and no "(optional)" tag.
function FieldWrapper({
  label, hint, required, children,
}: {
  label: string; hint: string; required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className={`block text-sm mb-0.5 ${required ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
        {label}
        {required && (
          <span className="ml-1.5 text-xs font-normal text-white bg-emerald-500 px-1.5 py-0.5 rounded-full">Required</span>
        )}
      </label>
      <p className="text-xs text-gray-400 mb-3">{hint}</p>
      {children}
    </div>
  );
}
