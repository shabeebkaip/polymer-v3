import { ReactNode } from "react";

export type UserType =  {
  _id?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  website?: string;
  industry?: string;
  address?: string;
  country_code?: string;
  phone?: string | number;
  location?: string;
  vat_number?: string;
  about_us?: string;
  Expert_department?: string;
  Expert_role?: string;
  user_type?: string;
  company_logo?: string;
  avatar?: string;
  email?: string;
  emailVerified?: boolean;
}

export interface UserLayoutProps {
  children: ReactNode;
}

export interface BulkOrder {
  _id: string;
  product: {
    productName: string;
    chemicalName?: string;
    tradeName?: string;
    description?: string;
  };
  quantity: number;
  uom: string;
  city: string;
  country: string;
  delivery_date: string;
  status: string;
  message?: string;
  user: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
  };
}

export interface ActionButtonsProps {
  productId: string;
  uom: string;
  className?: string;
  variant?: 'default' | 'compact' | 'large' | 'custom';
  onChatClick?: () => void;
  user: UserType;
}

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  user_type?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

export interface UserStore {
  user: UserInfo | null;
  isInitialized: boolean;
  setUser: (user: UserInfo | null) => void;
  loadUserFromCookies: () => void;
  logout: () => void;
}