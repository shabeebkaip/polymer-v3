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

export type PromotionStore = PromotionState & PromotionActions;
