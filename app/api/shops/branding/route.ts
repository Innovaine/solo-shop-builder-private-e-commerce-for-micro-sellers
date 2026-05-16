import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// PATCH /api/shops/branding — Update shop branding (FR-33)
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
    const { primaryColor, accentColor, logoUrl } = body;

    // Validate color format
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (primaryColor && !colorRegex.test(primaryColor)) {
      return NextResponse.json(
        { error: 'Invalid primary color format. Use hex format (#RRGGBB)' },
        { status: 400 }
      );
    }
    if (accentColor && !colorRegex.test(accentColor)) {
      return NextResponse.json(
        { error: 'Invalid accent color format. Use hex format (#RRGGBB)' },
        { status: 400 }
      );
    }

    // Validate logo URL
    if (logoUrl && logoUrl.trim()) {
      try {
        const url = new URL(logoUrl);
        if (url.protocol !== 'https:') {
          return NextResponse.json(
            { error: 'Logo URL must use HTTPS' },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid logo URL format' },
          { status: 400 }
        );
      }
    }

    // Update shop branding
    const updated = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        primaryColor: primaryColor || '#3B4C63',
        accentColor: accentColor || '#10B981',
        logoUrl: logoUrl?.trim() || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Branding updated successfully',
      shop: {
        id: updated.id,
        primaryColor: updated.primaryColor,
        accentColor: updated.accentColor,
        logoUrl: updated.logoUrl,
      },
    });
  } catch (error: any) {
    console.error('Branding update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
