export interface AnimatedPreloaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  minimal?: boolean;
}

export interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export interface FileUploadProps {
  onFileUpload: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  multiple?: boolean;
  setCloudinaryImage?: (url: string) => void;
  buttonText?: string;
}

export interface UploadedFile {
  fileUrl: string;
  id: string;
  name?: string;  // Keep for backward compatibility
  type?: string;  // Keep for backward compatibility
  originalFilename?: string;  // NEW: from backend
  format?: string;  // NEW: from backend (jpg, pdf, png, xlsx, etc.)
  resourceType?: string;  // NEW: from backend (image, raw)
  viewUrl?: string;  // NEW: relative URL for inline preview (raw files only)
  downloadUrl?: string;  // NEW: URL for forced downloads
}

export interface PreviewFile {
  fileUrl: string;
  type?: string;
}

export interface FileViewerProps {
  previewFile?: PreviewFile;
  triggerComp: React.ReactNode;
}

export interface SocialLink {
  label: string;
  icon: string;
  link: string;
}

export interface ImageUploadProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  previews: string[];
  setPreviews: (index: number) => void;
  onImageClick?: (index: number) => void;
  width?: string;
  height?: string;
}

export interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackType?: 'product' | 'company' | 'user';
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export interface DropdownOption {
  _id: string;
  name: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface SearchableDropdownProps {
  options: DropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
}

export interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export interface CacheMetadata {
  lastFetch: number;
  ttl: number;
}

export interface SharedState {
  industries: any[];
  productFamilies: any[];
  sellers: any[];
  buyerOpportunities: any[];
  suppliersSpecialDeals: any[];
  industriesCache: CacheMetadata | null;
  productFamiliesCache: CacheMetadata | null;
  sellersCache: CacheMetadata | null;
  buyerOpportunitiesCache: CacheMetadata | null;
  suppliersSpecialDealsCache: CacheMetadata | null;
  industriesLoading: boolean;
  familiesLoading: boolean;
  sellersLoading: boolean;
  buyerOpportunitiesLoading: boolean;
  suppliersSpecialDealsLoading: boolean;
  fetchIndustries: (forceRefresh?: boolean) => Promise<void>;
  fetchProductFamilies: (forceRefresh?: boolean) => Promise<void>;
  fetchSellers: (forceRefresh?: boolean) => Promise<void>;
  fetchBuyerOpportunities: (forceRefresh?: boolean) => Promise<void>;
  fetchSuppliersSpecialDeals: (forceRefresh?: boolean) => Promise<void>;
  invalidateCache: (cacheKey?: string) => void;
  isCacheValid: (cacheKey: string) => boolean;
  setIndustries: (industries: any[]) => void;
  setProductFamilies: (families: any[]) => void;
  setSellers: (sellers: any[]) => void;
  setBuyerOpportunities: (opportunities: any[]) => void;
  setSuppliersSpecialDeals: (deals: any[]) => void;
}

export interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  id?: string;
  required?: boolean;
  icon?: React.ReactNode;
  name?: string;
  autoComplete?: string;
  onBlur?: () => void;
}

export interface LabelValueProps {
  label: string;
  value: string | number | React.ReactNode;
  horizontal?: boolean;
  compact?: boolean;
}

export interface LabelValueVerticalProps {
  label: string;
  value: string | number | React.ReactNode;
}

export interface DropdownItem {
  _id: string;
  name: string;
}

export interface MultiSelectProps {
  label: string;
  placeholder?: string;
  options: DropdownItem[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: boolean;
  helperText?: string;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
}

export interface QuoteDealRequestModalProps {
  className?: string;
  dealId: string;
  dealProduct: string;
  dealSupplier: string;
  dealSellerId: string; // Required by API
  dealMinQuantity: string;
  dealPrice: number;
  buttonText?: string;
  children?: React.ReactNode;
}

export interface Grade extends DropdownOption {
  _id: string;
  name: string;
}

export interface Incoterm extends DropdownOption {
  _id: string;
  name: string;
}

export interface PackagingType extends DropdownOption {
  _id: string;
  name: string;
}

export interface QuoteRequestModalProps {
  className?: string;
  productId: string;
  uom: string;
  buttonText?: string;
  children?: React.ReactNode;
}

export interface SampleRequestModalProps {
  className?: string;
  productId: string;
  uom: string;
  buttonText?: string;
  children?: React.ReactNode;
}

export interface SampleRequestInputProps {
  placeholder: string;
  className?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  min?: number | string;
  readOnly?: boolean;
  onFocus?: () => void;
}

export interface SampleRequestTextareaProps {
  placeholder: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  rows?: number;
}

export interface SampleRequestDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  options: Grade[];
}

export interface SidebarSubItem {
  displayName: string;
  route: string;
  name: string;
  icon: string;
}

export interface SidebarItem {
  displayName: string;
  route: string;
  name: string;
  icon: string;
  subItems?: SidebarSubItem[];
}
