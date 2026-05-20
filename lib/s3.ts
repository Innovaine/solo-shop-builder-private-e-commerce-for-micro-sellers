// S3 upload utility using AWS SDK v3
// FR-4: Product image upload to S3
// Supports both AWS S3 and DigitalOcean Spaces

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/**
 * Get S3 client configuration at runtime
 * This ensures env vars are read when the function is called, not at module load time
 */
function getS3Client(): S3Client {
  // Read env values at runtime
  const s3Provider = process.env.S3_PROVIDER || 'aws'
  const isDigitalOcean = s3Provider === 'digitalocean'

  // DigitalOcean Spaces configuration
  const doRegion = process.env.DO_SPACES_REGION || 'nyc3'
  const doEndpoint = process.env.DO_SPACES_ENDPOINT || `https://${doRegion}.digitaloceanspaces.com`

  // AWS S3 configuration
  const awsRegion = process.env.AWS_REGION || 'us-east-1'

  return new S3Client({
    region: isDigitalOcean ? doRegion : awsRegion,
    endpoint: isDigitalOcean ? doEndpoint : undefined,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    // DigitalOcean Spaces does NOT support path-style; it uses virtual-hosted style
    forcePathStyle: false,
  })
}

/**
 * Get bucket name at runtime
 */
function getBucketName(): string {
  return process.env.AWS_S3_BUCKET || 'soloshopbox-uploads'
}

/**
 * Construct CDN URL based on provider at runtime
 */
function getCdnUrl(): string {
  const s3Provider = process.env.S3_PROVIDER || 'aws'
  const isDigitalOcean = s3Provider === 'digitalocean'
  const bucketName = getBucketName()
  
  // If explicit CDN URL is provided, use it
  if (process.env.AWS_CLOUDFRONT_URL) {
    return process.env.AWS_CLOUDFRONT_URL
  }
  
  // For DigitalOcean Spaces, use the CDN endpoint format
  if (isDigitalOcean) {
    const doRegion = process.env.DO_SPACES_REGION || 'nyc3'
    return `https://${bucketName}.${doRegion}.cdn.digitaloceanspaces.com`
  }
  
  // Default to AWS S3 URL
  return `https://${bucketName}.s3.amazonaws.com`
}

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
  // Get runtime values
  const s3Client = getS3Client()
  const bucketName = getBucketName()
  const cdnUrl = getCdnUrl()
  
  // DEBUG: Print S3 configuration values before calling
  const s3Provider = process.env.S3_PROVIDER || 'aws'
  const isDigitalOcean = s3Provider === 'digitalocean'
  const doRegion = process.env.DO_SPACES_REGION || 'nyc3'
  const doEndpoint = process.env.DO_SPACES_ENDPOINT || `https://${doRegion}.digitaloceanspaces.com`
  const awsRegion = process.env.AWS_REGION || 'us-east-1'
  
  console.log('[S3 Upload Debug] Configuration:', {
    s3Provider,
    isDigitalOcean,
    region: isDigitalOcean ? doRegion : awsRegion,
    endpoint: isDigitalOcean ? doEndpoint : 'default AWS endpoint',
    bucket: bucketName,
    cdnUrl,
  })
  
  // Sanitize filename and generate unique key
  const timestamp = Date.now()
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `products/${timestamp}-${sanitizedName}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    // FR-4: Make product images publicly accessible via CDN
    // DigitalOcean Spaces DOES support public-read ACL (per integration docs)
    ACL: 'public-read',
  })

  await s3Client.send(command)

  // Return CDN URL if CloudFront is configured, otherwise S3 direct URL
  const url = `${cdnUrl}/${key}`

  return {
    url,
    key,
    bucket: bucketName,
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
