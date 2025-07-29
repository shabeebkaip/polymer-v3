import { ProductCardTypes } from "./product";

export type sellerLogoContainerType = {
  _id: string;
  company_logo: string;
}
export type SellerLogoContainerProps  = {  
  seller: sellerLogoContainerType;
}

export interface Supplier {
  _id: string;
  company: string;
  company_logo: string;
  location: string;
  website: string;
  email?: string;
  phone?: string;
  description?: string;
  certifications?: string[];
  services?: string[];
  products: ProductCardTypes[]; // Assuming products is an array of product objects

  createdAt?: string;
  [key: string]: any;
}
