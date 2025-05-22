'use client';

import { useState } from 'react';

type Sponsor = {
  id: string;
  name: string;
  website: string;
  status: 'active' | 'pending' | 'inactive';
  totalSpent: number;
  activeAds: number;
};

const defaultSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TechCorp',
    website: 'https://techcorp.com',
    status: 'active',
    totalSpent: 5000,
    activeAds: 3,
  },
  {
    id: '2',
    name: 'StartupHub',
    website: 'https://startuphub.io',
    status: 'active',
    totalSpent: 3200,
    activeAds: 2,
  },
];

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);
  const [showAddForm, setShowAddForm] = useState(false);

  function getStatusColor(status: Sponsor['status']) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sponsors</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          Add Sponsor
        </button>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Active Ads</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id} className="text-sm text-gray-900">
                  <td className="px-6 py-4 font-medium">{sponsor.name}</td>
                  <td className="px-6 py-4">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline"
                    >
                      {sponsor.website}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        sponsor.status
                      )}`}
                    >
                      {sponsor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${sponsor.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4">{sponsor.activeAds}</td>
                  <td className="px-6 py-4">
                    <button className="text-amber-600 hover:text-amber-700">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sponsor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Sponsor</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            {/* Add sponsor form will go here */}
          </div>
        </div>
      )}
    </main>
  );
} 