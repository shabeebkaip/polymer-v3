// components/shared/PageNavigationLoader.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Make sure this exists

NProgress.configure({ showSpinner: false });

const PageNavigationLoader = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 600); // adjust to match your loading expectations

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default PageNavigationLoader;
