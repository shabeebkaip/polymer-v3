// Mirrors the Zod schema in polymer-nodejs/services/ai/ai.service.js

export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

export interface ConfidentString {
  value: string | null;
  confidence: ConfidenceLevel;
}

export interface ConfidentNumber {
  value: number | null;
  confidence: ConfidenceLevel;
  upperBound?: number;
}

export interface ExtractedProduct {
  productName?: ConfidentString | null;
  tradeName?: ConfidentString | null;
  chemicalName?: ConfidentString | null;
  description?: ConfidentString | null;
  manufacturingMethod?: ConfidentString | null;
  countryOfOrigin?: ConfidentString | null;
  color?: ConfidentString | null;
  additives?: ConfidentString | null;
  polymerType?: ConfidentString | null;
  chemicalFamily?: ConfidentString | null;
  physicalForm?: ConfidentString | null;
  industry?: string[] | null;
  grade?: string[] | null;
  density?: ConfidentNumber | null;
  mfi?: ConfidentNumber | null;
  tensileStrength?: ConfidentNumber | null;
  elongationAtBreak?: ConfidentNumber | null;
  flexuralModulus?: ConfidentNumber | null;
  shoreHardness?: ConfidentNumber | null;
  waterAbsorption?: ConfidentNumber | null;
  availability?: { value: "In Stock" | "On Request" | "Limited" | null; confidence: ConfidenceLevel } | null;
  minimum_order_quantity?: ConfidentNumber | null;
  stock?: ConfidentNumber | null;
  uom?: ConfidentString | null;
  price?: ConfidentNumber | null;
  priceTerms?: { value: "fixed" | "negotiable" | null; confidence: ConfidenceLevel } | null;
  leadTime?: ConfidentString | null;
  packagingWeight?: ConfidentString | null;
  storageConditions?: ConfidentString | null;
  shelfLife?: ConfidentString | null;
  // §14.3 "mfi (190°C/2.16kg)" trailing parenthetical — test-condition text with
  // no existing display anywhere else in the form (§21.9 point 1).
  mfi_conditions?: ConfidentString | null;
  recyclable?: boolean | null;
  bioDegradable?: boolean | null;
  fdaApproved?: boolean | null;
  medicalGrade?: boolean | null;
  materialType?: { value: "Virgin" | "Recycled" | null; confidence: ConfidenceLevel } | null;
  form?: { value: "Pellets" | "Powder" | "Flakes" | "Regrind" | null; confidence: ConfidenceLevel } | null;
  supplierType?: { value: "Manufacturer" | "Distributor" | "Trader" | null; confidence: ConfidenceLevel } | null;
}

export interface RefMatch {
  query: string;
  tier: "auto" | "confirm" | "manual";
  score?: number;
  match: { _id: string; name: string; slug?: string } | null;
}

export interface RefMatches {
  polymerType?: RefMatch | null;
  chemicalFamily?: RefMatch | null;
  physicalForm?: RefMatch | null;
  industry?: (RefMatch | null)[];
  grade?: (RefMatch | null)[];
}

export interface ParsedProductEntry {
  product: ExtractedProduct;
  refMatches: RefMatches;
}

// ── Shared cross-component types ─────────────────────────────────────────────

// §21.9 point 1 — `conditions` carries mfi_conditions (the only field with no
// existing display elsewhere); every other numeric field's unit is rendered
// from a static per-field label already shown in TechnicalProperties.tsx, so
// no live `unit` passthrough is needed (design correction, §14.3).
export type AiFilledFields = Record<string, { confidence: string; conditions?: string }>;

// §14.0/§21.9 point 4 — refmatch.service.js's three real match tiers on the
// five taxonomy fields, used as the "needs review" signal instead of the
// never-assigned "low" confidence.
export type TaxonomyFieldKey = "chemicalFamily" | "physicalForm" | "polymerType" | "industry" | "grade";

export interface TaxonomyReviewItem {
  key: string; // stable per-render key: formKey, or `${formKey}-${index}` for array fields
  formKey: TaxonomyFieldKey;
  isArray: boolean; // true for industry/grade (multi-select, per-item tier)
  tier: "confirm" | "manual";
  query: string; // raw catalogue text — render as plain text only, never markdown/HTML (§21.9 security note)
  suggestedId?: string;
  suggestedName?: string;
  label: string;
}

export type ConflictValue = string | number | boolean | string[];

export interface ConflictItem {
  id: string;
  fieldKey: string;
  label: string;
  catalogueValue: ConflictValue;
  displayValue: string;
  confidence: ConfidenceLevel;
  conditions?: string;
}

export interface ApplyPayload {
  fields: Record<string, unknown>;
  // Full successful-generation key snapshot. `fields` is filtered to values
  // that may be written; this list also includes equal/no-op and conflict rows
  // so a direct second-product choice can retire stale extraction-owned data.
  extractedFieldKeys: string[];
  aiFilledFields: AiFilledFields;
  sessionId: string;
  // §14.2 "Needs Your Attention" — the persistent review surface needs this
  // sibling structure; `aiFilledFields`'s own `conditions` field already
  // covers the other plumbing gap (§21.9 point 1), so no separate `rows`
  // structure is threaded through here (YAGNI — nothing in §14 reads it).
  taxonomyReview: TaxonomyReviewItem[];
  conflicts: ConflictItem[];
  foundCount: number;
}

export interface DiffRow {
  key: string;
  label: string;
  displayValue: string;
  confidence: ConfidenceLevel;
  skipped?: boolean;
  conditions?: string; // e.g. mfi's "190°C/2.16kg"
}

export interface ReadyDiff {
  payload: ApplyPayload;
  rows: DiffRow[];
  extractionMethod: "text" | "vision";
  taxonomyReview: TaxonomyReviewItem[];
}

export type AiModalPhase = "idle" | "parsing" | "pick" | "diff" | "rejected" | "ocrFailed" | "error";
export type BgState = "idle" | "processing" | "ready" | "failed";
export type BgFailReason = "upload" | "connection" | "expired" | "ocrFailed" | "timeout" | "error" | "rejected";

/** Real, server-authored processing boundaries. Never infer these from time. */
export type ProcessingStage = "uploaded" | "extracting" | "analysing" | "matching" | "preparing";

export interface CatalogFileMeta {
  name: string;
  size: number;
  type: string;
}

export interface AiParseResponse {
  success: boolean;
  sessionId: string | null;
  sourceFile: string;
  format: string;
  model: string;
  products: ParsedProductEntry[];
  rejectionReason?: string | null;
  extractionMethod: "text" | "vision";
  ocrFailed: boolean;
  stage?: ProcessingStage;
  createdAt?: string;
}
