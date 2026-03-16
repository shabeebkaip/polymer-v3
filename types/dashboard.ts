// Common Types
export interface MonthlyData {
  month: number;
  count: number;
}

export interface TopEntity {
  _id: string;
  name: string;
  company: string;
  requestCount: number;
}

export interface TopProduct {
  _id: string;
  productName: string;
  price: number;
  requestCount: number;
}

// Buyer Dashboard Types
export interface BuyerQuoteRequest {
  _id: string;
  seller: string;
  sellerCompany: string;
  product: string;
  desiredQuantity: number;
  status: string;
  sellerResponse?: {
    message: string;
    quotedPrice: number;
    quotedQuantity: number;
    estimatedDelivery: string;
  };
  createdAt: string;
}

export interface BuyerSampleRequest {
  _id: string;
  product: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export interface BuyerDealQuoteRequest {
  _id: string;
  seller: string;
  product: string;
  desiredQuantity: number;
  status: string;
  createdAt: string;
}

export interface BuyerDashboard {
  cards: {
    quoteRequests: {
      total: number;
      pending: number;
      responded: number;
      accepted: number;
    };
    sampleRequests: {
      total: number;
      pending: number;
      sent: number;
      delivered: number;
    };
    dealQuoteRequests: {
      total: number;
      pending: number;
    };
  };
  charts: {
    monthlyQuoteRequests: MonthlyData[];
    monthlySampleRequests: MonthlyData[];
  };
  recentActivity: {
    quoteRequests: BuyerQuoteRequest[];
    sampleRequests: BuyerSampleRequest[];
    dealQuoteRequests: BuyerDealQuoteRequest[];
  };
  insights: {
    topSellers: TopEntity[];
  };
}

// Seller Dashboard Types
export interface SellerQuoteRequest {
  _id: string;
  buyer: string;
  buyerCompany: string;
  product: string;
  desiredQuantity: number;
  status: string;
  createdAt: string;
}

export interface SellerSampleRequest {
  _id: string;
  productName: string;
  buyerName: string;
  buyerCompany: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export interface SellerBestDeal {
  _id: string;
  product: string;
  originalPrice: number;
  offerPrice: number;
  status: string;
  validity: string;
  createdAt: string;
}

export interface SellerDashboard {
  cards: {
    products: {
      total: number;
      newThisMonth: number;
    };
    quoteRequests: {
      total: number;
      pending: number;
      responded: number;
      accepted: number;
    };
    sampleRequests: {
      total: number;
      pending: number;
      sent: number;
    };
    bestDeals: {
      total: number;
      pending: number;
      approved: number;
    };
    dealQuoteRequests: {
      total: number;
      pending: number;
    };
  };
  charts: {
    monthlyQuoteRequests: MonthlyData[];
    monthlySampleRequests: MonthlyData[];
  };
  recentActivity: {
    quoteRequests: SellerQuoteRequest[];
    sampleRequests: SellerSampleRequest[];
    bestDeals: SellerBestDeal[];
  };
  insights: {
    topBuyers: TopEntity[];
    topProducts: TopProduct[];
  };
}

// API Response
export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  dashboardType: 'buyer' | 'seller';
  data: T;
}
