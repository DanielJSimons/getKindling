'use client';

import { useEffect, useState } from 'react';

type Metrics = {
  totalSites: number;
  totalSponsors: number;
  totalEarnings: number;
  activeAds: number;
};

export default function Overview() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalSites: 0,
    totalSponsors: 0,
    totalEarnings: 0,
    activeAds: 0,
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulated data for now
    setMetrics({
      totalSites: 5,
      totalSponsors: 12,
      totalEarnings: 2500,
      activeAds: 8,
    });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Overview</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total Sites</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.totalSites}</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Active Sponsors</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.totalSponsors}</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total Earnings</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">${metrics.totalEarnings.toLocaleString()}</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Active Ads</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.activeAds}</p>
        </div>
      </div>

      {/* Placeholder for charts/graphs */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Earnings Over Time</h2>
          <div className="h-64 rounded bg-gray-50"></div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Top Performing Sites</h2>
          <div className="h-64 rounded bg-gray-50"></div>
        </div>
      </div>
    </main>
  );
} 