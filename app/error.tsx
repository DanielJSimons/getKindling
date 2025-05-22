'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/60 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
} 