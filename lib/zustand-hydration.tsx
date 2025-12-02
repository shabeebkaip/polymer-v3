"use client";

import { useEffect, useState } from 'react';

// Custom hook to handle Zustand SSR hydration
export function useIsomorphicLayoutEffect(effect: () => void, deps?: React.DependencyList) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effect(), deps);
}

// Hook to ensure component only renders on client
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

// Higher-order component to handle Zustand hydration
export function withHydration<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function HydratedComponent(props: T) {
    const isHydrated = useHydration();

    if (!isHydrated) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
}
