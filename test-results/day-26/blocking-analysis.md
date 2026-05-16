# Day 26 Build Blocking Analysis

## Current State
- **Container running:** Day 24 build (image db1e07827eda)
- **Container status:** UP and healthy for 2+ hours
- **Day 26 code deployment:** BLOCKED - build fails before image creation

## Root Cause

Next.js 14 tries to statically pre-render all pages/routes at **build time**. When a Server Component or API route accesses:
- Prisma (database)
- cookies()
- headers()
- searchParams
- request object

...Next.js will attempt to execute that code during `npm run build` inside the Docker builder container.

**Problem:** The builder container does NOT have:
1. A running PostgreSQL database
2. Database credentials
3. The complete runtime environment

**Result:** Build fails with errors like:
- `Prisma cannot find libssl.so.1.1`
- `Database does not exist`
- `Route couldn't be rendered statically because it accessed cookies/searchParams`

## Files Blocking Build (from reviewer's analysis)

### 1. `app/dashboard/page.tsx`
**Issue:** Server Component calls `await prisma.shop.findFirst()` at top level
**Error:** Next.js tries to run this during static generation → Prisma fails
**Fix:** Add `export const dynamic = 'force-dynamic'` at top of file

### 2. `app/api/checkout/route.ts`
**Issue:** API route calls `await prisma.shop.findUnique()` 
**Error:** Next.js tries to pre-render → Prisma fails
**Fix:** Add `export const dynamic = 'force-dynamic'` after imports

### 3. Potentially other routes accessing Prisma
The engineer added `dynamic` exports to:
- ✅ `app/api/orders/route.ts`
- ✅ `app/api/products/route.ts`
- ✅ `app/api/shops/route.ts`
- ✅ `app/api/auth/verify/route.ts`

But MISSED:
- ❌ `app/api/checkout/route.ts`
- ❌ `app/dashboard/page.tsx`
- ❌ Possibly others (need to audit all files that import prisma)

## Why This Happens

Next.js 14 defaults to **Static Site Generation (SSG)** for performance. It wants to:
1. Pre-render pages at build time
2. Serve them as static HTML
3. Avoid runtime overhead

But our app is **fully dynamic** - every page needs:
- Live database queries
- Session/cookie access
- Real-time data

## The Fix

**Option A: Per-route (current approach)**
Add to every file that accesses Prisma/cookies/headers:
```typescript
export const dynamic = 'force-dynamic'
```

**Option B: Global (cleaner, safer)**
In `next.config.js`:
```javascript
module.exports = {
  experimental: {
    dynamicIO: true, // Force all routes dynamic by default
  },
}
```

**Recommendation:** Use Option B to prevent this recurring across future features.

## Files That Need `dynamic` Export

Searched codebase for Prisma imports:
```bash
grep -r "from '@/lib/db'" app/ --include="*.ts" --include="*.tsx"
```

Results (files importing prisma):
- app/api/auth/verify/route.ts ✅ HAS dynamic export
- app/api/checkout/myfatoorah/callback/route.ts ❌ MISSING
- app/api/checkout/myfatoorah/route.ts ❌ MISSING
- app/api/checkout/route.ts ❌ MISSING (BLOCKER)
- app/api/health/route.ts ✅ HAS dynamic export
- app/api/orders/[id]/route.ts ❌ MISSING
- app/api/orders/route.ts ✅ HAS dynamic export
- app/api/products/[id]/route.ts ❌ MISSING
- app/api/products/route.ts ✅ HAS dynamic export
- app/api/shops/route.ts ✅ HAS dynamic export
- app/api/webhooks/stripe/route.ts ❌ MISSING
- app/dashboard/page.tsx ❌ MISSING (BLOCKER)
- app/dashboard/create-shop/page.tsx ❌ MISSING
- app/dashboard/orders/page.tsx ❌ MISSING
- app/dashboard/products/page.tsx ❌ MISSING
- app/dashboard/products/[id]/edit/page.tsx ❌ MISSING
- app/shop/[slug]/page.tsx ❌ MISSING
- app/shop/[slug]/product/[productId]/page.tsx ❌ MISSING
- app/track/[orderId]/page.tsx ❌ MISSING

**Total:** 18 files import Prisma, only 5 have the export.

## Next Steps for Engineer

1. **Quick fix (unblocks testing today):**
   - Add `export const dynamic = 'force-dynamic'` to remaining 13 files
   - Rebuild
   - Deploy

2. **Sustainable fix (prevents future recurrence):**
   - Update `next.config.js` with global dynamic rendering
   - Remove per-file exports (no longer needed)
   - Document in README

3. **Verification:**
   - Build must complete without "Export encountered errors"
   - Docker image must be created successfully
   - Container must start and respond to health check

## Test Impact

Once build succeeds, I can test:
- ✅ FR-2: Email verification flow (`/auth/verify`)
- ✅ FR-3: Shop dashboard (`/dashboard`)
- ✅ FR-4-11: Product management
- ✅ FR-12-14: Order tracking (`/track/[orderId]`)
- ✅ Myfatoorah payment integration

Until then: **BLOCKED - cannot deploy or test day 26 features**
