export type NavLink = {
    href: string;
    label: string;
    icon?: string;
    id: string;
};

export type userPopoverType = {
    isUserPopoverOpen: boolean
    setIsUserPopoverOpen: (isOpen: boolean) => void;
    navOptions : NavLink[],
    handleNavigate: (href: string) => void;
    handleLogout: () => void;

}