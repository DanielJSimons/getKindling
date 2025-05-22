import { NextRequest, NextResponse } from 'next/server';

// Types matching the ones in the frontend
type PageType = 'blog' | 'landing' | 'docs' | 'portfolio' | 'ecommerce';
type AdPosition = 'BANNER' | 'SIDEPANEL' | 'INLINE';

interface Layout {
  id: string;
  name: string;
  description: string;
  pageType: PageType;
  positions: AdPosition[];
  example?: string;
}

// Same layouts as in the frontend, but with additional metadata
const layouts: Layout[] = [
  {
    id: '1',
    name: 'Blog Standard',
    description: 'Classic blog layout with header banner and sidebar ads',
    pageType: 'blog',
    positions: ['BANNER', 'SIDEPANEL'],
    example: '/api/examples/layouts/blog-standard'
  },
  {
    id: '2',
    name: 'Blog Rich Content',
    description: 'Content-focused blog with inline and banner ads',
    pageType: 'blog',
    positions: ['BANNER', 'INLINE'],
    example: '/api/examples/layouts/blog-rich'
  },
  {
    id: '3',
    name: 'Landing Page Impact',
    description: 'High-impact layout for landing pages with prominent banner',
    pageType: 'landing',
    positions: ['BANNER'],
    example: '/api/examples/layouts/landing-impact'
  },
  {
    id: '4',
    name: 'Landing Page Full Funnel',
    description: 'Complete layout with ads at multiple points in the conversion funnel',
    pageType: 'landing',
    positions: ['BANNER', 'INLINE'],
    example: '/api/examples/layouts/landing-funnel'
  },
  {
    id: '5',
    name: 'Documentation Simple',
    description: 'Clean documentation layout with non-intrusive sidebar ads',
    pageType: 'docs',
    positions: ['SIDEPANEL'],
    example: '/api/examples/layouts/docs-simple'
  },
  {
    id: '6',
    name: 'Portfolio Showcase',
    description: 'Elegant portfolio layout with banner and inline sponsorships',
    pageType: 'portfolio',
    positions: ['BANNER', 'INLINE'],
    example: '/api/examples/layouts/portfolio-showcase'
  },
  {
    id: '7',
    name: 'E-commerce Listings',
    description: 'Product listing page with sponsored products and banners',
    pageType: 'ecommerce',
    positions: ['BANNER', 'INLINE', 'SIDEPANEL'],
    example: '/api/examples/layouts/ecommerce-listings'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const pageType = searchParams.get('pageType') as PageType | null;
    const positions = searchParams.getAll('position') as AdPosition[];
    
    // Filter layouts based on query parameters
    let filteredLayouts = [...layouts];
    
    if (pageType) {
      filteredLayouts = filteredLayouts.filter(layout => layout.pageType === pageType);
    }
    
    if (positions.length > 0) {
      // Filter layouts that contain ALL specified positions
      filteredLayouts = filteredLayouts.filter(layout => 
        positions.every(position => layout.positions.includes(position))
      );
    }
    
    return NextResponse.json(filteredLayouts);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    return NextResponse.json({
      error: 'Failed to fetch layouts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Route to get a specific layout by ID
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Layout ID is required' }, { status: 400 });
    }
    
    const layout = layouts.find(l => l.id === id);
    
    if (!layout) {
      return NextResponse.json({ error: 'Layout not found' }, { status: 404 });
    }
    
    return NextResponse.json(layout);
  } catch (error) {
    console.error('Error fetching layout:', error);
    return NextResponse.json({
      error: 'Failed to fetch layout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 