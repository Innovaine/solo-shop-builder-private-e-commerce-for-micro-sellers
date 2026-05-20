import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { uploadToS3, isS3Configured } from '@/lib/s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { existsSync } from 'fs';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

// PATCH /api/shops/branding — Update shop branding (FR-33 + FR-6+)
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

    let logoImageUrl: string | undefined;

    // Handle logo file upload
    if (logoFile && logoFile.size > 0) {
      // Validate file size
      if (logoFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Logo file must be less than 2MB' },
          { status: 400 }
        );
      }

      // Validate MIME type
      if (!ALLOWED_TYPES.includes(logoFile.type)) {
        return NextResponse.json(
          { error: 'Logo must be a PNG or JPEG image' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const originalName = logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');

      // Try S3 upload first if configured
      if (isS3Configured()) {
        try {
          const result = await uploadToS3(buffer, originalName, logoFile.type);
          logoImageUrl = result.url;
          console.log('[Branding] Logo uploaded to S3:', logoImageUrl);
        } catch (s3Error) {
          console.error('[Branding] S3 upload failed, falling back to local storage:', s3Error);
          // Fall through to local storage
          logoImageUrl = await saveLogoLocally(buffer, originalName, shop.id);
        }
      } else {
        // S3 not configured, use local storage
        console.log('[Branding] S3 not configured, using local storage');
        logoImageUrl = await saveLogoLocally(buffer, originalName, shop.id);
      }
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

/**
 * Save logo file to local filesystem (fallback)
 */
async function saveLogoLocally(buffer: Buffer, originalName: string, shopId: string): Promise<string> {
  // Create upload directory
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'shops', shopId);
  
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const ext = originalName.split('.').pop() || 'png';
  const filename = `logo-${crypto.randomBytes(8).toString('hex')}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  // Save file
  await writeFile(filepath, buffer);

  // Store relative path (served from /public)
  return `/uploads/shops/${shopId}/${filename}`;
}
