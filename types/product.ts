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

export interface ProductRequestFormData {
  productId: string;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: Date | undefined;
  message: string;
  request_document: string;
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

export interface CompanyDetailsProps {
  companyDetails: {
    _id: string;
    company: string;
    company_logo: string;
    location?: string;
    website?: string;
    name?: string;
    email?: string;
    phone?: number;
    address?: string;
    [key: string]: unknown;
  };
  productId: string;
  uom: string;
  userType?: string;
  product: Product;
}

export interface FilterDataItem {
  _id: string | boolean;
  name: string;
  count: number;
}

export interface FilterSection {
  name: string;
  displayName: string;
  component: string;
  filterType: string;
  collapsible: boolean;
  searchable?: boolean;
  data: FilterDataItem[];
}

export interface FilterProps {
  filters: FilterSection[];
  query: Record<string, string | string[]>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
  loader?: boolean;
}

export interface FilterItemData {
  name: string;
  _id: string | boolean;
  count?: number;
}

export interface FilterItemProps {
  filter: {
    name: string;
    displayName: string;
    component?: string;
    filterType?: string;
    collapsible?: boolean;
    searchable?: boolean;
    data: FilterItemData[];
  };
  query: Record<string, unknown>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
}

export interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface FilterTopProps {
  filters: FilterSection[];
  query: Record<string, unknown>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
}

export interface Image {
  fileUrl: string;
  [key: string]: unknown;
}

export interface ImageContainersProps {
  productImages: Image[];
  [key: string]: unknown;
  isCompact?: boolean;
}

export interface ProductCardProps {
  product: ProductCardTypes;
  userType?: string;
}

export interface ProductDetailClientProps {
  product: Product;
}

export interface ProductFilter {
  filterSide: FilterSection[];
  filterTop: FilterSection[];
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface ProductsListProps {
  products: ProductCardTypes[];
  loader?: boolean;
  userType?: string;
}

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  query: Record<string, string[] | string>;
}

export interface GeneralTabInformationProps {
  product: Product;
}

export interface ProductBasicInformationProps {
  product: Product;
}

export interface ProductCertificationsProps {
  product: Product;
}

export interface ProductDetailBreadCrumbProps {
  product: {
    productName: string;
  };
}

export interface ProductDocumentDetailsProps {
  product: Product;
}

export interface ProductManufactureDetailsProps {
  product: Product;
}

export interface ProductOverviewProps {
  product: Product;
}

export interface ProductSummaryBarProps {
  product: Product;
}

export interface ProductTechnicalPropertiesProps {
  product: Product;
}

export interface ProductTradeInformationProps {
  product: Product;
}

export interface ProductValueCardProps {
  label: string;
  value: string | number;
}

export type ValidationErrors = Partial<Record<keyof ProductFormData, string>>;

export interface RequiredField {
  field: keyof ProductFormData;
  label: string;
}

export interface AddEditProductProps {
  product?: ProductFormData;
  id?: string;
}

export interface UserProductCardProps {
  product: {
    _id?: string;
    productName?: string;
    productImages?: Array<{ fileUrl: string }>;
    createdBy?: {
      company_logo?: string;
      company?: string;
    };
    chemicalName?: string;
    productFormName?: string;
    polymerType?: { name?: string };
    countryOfOrigin?: string;
  };
}

export interface CertificationProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: boolean) => void;
}

export interface DocumentsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: UploadedFile[]) => void;
}

export interface EnvironmentalProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: boolean) => void;
}

export interface GeneralInformationProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | number | boolean) => void;
  onFieldError: (field: keyof ProductFormData) => void;
  error: Partial<Record<keyof ProductFormData, string>>;
}

export interface PackagingType {
  _id: string;
  name: string;
}

export interface PackageInformationProps {
  data: {
    packagingType?: string[];
    packagingWeight?: string;
    storageConditions?: string;
    shelfLife?: string;
    [key: string]: unknown;
  };
  onFieldChange: (field: string, value: string | string[]) => void;
  packagingTypes?: PackagingType[];
}

export interface ProductDetailsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | string[]) => void;
  chemicalFamilies: Array<{ _id: string; name: string }>;
  polymersTypes: Array<{ _id: string; name: string }>;
  industry: Array<{ _id: string; name: string }>;
  physicalForms: Array<{ _id: string; name: string }>;
  productFamilies: Array<{ _id: string; name: string }>;
  onFieldError: (field: keyof ProductFormData) => void;
  error: Partial<Record<keyof ProductFormData, string>>;
}

export interface ProductImagesProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: Array<{ id: string; fileUrl: string }>) => void;
}

export interface TechnicalPropertiesProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | string[]) => void;
  grades?: Array<{ _id: string; name: string }>;
}

export interface TradeInformationProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | string[]) => void;
  incoterms?: Array<{ _id: string; name: string }>;
  paymentTerms?: Array<{ _id: string; name: string }>;
  error: Partial<Record<keyof ProductFormData, string>>;
  onFieldError: (field: keyof ProductFormData) => void;
}
