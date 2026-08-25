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
  Eye, MapPin, Tag, Layers,
  FileText, FileSpreadsheet, AlertCircle, FileCheck,
} from "lucide-react";
import AiCatalogModal, { type AiFilledFields } from "@/components/ai-import/AiCatalogModal";
import AiProcessingWidget from "@/components/ai-import/AiProcessingWidget";
import { useAiProcessing } from "@/lib/useAiProcessing";
import { createProduct, updateProduct } from "@/apiServices/products";
import { initialFormData } from "@/apiServices/constants/userProductCrud";
import { QUICK_ADD_DRAFT_KEY, QUICK_ADD_DRAFT_TTL_MS } from "@/components/user/products/QuickAddProduct";
import CatalogFindings, { getVisibleTaxonomyReview } from "@/components/user/products/CatalogFindings";
import type { ApplyPayload, ConflictItem, TaxonomyReviewItem } from "@/types/ai";
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
  grade: "grade-field",
};

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
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 motion-reduce:transition-none
      ${hasError ? "border-red-200" : completed ? "border-emerald-200" : "border-gray-100"}
      ${open ? "shadow-md" : "hover:shadow-md"}
    `}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-5 py-4 text-start group rounded-t-2xl overflow-hidden min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700"
      >
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
          ${completed ? "bg-emerald-50" : hasError ? "bg-red-50" : "bg-gray-50"}`}>
          <Icon aria-hidden="true" className={`w-4 h-4 ${completed ? "text-emerald-600" : hasError ? "text-red-500" : "text-gray-500"}`} />
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
          {open ? <ChevronUp aria-hidden="true" className="w-4 h-4" /> : <ChevronDown aria-hidden="true" className="w-4 h-4" />}
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
  aiFillCount, catalogRemaining, uploadedFileName, onOpenModal, onHandleFile,
  onReopenCatalogPicker, onRemove,
}: {
  aiFillCount: number;
  catalogRemaining: number;
  uploadedFileName?: string | null;
  onOpenModal: () => void;
  onHandleFile: (file: File) => void;
  onReopenCatalogPicker: () => void;
  onRemove: () => void;
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

  // §14.5 — compact post-extraction source bar, supersedes §13.2's tall
  // success card. getRootProps/getInputProps stay wired here too, so a drop
  // directly onto the bar still re-triggers import exactly like "Replace".
  if (success) {
    return (
      <div
        id="catalog-source-bar"
        aria-label="Imported catalogue source"
        className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-nowrap"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="max-w-[220px] break-words text-sm font-medium text-gray-900" title={uploadedFileName ?? "Catalogue"}>
              <bdi>{uploadedFileName ?? "Catalogue"}</bdi>
            </p>
            <p className="text-xs text-gray-500">{aiFillCount} field{aiFillCount !== 1 ? "s" : ""} found</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          {catalogRemaining > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReopenCatalogPicker(); }}
              className="min-h-[44px] rounded-lg px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Add another
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
            className="min-h-[44px] rounded-lg px-3 text-xs font-medium text-teal-700 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="min-h-[44px] rounded-lg px-3 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        aria-label="Upload a catalog file to auto-fill this form. Accepts PDF, Excel, CSV, or image files, up to 20 megabytes."
        className={`bg-white rounded-2xl border-2 border-dashed transition-colors px-4 py-8 sm:px-6 sm:py-10 lg:py-14 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
              ${isDragActive ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-teal-400 hover:bg-teal-50/40"}`}
      >
        <input {...getInputProps()} className="hidden" />
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
  const catalogInstanceId = React.useId().replace(/:/g, "");
  const needsAttentionHeadingId = `${catalogInstanceId}-needs-attention-heading`;
  const foundHeadingId = `${catalogInstanceId}-found-in-catalogue-heading`;
  const requiredHeadingId = `${catalogInstanceId}-required-information-heading`;
  const statusId = `${catalogInstanceId}-catalogue-status`;
  const completionTrackerId = `${catalogInstanceId}-completion-tracker`;
  const completionHeadingId = `${catalogInstanceId}-completion-heading`;
  const validationSummaryId = `${catalogInstanceId}-validation-summary`;
  const validationHeadingId = `${catalogInstanceId}-validation-heading`;
  const router = useRouter();
  const isEditMode = !!id;

  const {
    chemicalFamilies, polymersTypes, industry, physicalForms,
    packagingTypes, grades, incoterms, paymentTerms, productFamilies,
  } = useDropdowns();

  const [data, setData] = useState<ProductFormData>(product ?? initialFormData);
  const [error, setError] = useState<ValidationErrors>({});
  const [validationAttempt, setValidationAttempt] = useState(0);
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
  const aiFilledFieldsRef = useRef<AiFilledFields>({});
  const [aiFillCount, setAiFillCount] = useState(0);
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);
  // §14 "Found in Your Catalogue" — the persistent review surface needs the
  // taxonomy review metadata the transient AI modal already had access to
  // (§21.9's plumbing note), so it's captured here alongside aiFilledFields.
  const [taxonomyReview, setTaxonomyReview] = useState<TaxonomyReviewItem[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [latestFoundCount, setLatestFoundCount] = useState(0);
  // Bumped once per successful apply (initial import, Replace, or "Add
  // another") — NOT on aiFillCount changes from per-card edits/dismissals,
  // which must not re-announce (§14.9). aiFillCount alone can't drive this:
  // a same-session "Add another" pick never passes back through 0.
  const [applyGen, setApplyGen] = useState(0);
  const [ariaLiveMsg, setAriaLiveMsg] = useState("");

  const handleAiApply = useCallback(
    ({ fields, extractedFieldKeys, aiFilledFields: filled, sessionId, taxonomyReview: review, conflicts: nextConflicts, foundCount }: ApplyPayload) => {
      const normalized = { ...fields };
      // buildDiff stores polymer type as polymerTypes (array); SearchableSelect binds to polymerType (string)
      if (Array.isArray(normalized.polymerTypes) && (normalized.polymerTypes as unknown[]).length > 0) {
        normalized.polymerType = (normalized.polymerTypes as unknown[])[0];
      }
      const extractedKeys = new Set(extractedFieldKeys.map(key => key === "polymerTypes" ? "polymerType" : key));
      const conflictKeys = new Set(nextConflicts.map(conflict => conflict.fieldKey));
      const previousFilled = aiFilledFieldsRef.current;
      const nextFilled: AiFilledFields = { ...filled };
      Object.entries(previousFilled).forEach(([key, metadata]) => {
        if (extractedKeys.has(key) && !conflictKeys.has(key) && !nextFilled[key]) nextFilled[key] = metadata;
      });

      setData(prev => {
        const next = { ...prev } as ProductFormData;
        Object.keys(previousFilled).forEach(key => {
          if (extractedKeys.has(key) || conflictKeys.has(key)) return;
          const current = (next as unknown as Record<string, unknown>)[key];
          const empty = Array.isArray(current) ? [] : typeof current === "boolean" ? false : "";
          (next as unknown as Record<string, unknown>)[key] = empty;
        });
        return { ...next, ...normalized };
      });
      aiFilledFieldsRef.current = nextFilled;
      setAiFilledFields(nextFilled);
      setAiFillCount(Object.keys(nextFilled).length);
      setAiSessionId(sessionId);
      setTaxonomyReview(review ?? []);
      setConflicts(nextConflicts);
      setLatestFoundCount(foundCount);
      setApplyGen(g => g + 1);
    },
    [],
  );

  const focusAfterCatalogueMinimise = useCallback(() => {
    const requiredTargets: Array<{ missing: boolean; id: string }> = [
      { missing: !data.productName?.trim(), id: "productName" },
      { missing: !data.chemicalName?.trim(), id: "chemicalName" },
      { missing: !data.chemicalFamily, id: "chemicalFamily-field" },
      { missing: !data.polymerType, id: "polymerType-field" },
      { missing: !data.physicalForm, id: "physicalForm-field" },
      { missing: !Array.isArray(data.industry) || data.industry.length === 0, id: "industry-field" },
      { missing: !Array.isArray(data.productImages) || data.productImages.length === 0, id: "productImages-field" },
      { missing: !data.minimum_order_quantity, id: "minimum_order_quantity" },
      { missing: !data.stock, id: "stock" },
      { missing: !data.uom, id: "uom-field" },
      { missing: !data.price, id: "price" },
      { missing: !Array.isArray(data.incoterms) || data.incoterms.length === 0, id: "incoterms-field" },
    ];
    const target = requiredTargets.find(item => item.missing);
    const container = target ? document.getElementById(target.id) : document.getElementById("catalog-source-bar");
    const focusable = container?.matches("input,button,select,textarea,[tabindex='0']")
      ? container as HTMLElement
      : container?.querySelector<HTMLElement>("input:not([type='hidden']),button,select,textarea,[tabindex='0']");
    const fallback = document.querySelector<HTMLElement>('[aria-label^="Upload a catalog file"]');
    const destination = focusable ?? fallback;
    destination?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    destination?.focus();
  }, [data]);

  const aiProcessing = useAiProcessing({
    isEditMode,
    existingData: data as Record<string, unknown>,
    suppressResultToasts: true,
    onStatusMessage: setAriaLiveMsg,
    onMinimiseFocus: focusAfterCatalogueMinimise,
    onApply: handleAiApply,
  });

  const clearAiField = useCallback(
    (field: string) => setAiFilledFields(prev => {
      const next = { ...prev };
      delete next[field];
      aiFilledFieldsRef.current = next;
      return next;
    }),
    [],
  );

  const handleAiClear = useCallback(() => {
    aiFilledFieldsRef.current = {};
    setAiFilledFields({});
    setAiFillCount(0);
    setAiSessionId(null);
    setTaxonomyReview([]);
    setConflicts([]);
    setLatestFoundCount(0);
    aiProcessing.clearAiData();
    toast.info("Catalogue import cleared. Values you kept remain in the form.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiProcessing.clearAiData]);

  const onFieldChange = useCallback((
    key: keyof ProductFormData,
    value: string | number | boolean | string[] | UploadedFile[] | Record<string, unknown> | undefined,
  ) => setData(prev => ({ ...prev, [key]: value })), []);

  // §14.3 "dismissed" state — a stronger action than edit-clears-badge: clears
  // both the AI flag AND resets the field to its empty-equivalent, so no
  // stale extracted value is left with no visible indication of where it came from.
  const dismissAiField = useCallback((key: string) => {
    clearAiField(key);
    setData(prev => {
      const current = (prev as Record<string, unknown>)[key];
      const empty: string | boolean | string[] = Array.isArray(current) ? [] : typeof current === "boolean" ? false : "";
      return { ...prev, [key]: empty };
    });
  }, [clearAiField]);

  const onFieldError = (key: keyof ProductFormData) =>
    setError(prev => ({ ...prev, [key]: "" }));

  const resetForm = () => {
    aiFilledFieldsRef.current = {};
    setData(initialFormData);
    setError({});
    setConflicts([]);
    aiProcessing.clearConflictSuppressions();
  };

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
    const el = document.getElementById(domId);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    el.focus();
  }, []);

  // fdaCertificate/medicalCertificate/grade live inside a collapsed
  // SectionCard nested inside the collapsed Advanced panel — both levels must
  // open and paint before we call scrollIntoView/focus (§13.9 — never focus a
  // still display:none element). "Pick from list" (§14.2b) reuses this same
  // path for grade's manual-tier taxonomy row.
  const PENDING_FIELD_SECTION: Record<string, SectionId> = {
    fdaCertificate: "compliance", medicalCertificate: "compliance", grade: "technical",
  };

  useEffect(() => {
    if (!pendingFocusRef.current) return;
    const key = pendingFocusRef.current;
    const sec = PENDING_FIELD_SECTION[key];
    if (!advancedOpen || (sec && !sectionOpen[sec])) return;
    pendingFocusRef.current = null;
    requestAnimationFrame(() => focusField(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedOpen, sectionOpen.compliance, sectionOpen.technical]);

  const revealAndFocusField = useCallback((fieldKey: string) => {
    const sec = PENDING_FIELD_SECTION[fieldKey];
    if (sec) {
      pendingFocusRef.current = fieldKey;
      setAdvancedOpen(true);
      setSectionOpen(prev => ({ ...prev, [sec]: true }));
    } else {
      focusField(fieldKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusField]);

  // ── §14.2 "Needs Your Attention" — confirm/manual taxonomy tier resolution ──
  const resolveTaxonomy = useCallback((item: TaxonomyReviewItem, action: "use" | "reject") => {
    if (action === "use" && item.suggestedId) {
      if (item.isArray) {
        setData(prev => {
          const current = (prev[item.formKey] as string[]) || [];
          return current.includes(item.suggestedId!) ? prev : { ...prev, [item.formKey]: [...current, item.suggestedId!] };
        });
      } else {
        onFieldChange(item.formKey as keyof ProductFormData, item.suggestedId);
      }
    } else if (action === "reject" && !item.isArray) {
      onFieldChange(item.formKey as keyof ProductFormData, "");
    }
    // Array "reject" — nothing to clear, the item was never added (§14.2a).
    setTaxonomyReview(prev => prev.filter(t => t.key !== item.key));
  }, [onFieldChange]);

  const pickFromList = useCallback((item: TaxonomyReviewItem) => {
    revealAndFocusField(item.formKey);
  }, [revealAndFocusField]);

  const visibleTaxonomyReview = getVisibleTaxonomyReview(taxonomyReview, data);

  const resolveConflict = useCallback((conflict: ConflictItem, action: "keep" | "use") => {
    if (action === "keep") {
      aiProcessing.suppressConflict(conflict.fieldKey, conflict.catalogueValue);
      setAriaLiveMsg(`Kept current value for ${conflict.label}.`);
    } else {
      onFieldChange(conflict.fieldKey as keyof ProductFormData, conflict.catalogueValue);
      if (!aiFilledFields[conflict.fieldKey]) setAiFillCount(count => count + 1);
      setAiFilledFields(prev => ({
        ...prev,
        [conflict.fieldKey]: {
          confidence: conflict.confidence,
          ...(conflict.conditions ? { conditions: conflict.conditions } : {}),
        },
      }));
      aiFilledFieldsRef.current = {
        ...aiFilledFieldsRef.current,
        [conflict.fieldKey]: {
          confidence: conflict.confidence,
          ...(conflict.conditions ? { conditions: conflict.conditions } : {}),
        },
      };
      setAriaLiveMsg(`Using catalogue value for ${conflict.label}.`);
    }
    setConflicts(prev => prev.filter(item => item.id !== conflict.id));
  }, [aiFilledFields, aiProcessing, onFieldChange]);

  // ── §14.9 Accessibility — status announcement + focus-to-first-decision on
  // extraction complete. Keyed on applyGen (bumped once per successful apply:
  // initial import, Replace, or "Add another"), not aiFillCount, so per-card
  // edits/dismissals never re-announce and same-session re-picks still do.
  const focusDomId = useCallback((domId: string) => {
    const el = document.getElementById(domId);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    el.focus();
  }, []);

  useEffect(() => {
    if (applyGen === 0) return;
    const attentionCount = conflicts.length + visibleTaxonomyReview.length;
    const msg = `Catalogue processed. ${latestFoundCount} field${latestFoundCount === 1 ? "" : "s"} found. ${attentionCount} need review.`;
    setAriaLiveMsg(msg);
    requestAnimationFrame(() => {
      if (attentionCount > 0) focusDomId(needsAttentionHeadingId);
      else focusDomId(aiFillCount > 0 ? foundHeadingId : requiredHeadingId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyGen]);

  useEffect(() => {
    if (validationAttempt > 0) requestAnimationFrame(() => focusDomId(validationSummaryId));
  }, [focusDomId, validationAttempt, validationSummaryId]);

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
    ["minimum_order_quantity","stock","density","mfi","tensileStrength","elongationAtBreak","shoreHardness","waterAbsorption","flexuralModulus"].forEach(f => {
      if (fmt[f] && typeof fmt[f] === "string") { const n = Number(fmt[f]); if (!isNaN(n)) fmt[f] = n; }
    });
    if (fmt.packagingWeight && typeof fmt.packagingWeight === "number") fmt.packagingWeight = String(fmt.packagingWeight);
    ["industry","grade","incoterms","packagingType","product_family"].forEach(f => {
      if (fmt[f] && !Array.isArray(fmt[f])) fmt[f] = [fmt[f]];
      else if (!fmt[f]) fmt[f] = [];
    });
    // §14.7 / §21.9 point 2 — flexuralModulus WAS unconditionally deleted here
    // even though the backend schema already persists it (models/product.js);
    // the only bug was this frontend sanitizer. Kept off this delete-list now
    // that the card (§14.4) can promise the value actually saves.
    ["melting_point","glass_transition_temperature","heat_deflection_temperature","moisture_content","ash_content","dielectric_strength","volume_resistivity","grades"].forEach(f => delete fmt[f]);
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
      setValidationAttempt(attempt => attempt + 1);
      toast.error(`Fix ${Object.keys(errs).length} required field${Object.keys(errs).length > 1 ? "s" : ""} before submitting`);
      return;
    }
    setSaving(true);
    setAriaLiveMsg(isEditMode ? "Saving product." : "Creating product.");
    const toastId = toast.loading(isEditMode ? "Updating product…" : "Creating product…");
    try {
      const payload = formatDataForAPI(data);
      if (aiSessionId) { payload.aiSessionId = aiSessionId; payload.createdVia = "ai"; }
      const res = isEditMode
        ? await updateProduct(id as string, payload)
        : await createProduct(payload);
      if (res?.success) {
        setAriaLiveMsg(isEditMode ? "Product saved successfully." : "Product created successfully.");
        toast.success(isEditMode ? "Product updated!" : "Product created!", { id: toastId });
        aiProcessing.onFormSubmit();
        aiProcessing.clearConflictSuppressions();
        setConflicts([]);
        if (!isEditMode) {
          setData(initialFormData);
          sessionStorage.removeItem(QUICK_ADD_DRAFT_KEY);
        }
        setTimeout(() => router.push("/user/products"), 800);
      } else {
        setAriaLiveMsg(isEditMode ? "Product could not be saved." : "Product could not be created.");
        toast.error(isEditMode ? "Error updating product" : "Error creating product", { id: toastId });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        ?? (err as { message?: string })?.message ?? "Something went wrong";
      toast.error(msg, { id: toastId });
      setAriaLiveMsg(`Save failed. ${msg}`);
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
  const validationErrors = Object.entries(error).filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-gray-50">

      {/* aria-live region (§14.9) — shared status announcement for extraction
          complete; per-card edits/dismissals deliberately do not re-announce. */}
      <div id={statusId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">{ariaLiveMsg}</div>

      {/* ── Sticky top bar ──
          M-0 backlog 8: this bar and the footer bar both carry a Create
          Product action; that's only non-redundant if this bar is genuinely
          sticky (it renders `backdrop-blur-md` as if it already were, but was
          missing the positioning classes) — the top action is now always
          reachable while scrolling a long form, the footer one is the natural
          end-of-form action, matching how DESIGN_SPEC §13.0/§14.8 already
          describe this bar. */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="flex min-h-14 w-full flex-wrap items-center justify-between gap-2 px-4 py-2 sm:flex-nowrap sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/user/products")}
              className="min-h-[44px] rounded text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> Back to Products
            </button>
            {onBackToQuickAdd && (
              <button
                onClick={handleBackToQuickAdd}
                className="min-h-[44px] rounded text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <span aria-hidden="true" className="inline-block rtl:-scale-x-100">←</span> Back to Quick Add
              </button>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
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

      <div className="w-full min-w-0 py-6">
        <div className="flex flex-col xl:flex-row gap-6 items-start">

          {/* ── LEFT: Main form area ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Reduced hero (§13.1) — Completion Progress widget removed, now
                solely owned by the sidebar tracker below. */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 px-6 py-4 sm:px-8 sm:py-5 shadow-xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 end-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48 rtl:-translate-x-48" />
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white rounded-full translate-y-32" />
              </div>
              <div className="absolute end-6 top-0 bottom-0 w-40 sm:w-52 flex items-center opacity-20 pointer-events-none">
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
              uploadedFileName={aiProcessing.uploadedFileName}
              onOpenModal={aiProcessing.openModal}
              onHandleFile={aiProcessing.handleFile}
              onReopenCatalogPicker={aiProcessing.reopenCatalogPicker}
              onRemove={handleAiClear}
            />

            {validationErrors.length > 0 && (
              <section
                id={validationSummaryId}
                role="alert"
                tabIndex={-1}
                aria-labelledby={validationHeadingId}
                className="scroll-mt-24 rounded-xl border border-red-200 bg-red-50 p-4 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
              >
                <h2 id={validationHeadingId} className="text-sm font-semibold text-red-900">
                  Fix {validationErrors.length} field{validationErrors.length === 1 ? "" : "s"} before saving
                </h2>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {validationErrors.map(([key, message]) => (
                    <li key={key} className="text-sm text-red-800">
                      <button
                        type="button"
                        onClick={() => revealAndFocusField(key)}
                        className="min-h-[44px] text-start underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                      >
                        {message}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* "Found in Your Catalogue" review surface (§14) — only renders
                once an extraction has applied at least one field; absent
                otherwise, matching §13 exactly with zero extra chrome. */}
            {(aiFillCount > 0 || conflicts.length > 0 || taxonomyReview.length > 0) && (
              <CatalogFindings
                data={data}
                onFieldChange={(f, v) => onFieldChange(f, v as string | number | boolean | UploadedFile[] | undefined)}
                aiFilledFields={aiFilledFields}
                clearAiField={clearAiField}
                dismissAiField={dismissAiField}
                taxonomyReview={taxonomyReview}
                conflicts={conflicts}
                onResolveConflict={resolveConflict}
                onResolveTaxonomy={resolveTaxonomy}
                onPickFromList={pickFromList}
                grades={grades}
                completedRequired={completedRequired}
                totalRequired={totalRequired}
                needsAttentionHeadingId={needsAttentionHeadingId}
                foundHeadingId={foundHeadingId}
                requiredHeadingId={requiredHeadingId}
                completionTrackerId={completionTrackerId}
                onFocusCompletion={() => focusDomId(completionTrackerId)}
              />
            )}

            <AiCatalogModal
              open={aiProcessing.modalOpen}
              onOpenChange={aiProcessing.handleModalOpenChange}
              phase={aiProcessing.modalPhase}
              processingStage={aiProcessing.processingStage}
              uploadedFile={aiProcessing.uploadedFile}
              elapsedSeconds={aiProcessing.elapsedSeconds}
              accepted={aiProcessing.accepted}
              delayed={aiProcessing.delayed}
              readyDiff={aiProcessing.readyDiff}
              errorMsg={aiProcessing.modalErrorMsg}
              pickItems={aiProcessing.pickItems}
              usedIndices={aiProcessing.catalogMemory?.usedIndices}
              onFile={aiProcessing.handleFile}
              onMinimise={aiProcessing.minimise}
              onStop={aiProcessing.cancelBg}
              onApplyDiff={aiProcessing.applyDiff}
              onPick={aiProcessing.pickProduct}
              onClearAll={aiFillCount > 0 || conflicts.length > 0 ? handleAiClear : undefined}
            />

            <AiProcessingWidget
              bgState={aiProcessing.bgState}
              bgFailReason={aiProcessing.bgFailReason}
              fieldCount={aiProcessing.fieldCount}
              pickCount={aiProcessing.pickItems?.length ?? 0}
              stage={aiProcessing.processingStage}
              file={aiProcessing.uploadedFile}
              elapsedSeconds={aiProcessing.elapsedSeconds}
              delayed={aiProcessing.delayed}
              onStop={aiProcessing.cancelBg}
              onViewProgress={aiProcessing.viewProgress}
              onReplaceFile={aiProcessing.handleFile}
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
                    <p id={requiredHeadingId} tabIndex={-1} className="scroll-mt-24 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2">Required Information</p>
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
                <div className="text-start">
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
                            clearAiField={clearAiField}
                          />
                        )}
                        {sec.id === "compliance" && (
                          <>
                            <Environmental data={data} onFieldChange={onFieldChange} clearAiField={clearAiField} />
                            <Certification data={data} onFieldChange={onFieldChange} clearAiField={clearAiField} />
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
              {/* M-0 backlog 7 — there is no autosave anywhere in this form;
                  this used to falsely claim there was. */}
              <p className="text-xs text-gray-400 hidden sm:block">
                Not saved yet — click &ldquo;{isEditMode ? "Save Changes" : "Create Product"}&rdquo; to save your progress
              </p>
              <Button onClick={handleSubmit} disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </div>

          {/* ── RIGHT: Sticky sidebar ── */}
          <div className="flex w-full shrink-0 flex-col gap-4 xl:sticky xl:top-20 xl:w-[320px] xl:max-h-[calc(100dvh-6rem)] xl:overflow-y-auto">

            {/* Completion tracker (§13.5) — required-vs-optional model, sole
                source of truth for completion on this page. `id` is the
                destination for the Needs Your Attention checklist action. */}
            <div
              id={completionTrackerId}
              tabIndex={-1}
              aria-labelledby={completionHeadingId}
              className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              <h3 id={completionHeadingId} className="mb-4 text-sm font-semibold text-gray-900">Product Completion</h3>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">Required fields</span>
                <span className="text-xs font-bold text-emerald-600">{completedRequired} of {totalRequired} complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-[width] duration-200 motion-reduce:transition-none"
                  style={{ width: `${totalRequired ? (completedRequired / totalRequired) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">Optional fields</span>
                <span className="text-xs font-bold text-gray-500">{completedOptional} of {totalOptional} complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gray-400 transition-[width] duration-200 motion-reduce:transition-none"
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
                    className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${f.done ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                        {f.done && <CheckCircle2 aria-hidden="true" className="w-3 h-3 text-white" />}
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
                <Eye aria-hidden="true" className="w-4 h-4 text-gray-400" />
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
                  <span className="absolute top-2 end-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">Draft</span>
                </div>

                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    <bdi>{data.productName || "Product Name"}</bdi>
                  </p>
                  <p className="text-xs text-gray-400 truncate mb-2">
                    <bdi>{data.chemicalName || "Chemical Name"}</bdi>
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
        <div className="fixed z-50 [inset-block-end:max(1.25rem,env(safe-area-inset-bottom))] [inset-inline-end:max(1.25rem,env(safe-area-inset-right))]">
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
