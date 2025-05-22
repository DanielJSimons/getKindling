import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';

// Handler for updating user profile
export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request data
    const data = await request.json();
    const { name } = data;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Update user in database
    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data: { name }
    });
    
    // Return success response (exclude sensitive fields)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      success: true
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { 
      status: 500 
    });
  }
} 