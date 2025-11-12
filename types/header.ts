export type NavLink = {
  href: string;
  label: string;
  icon?: string;
  id: string;
};

export type linksType = {
  href: string;
  label: string;
};

export type NavigationProps = {
  links: linksType[];
};

export type userPopoverType = {
  isUserPopoverOpen: boolean;
  setIsUserPopoverOpen: (isOpen: boolean) => void;
  navOptions: NavLink[];
  handleNavigate: (href: string) => void;
  handleLogout: () => void;
};

export type mobileMenuButtonType = {
  toggleMenu: () => void;
  isOpen: boolean;
};

export type mobileMenuOverlayType = {
  toggleMenu: () => void;
};

export type mobileMenuType = {
  isOpen: boolean;
  links: linksType[];
  handleNavigate: (href: string) => void;
  toggleVisibility: () => void;
  language: string;
  changeLanguage: (selectedLanguage: string) => void;
  isVisible: boolean;
  handleLogout: () => void;
};
