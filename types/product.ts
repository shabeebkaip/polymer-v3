export interface UploadedFile {
  id: string;
  fileUrl: string;
  type?: string;
  name?: string;
  [key: string]: any; // fallback for dynamic keys
}

export interface ProductImage {
  fileUrl: string;
  [key: string]: unknown;
  id: string;
  name: string;
  type: string;
}

export interface Company {
  _id: string;
  company: string;
  company_logo: string;
  countryOfOrigin: string;
  website?: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  location: string;
  [key: string]: unknown; // Add index signature for compatibility
}
export interface NamedObject {
  _id: string;
  name: string;
  ar_name?: string;
  ger_name?: string;
  cn_name?: string;
}

export interface Product {
  _id: string;
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  productImages?: ProductImage[];
  createdBy?: Company;
  chemicalFamily?: NamedObject;
  polymerType?: NamedObject;
  physicalForm?: NamedObject;
  industry?: NamedObject[];
  grade?: NamedObject[];
  productType?: string;
  uom?: string;
  minimum_order_quantity?: number;
  minOrderQuantity?: number;
  price?: number;
  density?: number;
  stock?: number;
  manufacturingMethod?: string;
  color?: string;
  countryOfOrigin?: string;
  packagingWeight?: string;
  mfi?: number;
  tensileStrength?: number;
  elongationAtBreak?: number;
  shoreHardness?: number;
  waterAbsorption?: number;
  storageConditions?: string;
  shelfLife?: string;
  recyclable?: boolean;
  bioDegradable?: boolean;
  fdaApproved?: boolean;
  medicalGrade?: boolean;
  leadTime?: string;
  paymentTerms?: NamedObject;
  priceTerms?: string;
  packagingType?: NamedObject[];
  incoterms?: NamedObject[];
  product_family?: NamedObject[];
  additionalInfo?: Array<{
    title: string;
    description: string;
  }>;
  safety_data_sheet?: {
    fileUrl: string;
    name: string;
    type: string;
  };
  technical_data_sheet?: {
    fileUrl: string;
    name: string;
    type: string;
  };
  certificate_of_analysis?: {
    fileUrl: string;
    name: string;
    type: string;
  };
  [key: string]: any;
}

export interface ProductFormData {
  productName: string;
  chemicalName: string;
  description: string;

  tradeName: string;
  chemicalFamily: string;
  polymerType: string;

  industry: string[]; // Array of industry IDs
  grade: string[]; // Array of grade IDs

  manufacturingMethod: string;
  physicalForm: string;
  countryOfOrigin: string;
  color: string;

  productImages: UploadedFile[];

  density: string;
  mfi: number | null;
  tensileStrength: number | null;
  elongationAtBreak: number | null;
  shoreHardness: number | null;
  waterAbsorption: number | null;

  minimum_order_quantity: number | null;
  stock: number | null;
  uom: string;
  price: number | null;
  priceTerms: "fixed" | "negotiable";

  incoterms: string[]; // Array of incoterm IDs
  leadTime: string;
  paymentTerms: string;

  packagingType: string[]; // Array of packaging type IDs
  packagingWeight: string;
  storageConditions: string;

  technical_data_sheet: Record<string, any>;
  certificate_of_analysis: Record<string, any>;
  safety_data_sheet: Record<string, any>;

  shelfLife: string;

  recyclable: boolean;
  bioDegradable: boolean;
  fdaApproved: boolean;
  medicalGrade: boolean;

  product_family: string[]; // Array of family IDs

  _id?: string | null;

  [key: string]: any; // fallback for dynamic keys
}

export interface ProductCardTypes {
  productImages: any[];
  productName: string;
  createdBy: {
    company_logo: string;
  };
  countryOfOrigin: string;
  chemicalName: string;
  polymerType: {
    name: string;
  };
  uom: string;
  _id: string;
  [key: string]: any; // fallback for dynamic keys
}
