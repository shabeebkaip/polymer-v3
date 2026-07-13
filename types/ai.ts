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

export type AiFilledFields = Record<string, { confidence: string }>;

export interface ApplyPayload {
  fields: Record<string, unknown>;
  aiFilledFields: AiFilledFields;
  sessionId: string;
}

export interface DiffRow {
  key: string;
  label: string;
  displayValue: string;
  confidence: ConfidenceLevel;
  skipped?: boolean;
}

export interface ReadyDiff {
  payload: ApplyPayload;
  rows: DiffRow[];
  extractionMethod: "text" | "vision";
}

export type AiModalPhase = "idle" | "parsing" | "pick" | "diff" | "rejected" | "ocrFailed" | "error";
export type BgState = "idle" | "processing" | "ready" | "failed";
export type BgFailReason = "ocrFailed" | "timeout" | "error";

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
}
