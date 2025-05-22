import { authOptions } from '@/lib/auth.server';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Check auth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { provider } = data;
    
    if (!provider || !['facebook', 'twitter', 'github'].includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Generate an OAuth state token
    // 2. Store it in session/cookies
    // 3. Redirect to the provider's OAuth authorization URL

    // For demo purposes, we'll simulate a successful connection
    console.log(`Connecting ${provider} for user: ${session.user.email}`);

    // Return success with mock data
    return NextResponse.json({ 
      success: true,
      redirectUrl: `/api/oauth/${provider}/callback?mockAuth=true`,
      provider
    });

  } catch (error) {
    console.error('Error connecting account:', error);
    return NextResponse.json({ 
      error: 'Failed to connect account' 
    }, { 
      status: 500 
    });
  }
} 