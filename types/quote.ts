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
  sellerId: string; // Required: Seller/Supplier ID
  desiredQuantity: number;
  shippingCountry: string;
  paymentTerms: string;
  deliveryDeadline: Date | string; // Can be Date object or YYYY-MM-DD string
}

export type QuoteRequest = ProductQuoteRequest | DealQuoteRequest;

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  count: number;
  limit: number;
}

export interface QuoteEnquiriesState {
  enquiries: QuoteEnquiry[];
  meta: {
    pagination: PaginationMeta;
    filters: { search: string; status: string };
  } | null;
  enquiryDetail: QuoteEnquiry | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  setEnquiries: (enquiries: QuoteEnquiry[], meta: any) => void;
  clearEnquiries: () => void;
  setEnquiryDetail: (enquiry: QuoteEnquiry) => void;
  clearEnquiryDetail: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUpdating: (updating: boolean) => void;
}

export interface QuoteRequestResponse {
  _id: string;
  requestType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Add other response fields as needed
}

// Quote Enquiry Types
export interface QuoteEnquiryProduct {
  productName?: string;
  sku?: string;
  description?: string;
  chemicalName?: string;
  tradeName?: string;
  countryOfOrigin?: string;
  color?: string;
  productImages?: Array<{ fileUrl: string; [key: string]: unknown }>;
  density?: string;
  mfi?: string | number;
  createdBy?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: string;
    [key: string]: unknown;
  };
}

export interface QuoteEnquiryUser {
  email?: string;
  name?: string;
  company?: string;
  phone?: string;
  address?: string;
}

export interface QuoteEnquiryGrade {
  name?: string;
}

export interface QuoteEnquiryUnified {
  title?: string;
  quantity?: number;
}

export interface QuoteEnquiryBuyer {
  email?: string;
  name?: string;
}

export interface QuoteEnquiry {
  _id?: string;
  id?: string;
  user?: QuoteEnquiryUser;
  buyer?: QuoteEnquiryBuyer;
  product?: QuoteEnquiryProduct;
  unified?: QuoteEnquiryUnified;
  quantity?: number;
  uom?: string;
  incoterm?: string | { name?: string };
  grade?: QuoteEnquiryGrade;
  packaging?: string;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  destination?: string;
  city?: string;
  country?: string;
  postCode?: string;
  application?: string;
  open_request?: boolean;
  orderDetails?: {
    quantity: number;
    uom: string;
    incoterm: string | { name?: string };
    deliveryDate?: string;
    pricing?: string | number;
    packagingType?: { name?: string };
    packagingSize?: string;
    expectedAnnualVolume?: number;
  };
}

export interface StatusOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

// Quote Request List Types
export const ALLOWED_STATUSES = [
  "pending", "responded", "negotiation", "accepted", "in_progress", 
  "shipped", "delivered", "completed", "rejected", "cancelled"
] as const;

export type QuoteStatus = typeof ALLOWED_STATUSES[number];
export type QuoteRequestType = "product_quote" | "deal_quote" | "all";

export interface QuoteRequestList {
  _id: string;
  requestType: QuoteRequestType;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  statusMessage: unknown[];
  productName: string;
  productId: string;
  company: string;
  companyId: string | null;
  quantity: number;
  unit: string;
  destination: string;
  deliveryDate: string;
  grade: string;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    company: string;
    email: string;
  };
  unified: {
    statusIcon: string;
    priorityLevel: string;
    quantity: number;
    deliveryDate: string;
    location: string;
    productInfo: string;
    type: QuoteRequestType;
    title: string;
  };
  quoteType: string;
  productQuote?: {
    product: {
      _id: string;
      productName: string;
      createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        company: string;
        email: string;
      };
    };
    packaging_size: string;
    incoterm: {
      _id: string;
      name: string;
    };
  };
  dealQuote?: {
    bestDeal: {
      _id: string;
      productId: {
        _id: string;
        productName: string;
      };
      offerPrice: number;
      status: string;
    };
    paymentTerms: string;
    offerPrice: number;
  };
}

export interface QuoteRequestDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Deal Quote Requests by Deal ID (Supplier endpoint)
export interface DealQuoteRequestBuyer {
  _id: string;
  name: string;
  email: string;
  phone: string | number; // Can be string or number
  company: string;
  location?: string; // Optional for list endpoint
  address?: string; // Used in detail endpoint
}

export interface DealQuoteRequestProduct {
  _id: string;
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  productImages?: Array<{
    _id: string;
    id: string;
    name: string;
    type: string;
    fileUrl: string;
  }>;
  countryOfOrigin?: string;
  color?: string;
  density?: number;
  mfi?: number;
}

export interface DealQuoteRequestDeal {
  _id: string;
  title?: string; // Optional - not always in response
  description?: string; // Optional - not always in response
  dealPrice?: number; // Optional - not always in response
  productName?: string; // For list endpoint
  productImage?: string | null; // For list endpoint
  product?: DealQuoteRequestProduct; // For detail endpoint
}

export interface DealQuoteRequestOrderDetails {
  quantity: number;
  shippingCountry: string;
  paymentTerms: string | null;
  deliveryDeadline: string | null;
}

export interface QuotationDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  viewUrl: string;
  uploadedAt: string;
}

export interface DealQuoteRequestSellerResponse {
  message?: string;
  quotedPrice?: number;
  quotedQuantity?: number;
  estimatedDelivery?: string;
  respondedAt?: string;
  quotationDocument?: QuotationDocument | Record<string, never>; // Can be empty object {}
}

export interface DealQuoteRequestSeller {
  _id: string;
  name: string;
  email: string;
  phone: string | number;
  company: string;
}

export interface DealQuoteRequestStatusHistory {
  _id: string;
  status: string;
  message: string;
  date: string;
  updatedBy: string;
  id: string;
}

export interface DealQuoteRequestByDealId {
  _id: string;
  status: "pending" | "responded" | "accepted" | "rejected" | "cancelled";
  message?: string;
  createdAt: string;
  updatedAt: string;
  buyer: DealQuoteRequestBuyer;
  seller?: DealQuoteRequestSeller; // For detail endpoint
  sellerId?: string; // For list endpoint
  deal: DealQuoteRequestDeal;
  orderDetails: DealQuoteRequestOrderDetails;
  sellerResponse: DealQuoteRequestSellerResponse | null;
  statusHistory?: DealQuoteRequestStatusHistory[]; // For detail endpoint
}

export interface DealQuoteRequestsByDealIdResponse {
  success: boolean;
  message: string;
  data: DealQuoteRequestByDealId[];
  meta: {
    total: number;
    dealId: string;
  };
}
