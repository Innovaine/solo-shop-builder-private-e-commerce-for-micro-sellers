// S3 upload utility using AWS SDK v3
// FR-4: Product image upload to S3

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'soloshopbox-uploads'
const CDN_URL = process.env.AWS_CLOUDFRONT_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`

export interface UploadResult {
  url: string
  key: string
  bucket: string
}

/**
 * Upload file buffer to S3
 * @param buffer File buffer
 * @param filename Original filename (will be sanitized)
 * @param mimeType File MIME type
 * @returns Promise<UploadResult>
 */
export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  // Sanitize filename and generate unique key
  const timestamp = Date.now()
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `products/${timestamp}-${sanitizedName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read', // Make objects publicly readable
  })

  await s3Client.send(command)

  // Return CDN URL if CloudFront is configured, otherwise S3 direct URL
  const url = `${CDN_URL}/${key}`

  return {
    url,
    key,
    bucket: BUCKET_NAME,
  }
}

/**
 * Check if S3 is configured
 * @returns boolean
 */
export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET
  )
}
