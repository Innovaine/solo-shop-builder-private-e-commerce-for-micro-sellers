# S3
> **Kind:** `text`
> **Last refreshed:** (never)
## Docs

Then in the S3 client builder, conditionally pass `endpoint: process.env.AWS_S3_ENDPOINT` and `forcePathStyle: true` when set — MinIO requires path-style URLs.

## Failure modes to handle
| Symptom | Cause | Code response |
|---|---|---|
| 403 AccessDenied on PutObject | IAM policy missing | Throw 500 — server config issue |
| 403 AccessDenied on GetObject | Object exists but key wrong-cased OR cross-account | Return 404 to client (don't leak that it exists) |
| 404 NoSuchKey on GetObject | Key in DB but object gone from S3 | Return 404 + log warning (data drift) |
| Network timeout on upload | Slow client, large file | Reject upload if > MAX_BYTES, retry once on timeout |
| Bad Content-Type | User uploaded HTML claiming to be image | Validate magic bytes before PutObject |
| Bucket region mismatch | Bucket in eu-west-1, client in me-south-1 | Always set AWS_REGION to bucket's region |

## Acceptance criteria
- [ ] Upload a 2 MB JPG via the upload endpoint → key returned, file lands in S3 under `profile/`
- [ ] DB row updated with the new key
- [ ] GET /api/download/{key} streams the image with the correct Content-Type
- [ ] GET /api/download/{key} for a non-existent key returns 404 (not 500)
- [ ] Re-upload to the same user → old object is deleted from S3 (verify with `aws s3 ls`)
- [ ] Upload of 50 MB file is rejected with 413 if MAX_BYTES is 10 MB
- [ ] Upload of a PHP file with `.jpg` extension is rejected (magic-byte check)
- [ ] With AWS_S3_ENDPOINT set to MinIO, all the above still pass

---

## Reference implementation (Next.js App Router + AWS SDK v3)

### app/api/upload/route.ts — POST handler (multipart upload)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import { requireAuth } from '@/lib/auth'   // canonical auth helper
import { prisma } from '@/lib/db'

// Allow up to 10 MB per image; reject anything larger client-side too
const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_S3_ENDPOINT,   // undefined in prod (uses default), set for MinIO
  forcePathStyle: !!process.env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  const { userId } = await requireAuth()

  const form = await req.formData()
  const file = form.get('file')
  const categoryRaw = form.get('category')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 })
  }
  const category = typeof categoryRaw === 'string' ? categoryRaw : 'profile'
  if (!/^[a-z][a-z0-9_-]{0,30}$/.test(category)) {
    return NextResponse.json({ error: 'invalid category' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large' }, { status: 413 })
  }
  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'unsupported file type' }, { status: 415 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  // Magic-byte sanity check (cheap defense against extension spoofing)
  if (!magicBytesMatch(buffer, file.type)) {
    return NextResponse.json({ error: 'file content does not match type' }, { status: 415 })
  }

  const key = `${category}/${randomUUID()}.${ext}`
  try {
    await s3.send(new PutObjectCommand({
      Bucket:      process.env.AWS_S3_BUCKET!,
      Key:         key,
      Body:        buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable', // safe — key has uuid
    }))
  } catch (e: any) {
    console.error('[s3] upload failed', { key, name: e.name, message: e.message })
    return NextResponse.json({ error: 's3_upload_failed' }, { status: 500 })
  }

  // For profile images, swap atomically + delete the old object best-effort
  if (category === 'profile') {
    const old = (await prisma.user.findUnique({ where: { id: userId } }))?.profileImageKey
    await prisma.user.update({ where: { id: userId }, data: { profileImageKey: key } })
    if (old && old !== key) {
      s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET!, Key: old }))
        .catch((e) => console.warn('[s3] cleanup of old object failed:', old, e.message))
    }
  }

  return NextResponse.json({ key })
}

// Detect basic image-magic-byte signatures. Returns true if buffer's first
// bytes match the declared MIME. Doesn't catch every fake but stops the
// obvious "PHP file with .jpg extension" attack.
function magicBytesMatch(buf: Buffer, mime: string): boolean {
  if (mime === 'image/jpeg') return buf[0] === 0xFF && buf[1] === 0xD8
  if (mime === 'image/png')  return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47
  if (mime === 'image/webp') return buf.slice(8, 12).toString() === 'WEBP'
  if (mime === 'image/gif')  return buf.slice(0, 3).toString() === 'GIF'
  return false
}
```

### app/api/download/[...key]/route.ts — GET handler (proxy download)

The `[...key]` catch-all segment captures the full slash-separated key
(e.g. `/api/download/profile/abc-123.jpg` → params.key = `["profile", "abc-123.jpg"]`).

```ts
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region:   process.env.AWS_REGION!,
  endpoint: process.env.AWS_S3_ENDPOINT,
  forcePathStyle: !!process.env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Allowed top-level prefixes. Add more here as features land.
const ALLOWED_PREFIXES = new Set(['profile', 'products', 'orders', 'shop-branding'])

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string[] } },
) {
  const key = params.key.join('/')
  // Defence: reject path traversal and unknown prefixes.
  if (key.includes('..') || !ALLOWED_PREFIXES.has(params.key[0] ?? '')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  try {
    const obj = await s3.send(new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key:    key,
    }))
    if (!obj.Body) return new NextResponse('Not Found', { status: 404 })

    // ReadableStream → Response. Pass through Content-Type and length.
    const stream = obj.Body.transformToWebStream()
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type':   obj.ContentType ?? 'application/octet-stream',
        'Content-Length': obj.ContentLength ? String(obj.ContentLength) : '',
        // Cache aggressively — UUID-keyed files never change content for a given key
        'Cache-Control':  'public, max-age=31536000, immutable',
      },
    })
  } catch (e: any) {
    if (e instanceof NoSuchKey || e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) {
      return new NextResponse('Not Found', { status: 404 })
    }
    console.error('[s3] download failed', { key, name: e.name, message: e.message })
    return new NextResponse('Server Error', { status: 500 })
  }
}
```

### Frontend usage

```ts
// Upload
const fd = new FormData()
fd.append('file', selectedFile)
fd.append('category', 'profile')
const res = await fetch('/api/upload', { method: 'POST', body: fd })
const { key } = await res.json()
// → key looks like "profile/0bf3c5a2-3f0c-4e9f-9a72-c2e7a18ba3d1.jpg"

// Display
<img src={`/api/download/${key}`} alt="profile" />
// → resolves to /api/download/profile/0bf3c5a2-...jpg
```

### Required dependencies
```bash
npm install @aws-sdk/client-s3
# That's it — no @aws-sdk/lib-storage, no presigner; raw client is enough.
```

### IAM policy for the upload user (paste into AWS Console)
Minimum permissions on the bucket:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::<your-bucket-name>/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::<your-bucket-name>"
    }
  ]
}
```

Do NOT grant s3:* — that's how leaked keys turn into $50,000 crypto-mining bills.
