export type NavLink = {
    href: string;
    label: string;
    icon?: string;
    id: string;
};

export type linksType = {
    href: string;
    label: string;
}

export type userPopoverType = {
    isUserPopoverOpen: boolean
    setIsUserPopoverOpen: (isOpen: boolean) => void;
    navOptions: NavLink[],
    handleNavigate: (href: string) => void;
    handleLogout: () => void;
}

export type mobileMenuType = {
    toggleMenu : () => void;
    isOpen: boolean;
}