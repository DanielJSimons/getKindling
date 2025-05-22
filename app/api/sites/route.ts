import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch all sites for the current user
    const sites = await prisma.site.findMany({
      where: { ownerId: session.user.id as string },
      include: { adSlots: true },
      orderBy: { createdAt: 'desc' } // Most recent first
    });
    
    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch sites',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, url } = await req.json();

    // Check if a site with this URL already exists
    const existingSite = await prisma.site.findUnique({
      where: { url }
    });

    if (existingSite) {
      return NextResponse.json({ 
        error: 'A site with this URL already exists',
        code: 'URL_ALREADY_EXISTS'
      }, { status: 409 });
    }
    
    // Create the site if it doesn't exist
    const site = await prisma.site.create({
      data: { ownerId: session.user.id as string, name, url },
      include: { adSlots: true }  // Include adSlots in the response
    });
    
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error('Error creating site:', error);
    
    // Handle unique constraint violation specifically
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'A site with this URL already exists',
        code: 'URL_ALREADY_EXISTS'
      }, { status: 409 });
    }
    
    // Handle other errors
    return NextResponse.json({ 
      error: 'Failed to create site',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}