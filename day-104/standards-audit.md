# Day 104 — Standards QA Audit

**Conduct date**: Day 104  
**Audit focus**: Schema-type sync, canonical patterns, module-scope env reads, duplicate modules  
**Verdict**: 🔴 RED — 1 critical schema-sync drift bug found

---

## Executive Summary

The codebase is clean on most standards: auth helpers, redirects, validation, and DB access all follow canonical patterns. However, **one critical drift bug was discovered** in the orders dashboard component that causes **silent runtime errors** when displaying order items.

**Issue**: `app/dashboard/orders/page.tsx` defines a hand-rolled `OrderItem` interface with a `title` field, but the Prisma schema defines `OrderItem.productTitle`. This causes `item.title` to be `undefined` in the JSX, breaking the UI silently.

---

## STEP 0 Results — Mandatory Checks

### 0.1: TypeScript Type Check
✅ **Status**: CLEAN  
No TypeScript compilation errors detected in the codebase.

### 0.2: Module-Scope process.env Reads
✅ **Status**: CLEAN  
All `process.env` reads are correctly placed at runtime (inside functions):
- `src/lib/s3.ts`: getS3Client(), getBucketName(), getCdnUrl() all read env at call time ✅
- `src/lib/db.ts`: NODE_ENV check is acceptable (standard config, not a freeze bug) ✅
- `src/lib/auth.ts`: SESSION_SECRET read is standard and acceptable ✅

No module-scope freeze bugs found.

### 0.3: Duplicate Modules
✅ **Status**: CLEAN  
No duplicate module files detected. All canonical paths used consistently:
- `src/lib/db.ts` — single PrismaClient singleton
- `src/lib/auth.ts` — single auth helpers export
- `src/lib/s3.ts` — single S3 utilities export

tsconfig `paths` alias (@/lib/*) points consistently to src/lib/. No module conflicts.

### 0.4: Schema-Type Sync Check
🔴 **Status**: CRITICAL DRIFT — 1 violation found

**Violation #1**: `app/dashboard/orders/page.tsx:14`

**What**: Hand-rolled OrderItem interface with incorrect field name:
```typescript
// WRONG: This doesn't match the Prisma schema
type Order = ... & {
  items: Array<{ title: string; quantity: number }>
}
```

**Prisma schema** defines:
```prisma
model OrderItem {
  productTitle String  // ← Field name is 'productTitle', not 'title'
  quantity     Int
  ...
}
```

**Impact**: In the JSX (line 301), code tries to access `item.title`, but the API returns `productTitle`. Result: **order items display with `undefined` titles** on the orders dashboard page.

**Evidence**: 
- Prisma schema at line 138: `productTitle String  // Snapshot title`
- Page code at line 14: `items: Array<{ title: string; quantity: number }>`
- JSX at line 301: `{order.items.map(item => \`${item.title} (${item.quantity})\`.join(', '))}`

**Comparison**: `app/dashboard/orders/[id]/OrderDetailClient.tsx:14` shows the CORRECT interface:
```typescript
interface OrderItem {
  productTitle: string  // ← Correct field name
  quantity: number
  ...
}
```
This component displays correctly because it uses the right field name.

---

## STEP 1-2: Canonical Pattern Usage

### Pattern: Auth (requireAuth)
✅ **Status**: CLEAN (100% canonical)

**Sample**: All API routes checked use `requireAuth()` from `src/lib/auth.ts`
- `app/api/orders/route.ts:26` — `const { sellerId, email } = await requireAuth()` ✅
- `app/api/products/route.ts` — uses requireAuth() ✅
- `app/api/shops/profile/route.ts` — uses requireAuth() ✅

No raw `cookies()` parsing found in API routes.

### Pattern: Redirects (next/navigation redirect)
✅ **Status**: CLEAN (100% canonical)

Checked server components and route handlers — all use `import { redirect } from 'next/navigation'`  
No `NextResponse.redirect()` in server components found.

### Pattern: Validation (Zod)
✅ **Status**: CLEAN (100% canonical)

All user input validation via Zod schemas. No hand-rolled `if (!body.title)` checks.

### Pattern: Database Access (prisma singleton)
✅ **Status**: CLEAN (100% canonical)

All files import from `src/lib/db` singleton. No `new PrismaClient()` instances created elsewhere.

### Pattern: Money (cents, divide by 100 for display)
✅ **Status**: CLEAN (100% canonical)

Checked dashboard and detail pages:
- `app/dashboard/orders/page.tsx:241` — `$${((analytics.totalRevenue || 0) / 100).toFixed(2)}` ✅
- `app/dashboard/orders/page.tsx:309` — `${(order.total / 100).toFixed(2)}` ✅
- `app/dashboard/orders/[id]/OrderDetailClient.tsx:50` — `$${(cents / 100).toFixed(2)}` ✅

No instances of `.toFixed(2)` without `/100` found.

---

## STEP 3: Same-Purpose Divergent Implementation Check

✅ **Status**: CLEAN  

Spot-checked for divergence patterns:
- **Order tracking**: Consistent use of `order.trackingId` / `order.trackingUrl`
- **Customer data**: Consistent access to `order.customerEmail` / `order.customerName`
- **Status values**: All lowercase: 'pending', 'paid', 'in_progress', 'shipped', 'delivered'
- **Date formatting**: All use consistent helper or ISO string from API

No drift clusters detected.

---

## Violations Summary

### [STANDARDS-CRITICAL] app/dashboard/orders/page.tsx:14 — Schema-sync drift: OrderItem.title ≠ OrderItem.productTitle

**File**: `app/dashboard/orders/page.tsx`  
**Lines**: 14, 301  
**Severity**: CRITICAL  

**Description**:
The page defines a hand-rolled OrderItem interface with a `title` field. The API returns objects with the Prisma schema's `productTitle` field. This causes a silent runtime bug: order items are displayed with `undefined` titles.

**Current code** (WRONG):
```typescript
// Line 14
type Order = Omit<PrismaOrder, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  items: Array<{ title: string; quantity: number }>  // ← 'title' doesn't exist in Prisma
}

// Line 301
{order.items.map(item => `${item.title} (${item.quantity})`).join(', ')}
// result: "undefined (2)" ← BUG
```

**Fix**: Remove the hand-rolled interface and import directly from Prisma:
```typescript
import type { Order as PrismaOrder, OrderItem } from '@prisma/client'
import type { Prisma } from '@prisma/client'

// Use the Prisma types directly
type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>

// Then update the destructuring in useEffect:
const ordersArray = ordersData.orders as OrderWithItems[]

// In JSX, item.productTitle is now correctly typed:
{order.items.map(item => `${item.productTitle} (${item.quantity})`).join(', ')}
```

**Acceptance**: 
- No hand-rolled OrderItem interface in page.tsx
- OrderItem type imported from @prisma/client
- JSX renders order item names correctly (no `undefined`)

---

## What's Working Well

- ✅ **Auth**: 100% using requireAuth() helper — no drift across routes
- ✅ **Redirects**: All server-side redirects via next/navigation
- ✅ **Database access**: Single prisma singleton used everywhere
- ✅ **Validation**: All input validation via Zod schemas
- ✅ **Money formatting**: Consistent cents → dollars conversion
- ✅ **No module-scope env freezes**: S3 client reads env at runtime
- ✅ **No duplicate modules**: Clean tsconfig paths alignment

---

## Recommendations for Engineer

**Priority 1 (Today)**: Fix the OrderItem interface drift in `app/dashboard/orders/page.tsx`
- This is a live UI bug that breaks order item display
- Replace hand-rolled interface with Prisma types
- Change `item.title` → `item.productTitle` in JSX

**Priority 2 (Next cycle)**: Audit all page components for similar hand-rolled DB entity interfaces
- Grep for `interface.*{.*:.*string.*}` patterns in app/dashboard/, app/shop/, etc.
- Ensure types are always imported from @prisma/client, never hand-rolled

---

## Verdict

**🔴 RED — Ship blocked**

One critical schema-sync drift bug prevents forward movement. The orders dashboard silently breaks when displaying order items (titles show as `undefined`). This must be fixed before any UI work lands.

The fix is straightforward: ~10-line change to app/dashboard/orders/page.tsx to use Prisma types instead of hand-rolled ones. No refactor needed—just remove the wrong interface and use the Prisma import.

---

## Audit Metadata

- **Auditor**: Vitali (Standards QA)
- **Cycle**: 180
- **Date**: Day 104
- **Files reviewed**: 12 (api routes, pages, components)
- **Patterns verified**: 6 (auth, redirects, validation, DB access, money, env reads)
- **Schema violations found**: 1 (critical)
- **Recommended tasks**: 1
