// app/dashboard/sites/[siteId]/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

type Slot = {
  id: string;
  position: string;
  priceUsd: number;
  maxSponsors: number;
  allowCustomShare: boolean;
  sponsorships?: any[]; // We'll use this to store sponsorships data when needed
};

type Site = { id: string; name: string; url: string; adSlots: Slot[] };

export default function SiteDetail() {
  // 🔑  useParams is the supported way to read route params in a Client Component
  const { siteId } = useParams<{ siteId: string }>();

  const [site, setSite] = useState<Site | null>(null);
  const [position, setPosition] = useState('BANNER');
  const [price, setPrice] = useState(1_000); // pennies → $10.00
  const [maxSponsors, setMaxSponsors] = useState(1);
  const [allowCustomShare, setAllowCustomShare] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!siteId) return;

    const loadSite = async () => {
      try {
        const allSites: Site[] = await fetch('/api/sites', { cache: 'no-store' }).then(r => r.json());
        setSite(allSites.find(s => s.id === siteId) ?? null);
      } catch (error) {
        console.error('Error loading site:', error);
        toast.error('Failed to load site data');
      }
    };

    loadSite();
  }, [siteId]);

  async function addSlot(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/sites/${siteId}/adslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          position, 
          priceUsd: price,
          maxSponsors,
          allowCustomShare
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create ad slot');
      }
      
      const slot: Slot = await res.json();
      setSite(prev => prev && { ...prev, adSlots: [...prev.adSlots, slot] });
      toast.success('Ad slot created successfully');
      
      // Reset form
      setPosition('BANNER');
      setPrice(1_000);
      setMaxSponsors(1);
      setAllowCustomShare(false);
    } catch (error) {
      console.error('Error adding slot:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create ad slot');
    } finally {
      setIsSubmitting(false);
    }
  }
  /* ──────────────────────────────────────────────────────────── */

  // Helper function to calculate default share percentage
  const getDefaultSharePct = (maxSpons: number) => {
    return maxSpons > 0 ? Math.floor(100 / maxSpons) : 100;
  };

  if (!site) return <p className="p-8">Loading…</p>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">{site.name}</h1>
      <p className="mb-6 text-sm text-gray-600">{site.url}</p>

      <section className="mb-10">
        <h2 className="mb-2 font-semibold">Embed snippet</h2>
        <pre className="select-all rounded bg-gray-100 p-3 text-sm">{`<script async src="/widget.js" data-site="${siteId}"></script>`}</pre>
      </section>

      <section>
        <h2 className="mb-4 font-semibold">Ad Slots</h2>

        {site.adSlots.length === 0 ? (
          <p className="text-sm text-gray-600">No slots yet.</p>
        ) : (
          <ul className="space-y-4">
            {site.adSlots.map(slot => (
              <li key={slot.id} className="rounded-lg border bg-white p-4 text-sm shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{slot.position}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 font-semibold">${(slot.priceUsd / 100).toFixed(2)}/day</span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      for 100% share
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Slot ID:</span> 
                    <code className="ml-1 bg-gray-100 px-1 py-0.5 rounded">{slot.id}</code>
                  </div>
                  
                  <div>
                    <span className="font-medium">Max sponsors:</span> 
                    <span className="ml-1">{slot.maxSponsors === 0 ? 'Unlimited' : slot.maxSponsors}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Default share:</span> 
                    <span className="ml-1">
                      {getDefaultSharePct(slot.maxSponsors)}%
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Custom share:</span> 
                    <span className="ml-1">{slot.allowCustomShare ? 'Allowed' : 'Not allowed'}</span>
                  </div>
                </div>
                
                <div className="mt-3 border-t pt-3">
                  <p className="text-xs text-gray-500 mb-1">Per-slot embed code:</p>
                  <pre className="select-all rounded bg-gray-100 p-2 text-xs">{`<script async src="/widget.js" data-slot="${slot.id}"></script>`}</pre>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={addSlot} className="mt-8 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-medium">Create new ad slot</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1">Position</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option>BANNER</option>
                <option>SIDEPANEL</option>
                <option>INLINE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Price per day for 100% share (USD cents)</label>
              <input
                type="number"
                min={100}
                required
                className="w-full rounded border p-2"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
              />
              <p className="mt-1 text-xs text-gray-500">${(price / 100).toFixed(2)}/day</p>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Max simultaneous sponsors</label>
              <input
                type="number"
                min={0}
                required
                className="w-full rounded border p-2"
                value={maxSponsors}
                onChange={e => setMaxSponsors(Number(e.target.value))}
              />
              <p className="mt-1 text-xs text-gray-500">
                {maxSponsors === 0 ? 'Unlimited' : maxSponsors === 1 ? 'Exclusive (one sponsor only)' : `Up to ${maxSponsors} sponsors`}
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allowCustomShare}
                    onChange={e => setAllowCustomShare(e.target.checked)}
                    className="rounded border-gray-300 text-amber-500"
                  />
                  <span className="ml-2 text-sm">Allow sponsors to choose custom share percentage</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  If disabled, each sponsor gets {maxSponsors > 0 ? Math.floor(100 / maxSponsors) : 100}% share
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:bg-amber-300"
            >
              {isSubmitting ? 'Creating...' : 'Create Ad Slot'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
