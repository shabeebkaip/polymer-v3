// Sample Enquiry Types
import { StatusConfig } from '@/lib/config/status.config';

export interface StatusOption {
  value: string;
  label: string;
  description: string;
}

export interface SampleRequestHeaderProps {
  requestId: string;
  status: string;
  statusConfig: StatusConfig;
}

export interface ProductImage {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  _id: string;
}

export interface SampleEnquiry {
  _id: string;
  user: any;
  product: any;
  quantity: number;
  uom: string;
  sampleSize?: string;
  address: string;
  country: string;
  grade: any;
  application: string;
  expected_annual_volume: number;
  orderDate: string;
  neededBy: string;
  message: string;
  request_document: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface SampleEnquiriesState {
  enquiries: SampleEnquiry[];
  meta: {
    pagination: {
      total: number;
      page: number;
      totalPages: number;
      count: number;
      limit: number;
    };
    filters: { search: string; status: string };
  } | null;
  enquiryDetail: SampleEnquiry | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  setEnquiries: (enquiries: SampleEnquiry[], meta: any) => void;
  clearEnquiries: () => void;
  setEnquiryDetail: (enquiry: SampleEnquiry) => void;
  clearEnquiryDetail: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUpdating: (updating: boolean) => void;
}
