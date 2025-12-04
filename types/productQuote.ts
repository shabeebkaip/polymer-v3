// Product Quote Request Types (Buyer Side)

export interface ProductImage {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  _id: string;
}

export interface Product {
  _id: string;
  productName?: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  countryOfOrigin?: string;
  productImages?: ProductImage[];
}

export interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: number;
}

export interface Grade {
  _id: string;
  name: string;
}

export interface Incoterm {
  _id: string;
  name: string;
}

export interface PackagingType {
  _id: string;
  name: string;
}

export interface StatusHistoryItem {
  status: string;
  message: string;
  date: string;
  updatedBy: string;
  _id: string;
  id: string;
}

export interface BuyerProductQuoteRequest {
  _id: string;
  buyerId: string;
  sellerId: Seller;
  productId: Product;
  desiredQuantity: number;
  uom?: string;
  shippingCountry?: string;
  deliveryDeadline?: string;
  gradeId?: Grade;
  incotermId?: Incoterm;
  packagingTypeId?: PackagingType;
  application?: string;
  openRequest: boolean;
  status: StatusHistoryItem[];
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface BuyerProductQuotesApiResponse {
  success: boolean;
  data: BuyerProductQuoteRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type QuoteStatus = "pending" | "responded" | "accepted" | "rejected" | "cancelled";

export interface StatusConfig {
  badge: string;
  text: string;
}

export type StatusConfigMap = Record<QuoteStatus, StatusConfig>;
