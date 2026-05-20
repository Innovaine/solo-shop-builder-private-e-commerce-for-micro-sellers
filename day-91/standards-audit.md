# Day 91 — Standards QA Audit

**Status**: 🔴 RED — Critical wiring and build-time freeze bugs found

---

## Summary

Systematic audit of 8 canonical pattern families across ~150 TypeScript files. Found **2 critical issues** that break runtime environment variable handling:

1. **[WIRING-CRITICAL]** Duplicate `s3.ts` files — app imports the WRONG copy (module-scope env reads instead of runtime-safe)
2. **[STANDARDS-CRITICAL]** 4 module-scope `process.env` reads in Stripe route handlers (frozen at build time)

Both issues prevent environment-variable-driven configuration at runtime. The deployed server's env vars are IGNORED because values are baked into the compiled bundle at build time.

---

## Violations Found

### STEP 0 Checks (Mandatory)

✅ **Schema-sync-check**: No hand-rolled interface drift found. All DB-backed types properly imported from `@prisma/client`.

✅ **tsc --noEmit**: Project compiles cleanly (TypeScript check passed).

❌ **Module-scope `process.env` reads (STEP 2D)**: FOUND 4 critical violations in Stripe routes.

❌ **Duplicate modules (STEP 2E)**: FOUND — `lib/s3.ts` vs `src/lib/s3.ts` with different implementations.

---

## Critical Issues

### Issue 1: Duplicate S3 Module — Wrong Copy Used

**Files**: 
- `lib/s3.ts` (2,939 bytes) — ✅ CORRECT
- `src/lib/s3.ts` (1,756 bytes) — ❌ WRONG (currently imported)

**Problem**:
```
lib/s3.ts has:
  function getS3Client() { /* reads env at RUNTIME */ }
  function getCdnUrl() { /* reads env at RUNTIME */ }

src/lib/s3.ts has:
  const BUCKET_NAME = process.env.AWS_S3_BUCKET  // module scope — FROZEN at build
  const CDN_URL = process.env.AWS_CLOUDFRONT_URL // module scope — FROZEN at build
```

The route handler imports:
```typescript
// app/api/products/upload/route.ts:9
import { uploadToS3, isS3Configured } from '@/lib/s3'
```

**Path resolution** (tsconfig.json):
```json
"paths": { "@/*": ["./app/*", "./src/*"] }
```

This tries `./app/lib/s3` first (doesn't exist), then `./src/lib/s3` (the WRONG copy with module-scope reads).

**Task filed**: #260 [WIRING-CRITICAL]

---

### Issue 2: Module-Scope Stripe Client Initialization

**Files with violations**:
1. `app/api/checkout/route.ts:10`
2. `app/api/orders/[id]/refund/route.ts:10`
3. `app/api/webhooks/stripe/route.ts:10`
4. `app/api/webhooks/stripe/route.ts:14`

**Pattern**:
```typescript
// ❌ WRONG — frozen at build time
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  // Uses frozen 'stripe' client from module scope
}
```

**Impact**: If `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` is changed on the production server and the container is restarted, the deployed app IGNORES the new value. It uses whatever was baked in at `next build` time.

**Task filed**: #261 [STANDARDS-CRITICAL]

---

## Canonical Patterns Audit

### 1. Authentication & Session (requireAuth)
✅ COMPLIANT — All 40+ API routes use `requireAuth()` or `getSession()` correctly. No raw cookie parsing found.

### 2. Routing & Redirects
✅ COMPLIANT — All server components use `redirect()` from next/navigation. No NextResponse.redirect() in server components.

### 3. Route Parameters & Query Strings
✅ COMPLIANT — All dynamic page handlers correctly destructure `params` and `searchParams`. No cross-contamination.

### 4. API Responses
✅ COMPLIANT — All route handlers return `NextResponse.json()`. No raw Response() objects.

### 5. Data Types & Units
✅ COMPLIANT — Money stored as integer cents. All display code divides by 100. No floating-point precision issues.

### 6. Database Access
✅ COMPLIANT — All Prisma usage imports singleton from `src/lib/db.ts`. No `new PrismaClient()` in routes.

### 7. Validation
✅ COMPLIANT — All request validation uses Zod. No hand-rolled `if (!body.title)` checks.

### 8. Rate Limiting
✅ COMPLIANT — All auth routes (`/api/auth/signup`, `/api/auth/login`) use `checkRateLimit()`.

---

## Why These Bugs Matter

**The S3 provider bug**: If the business needs to switch S3 providers (AWS → DigitalOcean) at runtime, the code cannot respond. It's stuck with whatever was set at build time.

**The Stripe key bug**: In payment processing, env vars can change (test keys during staging, live keys in production, key rotation for security). If the app ignores runtime env changes, it locks in old credentials permanently until the next rebuild.

Both are **runtime-safety regressions** that violate the company's shipping standards. See `standards.md` § "Runtime ENV Reads":
> Read process.env INSIDE the function that uses it — never at module top-level. 

---

## Verdict & Actions

**CURRENT VERDICT**: 🔴 **RED**

The duplicate S3 module is a live wiring bug. The Stripe freeze-bugs are critical for environment safety.

**REQUIRED FIX** (before next ship):
1. Delete `src/lib/s3.ts` (task #260)
2. Move Stripe client creation into request handlers (task #261)

**DO NOT PASS** to next stage until these are resolved.

---

## Tool Output Logs

### STEP 2D: Module-scope env reads found
```
app/api/checkout/route.ts:10:const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
app/api/orders/[id]/refund/route.ts:10:const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
app/api/webhooks/stripe/route.ts:10:const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
app/api/webhooks/stripe/route.ts:14:const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
src/lib/s3.ts:15:const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'soloshopbox-uploads'
src/lib/s3.ts:16:const CDN_URL = process.env.AWS_CLOUDFRONT_URL || ...
```

### STEP 2E: Duplicate modules found
```
lib/s3.ts              (2.9 KB) — runtime-safe, correct implementation
src/lib/s3.ts         (1.8 KB) — module-scope reads, incorrect, currently used
```

### TypeScript compilation
```
✓ tsc --noEmit: 0 errors (passed)
```

---

## Historical Context

Day 87 audit flagged similar issues with S3 module structure. The duplicate has persisted and is causing the wrong implementation to be used. This is a 4-day-old regression that compounds each deploy cycle.

---

**Audit conducted by**: Vitali (Standards QA)  
**Date**: Day 91  
**Next review**: Day 92 (post-fix verification)
