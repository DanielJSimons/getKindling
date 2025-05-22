import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract sponsorship details from request
    const { 
      adSlotId, 
      days = 7, 
      sharePct, 
      creative 
    } = await req.json();

    // Validate required fields
    if (!adSlotId) {
      return NextResponse.json({ error: 'Ad slot ID is required' }, { status: 400 });
    }

    if (days < 1) {
      return NextResponse.json({ error: 'Duration must be at least 1 day' }, { status: 400 });
    }

    // Fetch the ad slot
    const adSlot = await prisma.adSlot.findUnique({
      where: { id: adSlotId },
      include: {
        sponsorships: {
          where: {
            status: 'ACTIVE',
            // Find sponsorships that will overlap with our new one
            OR: [
              {
                startsAt: {
                  lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000) // end date
                },
                endsAt: {
                  gte: new Date() // now
                }
              }
            ]
          }
        }
      }
    });

    if (!adSlot) {
      return NextResponse.json({ error: 'Ad slot not found' }, { status: 404 });
    }

    if (!adSlot.active) {
      return NextResponse.json({ error: 'This ad slot is not active' }, { status: 400 });
    }

    // Calculate share percentage
    let finalSharePct = 100; // Default for exclusive slots
    
    if (adSlot.maxSponsors > 0) {
      // If custom share is allowed and provided, use that
      if (adSlot.allowCustomShare && sharePct) {
        finalSharePct = Math.min(Math.max(1, sharePct), 100); // Between 1 and 100
      } else {
        // Otherwise use the default share based on maxSponsors
        finalSharePct = Math.floor(100 / adSlot.maxSponsors);
      }
    }

    // Check if there's room for this sponsorship
    if (adSlot.maxSponsors > 0) { // Skip if unlimited (maxSponsors === 0)
      const totalActiveSharePct = adSlot.sponsorships.reduce((sum, s) => sum + s.sharePct, 0);
      
      if (totalActiveSharePct + finalSharePct > 100) {
        return NextResponse.json({ 
          error: 'Slot is full for the requested time period',
          available: 100 - totalActiveSharePct,
          requested: finalSharePct
        }, { status: 409 });
      }
    }

    // Calculate price based on share percentage and duration
    const pricePerDay = adSlot.priceUsd;
    const totalPrice = Math.round((pricePerDay * (finalSharePct / 100)) * days);

    // Create the sponsorship order
    const startsAt = new Date(); // Start now
    const endsAt = new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000);

    // Create the pending sponsorship
    const sponsorship = await prisma.sponsorship.create({
      data: {
        sponsorId: session.user.id as string,
        adSlotId: adSlot.id,
        status: 'PENDING', // Will be updated to ACTIVE after payment
        startsAt,
        endsAt,
        sharePct: finalSharePct,
        creative,
        // In a real implementation, we'd generate a Stripe checkout session
        // and store the ID here
        checkoutId: `sim_${Math.random().toString(36).substring(2, 15)}`
      }
    });

    // In a real implementation, we would now:
    // 1. Create a Stripe checkout session
    // 2. Return the checkout URL for redirection
    
    // For now, we'll simulate success
    const simulatedPayment = true;

    if (simulatedPayment) {
      // Update to active immediately (in real app, this would happen in a webhook)
      await prisma.sponsorship.update({
        where: { id: sponsorship.id },
        data: { status: 'ACTIVE' }
      });
    }

    return NextResponse.json({
      success: true,
      sponsorship: {
        id: sponsorship.id,
        sharePct: finalSharePct,
        totalPriceUsd: totalPrice / 100, // Convert to dollars for display
        startDate: startsAt,
        endDate: endsAt,
        // In a real implementation:
        // checkoutUrl: stripeSession.url
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating sponsorship:', error);
    return NextResponse.json({
      error: 'Failed to create sponsorship',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 