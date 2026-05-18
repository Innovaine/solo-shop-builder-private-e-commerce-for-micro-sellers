import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// PATCH /api/shops/branding — Update shop branding (FR-33 + FR-6+)
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

    // Parse multipart form data
    const formData = await req.formData();
    const primaryColor = formData.get('primaryColor') as string;
    const accentColor = formData.get('accentColor') as string;
    const logoUrl = formData.get('logoUrl') as string;
    const tagline = formData.get('tagline') as string;
    const logoFile = formData.get('logo') as File | null;

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

    // Validate tagline length (FR-26: max 100 chars)
    if (tagline && tagline.length > 100) {
      return NextResponse.json(
        { error: 'Tagline must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Handle logo file upload (FR-6+)
    let logoImageUrl = null;
    if (logoFile && logoFile.size > 0) {
      // Validate file size (max 2MB)
      if (logoFile.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Logo file must be less than 2MB' },
          { status: 400 }
        );
      }

      // Validate MIME type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(logoFile.type)) {
        return NextResponse.json(
          { error: 'Logo must be a PNG or JPEG image' },
          { status: 400 }
        );
      }

      // Create upload directory
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'shops', shop.id);
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const ext = logoFile.name.split('.').pop() || 'png';
      const filename = `logo-${crypto.randomBytes(8).toString('hex')}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Save file
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      await writeFile(filepath, buffer);

      // Store relative path (served from /public)
      logoImageUrl = `/uploads/shops/${shop.id}/${filename}`;
    }

    // Update shop branding
    const updated = await prisma.shop.update({
      where: { id: shop.id },
      data: {
        primaryColor: primaryColor || '#3B4C63',
        accentColor: accentColor || '#10B981',
        logoUrl: logoUrl?.trim() || null,
        logoImageUrl: logoImageUrl || undefined, // Only update if new file uploaded
        tagline: tagline?.trim() || null,
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
        logoImageUrl: updated.logoImageUrl,
        tagline: updated.tagline,
      },
      logoImageUrl: updated.logoImageUrl, // Return for frontend preview
    });
  } catch (error: any) {
    console.error('Branding update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
