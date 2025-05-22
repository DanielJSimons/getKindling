'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mx-auto max-w-md rounded-lg border border-red-100 bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
        </div>
        
        <p className="mb-4 text-gray-600">
          There was an error loading this dashboard page. Our team has been notified.
        </p>
        
        {error.message && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {error.message}
          </div>
        )}
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              // Attempt to reset the error boundary
              reset();
              
              // If reset doesn't work, we can try refreshing the page
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
            className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
          >
            Try again
          </button>
          
          <Link
            href="/dashboard"
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 