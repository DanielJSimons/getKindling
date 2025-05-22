import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slotId: string } }
) {
  try {
    const slot = await prisma.adSlot.findUnique({
      where: { id: params.slotId },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true,
          }
        },
        sponsorships: {
          where: {
            status: 'ACTIVE',
            endsAt: { gt: new Date() }
          },
          include: {
            sponsor: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    if (!slot) {
      return NextResponse.json({ error: 'Ad slot not found' }, { status: 404 });
    }

    return NextResponse.json(slot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    return NextResponse.json({
      error: 'Failed to fetch ad slot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 