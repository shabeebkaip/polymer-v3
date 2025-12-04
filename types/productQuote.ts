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

// Product Quote Request Detail Types
export interface Buyer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface ProductDetail {
  _id: string;
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  productImages?: ProductImage[];
  countryOfOrigin?: string;
  color?: string;
  density?: string;
  mfi?: string;
}

export interface QuotationDocument {
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface SellerResponseDetail {
  message?: string;
  quotedPrice?: number;
  quotedQuantity?: number;
  estimatedDelivery?: string;
  leadTime?: string;
  terms?: string;
  quotationDocument?: QuotationDocument;
  respondedAt?: string;
}

export interface ProductQuoteRequestDetail {
  _id: string;
  buyerId: Buyer;
  sellerId: Seller;
  productId: ProductDetail;
  desiredQuantity: number;
  uom?: string;
  shippingCountry?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  paymentTerms?: string;
  deliveryDeadline?: string;
  additionalRequirements?: string;
  application?: string;
  gradeId?: Grade;
  incotermId?: Incoterm;
  packagingTypeId?: PackagingType;
  sellerResponse?: SellerResponseDetail;
  status: StatusHistoryItem[];
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuoteRequestDetailApiResponse {
  success: boolean;
  data: ProductQuoteRequestDetail;
}

// Comment Types
export interface CommentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

export interface Comment {
  _id: string;
  quoteRequestId: string;
  userId: CommentUser;
  comment: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsApiResponse {
  success: boolean;
  data: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCommentRequest {
  quoteRequestId: string;
  comment: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export interface UpdateCommentRequest {
  comment: string;
}

export interface UpdateCommentResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    comment: string;
    updatedAt: string;
  };
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}
