// Quote Request Types for the unified schema

export interface QuoteRequestBase {
  requestType: "product_quote" | "deal_quote";
  message?: string;
  request_document?: string;
  open_request?: boolean;
  // Unified status system
  status?: "pending" | "responded" | "negotiation" | "accepted" | "in_progress" | "shipped" | "delivered" | "completed" | "rejected" | "cancelled";
  adminNote?: string;
  sourceSection?: "product_detail" | "special_offers" | "search_results";
}

export interface ProductQuoteRequest extends QuoteRequestBase {
  requestType: "product_quote";
  product: string; // Product ID
  quantity: number;
  uom: string;
  country: string;
  destination: string;
  delivery_date: Date;
  // Optional fields for product quotes
  grade?: string;
  incoterm?: string;
  packagingType?: string;
  packaging_size: string;
  expected_annual_volume?: number;
  application?: string;
  price?: string;
  lead_time?: string;
  terms?: string;
}

export interface DealQuoteRequest extends QuoteRequestBase {
  requestType: "deal_quote";
  bestDealId: string; // Deal/Promotion ID
  desiredQuantity: number;
  shippingCountry: string;
  paymentTerms: string;
  deliveryDeadline: Date;
}

export type QuoteRequest = ProductQuoteRequest | DealQuoteRequest;

export interface QuoteRequestResponse {
  _id: string;
  requestType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Add other response fields as needed
}
