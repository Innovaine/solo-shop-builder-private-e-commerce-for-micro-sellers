# Day 94 — Standards QA Audit

## Verdict: 🔴 RED (4 critical violations, 1 wiring violation)

**Summary**: Found module-scope process.env reads in Stripe client initialization (FREEZE BUG) and duplicate S3 module with broken impl. These block shipping.

---

## STEP 0 Findings

### STEP 0A: Schema-Sync Check
✅ **PASS** — Spot check of app/dashboard/orders/page.tsx shows Order and OrderItem correctly imported from @prisma/client. No drift detected.

### STEP 0B: TypeScript Compilation
⊘ **SKIPPED** — node_modules not available on server. Package.json has @types/node. Relying on build verification.

### STEP 0C: Module-Scope process.env Reads (Build-Time Freeze Bug)

🔴 **CRITICAL VIOLATIONS FOUND**:

```
File: app/api/checkout/route.ts:10
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  ❌ WRONG: Stripe client initialized at module scope with frozen env var

File: app/api/orders/[id]/refund/route.ts:10
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  ❌ WRONG: Stripe client initialized at module scope with frozen env var

File: app/api/webhooks/stripe/route.ts:10-14
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  ❌ WRONG: Both clients + secret frozen at build time

File: src/lib/s3.ts:8,9,15-16,30
  const s3Client = new S3Client({ region: process.env.AWS_REGION || ... })
  const BUCKET_NAME = process.env.AWS_S3_BUCKET || ...
  const CDN_URL = process.env.AWS_CLOUDFRONT_URL || ...
  ❌ WRONG: S3 client initialized at module scope with frozen env vars
```

**Impact**: If STRIPE_SECRET_KEY or AWS_S3_BUCKET changes on the deployed container, the running Next.js process still uses the value frozen at `next build` time. Restart required to pick up env changes.

**Canonical Pattern** (per standards.md): Read process.env INSIDE function that uses it.

```typescript
✅ RIGHT:
function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { ... })
}
```

### STEP 0D: Duplicate Module Check

🔴 **CRITICAL WIRING VIOLATION**:

**Three S3 files found**:
1. `lib/s3.ts` — ✅ CORRECT, runtime-based env reads in functions
2. `app/lib/s3.ts` — ✅ CORRECT, runtime-based env reads in functions
3. `src/lib/s3.ts` — ❌ BROKEN, module-scope env reads (freeze bug)

**Import resolution**: 
- tsconfig.json `"@/*": ["./app/*", "./src/*"]`
- `@/lib/s3` resolves to `app/lib/s3.ts` (correct by accident)
- `src/lib/s3.ts` is dead code AND has the freeze bug

**Action**: DELETE `src/lib/s3.ts`. It's a broken duplicate that should never be imported, but its existence is a footgun.

---

## STEP 1-2: Canonical Pattern Audit

### Authentication
✅ **PASS** — `requireAuth()` helper used correctly. Only one `cookies()` call found in `src/lib/auth.ts` (the helper itself — correct location).

### Redirects
✅ **PASS** — `NextResponse.redirect()` used in API routes (callback handlers). `redirect()` from next/navigation used in server components. No mixing.

### Route Parameters
✅ **PASS** — `params.id`, `params.slug` used consistently. No drift.

### Query Strings
✅ **MOSTLY PASS** — `searchParams` accessed consistently via `new URL(request.url).searchParams`. One minor variant in `app/api/auth/verify/route.ts:86` uses `request.nextUrl.searchParams` — functionally equivalent, but non-canonical.

### Validation
✅ **PASS** — Zod imported and used consistently across API routes.

### Rate Limiting
✅ **PASS** — `checkRateLimit()` from `@/lib/rate-limit` used on auth and product creation endpoints.

---

## STEP 3: Same-Purpose-Different-Impl Drift

✅ **CLEAR** — No major drift clusters detected. Param access, searchParams access, error handling patterns are consistent.

---

## Violations Filed

### [STANDARDS-CRITICAL] 1: Stripe client frozen at build time in checkout route
- File: `app/api/checkout/route.ts:10`
- Issue: Module-scope Stripe client initialization
- Fix: Move `new Stripe(...)` inside each handler function

### [STANDARDS-CRITICAL] 2: Stripe client frozen at build time in refund route
- File: `app/api/orders/[id]/refund/route.ts:10`
- Issue: Module-scope Stripe client initialization
- Fix: Move `new Stripe(...)` inside handler function

### [STANDARDS-CRITICAL] 3: Stripe client + secret frozen at build time in webhook handler
- File: `app/api/webhooks/stripe/route.ts:10-14`
- Issue: Module-scope Stripe client + webhook secret initialization
- Fix: Move both inside handler functions

### [WIRING-CRITICAL] 4: Delete duplicate broken S3 module
- File: `src/lib/s3.ts`
- Issue: Duplicate of correct implementation in `app/lib/s3.ts`, but with module-scope freeze bug
- Fix: Delete `src/lib/s3.ts` entirely (dead code)

---

## What's Working

- ✅ Auth patterns (requireAuth used correctly)
- ✅ Routing conventions (redirect, NextResponse.redirect properly split)
- ✅ Validation (zod used throughout)
- ✅ Rate limiting (applied to sensitive endpoints)
- ✅ DB access (prisma singleton pattern)
- ✅ Type safety (Prisma types imported, no hand-rolled drift)

---

## Recommendation

**VERDICT**: 🔴 **RED** — Ship is BLOCKED until:
1. Stripe clients moved to runtime initialization (3 files)
2. Duplicate `src/lib/s3.ts` deleted

All 4 violations are fixable in ~30 minutes. After fixes, run full build + deploy cycle to verify env vars can be changed at container runtime.
