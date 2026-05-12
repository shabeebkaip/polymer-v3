'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
      <p className="text-gray-500 max-w-md">
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
