'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

// Define page types and ad positions
type PageType = 'blog' | 'landing' | 'docs' | 'portfolio' | 'ecommerce';

type AdPosition = 'BANNER' | 'SIDEPANEL' | 'INLINE';

// Layout definition
type Layout = {
  id: string;
  name: string;
  description: string;
  pageType: PageType;
  positions: AdPosition[];
};

// Example data for layouts
const defaultLayouts: Layout[] = [
  {
    id: '1',
    name: 'Blog Standard',
    description: 'Classic blog layout with header banner and sidebar ads',
    pageType: 'blog',
    positions: ['BANNER', 'SIDEPANEL'],
  },
  {
    id: '2',
    name: 'Blog Rich Content',
    description: 'Content-focused blog with inline and banner ads',
    pageType: 'blog',
    positions: ['BANNER', 'INLINE'],
  },
  {
    id: '3',
    name: 'Landing Page Impact',
    description: 'High-impact layout for landing pages with prominent banner',
    pageType: 'landing',
    positions: ['BANNER'],
  },
  {
    id: '4',
    name: 'Landing Page Full Funnel',
    description: 'Complete layout with ads at multiple points in the conversion funnel',
    pageType: 'landing',
    positions: ['BANNER', 'INLINE'],
  },
  {
    id: '5',
    name: 'Documentation Simple',
    description: 'Clean documentation layout with non-intrusive sidebar ads',
    pageType: 'docs',
    positions: ['SIDEPANEL'],
  },
  {
    id: '6',
    name: 'Portfolio Showcase',
    description: 'Elegant portfolio layout with banner and inline sponsorships',
    pageType: 'portfolio',
    positions: ['BANNER', 'INLINE'],
  },
  {
    id: '7',
    name: 'E-commerce Listings',
    description: 'Product listing page with sponsored products and banners',
    pageType: 'ecommerce',
    positions: ['BANNER', 'INLINE', 'SIDEPANEL'],
  }
];

// Example images for different layouts
const exampleImages = {
  blog: {
    BANNER: '/examples/blog-banner.png',
    SIDEPANEL: '/examples/blog-sidepanel.png',
    INLINE: '/examples/blog-inline.png',
  },
  landing: {
    BANNER: '/examples/landing-banner.png',
    INLINE: '/examples/landing-inline.png',
  },
  docs: {
    SIDEPANEL: '/examples/docs-sidepanel.png',
  },
  portfolio: {
    BANNER: '/examples/portfolio-banner.png',
    INLINE: '/examples/portfolio-inline.png',
  },
  ecommerce: {
    BANNER: '/examples/ecommerce-banner.png',
    SIDEPANEL: '/examples/ecommerce-sidepanel.png',
    INLINE: '/examples/ecommerce-inline.png',
  }
};

// Add this type definition after the AdPosition type
interface MockImageSet {
  base: string;
  BANNER?: string;
  SIDEPANEL?: string;
  INLINE?: string;
  [key: string]: string | undefined;
}

type MockImages = {
  [key in PageType]: MockImageSet;
};

// Then replace the mockImages declaration
const mockImages: MockImages = {
  blog: {
    base: '/mockups/blog-base.jpg',
    BANNER: '/mockups/blog-banner.jpg',
    SIDEPANEL: '/mockups/blog-sidepanel.jpg',
    INLINE: '/mockups/blog-inline.jpg',
  },
  landing: {
    base: '/mockups/landing-base.jpg',
    BANNER: '/mockups/landing-banner.jpg',
    INLINE: '/mockups/landing-inline.jpg',
  },
  docs: {
    base: '/mockups/docs-base.jpg',
    SIDEPANEL: '/mockups/docs-sidepanel.jpg',
  },
  portfolio: {
    base: '/mockups/portfolio-base.jpg',
    BANNER: '/mockups/portfolio-banner.jpg',
    INLINE: '/mockups/portfolio-inline.jpg',
  },
  ecommerce: {
    base: '/mockups/ecommerce-base.jpg',
    BANNER: '/mockups/ecommerce-banner.jpg',
    SIDEPANEL: '/mockups/ecommerce-sidepanel.jpg',
    INLINE: '/mockups/ecommerce-inline.jpg',
  }
};

export default function Layouts() {
  const [layouts, setLayouts] = useState<Layout[]>(defaultLayouts);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [activeFilter, setActiveFilter] = useState<PageType | 'all'>('all');
  
  // Filter layouts based on selected page type
  const filteredLayouts = activeFilter === 'all' 
    ? layouts 
    : layouts.filter(layout => layout.pageType === activeFilter);

  // Generate a placeholder if mockup images aren't available
  const getPlaceholder = (pageType: PageType, position: AdPosition) => (
    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600">{pageType} - {position}</div>
        <div className="mt-2 text-xs text-gray-400">Example image not available</div>
      </div>
    </div>
  );

  // Add this useEffect to load layouts from API
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const res = await fetch('/api/layouts');
        if (!res.ok) {
          throw new Error('Failed to fetch layouts');
        }
        const data = await res.json();
        setLayouts(data);
      } catch (error) {
        console.error('Error loading layouts:', error);
        toast.error('Failed to load layouts. Using default templates.');
        // Keep default layouts if API fails
      }
    };
    
    fetchLayouts();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ad Layouts</h1>
        <button className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">
          Create Custom Layout
        </button>
      </div>

      {/* Filtering tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === 'all'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Layouts
            </button>
            <button
              onClick={() => setActiveFilter('blog')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === 'blog'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => setActiveFilter('landing')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === 'landing'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Landing Page
            </button>
            <button
              onClick={() => setActiveFilter('docs')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === 'docs'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documentation
            </button>
            <button
              onClick={() => setActiveFilter('portfolio')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === 'portfolio'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveFilter('ecommerce')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === 'ecommerce'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              E-commerce
            </button>
          </nav>
        </div>
      </div>

      {/* Layouts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLayouts.map((layout) => (
          <div
            key={layout.id}
            className="cursor-pointer rounded-lg border bg-white shadow-sm transition hover:shadow-md overflow-hidden"
            onClick={() => setSelectedLayout(layout)}
          >
            <div className="relative h-48 bg-gray-100">
              {/* Placeholder for layout preview */}
              <div className="absolute inset-0 bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 opacity-60">
                  {/* Base page mockup */}
                  {mockImages[layout.pageType]?.base ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={mockImages[layout.pageType].base}
                        alt={`${layout.pageType} page mockup`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
                
                {/* Highlight ad positions */}
                {layout.positions.map(position => (
                  <div key={position} className="absolute">
                    {position === 'BANNER' && (
                      <div className="absolute top-0 left-0 right-0 h-16 bg-amber-200 bg-opacity-50 border-2 border-amber-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-amber-800">Banner Ad</span>
                      </div>
                    )}
                    {position === 'SIDEPANEL' && (
                      <div className="absolute top-16 right-0 w-24 bottom-0 bg-blue-200 bg-opacity-50 border-2 border-blue-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-800 transform rotate-90">Sidepanel Ad</span>
                      </div>
                    )}
                    {position === 'INLINE' && (
                      <div className="absolute top-1/2 left-0 right-0 h-12 bg-green-200 bg-opacity-50 border-2 border-green-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-green-800">Inline Ad</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900">{layout.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{layout.description}</p>
              <div className="mt-4">
                <h3 className="text-xs font-medium text-gray-500">Ad Positions</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {layout.positions.map((position) => (
                    <span
                      key={position}
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        position === 'BANNER' 
                          ? 'bg-amber-100 text-amber-700' 
                          : position === 'SIDEPANEL'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout detail modal */}
      {selectedLayout && (
        <div className="fixed inset-0 grid place-items-center bg-black/40 z-50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">{selectedLayout.name}</h2>
              <button
                onClick={() => setSelectedLayout(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Layout Overview</h3>
                <p className="text-gray-600">{selectedLayout.description}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Page Type</h4>
                  <p className="text-gray-800 capitalize">{selectedLayout.pageType}</p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <h4 className="text-sm font-medium text-gray-500 w-full">Ad Positions</h4>
                  {selectedLayout.positions.map((position) => (
                    <span
                      key={position}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        position === 'BANNER' 
                          ? 'bg-amber-100 text-amber-700' 
                          : position === 'SIDEPANEL'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Position Examples</h3>
                <div className="grid gap-6">
                  {selectedLayout.positions.map(position => (
                    <div key={position} className="border rounded-lg p-4">
                      <h4 className={`text-sm font-medium mb-2 ${
                        position === 'BANNER' 
                          ? 'text-amber-700' 
                          : position === 'SIDEPANEL'
                          ? 'text-blue-700'
                          : 'text-green-700'
                      }`}>
                        {position} Position
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-2">
                        {mockImages[selectedLayout.pageType] && 
                          position in mockImages[selectedLayout.pageType] ? (
                          <div className="relative aspect-video">
                            <Image
                              src={mockImages[selectedLayout.pageType][position] as string}
                              alt={`${selectedLayout.pageType} ${position} example`}
                              fill
                              className="rounded-lg"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        ) : (
                          getPlaceholder(selectedLayout.pageType, position)
                        )}
                      </div>
                      
                      <div className="mt-3">
                        <h5 className="text-xs font-medium text-gray-500">Recommended Ad Sizes</h5>
                        <p className="text-sm text-gray-700">
                          {position === 'BANNER' && '970×250, 728×90, 468×60, 320×50'}
                          {position === 'SIDEPANEL' && '300×600, 300×250, 160×600'}
                          {position === 'INLINE' && '728×90, 300×250, 468×60'}
                        </p>
                      </div>
                      
                      <div className="mt-3">
                        <h5 className="text-xs font-medium text-gray-500">Best Practices</h5>
                        <ul className="text-sm text-gray-700 list-disc pl-5 mt-1">
                          {position === 'BANNER' && (
                            <>
                              <li>Place above the fold for maximum visibility</li>
                              <li>Use responsive designs that adapt to screen sizes</li>
                              <li>Consider sticky options for increased view time</li>
                            </>
                          )}
                          {position === 'SIDEPANEL' && (
                            <>
                              <li>Keep ad aligned with content flow</li>
                              <li>Consider sticky sidepanels for longer pages</li>
                              <li>Ensure adequate spacing from main content</li>
                            </>
                          )}
                          {position === 'INLINE' && (
                            <>
                              <li>Place between natural content breaks</li>
                              <li>Match width to content for seamless integration</li>
                              <li>Limit to 2-3 inline ads per page to avoid fatigue</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedLayout(null)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button 
                  onClick={() => window.open(`/api/examples/layouts/${selectedLayout.pageType}-${selectedLayout.positions[0].toLowerCase()}`, '_blank')}
                  className="mr-3 px-4 py-2 border border-amber-300 bg-amber-50 rounded-md text-amber-700 hover:bg-amber-100"
                >
                  Preview Layout
                </button>
                <button 
                  onClick={async () => {
                    try {
                      // Example of how you would select this layout through the API
                      const res = await fetch('/api/layouts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: selectedLayout.id }),
                      });
                      
                      if (!res.ok) {
                        throw new Error('Failed to select layout');
                      }
                      
                      // Success! Close the modal and show success toast
                      setSelectedLayout(null);
                      toast.success(`${selectedLayout.name} layout selected successfully!`);
                    } catch (error) {
                      console.error('Error selecting layout:', error);
                      toast.error('Failed to select layout');
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                  Use This Layout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 