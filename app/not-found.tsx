import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - Polymers Hub',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-white">
      <div className="space-y-2">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
