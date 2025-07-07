export interface FinanceRequestDetailTypes {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    address: string;
    phone: number;
  };
  productId: {
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
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
      address: string;
      phone: number;
    };
    color: string;
    countryOfOrigin: string;
    density: number;
    elongationAtBreak: number;
    manufacturingMethod: string;
    mfi: number;
    shoreHardness: number;
    tensileStrength: number;
    tradeName: string;
    waterAbsorption: number;
  };
  emiMonths: number;
  quantity: number;
  estimatedPrice: number;
  notes: string;
  status: string;
  productGrade: string;
  desiredDeliveryDate: string;
  destination: string;
  paymentTerms: string;
  requireLogisticsSupport: string;
  previousPurchaseHistory: string;
  additionalNotes: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  productName: string;
  grade?: { name: string };
  uom?: string;
  pricePerUnit?: number;
  createdBy?: {
    company?: string;
  };
}

export interface FinanceFormData {
  productId: string;
  emiMonths: number;
  quantity: number;
  estimatedPrice: number;
  notes: string;
  productGrade: string;
  desiredDeliveryDate: Date | undefined;
  destination: string;
  paymentTerms: string;
  requireLogisticsSupport: string;
  previousPurchaseHistory: string;
  additionalNotes: string;
  country: string;
}
