export interface BenefitsContent {
  content?: {
    description?: string[];
  };
}

export interface CmsState {
  buyersBenefits: BenefitsContent;
  suppliersBenefits: BenefitsContent;
  socialLinks: any[];
  loading: boolean;
  getBenefitsOfBuyers: () => Promise<void>;
  getBenefitsOfSuppliers: () => Promise<void>;
  getSocialLinks: () => Promise<void>;
  setBuyersBenefits: (benefits: BenefitsContent) => void;
  setSuppliersBenefits: (benefits: BenefitsContent) => void;
}
