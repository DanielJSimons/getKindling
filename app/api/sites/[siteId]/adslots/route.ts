import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const { 
      position, 
      priceUsd, 
      maxSponsors = 1, 
      allowCustomShare = false 
    } = await req.json();

    // Validate inputs
    if (!position) {
      return NextResponse.json({ error: 'Position is required' }, { status: 400 });
    }

    if (!priceUsd || priceUsd < 1) {
      return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 });
    }

    if (maxSponsors < 0) {
      return NextResponse.json({ error: 'Max sponsors cannot be negative' }, { status: 400 });
    }

    // Create the ad slot
    const slot = await prisma.adSlot.create({
      data: { 
        siteId: params.siteId, 
        position, 
        priceUsd,
        maxSponsors,
        allowCustomShare
      },
    });
    
    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error('Error creating ad slot:', error);
    return NextResponse.json({ 
      error: 'Failed to create ad slot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
