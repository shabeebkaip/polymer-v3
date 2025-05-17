export interface AdditionalInfo {
  title: string;
  description: string;
}

export interface UploadedFile {
  id: string;
  fileUrl: string;
  type?: string;
  name?: string;
}

export interface ProductFormData {
  productName: string;
  chemicalName: string;
  description: string;
  additionalInfo: AdditionalInfo[];

  tradeName: string;
  chemicalFamily: string;
  polymerType: string;

  industry: string[]; // Array of industry IDs
  grade: string[]; // Array of grade IDs
  productFamily: string[]; // Array of family IDs
  
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
