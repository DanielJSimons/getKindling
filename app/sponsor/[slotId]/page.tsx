'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function SponsorPage() {
  const { slotId } = useParams<{ slotId: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [adSlot, setAdSlot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [sharePct, setSharePct] = useState(100);
  const [creative, setCreative] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Load the ad slot details
  useEffect(() => {
    if (!slotId) return;
    
    const fetchAdSlot = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we'd have a dedicated endpoint for this
        const response = await fetch(`/api/adslots/${slotId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load ad slot');
        }
        
        const data = await response.json();
        setAdSlot(data);
        
        // Set default share percentage based on maxSponsors
        if (data.maxSponsors > 0) {
          setSharePct(Math.floor(100 / data.maxSponsors));
        }
      } catch (error) {
        console.error('Error loading ad slot:', error);
        toast.error('Failed to load ad slot details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdSlot();
  }, [slotId]);
  
  // Calculate price
  const calculatePrice = () => {
    if (!adSlot) return 0;
    const pricePerDay = adSlot.priceUsd;
    return Math.round((pricePerDay * (sharePct / 100)) * days) / 100; // Convert to dollars
  };
  
  // Handle sponsorship purchase
  const handlePurchase = async () => {
    if (status !== 'authenticated') {
      toast.error('You must be logged in to sponsor');
      // Redirect to login
      router.push('/login');
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      const response = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adSlotId: slotId,
          days,
          sharePct,
          creative,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create sponsorship');
      }
      
      // Success! Show a toast and redirect
      toast.success('Sponsorship created successfully!');
      router.push(`/dashboard/sponsorships/${data.sponsorship.id}`);
    } catch (error) {
      console.error('Error purchasing sponsorship:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to purchase sponsorship');
    } finally {
      setIsPurchasing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600 mx-auto"></div>
          <p className="text-gray-600">Loading ad slot details...</p>
        </div>
      </div>
    );
  }
  
  if (!adSlot) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Ad Slot Not Found</h1>
        <p className="mb-4 text-gray-600">We couldn't find the ad slot you're looking for.</p>
        <button 
          onClick={() => router.push('/')}
          className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8">
      <h1 className="mb-2 text-3xl font-bold">Sponsor this site</h1>
      <p className="mb-8 text-gray-600">Support this creator while promoting your product/service to their audience</p>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Ad slot info */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Ad Slot Details</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Site</p>
            <p className="font-medium">{adSlot.site?.name || 'Unknown Site'}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-medium">{adSlot.position}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Base Price</p>
            <p className="font-medium">${(adSlot.priceUsd / 100).toFixed(2)}/day for 100% share</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Sharing Model</p>
            <p className="font-medium">
              {adSlot.maxSponsors === 0 ? 'Unlimited sponsors' : 
               adSlot.maxSponsors === 1 ? 'Exclusive (one sponsor at a time)' : 
               `Up to ${adSlot.maxSponsors} simultaneous sponsors`}
            </p>
          </div>
          
          {adSlot.maxSponsors > 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Default Share</p>
              <p className="font-medium">{Math.floor(100 / adSlot.maxSponsors)}% per sponsor</p>
            </div>
          )}
          
          {/* Show current sponsors */}
          <div className="mt-6">
            <h3 className="mb-2 font-medium">Current Sponsors</h3>
            {adSlot.sponsorships && adSlot.sponsorships.length > 0 ? (
              <div className="space-y-2">
                {adSlot.sponsorships.map((s: any) => (
                  <div key={s.id} className="rounded bg-amber-50 p-2 text-sm">
                    <div className="font-medium">{s.sponsor?.name || 'Anonymous'}</div>
                    <div className="flex justify-between text-gray-500">
                      <span>{s.sharePct}% share</span>
                      <span>Until {new Date(s.endsAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No active sponsors - be the first!</p>
            )}
          </div>
        </div>
        
        {/* Right: Sponsorship form */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Your Sponsorship</h2>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Duration</label>
            <select 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full rounded border p-2"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
          
          {/* Share percentage slider - only if allowed */}
          {adSlot.allowCustomShare && adSlot.maxSponsors !== 1 && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">
                Share of Voice: {sharePct}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={sharePct}
                onChange={(e) => setSharePct(Number(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Higher share = more visibility, higher price
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Creative Content</label>
            <textarea
              value={creative}
              onChange={(e) => setCreative(e.target.value)}
              placeholder="Enter a URL, HTML code, or text for your ad"
              className="w-full rounded border p-2"
              rows={4}
            />
            <p className="mt-1 text-xs text-gray-500">
              You can use a URL to an image, a landing page, or HTML code
            </p>
          </div>
          
          <div className="mt-6 rounded-lg bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Price:</span>
              <span className="text-xl font-bold text-amber-600">${calculatePrice().toFixed(2)}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              For {days} days at {sharePct}% share of voice
            </p>
          </div>
          
          <button
            onClick={handlePurchase}
            disabled={isPurchasing || !creative || status !== 'authenticated'}
            className="mt-4 w-full rounded bg-amber-500 px-4 py-3 font-medium text-white hover:bg-amber-600 disabled:bg-amber-300"
          >
            {isPurchasing ? 'Processing...' : 'Purchase Sponsorship'}
          </button>
          
          {status !== 'authenticated' && (
            <p className="mt-2 text-center text-sm text-red-500">
              You must be logged in to sponsor
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 