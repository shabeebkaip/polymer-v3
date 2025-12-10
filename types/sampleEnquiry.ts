export interface SampleEnquiry {
  _id: string;
  product?: {
    productName?: string;
    grade?: string;
    productImages?: Array<{ fileUrl: string }>;
  };
  quantity?: number;
  uom?: string;
  user?: {
    company?: string;
    firstName?: string;
    lastName?: string;
  };
  status?: string;
  createdAt?: string;
}
