'use client';

import { useEffect, useState, FormEvent } from 'react';

type Site = { id: string; name: string; url: string; adSlots: { id: string }[] };

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sites').then((r) => r.json()).then(setSites);
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
      setShow(false);
      setName('');
      setUrl('');
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
        setSites((prevSites) => prevSites.filter(site => site.id !== siteId));
      } else {
        alert('Failed to delete site');
      }
    } catch (error) {
      alert('Failed to delete site');
    } finally {
      setDeletingSiteId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Site Management</h1>
        <button
          onClick={() => setShow(true)}
          className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          + Add site
        </button>
      </div>

      {/* Detailed site stats */}
      {sites.length > 0 && (
        <div className="mb-12 overflow-hidden rounded-lg border bg-white shadow">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium">Site Performance</h2>
            <p className="mt-1 text-sm text-gray-500">
              Overview of all your sites and their performance metrics
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Site
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ad Slots
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Impressions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clicks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <a href={`/dashboard/sites/${site.id}`} className="flex items-start">
                        <div>
                          <div className="font-medium text-gray-900">{site.name}</div>
                          <div className="text-xs text-gray-500">{site.url}</div>
                        </div>
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {site.adSlots.length}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {/* Example data - would come from API */}
                      {Math.floor(Math.random() * 10000)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {/* Example data - would come from API */}
                      {Math.floor(Math.random() * 500)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {/* Example data - would come from API */}
                      ${(Math.random() * 1000).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Site grid */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">Your Sites</h2>

        {sites.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <h3 className="mb-2 text-lg font-medium">No sites yet</h3>
            <p className="mb-4 text-gray-500">Add your first site to get started with Kindling.</p>
            <button
              onClick={() => setShow(true)}
              className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
            >
              + Add your first site
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((s) => (
              <div key={s.id} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow">
                <div className="p-6">
                  <h3 className="mb-1 font-medium">{s.name}</h3>
                  <p className="mb-4 text-sm text-gray-500">{s.url}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      {s.adSlots.length} ad slots
                    </span>
                    <a 
                      href={`/dashboard/sites/${s.id}`} 
                      className="text-sm font-medium text-amber-600 hover:text-amber-800"
                    >
                      Manage →
                    </a>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteSite(s.id, e)}
                  disabled={deletingSiteId === s.id}
                  className="absolute right-2 top-2 rounded-full p-2 text-red-500 opacity-0 transition hover:bg-red-50 group-hover:opacity-100"
                  title="Delete site"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding a new site */}
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