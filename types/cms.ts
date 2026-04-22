export interface BenefitsContent {
  content?: {
    description?: string[];
  };
}

export interface HeroSectionContent {
  content?: {
    title?: string;
    description?: string;
    ar_title?: string;
    ger_title?: string;
    cn_title?: string;
    ar_description?: string;
    ger_description?: string;
    cn_description?: string;
  };
}

export interface PolymerAdvantagesContent {
  content?: {
    title?: string;
    description?: string;
    ar_title?: string;
    ger_title?: string;
    cn_title?: string;
    ar_description?: string;
    ger_description?: string;
    cn_description?: string;
  };
}

export interface HomeSectionsContent {
  content?: {
    dealsTitle?: string;
    dealsDescription?: string;
    suppliersTitle?: string;
    suppliersBadge?: string;
    suppliersDescription?: string;
    benefitsBadge?: string;
  };
}

export interface CmsState {
  buyersBenefits: BenefitsContent;
  suppliersBenefits: BenefitsContent;
  socialLinks: any[];
  heroSection: HeroSectionContent;
  polymerAdvantages: PolymerAdvantagesContent;
  homeSections: HomeSectionsContent;
  loading: boolean;
  getBenefitsOfBuyers: () => Promise<void>;
  getBenefitsOfSuppliers: () => Promise<void>;
  getSocialLinks: () => Promise<void>;
  setBuyersBenefits: (benefits: BenefitsContent) => void;
  setSuppliersBenefits: (benefits: BenefitsContent) => void;
  setHeroSection: (data: HeroSectionContent) => void;
  setPolymerAdvantages: (data: PolymerAdvantagesContent) => void;
  setHomeSections: (data: HomeSectionsContent) => void;
}
