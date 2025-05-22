import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Delete the site (this will cascade delete related adSlots due to our schema)
  await prisma.site.delete({
    where: {
      id: params.siteId,
      ownerId: session.user.id // Ensure user owns the site
    }
  });

  return NextResponse.json({ success: true });
} 