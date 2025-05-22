import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure the route is not cached

export async function GET(request: NextRequest) {
  try {
    // Extract slot ID from query parameters
    const slotId = request.nextUrl.searchParams.get('slot');
    
    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }
    
    // 1. Fetch all ACTIVE orders for the slot where startsAt <= now < endsAt
    const currentDate = new Date();
    const activeSponsors = await prisma.sponsorship.findMany({
      where: {
        adSlotId: slotId,
        status: 'ACTIVE',
        startsAt: { lte: currentDate },
        endsAt: { gt: currentDate },
      },
      include: {
        sponsor: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    
    // If no active sponsors, return empty
    if (activeSponsors.length === 0) {
      return NextResponse.json({ 
        message: 'No active sponsors for this slot',
        hasActiveSponsors: false,
      });
    }
    
    // 2. Build array with duplicates proportional to sharePct
    const pool = activeSponsors.flatMap(sponsor => 
      Array(Math.round(sponsor.sharePct)).fill(sponsor)
    );
    
    // 3. Pick one at random
    const winner = pool[Math.floor(Math.random() * pool.length)];
    
    // 4. Return the creative content with relevant metadata
    return NextResponse.json({
      hasActiveSponsors: true,
      sponsorship: {
        id: winner.id,
        sponsorName: winner.sponsor.name,
        creative: winner.creative,
        sponsorId: winner.sponsorId,
      }
    });
    
  } catch (error) {
    console.error('Error serving ad content:', error);
    return NextResponse.json({
      error: 'Failed to serve ad content',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 