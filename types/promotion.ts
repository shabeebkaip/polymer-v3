// Promotion types based on API response structure

export interface Promotion {
  id: string;
  productId?: string;
  productName?: string;
  offerPrice: number;
  status: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  statusIcon: string;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  count: number;
  limit: number;
}

export interface Filters {
  status: string;
}

export interface Summary {
  total: number;
  active: number;
  pending: number;
  rejected: number;
}

export interface Meta {
  pagination: Pagination;
  filters: Filters;
  summary: Summary;
}

export interface PromotionResponse {
  success: boolean;
  message: string;
  data: Promotion[];
  meta: Meta;
}

// Store types
export interface PromotionFilters {
  status: string;
  search: string;
}

export interface PromotionState {
  promotions: Promotion[];
  meta: Meta | null;
  loading: boolean;
  error: string | null;
  filters: PromotionFilters;
  currentPage: number;
  itemsPerPage: number;
}

export interface PromotionActions {
  fetchPromotions: () => Promise<void>;
  setFilters: (filters: Partial<PromotionFilters>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  clearFilters: () => void;
  getFilteredPromotions: () => Promotion[];
  getPaginatedPromotions: () => Promotion[];
  getTotalPages: () => number;
}

// Promotion Detail Types (based on API response structure)
export interface PromotionProduct {
  id: string;
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  price?: number;
  uom?: string;
  stock?: number;
  countryOfOrigin?: string;
  color?: string;
  manufacturingMethod?: string;
  specifications?: {
    density?: number;
    mfi?: number;
    tensileStrength?: number;
    elongationAtBreak?: number;
    shoreHardness?: number;
    waterAbsorption?: number;
  };
  creator?: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
  productImages?: Array<{
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    _id: string;
  }>;
}

export interface PromotionSeller {
  id: string;
  name: string;
  email: string;
  phone?: number;
  company: string;
  location?: string;
  address?: {
    full: string;
  };
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
}

export interface PromotionDetail {
  _id: string;
  product: PromotionProduct;
  seller: PromotionSeller;
  offerPrice: number;
  status: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  validUntil?: string;
  minimumQuantity?: string;
  dealType?: string;
  statusIcon?: string;
  isExpired?: boolean;
  statusTracking?: {
    adminStatus: string;
    lastUpdate: string;
    totalRequests: number;
    requestBreakdown: {
      pending: number;
      accepted: number;
      rejected: number;
      completed: number;
    };
  };
  quoteRequests?: any[];
  summary?: {
    totalQuoteRequests: number;
    dealStatus: string;
    isActive: boolean;
    recentRequests: any[];
  };
}

export interface PromotionDetailResponse {
  success: boolean;
  message: string;
  data: PromotionDetail;
}

// Updated Store types with detail functionality
export interface PromotionDetailState {
  promotionDetail: PromotionDetail | null;
  detailLoading: boolean;
  detailError: string | null;
}

export interface PromotionDetailActions {
  fetchPromotionDetail: (id: string) => Promise<void>;
  clearPromotionDetail: () => void;
  setDetailLoading: (loading: boolean) => void;
  setDetailError: (error: string | null) => void;
}

export type PromotionStore = PromotionState & PromotionActions & PromotionDetailState & PromotionDetailActions;
