"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
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
import { ProductFormData, QuickAddFormData, ValidationErrors, RequiredField, AddEditProductProps } from "@/types/product";
import type { UploadedFile } from "@/types/shared";
import { Button } from "../ui/button";
import {
  Save, RotateCcw, ChevronDown, ChevronUp, CheckCircle2,
  ImageIcon, Settings, Box, Shield, Upload,
  Eye, MapPin, Tag, Layers, Sparkles, CheckCheck, Plus,
  FileText, FileSpreadsheet, AlertCircle,
} from "lucide-react";
import AiCatalogModal, { type AiFilledFields } from "@/components/ai-import/AiCatalogModal";
import AiProcessingWidget from "@/components/ai-import/AiProcessingWidget";
import { useAiProcessing } from "@/lib/useAiProcessing";
import { createProduct, updateProduct } from "@/apiServices/products";
import { initialFormData } from "@/apiServices/constants/userProductCrud";
import { QUICK_ADD_DRAFT_KEY, QUICK_ADD_DRAFT_TTL_MS } from "@/components/user/products/QuickAddProduct";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Shared draft — reverse write (T16 item 1) ────────────────────────────────
// Symmetric counterpart to add/page.tsx's readDraft(). Writes Detailed's current
// values back into the shared Quick Add draft on "Back to Quick Add", mapped to
// QuickAddFormData shape (inverse of §14.3). Detailed-only fields have no home
// there and are correctly dropped.
function writeDraftFromDetailed(data: ProductFormData, seedPolymerType?: string) {
  if (typeof window === "undefined") return;
  let existingTypes: string[] = [];
  let existingProductListFile: QuickAddFormData["productListFile"] = null;
  try {
    const raw = sessionStorage.getItem(QUICK_ADD_DRAFT_KEY);
    if (raw) {
      const draft = JSON.parse(raw) as { ts: number; values: QuickAddFormData };
      if (draft?.ts && draft.values && Date.now() - draft.ts <= QUICK_ADD_DRAFT_TTL_MS) {
        existingTypes = draft.values.polymerTypes ?? [];
        existingProductListFile = draft.values.productListFile ?? null;
      }
    }
  } catch {
    // malformed draft — fall through to the empty fallback below
  }

  // polymerType (singular) -> polymerTypes (array). Only collapse to the single
  // current value when the seller actually changed it in Detailed; if it's still
  // whatever it arrived pre-seeded as (or empty), keep the existing multi-select
  // array from Quick Add rather than silently dropping every type but the first.
  const touched = data.polymerType !== (seedPolymerType ?? "");
  const polymerTypes = touched && data.polymerType
    ? [data.polymerType]
    : existingTypes.length > 0
      ? existingTypes
      : data.polymerType ? [data.polymerType] : [];

  const values: QuickAddFormData = {
    polymerTypes,
    productName: data.productName || "",
    chemicalFamily: data.chemicalFamily || "",
    physicalForm: data.physicalForm || "",
    countryOfOrigin: data.countryOfOrigin || "",
    minimum_order_quantity: data.minimum_order_quantity ?? null,
    uom: data.uom || "",
    availability: data.availability || "",
    productListFile: data.productListFile ?? existingProductListFile,
  };
  sessionStorage.setItem(QUICK_ADD_DRAFT_KEY, JSON.stringify({ ts: Date.now(), values }));
}

// ─── Completion helpers ───────────────────────────────────────────────────────
// Only the four sections that still live behind the Advanced disclosure as
// independently-collapsible SectionCards. core/images/trade are no longer
// section-badge concepts — their completion is tracked field-by-field by the
// required-vs-optional model below (§13.5).
type SectionId = "technical" | "packaging" | "compliance" | "documents";

function getSectionCompletion(data: ProductFormData): Record<SectionId, boolean> {
  return {
    technical: !!(data.density || data.mfi || data.tensileStrength),
    packaging: Array.isArray(data.packagingType) && data.packagingType.length > 0,
    compliance: !!(data.recyclable || data.bioDegradable || data.fdaApproved || data.medicalGrade),
    documents: [data.safety_data_sheet, data.technical_data_sheet, data.certificate_of_analysis].some(
      doc => doc && typeof doc === "object" && Object.keys(doc).length > 0
    ),
  };
}

const SECTIONS: { id: SectionId; title: string; subtitle: string; icon: React.ElementType }[] = [
  { id: "technical",  title: "Technical Properties",        subtitle: "Add technical specifications and properties",  icon: Settings },
  { id: "packaging",  title: "Packaging",                   subtitle: "Provide packaging and pallet information",     icon: Box      },
  { id: "compliance", title: "Compliance & Certifications",  subtitle: "Add compliance documents and certificates",    icon: Shield   },
  { id: "documents",  title: "Documents",                   subtitle: "Upload any additional documents",              icon: Upload   },
];

// Focus target ids — most map to a native, already-focusable form control's
// own `id`; the rest (select-style fields with no single focusable element)
// get a `-field` suffixed wrapper `div` with `tabIndex={-1}` in the relevant
// sub-component so scrollIntoView + focus() both work consistently.
const FIELD_FOCUS_ID: Record<string, string> = {
  productName: "productName",
  chemicalName: "chemicalName",
  chemicalFamily: "chemicalFamily-field",
  polymerType: "polymerType-field",
  physicalForm: "physicalForm-field",
  industry: "industry-field",
  productImages: "productImages-field",
  minimum_order_quantity: "minimum_order_quantity",
  stock: "stock",
  uom: "uom-field",
  price: "price",
  incoterms: "incoterms-field",
  fdaCertificate: "fdaCertificate-field",
  medicalCertificate: "medicalCertificate-field",
};

const REQUIRED_FIELD_ORDER = [
  "productName", "chemicalName", "chemicalFamily", "polymerType", "physicalForm", "industry",
  "productImages", "minimum_order_quantity", "stock", "uom", "price", "incoterms",
  "fdaCertificate", "medicalCertificate",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// ─── Section Card (controlled — auto-expand-on-invalid-submit needs to force
// the Compliance card open from the parent, so open state is lifted) ────────
function SectionCard({
  title, subtitle, icon: Icon, completed, hasError, open, onToggle, children,
}: {
  title: string; subtitle: string; icon: React.ElementType;
  completed: boolean; hasError: boolean; open: boolean; onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200
      ${hasError ? "border-red-200" : completed ? "border-emerald-200" : "border-gray-100"}
      ${open ? "shadow-md" : "hover:shadow-md"}
    `}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-5 py-4 text-left group rounded-t-2xl overflow-hidden min-h-[44px]"
      >
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

// ─── Catalog dropzone (§13.2) — react-dropzone, matching FileUpload.tsx's hook
// usage, NOT AiCatalogModal's hand-rolled drag handlers. ────────────────────
const ACCEPT_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/csv": [".csv"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};
const ACCEPT_PILLS: [React.ElementType, string][] = [
  [FileText, "PDF"],
  [FileSpreadsheet, "XLSX"],
  [FileSpreadsheet, "CSV"],
  [ImageIcon, "JPG/PNG"],
  [ImageIcon, "WEBP"],
];

function CatalogDropzone({
  aiFillCount, catalogRemaining, onOpenModal, onHandleFile, onReopenCatalogPicker,
}: {
  aiFillCount: number;
  catalogRemaining: number;
  onOpenModal: () => void;
  onHandleFile: (file: File) => void;
  onReopenCatalogPicker: () => void;
}) {
  const [rejectionMsg, setRejectionMsg] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setRejectionMsg("");
    // R9 — order matters: openModal() sets phase "idle" + opens the modal,
    // handleFile() then flips phase to "parsing". Reversed order stomps the
    // parsing phase back to idle or parses silently with the modal closed.
    onOpenModal();
    onHandleFile(file);
  }, [onOpenModal, onHandleFile]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const tooLarge = fileRejections.some(r => r.errors.some(e => e.code === "file-too-large"));
    setRejectionMsg(tooLarge
      ? "File exceeds 20 MB limit."
      : "Accepted: PDF, XLSX, XLS, CSV, JPG, PNG, WEBP, GIF");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPT_TYPES,
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  const success = aiFillCount > 0;

  return (
    <div>
      <div
        {...getRootProps()}
        aria-label="Upload a catalog file to auto-fill this form. Accepts PDF, Excel, CSV, or image files, up to 20 megabytes."
        className={
          success
            ? "bg-teal-50 border border-teal-200 rounded-2xl px-4 sm:px-6 py-8 sm:py-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            : `bg-white rounded-2xl border-2 border-dashed transition-colors px-4 py-8 sm:px-6 sm:py-10 lg:py-14 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
              ${isDragActive ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-teal-400 hover:bg-teal-50/40"}`
        }
      >
        <input {...getInputProps()} className="hidden" />
        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <CheckCheck className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-900">Catalog imported · {aiFillCount} fields filled</p>
              <p className="text-xs text-teal-700 mt-0.5">
                {catalogRemaining > 0
                  ? `${catalogRemaining} more product${catalogRemaining !== 1 ? "s" : ""} available in this catalog`
                  : "Review the pre-filled fields below and make any corrections."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {catalogRemaining > 0 && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onReopenCatalogPicker(); }}
                  style={{ minHeight: "44px" }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-teal-200 bg-white text-teal-700 text-sm font-medium transition-colors hover:bg-teal-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another from this catalog
                </button>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
                style={{ minHeight: "44px" }}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Import another
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-600 shadow-md">
              <Upload className="text-white" size={28} />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">
                {isDragActive ? "Drop to import" : "Drop a catalog to auto-fill this form"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, Excel, CSV, or image — Claude reads it and fills in what it finds. Up to 20 MB.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {ACCEPT_PILLS.map(([Icon, label]) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-xs text-gray-600 border border-gray-100">
                  <Icon size={11} />{label}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md
                bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all"
            >
              Choose a file
            </button>
          </div>
        )}
      </div>
      {rejectionMsg && (
        <div className="mt-3 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{rejectionMsg}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AddEditProduct = ({ product, id, onBackToQuickAdd }: AddEditProductProps) => {
  const router = useRouter();
  const isEditMode = !!id;

  const {
    chemicalFamilies, polymersTypes, industry, physicalForms,
    packagingTypes, grades, incoterms, paymentTerms, productFamilies,
  } = useDropdowns();

  const [data, setData] = useState<ProductFormData>(product ?? initialFormData);
  const [error, setError] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);

  // Advanced & Optional Details disclosure + its nested SectionCards (controlled
  // so submit-time validation can force Compliance open — §13.7).
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState<Record<SectionId, boolean>>({
    technical: false, packaging: false, compliance: false, documents: false,
  });
  const toggleSection = (sec: SectionId) => setSectionOpen(prev => ({ ...prev, [sec]: !prev[sec] }));

  // AI import
  const [aiFilledFields, setAiFilledFields] = useState<AiFilledFields>({});
  const [aiFillCount, setAiFillCount] = useState(0);
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);

  const handleAiApply = useCallback(
    ({ fields, aiFilledFields: filled, sessionId }: { fields: Record<string, unknown>; aiFilledFields: AiFilledFields; sessionId: string }) => {
      const normalized = { ...fields };
      // buildDiff stores polymer type as polymerTypes (array); SearchableSelect binds to polymerType (string)
      if (Array.isArray(normalized.polymerTypes) && (normalized.polymerTypes as unknown[]).length > 0) {
        normalized.polymerType = (normalized.polymerTypes as unknown[])[0];
      }
      setData(prev => ({ ...prev, ...normalized }));
      setAiFilledFields(filled);
      setAiFillCount(Object.keys(filled).length);
      setAiSessionId(sessionId);
    },
    [],
  );

  const aiProcessing = useAiProcessing({
    isEditMode,
    existingData: data as Record<string, unknown>,
    onApply: handleAiApply,
  });

  const clearAiField = useCallback(
    (field: string) => setAiFilledFields(prev => { const n = { ...prev }; delete n[field]; return n; }),
    [],
  );

  const handleAiClear = useCallback(() => {
    setAiFilledFields({});
    setAiFillCount(0);
    setAiSessionId(null);
    aiProcessing.clearAiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiProcessing.clearAiData]);

  const onFieldChange = (
    key: keyof ProductFormData,
    value: string | number | boolean | UploadedFile[] | Record<string, unknown> | undefined,
  ) => setData(prev => ({ ...prev, [key]: value }));

  const onFieldError = (key: keyof ProductFormData) =>
    setError(prev => ({ ...prev, [key]: "" }));

  const resetForm = () => { setData(initialFormData); setError({}); };

  // T16 item 1 — symmetric write-on-switch: write current Detailed values back
  // into the shared draft before handing off navigation to the caller.
  const handleBackToQuickAdd = () => {
    writeDraftFromDetailed(data, product?.polymerType);
    onBackToQuickAdd?.();
  };

  const catalogRemaining = aiProcessing.catalogMemory
    ? aiProcessing.catalogMemory.products.length - aiProcessing.catalogMemory.usedIndices.size
    : 0;

  // ── Completion — required-vs-optional model (§13.5), predicates copied
  // field-for-field from validate() below so the tracker can never say
  // "complete" while a required field that would block submission is empty.
  const completion = getSectionCompletion(data);

  const requiredChecklist: { key: string; label: string; done: boolean }[] = [
    { key: "productName", label: "Product Name", done: !!data.productName?.trim() },
    { key: "chemicalName", label: "Chemical Name", done: !!data.chemicalName?.trim() },
    { key: "chemicalFamily", label: "Chemical Family", done: !!data.chemicalFamily },
    { key: "polymerType", label: "Polymer Type", done: !!data.polymerType },
    { key: "physicalForm", label: "Physical Form", done: !!data.physicalForm },
    { key: "industry", label: "Industries", done: Array.isArray(data.industry) && data.industry.length > 0 },
    {
      key: "productImages", label: "Product Images",
      done: Array.isArray(data.productImages) && data.productImages.length > 0 &&
        data.productImages.every((img: UploadedFile) => !!img.id && !!img.name && !!img.type && !!img.fileUrl),
    },
    { key: "minimum_order_quantity", label: "Min. Order Quantity", done: !!data.minimum_order_quantity },
    { key: "stock", label: "Stock Quantity", done: !!data.stock },
    { key: "uom", label: "Unit of Measurement", done: !!data.uom },
    { key: "price", label: "Price per Unit", done: !!data.price },
    { key: "incoterms", label: "Incoterms", done: Array.isArray(data.incoterms) && data.incoterms.length > 0 },
  ];
  if (data.fdaApproved) {
    requiredChecklist.push({
      key: "fdaCertificate", label: "FDA Certificate",
      done: !!data.fdaCertificate?.id && !!data.fdaCertificate?.fileUrl,
    });
  }
  if (data.medicalGrade) {
    requiredChecklist.push({
      key: "medicalCertificate", label: "Medical Certificate",
      done: !!data.medicalCertificate?.id && !!data.medicalCertificate?.fileUrl,
    });
  }
  const totalRequired = requiredChecklist.length;
  const completedRequired = requiredChecklist.filter(f => f.done).length;

  const totalOptional = 9;
  const completedOptional = [
    !!data.tradeName?.trim(),
    !!data.description?.trim(),
    !!data.countryOfOrigin?.trim(),
    completion.technical,
    completion.packaging,
    completion.compliance,
    completion.documents,
    !!data.paymentTerms,
    !!data.leadTime,
  ].filter(Boolean).length;

  // ── Focus/scroll management for submit-invalid + tracker "Missing" clicks ──
  const pendingFocusRef = useRef<string | null>(null);

  const focusField = useCallback((fieldKey: string) => {
    const domId = FIELD_FOCUS_ID[fieldKey] ?? fieldKey;
    // ponytail: app/user/layout.tsx mounts {children} twice (separate desktop/
    // mobile trees, CSS-toggled — pre-existing, out of scope here), so a plain
    // getElementById can return the currently-hidden copy's element. Prefer
    // whichever match is actually laid out (offsetParent !== null).
    const matches = document.querySelectorAll(`#${CSS.escape(domId)}`);
    const el = (Array.from(matches).find(n => (n as HTMLElement).offsetParent !== null) ?? matches[0]) as HTMLElement | undefined;
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    el.focus();
  }, []);

  // fdaCertificate/medicalCertificate live inside a collapsed SectionCard
  // nested inside the collapsed Advanced panel — both levels must open and
  // paint before we call scrollIntoView/focus (§13.9 — never focus a still
  // display:none element).
  useEffect(() => {
    if (!pendingFocusRef.current) return;
    if (!advancedOpen || !sectionOpen.compliance) return;
    const key = pendingFocusRef.current;
    pendingFocusRef.current = null;
    requestAnimationFrame(() => focusField(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedOpen, sectionOpen.compliance]);

  const revealAndFocusField = useCallback((fieldKey: string) => {
    if (fieldKey === "fdaCertificate" || fieldKey === "medicalCertificate") {
      pendingFocusRef.current = fieldKey;
      setAdvancedOpen(true);
      setSectionOpen(prev => ({ ...prev, compliance: true }));
    } else {
      focusField(fieldKey);
    }
  }, [focusField]);

  const focusFirstInvalid = useCallback((errs: ValidationErrors) => {
    const firstKey = REQUIRED_FIELD_ORDER.find(k => !!errs[k as keyof ValidationErrors]);
    if (firstKey) revealAndFocusField(firstKey);
  }, [revealAndFocusField]);

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
    ["melting_point","glass_transition_temperature","heat_deflection_temperature","moisture_content","ash_content","dielectric_strength","volume_resistivity","flexuralModulus","grades"].forEach(f => delete fmt[f]);
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
      focusFirstInvalid(errs);
      return;
    }
    setSaving(true);
    const toastId = toast.loading(isEditMode ? "Updating product…" : "Creating product…");
    try {
      const payload = formatDataForAPI(data);
      if (aiSessionId) { payload.aiSessionId = aiSessionId; payload.createdVia = "ai"; }
      const res = isEditMode
        ? await updateProduct(id as string, payload)
        : await createProduct(payload);
      if (res?.success) {
        toast.success(isEditMode ? "Product updated!" : "Product created!", { id: toastId });
        aiProcessing.onFormSubmit();
        if (!isEditMode) {
          setData(initialFormData);
          sessionStorage.removeItem(QUICK_ADD_DRAFT_KEY);
        }
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

  // Error groups per SectionCard (only Compliance can carry an error — the
  // two conditional certs; the other three never set a validate() error).
  const sectionErrors: Record<SectionId, boolean> = {
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
            {onBackToQuickAdd && (
              <button
                onClick={handleBackToQuickAdd}
                className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
              >
                ← Back to Quick Add
              </button>
            )}
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

            {/* Reduced hero (§13.1) — Completion Progress widget removed, now
                solely owned by the sidebar tracker below. */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 px-6 py-4 sm:px-8 sm:py-5 shadow-xl">
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
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                    {isEditMode ? "Update Your Listing" : "Create New Product"}
                  </h1>
                  <p className="text-emerald-100 text-sm leading-relaxed max-w-md">
                    Build a professional product listing to attract verified buyers across the globe.
                  </p>
                </div>
              </div>
            </div>

            {/* Dominant catalog dropzone (§13.2 / §18) — replaces the old thin
                "AI Assist banner". */}
            <CatalogDropzone
              aiFillCount={aiFillCount}
              catalogRemaining={catalogRemaining}
              onOpenModal={aiProcessing.openModal}
              onHandleFile={aiProcessing.handleFile}
              onReopenCatalogPicker={aiProcessing.reopenCatalogPicker}
            />

            <AiCatalogModal
              open={aiProcessing.modalOpen}
              onOpenChange={aiProcessing.handleModalOpenChange}
              phase={aiProcessing.modalPhase}
              loadingMsg={aiProcessing.loadingMsg}
              loadingSubMsg={aiProcessing.loadingSubMsg}
              loadingStage={aiProcessing.loadingStage}
              uploadedFileName={aiProcessing.uploadedFileName}
              readyDiff={aiProcessing.readyDiff}
              errorMsg={aiProcessing.modalErrorMsg}
              pickItems={aiProcessing.pickItems}
              usedIndices={aiProcessing.catalogMemory?.usedIndices}
              onFile={aiProcessing.handleFile}
              onMinimise={aiProcessing.minimise}
              onApplyDiff={aiProcessing.applyDiff}
              onPick={aiProcessing.pickProduct}
              onClearAll={aiFillCount > 0 ? handleAiClear : undefined}
            />

            <AiProcessingWidget
              bgState={aiProcessing.bgState}
              bgFailReason={aiProcessing.bgFailReason}
              fieldCount={aiProcessing.fieldCount}
              pickCount={aiProcessing.pickItems?.length ?? 0}
              loadingStage={aiProcessing.loadingStage}
              fileName={aiProcessing.uploadedFileName ?? undefined}
              onCancel={aiProcessing.cancelBg}
              onApply={aiProcessing.applyReady}
              onRetry={aiProcessing.retry}
              onDismiss={aiProcessing.dismissWidget}
            />

            {/* Required Information card (§13.3) — all 12 required fields,
                always expanded, no extra click needed. */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-100">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-50 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Required Information</p>
                    <p className="text-xs text-gray-400 mt-0.5">Fill in everything below to publish your listing — nothing here is optional.</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  completedRequired === totalRequired ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {completedRequired} of {totalRequired} complete
                </span>
              </div>

              <div className="px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Product Identity</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <GeneralInformation
                    fieldGroup="required"
                    data={data} onFieldChange={onFieldChange} error={error} onFieldError={onFieldError}
                    aiFilledFields={aiFilledFields} clearAiField={clearAiField}
                  />
                  <ProductDetails
                    fieldGroup="required"
                    data={data}
                    onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                    chemicalFamilies={chemicalFamilies} polymersTypes={polymersTypes}
                    industry={industry} physicalForms={physicalForms} productFamilies={productFamilies}
                    error={error} onFieldError={onFieldError}
                    aiFilledFields={aiFilledFields} clearAiField={clearAiField}
                  />
                </div>

                <div className="border-t border-gray-100 my-5 sm:my-6" />
                <ProductImages data={data} onFieldChange={onFieldChange} />

                <div className="border-t border-gray-100 my-5 sm:my-6" />
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Trade &amp; Pricing</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <TradeInformation
                    fieldGroup="required"
                    data={data}
                    onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                    incoterms={incoterms} paymentTerms={paymentTerms} error={error} onFieldError={onFieldError}
                    aiFilledFields={aiFilledFields} clearAiField={clearAiField}
                  />
                </div>
              </div>
            </div>

            {/* Advanced & Optional Details disclosure (§13.4) — collapsed by
                default, real button, aria-expanded/aria-controls. */}
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/40">
              <button
                type="button"
                id="advanced-details-toggle"
                aria-controls="advanced-details-panel"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen(v => !v)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 min-h-[44px] flex-wrap"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {advancedOpen ? "Hide Advanced & Optional Details" : "Advanced & Optional Details"}
                  </p>
                  {!advancedOpen && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Technical properties, packaging, compliance &amp; certifications, documents, and other optional fields.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {completedOptional} of {totalOptional} optional fields added
                  </span>
                  {advancedOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {advancedOpen && (
                <div id="advanced-details-panel" role="region" aria-labelledby="advanced-details-toggle" className="px-5 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Additional Core Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    <GeneralInformation
                      fieldGroup="advanced"
                      data={data} onFieldChange={onFieldChange} error={error} onFieldError={onFieldError}
                      aiFilledFields={aiFilledFields} clearAiField={clearAiField}
                    />
                    <ProductDetails
                      fieldGroup="advanced"
                      data={data}
                      onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                      chemicalFamilies={chemicalFamilies} polymersTypes={polymersTypes}
                      industry={industry} physicalForms={physicalForms} productFamilies={productFamilies}
                      error={error} onFieldError={onFieldError}
                      aiFilledFields={aiFilledFields} clearAiField={clearAiField}
                    />
                  </div>

                  <div className="border-t border-gray-100 my-5" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Additional Trade Terms</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    <TradeInformation
                      fieldGroup="advanced"
                      data={data}
                      onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                      incoterms={incoterms} paymentTerms={paymentTerms} error={error} onFieldError={onFieldError}
                      aiFilledFields={aiFilledFields} clearAiField={clearAiField}
                    />
                  </div>

                  <div className="border-t border-gray-100 my-5" />
                  <div className="flex flex-col gap-4">
                    {SECTIONS.map(sec => (
                      <SectionCard
                        key={sec.id}
                        title={sec.title}
                        subtitle={sec.subtitle}
                        icon={sec.icon}
                        completed={completion[sec.id]}
                        hasError={sectionErrors[sec.id]}
                        open={sectionOpen[sec.id]}
                        onToggle={() => toggleSection(sec.id)}
                      >
                        {sec.id === "technical" && (
                          <TechnicalProperties
                            data={data}
                            onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                            grades={grades}
                            aiFilledFields={aiFilledFields} clearAiField={clearAiField}
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
                  </div>
                </div>
              )}
            </div>

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

            {/* Completion tracker (§13.5) — required-vs-optional model, sole
                source of truth for completion on this page. */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4">Product Completion</h3>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">Required fields</span>
                <span className="text-xs font-bold text-emerald-600">{completedRequired} of {totalRequired} complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalRequired ? (completedRequired / totalRequired) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">Optional fields</span>
                <span className="text-xs font-bold text-gray-500">{completedOptional} of {totalOptional} complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedOptional / totalOptional) * 100}%` }}
                />
              </div>

              <p className="mt-4 text-xs">
                {completedRequired === totalRequired ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready to publish — all required fields complete.
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {totalRequired - completedRequired} required field{totalRequired - completedRequired !== 1 ? "s" : ""} remaining
                  </span>
                )}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                {requiredChecklist.map(f => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => revealAndFocusField(f.key)}
                    className="flex items-center justify-between gap-2 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${f.done ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                        {f.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </span>
                      <span className="text-xs text-gray-600">{f.label}</span>
                    </span>
                    <span className={`text-xs font-medium ${f.done ? "text-emerald-600" : "text-gray-400"}`}>
                      {f.done ? "Complete" : "Missing"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview — unchanged (§13.6), reads directly off `data`. */}
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
