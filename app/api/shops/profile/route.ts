import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// PATCH /api/shops/profile — Update seller profile (FR-31)
export async function PATCH(req: NextRequest) {
  try {
    // Auth check
    const sessionCookie = cookies().get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.authToken.findUnique({
      where: { token: sessionCookie.value },
      include: { seller: { include: { shops: true } } },
    });

    if (!session || session.expiresAt < new Date() || session.used) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const shop = session.seller.shops[0];
    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    // Parse request body
    const body = await req.json();
    const { displayName, publicDescription, description, instagramUrl, facebookUrl, twitterUrl } = body;

    // Validate displayName length (FR-31: max 100 chars)
    if (displayName && displayName.length > 100) {
      return NextResponse.json(
        { error: 'Shop name must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Validate publicDescription length (FR-31: max 500 chars)
    if (publicDescription && publicDescription.length > 500) {
      return NextResponse.json(
        { error: 'Shop description must be 500 characters or less' },
        { status: 400 }
      );
    }

    // Validate URLs if provided
    const urlFields = { instagramUrl, facebookUrl, twitterUrl };
    for (const [key, value] of Object.entries(urlFields)) {
      if (value && value.trim()) {
        try {
          new URL(value);
        } catch {
          return NextResponse.json(
            { error: `Invalid URL format for ${key}` },
            { status: 400 }
          );
        }
      }
    }

    // Update shop profile
    const updated = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        displayName: displayName?.trim() || null,
        publicDescription: publicDescription?.trim() || null,
        description: description || null, // Legacy field
        instagramUrl: instagramUrl?.trim() || null,
        facebookUrl: facebookUrl?.trim() || null,
        twitterUrl: twitterUrl?.trim() || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      shop: {
        id: updated.id,
        displayName: updated.displayName,
        publicDescription: updated.publicDescription,
        description: updated.description,
        instagramUrl: updated.instagramUrl,
        facebookUrl: updated.facebookUrl,
        twitterUrl: updated.twitterUrl,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
