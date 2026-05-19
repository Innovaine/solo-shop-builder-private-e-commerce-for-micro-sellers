import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/shops/email-template — Fetch current email template
export async function GET(req: NextRequest) {
  try {
    // Auth check using iron-session
    let sellerId: string;
    try {
      const auth = await requireAuth();
      sellerId = auth.sellerId;
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find seller's shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId },
    });

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 });
    }

    return NextResponse.json({
      shop: {
        id: shop.id,
        emailTemplateBody: shop.emailTemplateBody || '',
      },
    });
  } catch (error: any) {
    console.error('Email template fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/shops/email-template — Update email template (FR-35)
export async function PATCH(req: NextRequest) {
  try {
    // Auth check using iron-session
    let sellerId: string;
    try {
      const auth = await requireAuth();
      sellerId = auth.sellerId;
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find seller's shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId },
    });

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
