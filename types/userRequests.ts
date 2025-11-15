// User Requests Types - Sample, Quote, Finance, and Product Requests

// Common User Type
export interface User {
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
  userType: string;
}

export interface ProductImage {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
}

export interface Grade {
  _id: string;
  name: string;
  description: string;
}

export interface Product {
  _id: string;
  productName: string;
  chemicalName: string;
  description: string;
  tradeName: string;
  countryOfOrigin: string;
  color: string;
  manufacturingMethod: string;
  productImages: ProductImage[];
  density: number;
  mfi: number;
  tensileStrength: number;
  elongationAtBreak: number;
  shoreHardness: number;
  waterAbsorption: number;
  createdBy: User;
}

// Sample Request Types
export interface SampleRequestDetail {
  _id: string;
  user: User;
  product: Product;
  grade: Grade;
  quantity: number;
  uom: string;
  phone: string;
  address: string;
  country: string;
  application: string;
  expected_annual_volume: number;
  orderDate: string;
  neededBy: string;
  message: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleRequestStore {
  sampleRequestDetail: SampleRequestDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchSampleRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearSampleRequestDetail: () => void;
}

export interface SampleRequestListItem {
  _id: string;
  user: string;
  product?: {
    _id: string;
    productName: string;
    createdBy?: {
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
    };
  };
  quantity: number;
  uom?: string;
  address?: string;
  country?: string;
  grade?: {
    _id: string;
    name: string;
  };
  application?: string;
  expected_annual_volume?: number;
  orderDate?: string;
  neededBy?: string;
  message?: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
}

export interface SampleRequestsListStore {
  requests: SampleRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchSampleRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

// Quote Request Types
export interface QuoteRequestDetail {
  _id: string;
  requestType: "product_quote" | "deal_quote";
  status: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: any[];
  requester: {
    _id: string;
    name: string;
    email: string;
    phone: number;
    company: string;
    address: {
      full: string;
    };
  };
  quoteType: string;
  product?: {
    _id: string;
    productName: string;
    chemicalName: string;
    description: string;
    productImages: Array<{
      id: string;
      name: string;
      type: string;
      fileUrl: string;
      _id: string;
    }>;
    countryOfOrigin: string;
    specifications: any;
    creator: {
      _id: string;
      name: string;
      company: string;
      email: string;
    };
  };
  orderDetails?: {
    quantity?: number;
    uom?: string;
    destination?: string;
    country?: string;
    deliveryDate?: string;
    packagingSize?: string;
    desiredQuantity?: number;
    shippingCountry?: string;
    paymentTerms?: string;
    deliveryDeadline?: string;
  };
  specifications?: {
    grade?: {
      _id: string;
      name: string;
      description: string;
    };
    incoterm?: {
      _id: string;
      name: string;
    };
  };
  bestDeal?: {
    _id: string;
    offerPrice: number;
    status: string;
    adminNote: string;
    createdAt: string;
    product: {
      _id: string;
      productName: string;
      chemicalName: string;
      tradeName: string;
      productImages: Array<{
        id: string;
        name: string;
        type: string;
        fileUrl: string;
        _id: string;
      }>;
      countryOfOrigin: string;
      color: string;
      createdBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        company: string;
        email: string;
      };
    };
  };
  unified: {
    type: string;
    title?: string;
    quantity: number;
    deliveryDate: string;
    location: string;
    destination: string;
    isProductQuote: boolean;
    isDealQuote: boolean;
    statusIcon: string;
    priorityLevel: string;
  };
  timeline: {
    requested: string;
    lastUpdate: string;
    deadline: string;
    statusUpdates: number;
  };
  metadata: {
    canEdit: boolean;
    canCancel: boolean;
    nextActions: string[];
    estimatedProcessingTime: string;
  };
}

export interface QuoteRequestStore {
  quoteRequestDetail: QuoteRequestDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchQuoteRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearQuoteRequestDetail: () => void;
}

export interface QuoteRequestListItem {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    address: string;
    phone: number;
  };
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
  quantity: number;
  uom: string;
  grade: {
    _id: string;
    name: string;
  };
  incoterm?: {
    _id: string;
    name: string;
  } | null;
  postCode?: string;
  city?: string;
  country: string;
  destination: string;
  packagingType?: {
    _id: string;
    name: string;
  };
  packaging_size: string;
  expected_annual_volume: number;
  delivery_date: string;
  application: string;
  pricing?: string;
  message: string;
  request_document?: string;
  open_request: boolean;
  status: "pending" | "responded" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
  responseMessage?: Array<{
    status: string;
    response: string;
    date: string;
    _id: string;
  }>;
}

export interface QuoteRequestsListStore {
  requests: QuoteRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchQuoteRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

// Finance Request Types
export interface FinanceRequestListItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    productName: string;
  };
  emiMonths: number;
  quantity: number;
  estimatedPrice: number;
  notes: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FinanceRequestsListResponse {
  data: FinanceRequestListItem[];
  total: number;
  meta?: {
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface FinanceRequestsListStore {
  requests: FinanceRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchFinanceRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

export interface FinanceRequestDetail {
  _id: string;
  user: User;
  amount: number;
  currency: string;
  financeType: string;
  purpose: string;
  duration?: number;
  interestRate?: number;
  collateral?: string;
  description: string;
  documents?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
}

export interface FinanceRequestStore {
  financeRequestDetail: FinanceRequestDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchFinanceRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearFinanceRequestDetail: () => void;
}

// Product Request Types
export interface ProductRequestUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  address: string;
  phone: number;
}

export interface ProductRequestProduct {
  _id: string;
  productName: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
  };
}

export interface ProductRequestListItem {
  _id: string;
  user: ProductRequestUser;
  product: ProductRequestProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: string;
  message: string;
  request_document: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
  sellerStatus: "pending" | "accepted" | "in_progress" | "shipped" | "delivered" | "completed" | "cancelled" | "rejected";
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  statusTracking?: {
    adminStatus: string;
    sellerStatus: string;
    lastUpdate: string;
    totalUpdates: number;
  };
}

export interface ProductRequestsListResponse {
  success: boolean;
  message: string;
  data: ProductRequestListItem[];
  meta: {
    pagination: {
      total: number;
      page: number;
      totalPages: number;
      count: number;
      limit: number;
    };
    filters: {
      search: string;
      status: string;
    };
  };
}

export interface ProductRequestsListStore {
  requests: ProductRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchProductRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

export interface ProductRequestDetailUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  address: string;
  phone: number;
}

export interface ProductRequestDetailProduct {
  _id: string;
  productName: string;
  chemicalName: string;
  description: string;
  tradeName: string;
  manufacturingMethod: string;
  countryOfOrigin: string;
  color: string;
  productImages: Array<{
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    _id: string;
  }>;
  density: number;
  mfi: number;
  tensileStrength: number;
  elongationAtBreak: number;
  shoreHardness: number;
  waterAbsorption: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    address: string;
    phone: number;
  };
}

export interface SupplierOffer {
  _id: string;
  bulkOrderId: {
    _id: string;
    product: string;
    quantity: number;
    uom: string;
    city: string;
    country: string;
    delivery_date: string;
  };
  supplierId: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
  };
  pricePerUnit: number;
  availableQuantity: number;
  deliveryTimeInDays: number;
  incotermAndPackaging: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductRequestDetailResponse {
  order: ProductRequestDetail;
  offers: SupplierOffer[];
}

export interface ProductRequestDetail {
  _id: string;
  user: ProductRequestDetailUser;
  product: ProductRequestDetailProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: string;
  message: string;
  request_document: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
  sellerStatus: "pending" | "accepted" | "in_progress" | "shipped" | "delivered" | "completed" | "cancelled" | "rejected";
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusTracking?: {
    adminStatus: string;
    sellerStatus: string;
    lastUpdate: string;
    totalUpdates: number;
    statusHistory: Array<any>;
  };
}

export interface ProductRequestDetailStore {
  productRequestDetail: ProductRequestDetail | null;
  supplierOffers: SupplierOffer[];
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchProductRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearProductRequestDetail: () => void;
}
