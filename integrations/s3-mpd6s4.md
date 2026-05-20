# S3
> **Kind:** `text`
> **Last refreshed:** (never)
## Docs

Object Storage (AWS S3 / DigitalOcean Spaces / MinIO)
Canonical integration spec. Supersedes every earlier S3 doc. Baked in: runtime env reads, provider switch, two-tier access, single-file rule.
Goal
Upload + serve files for the app. One bucket, namespaced by key prefix. Works with AWS S3, DigitalOcean Spaces, or local MinIO — same code, switched by env. Two access tiers:
* public — product images, shop branding. Anyone can view. Served by the CDN directly (fast, no server load).
* private — user-to-user / group-shared images. Gated by an auth + ACL check. Served only through a proxy endpoint.
⛔ Non-negotiable rules (these caused 9 rounds of bugs — do not repeat)
1. ONE storage file. src/lib/storage.ts is the single canonical module. Never create a second copy (lib/storage.ts, app/lib/s3.ts, …). The app resolves @/lib/storage → src/lib/storage.ts; a duplicate elsewhere = the app silently imports the wrong copy and every fix lands in dead code.
2. Read process.env INSIDE functions, never at module scope. Module-level const x = process.env.FOO is frozen into the bundle at next build time — the deployed container's runtime env is ignored. Every env read happens inside getStorageClient() / per-request.
3. Never put storage env vars in next.config.js's env: block. Same build-time freeze. Server code reads process.env at runtime directly.
4. A code change is not live until docker compose build runs. up -d / restart reuse the stale image. Deploy = pull → build → up.
Env vars (read at runtime only)
* STORAGE_PROVIDER — aws | digitalocean | minio (default aws)
* STORAGE_ACCESS_KEY_ID — access key (DO Spaces key for digitalocean)
* STORAGE_SECRET_ACCESS_KEY
* STORAGE_BUCKET — bucket / Space name
* STORAGE_REGION — us-east-1, fra1, nyc3, … (provider's region code)
* STORAGE_ENDPOINT — region-only endpoint; needed for digitalocean + minio. MUST NOT contain the bucket name. DO: https://fra1.digitaloceanspaces.com MinIO: http://localhost:9000
* STORAGE_FORCE_PATH_STYLE— "true" for MinIO; "false" for AWS + DO
* STORAGE_PUBLIC_BASE_URL — optional CDN/base URL for public files (e.g. https://bukettest.fra1.digitaloceanspaces.com)
Add every key to .env.example (committed) and docker-compose.yml's app service environment: block (committed) so git pull can't wipe the wiring.
Key format — persistent reference
<tier>/<category>/<uuid>.<ext>
* public/products/<uuid>.jpg
* public/shop-branding/<uuid>.png
* private/messages/<uuid>.jpg
* <uuid> is v4, generated at upload. NEVER the original filename (collisions + leaks the customer's filename into the URL).
* <ext> from the validated Content-Type, not the filename.
* Store the FULL key on the DB row.
Two access tiers
Tier	ACL on PutObject	Served by	Use for
public	public-read	direct CDN URL	product images, branding
private	private	/api/files/[...key] proxy + ACL check	user/group images
DigitalOcean Spaces does support the public-read canned ACL on PutObject — the "Spaces doesn't support ACLs" claim is false. Use it.
Private-tier access model
Compute access LIVE from group membership — never store a frozen sharedWith[] array (that breaks revocation when a member leaves).
model FileObject {
  id            String   @id @default(uuid())
  key           String   @unique
  ownerId       String
  visibility    String   @default("private") // "public" | "private"
  sharedGroupId String?
  createdAt     DateTime @default(now())
  shares        FileShare[]
}
model FileShare {            // explicit A→B direct shares
  id     String @id @default(uuid())
  fileId String
  userId String
  file   FileObject @relation(fields: [fileId], references: [id], onDelete: Cascade)
  @@unique([fileId, userId])
}
model Group {
  id      String @id @default(uuid())
  name    String
  members GroupMembership[]
}
model GroupMembership {
  id      String @id @default(uuid())
  groupId String
  userId  String
  group   Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  @@unique([groupId, userId])
}
Access for a private file = owner OR a FileShare row OR a CURRENT GroupMembership in sharedGroupId. Member leaves the group → their GroupMembership row is deleted → next request the live lookup fails → instant revocation, no extra work.
Failure modes
Symptom	Cause	Code response
ENOTFOUND bucket.s3.<region>.amazonaws.com	provider=aws but region is a DO region, OR endpoint missing	set STORAGE_PROVIDER + STORAGE_ENDPOINT correctly
ENOTFOUND bucket.bucket.<region>...	endpoint contains the bucket name	endpoint must be region-only
PermanentRedirect	wrong region for the bucket	STORAGE_REGION = bucket's actual region
SignatureDoesNotMatch	AWS keys used against DO endpoint (or vice versa)	use the provider's own key pair
403 AccessDenied (PutObject)	IAM policy missing PutObject	fix IAM — server config error, throw 500
403/404 AccessDenied (GetObject)	wrong key OR private object	return 404 (don't leak existence)
Access Denied on a public URL	object uploaded without public-read ACL	re-upload with ACL, or set bucket policy
Bad Content-Type	HTML/PHP uploaded as image	magic-byte check before PutObject
Upload too large	no size guard	reject > MAX_BYTES with 413 BEFORE buffering
Acceptance criteria
* [ ] Exactly one storage module: find . -name 'storage.ts' -not -path '*/node_modules/*' → 1 path
* [ ] grep -nE '^(const|let|var).*process\.env' src/lib/storage.ts → 0 matches (all env reads inside functions)
* [ ] No storage vars in next.config.js env: block
* [ ] Upload to public/products/ → direct CDN URL loads in an incognito browser
* [ ] Upload to private/messages/ → direct URL returns AccessDenied; /api/files/<key> returns it only for owner + shared users + current group members
* [ ] Remove a user from a group → their next /api/files request for a group-shared file returns 404
* [ ] 50 MB upload rejected with 413 (MAX_BYTES = 10 MB)
* [ ] PHP file with .jpg extension rejected (415, magic-byte check)
* [ ] Same tests pass with STORAGE_PROVIDER=minio
* [ ] After docker compose build, docker exec <c> env | grep STORAGE_PROVIDER shows the live value

Reference implementation
src/lib/storage.ts — the ONE canonical module
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, NoSuchKey } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

// ── Runtime config — every value read INSIDE a function, never module scope ──
function isDigitalOcean() { return process.env.STORAGE_PROVIDER === 'digitalocean' }
function isMinio()        { return process.env.STORAGE_PROVIDER === 'minio' }

function getStorageClient(): S3Client {
  const provider = process.env.STORAGE_PROVIDER || 'aws'
  const region   = process.env.STORAGE_REGION || (provider === 'aws' ? 'us-east-1' : 'nyc3')
  // Endpoint: region-only. AWS leaves it undefined (SDK derives it).
  let endpoint: string | undefined = process.env.STORAGE_ENDPOINT || undefined
  if (!endpoint && provider === 'digitalocean') endpoint = `https://${region}.digitaloceanspaces.com`
  if (!endpoint && provider === 'minio')        endpoint = 'http://localhost:9000'
  return new S3Client({
    region,
    endpoint,
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true' || isMinio(),
    credentials: {
      accessKeyId:     process.env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
    },
  })
}
function getBucket(): string {
  const b = process.env.STORAGE_BUCKET
  if (!b) throw new Error('STORAGE_BUCKET not set')
  return b
}

export const MAX_BYTES = 10 * 1024 * 1024
export const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
  'image/gif': 'gif', 'application/pdf': 'pdf',
}
// First path segment after the tier — controls validation + which routes accept it.
export const PUBLIC_CATEGORIES  = new Set(['products', 'shop-branding'])
export const PRIVATE_CATEGORIES = new Set(['messages', 'orders', 'profile'])

export function magicBytesMatch(buf: Buffer, mime: string): boolean {
  if (mime === 'image/jpeg')      return buf[0] === 0xFF && buf[1] === 0xD8
  if (mime === 'image/png')       return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47
  if (mime === 'image/webp')      return buf.slice(8, 12).toString() === 'WEBP'
  if (mime === 'image/gif')       return buf.slice(0, 3).toString() === 'GIF'
  if (mime === 'application/pdf') return buf.slice(0, 4).toString() === '%PDF'
  return false
}

export interface UploadInput {
  buffer: Buffer
  mimeType: string
  category: string          // e.g. 'products' | 'messages'
}
export interface UploadResult {
  key: string               // full key, store this on the DB row
  visibility: 'public' | 'private'
  publicUrl: string | null  // direct CDN URL for public; null for private
}

/** Upload a file. Tier (public/private) is derived from the category. */
export async function uploadObject(input: UploadInput): Promise<UploadResult> {
  const { buffer, mimeType, category } = input
  if (buffer.length > MAX_BYTES) {
    throw Object.assign(new Error('file too large'), { httpStatus: 413 })
  }
  const ext = ALLOWED_TYPES[mimeType]
  if (!ext) throw Object.assign(new Error('unsupported type'), { httpStatus: 415 })
  if (!magicBytesMatch(buffer, mimeType)) {
    throw Object.assign(new Error('content does not match type'), { httpStatus: 415 })
  }
  const isPublic = PUBLIC_CATEGORIES.has(category)
  if (!isPublic && !PRIVATE_CATEGORIES.has(category)) {
    throw Object.assign(new Error('invalid category'), { httpStatus: 400 })
  }
  const tier = isPublic ? 'public' : 'private'
  const key = `${tier}/${category}/${randomUUID()}.${ext}`

  await getStorageClient().send(new PutObjectCommand({
    Bucket:       getBucket(),
    Key:          key,
    Body:         buffer,
    ContentType:  mimeType,
    CacheControl: 'public, max-age=31536000, immutable',
    ACL:          isPublic ? 'public-read' : 'private',
  }))

  let publicUrl: string | null = null
  if (isPublic) {
    const base = process.env.STORAGE_PUBLIC_BASE_URL
      || (isDigitalOcean()
            ? `https://${getBucket()}.${process.env.STORAGE_REGION}.digitaloceanspaces.com`
            : `https://${getBucket()}.s3.${process.env.STORAGE_REGION}.amazonaws.com`)
    publicUrl = `${base}/${key}`
  }
  return { key, visibility: tier, publicUrl }
}

/** Stream a private object. Caller must have already done the ACL check. */
export async function getObjectStream(key: string): Promise<{
  stream: ReadableStream; contentType: string; contentLength?: number
} | null> {
  try {
    const obj = await getStorageClient().send(new GetObjectCommand({ Bucket: getBucket(), Key: key }))
    if (!obj.Body) return null
    return {
      stream: obj.Body.transformToWebStream(),
      contentType: obj.ContentType ?? 'application/octet-stream',
      contentLength: obj.ContentLength,
    }
  } catch (e: any) {
    if (e instanceof NoSuchKey || e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) return null
    if (e.$metadata?.httpStatusCode === 403) return null   // wrong key — don't leak
    throw e
  }
}

export async function deleteObject(key: string): Promise<void> {
  try {
    await getStorageClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
  } catch (e: any) {
    console.warn('[storage] delete failed:', key, e.message)
  }
}
app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadObject, deleteObject, MAX_BYTES } from '@/lib/storage'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { userId } = await requireAuth()
  const form = await req.formData()
  const file = form.get('file')
  const category = String(form.get('category') || 'products')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large' }, { status: 413 })
  }
  const buffer = Buffer.from(await file.arrayBuffer())

  let result
  try {
    result = await uploadObject({ buffer, mimeType: file.type, category })
  } catch (e: any) {
    const status = e.httpStatus ?? 500
    if (status >= 500) console.error('[upload] failed', { name: e.name, message: e.message })
    return NextResponse.json({ error: e.message ?? 'upload_failed' }, { status })
  }

  // Record the object for ACL checks (private tier) + ownership.
  await prisma.fileObject.create({
    data: { key: result.key, ownerId: userId, visibility: result.visibility },
  })

  // Profile image: atomic swap + best-effort delete of the old object.
  if (category === 'profile') {
    const prev = (await prisma.user.findUnique({ where: { id: userId } }))?.profileImageKey
    await prisma.user.update({ where: { id: userId }, data: { profileImageKey: result.key } })
    if (prev && prev !== result.key) deleteObject(prev)
  }

  return NextResponse.json({ key: result.key, url: result.publicUrl ?? `/api/files/${result.key}` })
}
app/api/files/[...key]/route.ts — proxy + ACL gate (private tier)
import { NextRequest, NextResponse } from 'next/server'
import { getObjectStream } from '@/lib/storage'
import { getSessionOrNull } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { key: string[] } }) {
  const key = params.key.join('/')
  if (key.includes('..')) return new NextResponse('Not Found', { status: 404 })

  const file = await prisma.fileObject.findUnique({
    where: { key },
    include: { shares: true },
  })
  if (!file) return new NextResponse('Not Found', { status: 404 })

  if (file.visibility !== 'public') {
    // ── Private: auth + ACL ──
    const session = await getSessionOrNull(req)
    if (!session) return new NextResponse('Not Found', { status: 404 })  // don't leak existence
    const userId = session.userId

    let allowed = file.ownerId === userId
    if (!allowed && file.shares.some((s) => s.userId === userId)) allowed = true
    if (!allowed && file.sharedGroupId) {
      // LIVE membership lookup — leaving the group revokes instantly.
      const m = await prisma.groupMembership.findUnique({
        where: { groupId_userId: { groupId: file.sharedGroupId, userId } },
      })
      if (m) allowed = true
    }
    if (!allowed) return new NextResponse('Not Found', { status: 404 })
  }

  const obj = await getObjectStream(key)
  if (!obj) return new NextResponse('Not Found', { status: 404 })
  return new NextResponse(obj.stream, {
    status: 200,
    headers: {
      'Content-Type':   obj.contentType,
      'Content-Length': obj.contentLength ? String(obj.contentLength) : '',
      'Cache-Control':  file.visibility === 'public'
        ? 'public, max-age=31536000, immutable'
        : 'private, max-age=0, must-revalidate',  // private — never CDN-cache
    },
  })
}
Frontend usage
// Upload
const fd = new FormData()
fd.append('file', selectedFile)
fd.append('category', 'products')          // public tier
const { url } = await (await fetch('/api/upload', { method: 'POST', body: fd })).json()

// Public image — url is the direct CDN link, use it directly
<img src={url} alt="product" />

// Private image — store the key, render via the proxy
<img src={`/api/files/${key}`} alt="shared" />
Dependency
npm install @aws-sdk/client-s3
Keys / IAM
* AWS: IAM user, policy granting s3:PutObject + s3:GetObject + s3:DeleteObject on arn:aws:s3:::<bucket>/* and s3:ListBucket on the bucket. Never s3:*.
* DigitalOcean Spaces: DO console → API → Spaces Keys → generate a key scoped to this Space only. Never "all Spaces access".
Deploy checklist (every time)
1. git pull — picks up code + the committed docker-compose.yml
2. docker compose build — REQUIRED; a code change is not live without it
3. docker compose up -d
4. docker exec <c> env | grep STORAGE_ — confirm runtime env is correct
Use the Qadar "Pull & Redeploy" button — it does steps 1-3 in order. Never deploy with bare up -d (skips the build → stale image).
