// Image upload endpoint for product images
// FR-4: Product image upload handler
// Day 67: Added S3 upload support with fallback to local filesystem

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { uploadToS3, isS3Configured } from '@/lib/s3'

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename for fallback
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`

    let url: string

    // Try S3 upload first if configured
    if (isS3Configured()) {
      try {
        const result = await uploadToS3(buffer, originalName, file.type)
        url = result.url
        console.log('Image uploaded to S3:', url)
      } catch (s3Error) {
        console.error('S3 upload failed, falling back to local storage:', s3Error)
        // Fall through to local storage
        url = await saveLocally(buffer, filename)
      }
    } else {
      // S3 not configured, use local storage
      url = await saveLocally(buffer, filename)
    }

    return NextResponse.json({
      success: true,
      url,
      filename,
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

/**
 * Save file to local filesystem (fallback)
 */
async function saveLocally(buffer: Buffer, filename: string): Promise<string> {
  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }

  // Save file
  const filepath = join(uploadsDir, filename)
  await writeFile(filepath, buffer)

  // Return public URL
  return `/uploads/${filename}`
}
