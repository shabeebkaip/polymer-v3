import { BenefitsContent } from './cms';
import { ProductCardTypes } from './product';

export interface HomePageData {
  industries: any[];
  productFamilies: any[];
  sellers: any[];
  buyersBenefits: BenefitsContent;
  suppliersBenefits: BenefitsContent;
  buyerOpportunities: any[];
  suppliersSpecialDeals: any[];
}

export type howPolymersConnectType = {
  isBuyer: boolean;
  isSeller: boolean;
};

export type Request = {
  id: string;
  type: 'buyer-request';
  title: string;
  buyer: {
    company: string;
    location: string;
    verified: boolean;
    name?: string;
  };
  product: string;
  quantity: string;
  budget: string;
  deadline: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  responses: number;
  destination?: string;
  sellerStatus?: string;
  requestDocument?: string;
  createdAt?: string;
  priority?: string;
  tradeName?: string;
  chemicalName?: string;
  daysLeft?: number;
};

export type BenefitCardProps = {
  benefits: string[];
  subtitle: string;
  title: string;
  registerLink: string;
};

export type ProductImage = {
  fileUrl: string;
};

export type ProductHome = {
  _id: string;
  productName: string;
  tradeName: string;
  description: string;
  productImages: ProductImage[];
  price: number;
  uom: string;
};

export type Seller = {
  _id: string;
  company: string;
  company_logo: string;
  products?: ProductCardTypes[];
};


export type Deal = {
  id: string;
  type: "special-deal";
  title: string;
  supplier: {
    name: string;
    logo: string;
    rating: number;
    location: string;
  };
  product: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  minQuantity: string;
  validUntil: string;
  description: string;
  badge: string;
  dealStatus?: string;
  dealType?: string;
  createdAt?: string;
}

export type ApiDeal = {
  _id?: string;
  productId?: {
    price?: string | number;
    productName?: string;
    description?: string;
    [key: string]: unknown;
  };
  offerPrice?: string | number;
  sellerId?: {
    company?: string;
    companyName?: string;
    email?: string;
    company_logo?: string;
    location?: string;
    address?: string;
    [key: string]: unknown;
  };
  status?: string;
  dealType?: string;
  validUntil?: string;
  createdAt?: string;
  adminNote?: string;
  minimumQuantity?: string;
  [key: string]: unknown;
};

export type TabProps = {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  icon: string;
  iconWidth?: string;
  fontSize?: string;  
};

export interface HomePageClientProps {
  initialData: HomePageData;
}

export interface HomeDataProviderProps {
  children: React.ReactNode;
  initialData: HomePageData;
}