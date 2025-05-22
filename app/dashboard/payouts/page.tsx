'use client';

import { useState } from 'react';

type Payout = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  date: string;
  method: string;
};

const defaultPayouts: Payout[] = [
  {
    id: '1',
    amount: 1200,
    status: 'paid',
    date: '2024-03-01',
    method: 'Bank Transfer',
  },
  {
    id: '2',
    amount: 800,
    status: 'pending',
    date: '2024-03-15',
    method: 'PayPal',
  },
];

export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>(defaultPayouts);
  const [showSetupModal, setShowSetupModal] = useState(false);

  function getStatusColor(status: Payout['status']) {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payouts</h1>
          <p className="mt-1 text-gray-500">Manage your earnings and payment methods</p>
        </div>
        <button
          onClick={() => setShowSetupModal(true)}
          className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          Set Up Payment Method
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Available for Payout</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">$2,450.00</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Next Payout Date</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">Mar 15, 2024</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Paid Out</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">$12,800.00</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="rounded-lg border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payouts.map((payout) => (
                <tr key={payout.id} className="text-sm text-gray-900">
                  <td className="px-6 py-4">
                    {new Date(payout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${payout.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{payout.method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        payout.status
                      )}`}
                    >
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Set Up Payment Method</h2>
              <button
                onClick={() => setShowSetupModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            {/* Payment setup form will go here */}
          </div>
        </div>
      )}
    </main>
  );
} 