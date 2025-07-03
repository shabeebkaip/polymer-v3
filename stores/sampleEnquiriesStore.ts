import { create } from "zustand";

interface SampleEnquiry {
  _id: string;
  user: any;
  product: any;
  quantity: number;
  uom: string;
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

interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  count: number;
  limit: number;
}

interface SampleEnquiriesState {
  enquiries: SampleEnquiry[];
  meta: {
    pagination: PaginationMeta;
    filters: { search: string; status: string };
  } | null;
  setEnquiries: (enquiries: SampleEnquiry[], meta: any) => void;
  clearEnquiries: () => void;
}

export const useSampleEnquiriesStore = create<SampleEnquiriesState>((set) => ({
  enquiries: [],
  meta: null,
  setEnquiries: (enquiries, meta) => set({ enquiries, meta }),
  clearEnquiries: () => set({ enquiries: [], meta: null }),
}));
