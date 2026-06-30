// Mirrors the Zod schema in polymer-nodejs/services/ai/ai.service.js

export type ConfidenceLevel = "high" | "medium" | "low" | "unknown";

export interface ExtractedProduct {
  productName?: string | null;
  tradeName?: string | null;
  chemicalName?: string | null;
  description?: string | null;
  manufacturingMethod?: string | null;
  countryOfOrigin?: string | null;
  color?: string | null;
  additives?: string | null;
  polymerType?: string | null;
  chemicalFamily?: string | null;
  physicalForm?: string | null;
  industry?: string[] | null;
  grade?: string[] | null;
  density?: number | null;
  mfi?: number | null;
  tensileStrength?: number | null;
  elongationAtBreak?: number | null;
  flexuralModulus?: number | null;
  shoreHardness?: number | null;
  waterAbsorption?: number | null;
  availability?: "In Stock" | "On Request" | "Limited" | null;
  minimum_order_quantity?: number | null;
  stock?: number | null;
  uom?: string | null;
  price?: number | null;
  priceTerms?: "fixed" | "negotiable" | null;
  leadTime?: string | null;
  packagingWeight?: string | null;
  storageConditions?: string | null;
  shelfLife?: string | null;
  recyclable?: boolean | null;
  bioDegradable?: boolean | null;
  fdaApproved?: boolean | null;
  medicalGrade?: boolean | null;
  materialType?: "Virgin" | "Recycled" | null;
  form?: "Pellets" | "Powder" | "Flakes" | "Regrind" | null;
  supplierType?: "Manufacturer" | "Distributor" | "Trader" | null;
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

export interface AiParseResponse {
  success: boolean;
  sessionId: string | null;
  sourceFile: string;
  format: string;
  model: string;
  products: ParsedProductEntry[];
  rejectionReason?: string | null;
}
