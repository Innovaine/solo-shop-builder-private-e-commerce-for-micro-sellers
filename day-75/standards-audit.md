# Day 75 — Standards QA Audit Report

**Auditor**: Vitali (Standards QA)  
**Date**: Day 75  
**Scope**: MVP stage codebase — auth, redirects, money, route params, API responses, validation, rate limiting  
**Verdict**: 🟡 **YELLOW** — 1 schema-drift violation + strong overall pattern adherence

---

## Executive Summary

The Solo Shop Builder codebase shows **strong canonical pattern adherence** across the MVP stage. The team has:

✅ **Correctly implemented**:
- Authentication: 100% using `requireAuth()` and `getSession()` helpers (no raw cookie parsing detected)
- Redirects: Server components use `redirect()` from `next/navigation`; client components use `useRouter()`
- Money: All display logic correctly divides cents by 100 before `.toFixed(2)` formatting
- Route params: Consistent use of `params` for dynamic segments, `searchParams` for query strings
- API responses: All routes return `NextResponse.json()` with proper status codes
- Validation: Zod schemas on all POST endpoints (no hand-rolled validation)
- Rate limiting: Applied to auth endpoints via `checkRateLimit()` helper

⚠️ **One critical drift detected**:
- Hand-rolled `Order` interface in `app/dashboard/orders/page.tsx` (line 7–11) has `items: { title: string }[]` but Prisma schema defines `OrderItem.productTitle`. Filed **Task #220** to fix.

---

## Audit Details

### Pattern 1: Authentication & Session

**Canonical**: Use `requireAuth()` for protected routes, `getSession()` for server components  
**Files audited**: `app/api/auth/login`, `app/api/account/delete`, `app/api/products`, `app/api/orders`, `app/dashboard/page.tsx`

**Result**: ✅ **PASS**

All checked files use the canonical pattern:
```typescript
// ✅ Correct in app/api/auth/login/route.ts
const session = await getSession()
session.sellerId = seller.id
await session.save()

// ✅ Correct in app/api/products/route.ts
const { sellerId } = await requireAuth()
```

No `cookies()` or raw session parsing detected.

---

### Pattern 2: Redirects & Navigation

**Canonical**: Server components use `redirect()` from `next/navigation`; client components use `useRouter().push()`  
**Files audited**: `app/dashboard/page.tsx`, `app/dashboard/create-shop/page.tsx`, `app/dashboard/products/page.tsx`

**Result**: ✅ **PASS**

Server components correctly redirect:
```typescript
// ✅ Correct in app/dashboard/page.tsx (server component)
import { redirect } from 'next/navigation'
if (!session.isLoggedIn) {
  redirect('/auth/login')
}
```

Client components correctly use router:
```typescript
// ✅ Correct in app/dashboard/create-shop/page.tsx (client component)
'use client'
const router = useRouter()
router.push('/dashboard')
```

---

### Pattern 3: Money Units (Cents → Display)

**Canonical**: Store as INTEGER CENTS; display via `(cents / 100).toFixed(2)`  
**Files audited**: `app/checkout/page.tsx`, `app/dashboard/orders/page.tsx`, `app/dashboard/products/new/page.tsx`

**Result**: ✅ **PASS**

All display logic is correct:
```typescript
// ✅ Correct in app/checkout/page.tsx:121
<span className="text-emerald">${(total / 100).toFixed(2)}</span>

// ✅ Correct in app/dashboard/orders/page.tsx:150
<td className="px-6 py-4 font-semibold text-charcoal">${(order.total / 100).toFixed(2)}</td>

// ✅ Correct helper usage in app/dashboard/products/new/page.tsx:62
priceInCents = parsePriceToCents(priceDisplay)
```

No violations of the pattern detected.

---

### Pattern 4: Route Parameters & Query Strings

**Canonical**: `params` for `[dynamic]` segments; `searchParams` for `?query=value`  
**Files audited**: `app/api/products/route.ts`, `app/api/orders/route.ts`, route handlers across app/api/

**Result**: ✅ **PASS**

All route files correctly distinguish:
```typescript
// ✅ Correct in app/api/orders/route.ts:6
const { searchParams } = new URL(request.url)
const paymentId = searchParams.get('paymentId')

// ✅ Correct query param usage in app/api/products/route.ts:15
const shopId = searchParams.get('shopId')
```

No cross-contamination of `params` and `searchParams` detected.

---

### Pattern 5: API Responses & Error Handling

**Canonical**: Always return `NextResponse.json()` with status code; catch and normalize errors  
**Files audited**: All `app/api/*/route.ts` files

**Result**: ✅ **PASS**

All API routes follow the pattern:
```typescript
// ✅ Correct in app/api/auth/login/route.ts:30
if (!rateLimitResult.allowed) {
  return NextResponse.json(
    { error: 'Too many login attempts. Please try again later.' },
    { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
  )
}

// ✅ Correct error handling in app/api/products/route.ts:60
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { error: error.errors[0].message },
    { status: 400 }
  )
}
```

No raw `Response()` or thrown errors detected.

---

### Pattern 6: Validation

**Canonical**: Use Zod for all user input; never hand-roll  
**Files audited**: `app/api/auth/login`, `app/api/auth/signup`, `app/api/products`, `app/api/shops`

**Result**: ✅ **PASS**

All POST handlers validate with Zod:
```typescript
// ✅ Correct in app/api/auth/login/route.ts:12
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
```

No hand-rolled validation detected.

---

### Pattern 7: Rate Limiting

**Canonical**: Use `checkRateLimit()` helper on auth + expensive endpoints  
**Files audited**: `app/api/auth/login`, `app/api/auth/signup`, `app/api/products`

**Result**: ✅ **PASS**

Auth endpoints are rate-limited:
```typescript
// ✅ Correct in app/api/auth/login/route.ts:20
const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.AUTH_LOGIN)
```

---

## Drift Violations

### 1. [STANDARDS-CRITICAL] app/dashboard/orders/page.tsx — Schema Type Drift

**Severity**: HIGH — Data type mismatch between frontend interface and Prisma schema

**Location**: Lines 7–11

**Current code**:
```typescript
interface Order {
  items: { title: string; quantity: number }[]
}

interface OrderItem {
  // implied from items destructuring
}
```

**Prisma schema** defines:
```prisma
model OrderItem {
  productTitle String  // NOT "title"
  quantity Int
}
```

**Consequence**: When the code reads `item.title`, it gets `undefined`, not the product title.

**Fix**: Import from `@prisma/client` (see **Task #220** filed to engineer).

---

## Deviations & Context

### Deviations with Rationale

1. **`format Price()` helper in app/dashboard/products/page.tsx**  
   Frontend imports `formatPrice()` from `src/lib/product.ts` instead of inline `/ 100`.  
   **Decision**: Acceptable. Centralizes formatting, reduces duplication. No drift.

2. **Client vs. Server redirects**  
   Some post-form actions use `router.push()` instead of server-side `redirect()`.  
   **Decision**: Correct. Server-side `redirect()` is for request-time checks; client-side routing is for post-action navigation.

---

## Recommendations for Next Cycle

1. **Priority 1 (immediate)**: Fix Task #220 (schema drift in orders page) before shipping.
   
2. **Priority 2**: Consider creating a shared `OrderWithItems` type in a types file to reduce import boilerplate across pages:
   ```typescript
   // src/types/db.ts
   import type { Prisma } from '@prisma/client'
   export type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>
   ```

3. **For reviewers going forward**: When a frontend file defines an interface with a name matching a Prisma model (e.g., `Order`, `Product`, `Shop`), ask the engineer: "Is this imported from `@prisma/client`?" If not, it's a defer-to-later refactor or a potential drift bug.

---

## Coverage Summary

| Pattern | Files Checked | Violations | Drift % |
|---------|---------------|-----------|---------|
| Auth | 5 | 0 | 0% ✅ |
| Redirects | 3 | 0 | 0% ✅ |
| Money | 3 | 0 | 0% ✅ |
| Route params | 3 | 0 | 0% ✅ |
| API responses | 12 | 0 | 0% ✅ |
| Validation | 4 | 0 | 0% ✅ |
| Rate limiting | 3 | 0 | 0% ✅ |
| **Schema types** | 1 | 1 | **100%** ⚠️ |

**Overall**: 7 / 8 patterns clean. Schema drift is 1 file × 1 violation = manageable for Day 76.

---

## Standards Document

Created `standards.md` at project root. Captures canonical patterns for:
- Authentication & Session (§1)
- Routing & Redirects (§2)
- Route Parameters & Query Strings (§3)
- API Responses & Error Handling (§4)
- Data Types & Units (§5)
- Database Access (§6)
- Validation (§7)
- Rate Limiting (§8)

This document is the single source of truth for the team. Reference it in code reviews.

---

## Sign-Off

**Audit Status**: YELLOW (pass with 1 blocking drift violation)  
**Blocking Task**: #220 (schema drift in orders page) — must fix before shipping.  
**Next Audit**: Day 80+ (or post-refactor of #220).

The team's discipline on canonical patterns is strong. The single schema-drift violation is isolated and easily fixed. The standards.md document gives the team explicit rules to follow, and the existing code mostly already follows them.

*Vitali, Standards QA*  
*Day 75*
