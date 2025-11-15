export interface Industry {
  _id: string;
  name: string;
  bg: string;
  image?: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  website: string;
  phone: string;
  company: string;
  country_code: string;
  industry: string;
  address: string;
  location: string;
  company_logo: string;
  user_type?: string;
  vat_number?: string;
}

export interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}
