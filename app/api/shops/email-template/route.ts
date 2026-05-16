import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/src/lib/db';

// PATCH /api/shops/email-template — Update email template (FR-35)
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
    const { emailTemplateBody } = body;

    if (!emailTemplateBody || typeof emailTemplateBody !== 'string') {
      return NextResponse.json(
        { error: 'Email template body is required' },
        { status: 400 }
      );
    }

    // Validate template length (max 10KB)
    if (emailTemplateBody.length > 10240) {
      return NextResponse.json(
        { error: 'Email template is too long (max 10KB)' },
        { status: 400 }
      );
    }

    // Update email template
    const updated = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        emailTemplateBody,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Email template updated successfully',
      shop: {
        id: updated.id,
        emailTemplateBody: updated.emailTemplateBody,
      },
    });
  } catch (error: any) {
    console.error('Email template update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
