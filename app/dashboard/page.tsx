'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

type Metrics = {
  totalSites: number;
  totalSponsors: number;
  totalEarnings: number;
  activeAds: number;
};

type Site = {
  id: string;
  name: string;
  url: string;
  adSlots: Array<any>;
  // Other fields as needed
};

export default function Dashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    totalSites: 0,
    totalSponsors: 0,
    totalEarnings: 0,
    activeAds: 0,
  });

  useEffect(() => {
    // Load sites with error handling
    const loadSites = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const response = await fetch('/api/sites', { cache: 'no-store' });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: Failed to load sites`);
        }
        
        const data = await response.json();
        setSites(data);
        
        // Update metrics based on actual site data
        setMetrics(prev => ({
          ...prev,
          totalSites: data.length,
          activeAds: data.reduce((sum: number, site: Site) => sum + site.adSlots.length, 0)
        }));
      } catch (err) {
        console.error('Failed to load sites:', err);
        setLoadError('Failed to load your sites. Please try again later.');
        toast.error('Failed to load sites');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load metrics (would be from API in production)
    // TODO: Replace with actual API call when available
    const loadMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        totalSponsors: 12,
        totalEarnings: 2500,
      }));
    };
    
    loadSites();
    loadMetrics();
  }, []);

  async function addSite(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.code === 'URL_ALREADY_EXISTS') {
          setError('A site with this URL already exists');
        } else {
          setError(data.error || 'Failed to add site');
        }
        return;
      }
      
      setSites((p) => [data, ...p]);
      setMetrics(prev => ({
        ...prev,
        totalSites: prev.totalSites + 1
      }));
      setShow(false);
      setName('');
      setUrl('');
      toast.success('Site added successfully');
    } catch (error) {
      setError('Failed to add site');
      console.error('Error adding site:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteSite(siteId: string, e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      return;
    }

    setDeletingSiteId(siteId);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Get the site and count its ad slots before removing
        const siteToDelete = sites.find(site => site.id === siteId);
        const adSlotsCount = siteToDelete?.adSlots.length || 0;
        
        setSites((prevSites) => prevSites.filter(site => site.id !== siteId));
        
        // Update metrics
        setMetrics(prev => ({
          ...prev,
          totalSites: prev.totalSites - 1,
          activeAds: prev.activeAds - adSlotsCount
        }));
        
        toast.success('Site deleted successfully');
      } else {
        toast.error('Failed to delete site');
      }
    } catch (error) {
      toast.error('Failed to delete site');
      console.error('Error deleting site:', error);
    } finally {
      setDeletingSiteId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      
      {/* Metrics Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Site Management */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Sites</h2>
        <button
          onClick={() => setShow(true)}
          className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          + Add site
        </button>
      </div>

      {/* Loading and error states */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="rounded bg-amber-50 px-4 py-2 text-amber-700">
            <span className="material-symbols-outlined animate-spin mr-2 inline-block">progress_activity</span>
            Loading your sites...
          </div>
        </div>
      )}
      
      {loadError && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span>{loadError}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Site list */}
      {!isLoading && !loadError && sites.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-gray-400">
            language
          </span>
          <h3 className="mb-1 text-lg font-medium">No sites yet</h3>
          <p className="mb-4 text-gray-500">Add your first website to start receiving sponsorships</p>
          <button
            onClick={() => setShow(true)}
            className="inline-flex items-center rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
          >
            <span className="material-symbols-outlined mr-1">add</span>
            Add your first site
          </button>
        </div>
      )}
      
      {!isLoading && !loadError && sites.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/sites/${site.id}`}
              className="group relative flex flex-col rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  onClick={(e) => deleteSite(site.id, e)}
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600
                    ${deletingSiteId === site.id ? 'animate-pulse bg-red-100' : ''}
                  `}
                  disabled={deletingSiteId === site.id}
                  aria-label="Delete site"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              
              <h3 className="mb-1 text-lg font-medium text-gray-900">{site.name}</h3>
              <p className="mb-4 text-xs text-gray-500">{site.url}</p>
              
              <div className="mt-auto flex flex-wrap justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">{site.adSlots.length}</p>
                  <p className="text-gray-500">Ad slots</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {/* Example data - would come from API */}
                    {Math.floor(Math.random() * 10000)}
                  </p>
                  <p className="text-gray-500">Impressions</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">${(Math.random() * 1000).toFixed(2)}</p>
                  <p className="text-gray-500">Revenue</p>
                </div>
              </div>
            </Link>
          ))}
          
          <button
            onClick={() => setShow(true)}
            className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-5 text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-500"
          >
            <span className="material-symbols-outlined mb-2 text-3xl">add_circle</span>
            <span>Add another site</span>
          </button>
        </div>
      )}

      {/* Add site modal */}
      {show && (
        <div className="fixed inset-0 grid place-items-center bg-black/40">
          <form onSubmit={addSite} className="w-80 space-y-4 rounded bg-white p-6">
            <h3 className="text-lg font-semibold">Add site</h3>
            
            {error && (
              <div className="rounded bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <input
              required
              className="w-full rounded border p-2"
              placeholder="Site name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              required
              type="url"
              className="w-full rounded border p-2"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShow(false);
                  setError(null);
                  setName('');
                  setUrl('');
                }}
                className="rounded border px-3 py-1"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                className="rounded bg-amber-500 px-3 py-1 text-white disabled:bg-amber-300"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
