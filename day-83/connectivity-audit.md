# Day 83 — Connectivity Audit

**Verdict: RED · 2 critical wiring issues persist + 1 new security debt identified**

---

## Status Summary

❌ **2 CRITICAL issues blocking core seller workflows**
1. Order detail page `/dashboard/orders/[id]` still missing (SAME as day-82)
2. Refund endpoint returns 500 instead of 401 for unauthenticated requests (security debt #240)

✅ **Stripe webhook routing correct** — signature verification present
✅ **Cross-tenant isolation present** in refund endpoint
✅ **All other page + API wiring correct** (23 pages, 34 API endpoints verified)

---

## Critical Issues Found

### ❌ ISSUE 1: [WIRING-CRITICAL] Orders Detail Page Still Missing (DAY-82 REGRESSION)

**Severity:** CRITICAL (breaks seller order management workflow)

**Status:** UNRESOLVED from day-82. No progress.

**Evidence:**
- **File:** `app/dashboard/orders/page.tsx:349`
- **Link:** `<a href={/dashboard/orders/${order.id}>View</a>`
- **Literal URL called:** `/dashboard/orders/{orderId}`
- **Expected destination:** `app/dashboard/orders/[id]/page.tsx`
- **Actual status:** **FILE DOES NOT EXIST** (verified via find command)

**Directory check result:**
```
app/dashboard/orders/
├── page.tsx  ✓ EXISTS (orders list page)
└── [id]/     ✗ MISSING (detail page folder)
```

**Impact:** When a seller clicks "View" on any order in the orders list, they get a 404. They cannot see individual order details. This blocks a core seller feature that was explicitly called out in the plan for today (#239).

**Related Task:** #239 [WIRING-CRITICAL] — marked as open/unresolved

---

### ❌ ISSUE 2: [SECURITY] Refund Endpoint Returns 500 Instead of 401 for Auth Failures

**Severity:** HIGH (security debt, incorrect HTTP semantics)

**Evidence:**
- **File:** `app/api/orders/[id]/refund/route.ts`
- **Auth check:** Line 16 calls `const { sellerId } = await requireAuth()`
- **Auth implementation:** `src/lib/auth.ts:32` throws `Error('Unauthorized')` when not authenticated
- **Error handling:** Line 126 has generic `catch (error: any)` that catches ALL errors
- **Problem:** The thrown auth error is caught and returns 500, not 401

**Code trace:**
```typescript
// src/lib/auth.ts:32
export async function requireAuth(): Promise<{ sellerId: string; email: string }> {
  const session = await getSession()
  if (!session.isLoggedIn || !session.sellerId || !session.email) {
    throw new Error('Unauthorized')  // ← throws Error
  }
  return { sellerId: session.sellerId, email: session.email }
}

// app/api/orders/[id]/refund/route.ts:16
const { sellerId } = await requireAuth()  // ← this throws, but is not caught until line 126

// app/api/orders/[id]/refund/route.ts:126
} catch (error: any) {
  console.error('Refund error:', error)
  // NO explicit handling for auth errors — falls through to 500
  return NextResponse.json(
    { error: 'Failed to process refund' },
    { status: 500 }  // ← WRONG: should be 401
  )
}
```

**Comparison to correct pattern:**
- `/api/orders/[id]/route.ts` (PATCH) **DOES** have explicit auth error handling at line 86-90:
  ```typescript
  if (error instanceof Error && error.message === 'Unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  ```
- Refund endpoint **LACKS** this pattern → returns 500

**Impact:** 
- Unauthenticated refund requests return 500 (server error) instead of 401 (auth required)
- Violates HTTP semantics (401 means "authentication required", 500 means "server error")
- Makes debugging harder for API consumers
- Security signal is muddied (looks like a system failure, not an auth failure)

**Related Task:** #240 — marked as open/unresolved

---

## Verified Wiring (✅ All Correct)

### Stripe Webhook Routing & Signature Verification

**Status:** ✅ WORKING CORRECTLY

**Evidence:**
- **File:** `app/api/webhooks/stripe/route.ts`
- **Signature verification:** Line 33 uses `stripe.webhooks.constructEvent(body, signature, webhookSecret)`
- **Secret sourced from:** `process.env.STRIPE_WEBHOOK_SECRET`
- **Error handling:** Line 36-40 returns 400 if signature verification fails

**Code excerpt:**
```typescript
// app/api/webhooks/stripe/route.ts:31-40
try {
  event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
} catch (err: any) {
  console.error('Webhook signature verification failed:', err.message)
  return NextResponse.json(
    { error: `Webhook Error: ${err.message}` },
    { status: 400 }
  )
}
```

**Result:** ✅ Stripe webhook signature verification is properly wired. Tampered events will be rejected with 400.

### Checkout Endpoints Wired Correctly

**Status:** ✅ WORKING CORRECTLY

**Checkout page routing:**
- **File:** `app/checkout/page.tsx:39-40` calls `fetch(endpoint, { method: 'POST' })`
- **Stripe endpoint:** `/api/checkout` → `app/api/checkout/route.ts:14` exports `POST` ✅
- **MyFatoorah endpoint:** `/api/checkout/myfatoorah` → `app/api/checkout/myfatoorah/route.ts:7` exports `POST` ✅

**Result:** ✅ Both checkout endpoints wired correctly. Both export POST method.

### Cross-Tenant Isolation in Refund Endpoint

**Status:** ✅ PRESENT (but auth error handling is broken)

**Evidence:**
- **File:** `app/api/orders/[id]/refund/route.ts:17-20` gets seller's shop
- **File:** `app/api/orders/[id]/refund/route.ts:39-41` verifies order belongs to seller's shop:

```typescript
// Verify order belongs to this shop
if (order.shopId !== shop.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

**Result:** ✅ Cross-tenant isolation is present. A seller cannot refund another seller's orders (returns 403). But the auth check itself is broken (returns 500 instead of 401).

### Dashboard Hub Navigation

**Status:** ✅ VERIFIED CORRECT (same as day-82)

All 9 subpages linked from `/dashboard` hub page with no orphans.

### Auth Session Consistency

**Status:** ✅ VERIFIED CORRECT (same as day-82)

- All `/dashboard/*` pages use `getSession()` from `@/lib/auth`
- All protected APIs use `requireAuth()` from `@/lib/auth`
- Same cookie-based mechanism (iron-session) throughout

**Note:** The issue is NOT the session mechanism itself, but the error handling around `requireAuth()`.

---

## All Routes Inventory

**Page Routes (23 total):**
- `/` — home/landing
- `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`
- `/dashboard` + 8 subpages (products, orders, analytics, branding, profile, billing, email-template, settings)
- `/dashboard/products/new`, `/dashboard/products/[id]/edit`, `/dashboard/products/import`
- `/shop/[slug]`, `/shop/[slug]/product/[productId]`
- `/checkout`, `/checkout/success`
- `/track/[orderId]`
- **MISSING:** `/dashboard/orders/[id]` ❌

**API Endpoints (34 total):**
- Auth: login, signup, logout, verify, forgot-password, reset-password
- Shops: GET, POST, profile PATCH, branding PATCH, status
- Products: GET, POST, [id] GET, [id] status, [id] variants, upload, import, export, bulk-status
- Orders: GET, POST, [id] GET, [id] refund, [id] history, export
- Checkout: POST, myfatoorah POST, myfatoorah callback
- Webhooks: stripe POST
- Analytics: GET
- Billing: GET
- Health: GET

---

## What's Working

✅ **Stripe webhook signature verification** — tampered events rejected with 400
✅ **Checkout endpoints** — Both Stripe and MyFatoorah POST endpoints wired correctly
✅ **Cross-tenant isolation** — Refund endpoint verifies order belongs to seller's shop
✅ **Dashboard navigation** — All 9 subpages reachable from hub
✅ **Auth session** — iron-session used consistently across pages and APIs
✅ **Back buttons** — All detail/edit pages have escape routes
✅ **Public storefront** — Shop page links to product details correctly

---

## What's Broken

❌ **Order detail page missing** (UNRESOLVED from day-82) — `/dashboard/orders/[id]` doesn't exist. "View" link on orders list returns 404.

❌ **Refund endpoint auth error handling** (NEW) — Returns 500 instead of 401 for unauthenticated requests. Violates HTTP semantics and makes debugging harder.

---

## Verdict Rationale

**RED** because:

1. ❌ **CRITICAL:** Order detail page is STILL missing (regression from day-82 — no fix applied)
2. ❌ **HIGH:** Refund endpoint returns wrong HTTP status for auth failures (500 instead of 401)
3. ⚠️ Both issues directly relate to the plan for day-83 (#239, #240)
4. ✅ All OTHER page links resolve correctly
5. ✅ Stripe webhook wiring is correct
6. ✅ Cross-tenant isolation is present (but auth error handling is broken)

The order detail page is a core seller feature that's been broken for 2+ days. The refund endpoint's auth error handling is a security/semantics issue that makes debugging harder. Together, these block the seller order management workflow.

---

## Tasks Status

| Task ID | Title | Status | Connectivity Finding |
|---------|-------|--------|----------------------|
| #239 | [WIRING-CRITICAL] Orders detail route `/dashboard/orders/[id]` missing | OPEN | ❌ Still broken. File does not exist. |
| #240 | Fix refund endpoint error handling — returns 500 instead of 401 | OPEN | ❌ Confirmed. Auth error from `requireAuth()` is caught and returned as 500. |
| #241 | [INTEGRATION] Wire Stripe Webhooks into the product | OPEN | ✅ Verified correct. Signature verification present. |
| #242 | [STANDARDS] Replace hand-rolled Product interface with Prisma | OPEN | Out of scope for connectivity audit. |
| #225 | [STAB-1] Fix Prisma import syntax in checkout/route.ts | OPEN | Out of scope for connectivity audit. |
| #243 | MyFatoorah doc updates | OPEN | Out of scope for connectivity audit. |

---

## Recommendations for the Engineer

### PRIORITY 1 — Create Order Detail Page (#239)

```
Create: app/dashboard/orders/[id]/page.tsx
Purpose: Display individual order details (items, total, status, history, refund button)
Link: Already set up on orders list page
Acceptance: Click "View" on any order → detail page loads with order data (not 404)
Security: Must verify seller owns the order (use same cross-tenant check as refund endpoint)
```

### PRIORITY 2 — Fix Refund Endpoint Auth Error Handling (#240)

```
File: app/api/orders/[id]/refund/route.ts

Change the catch block to:
  } catch (error: any) {
    // Handle auth errors with 401, not 500 (follow pattern from /api/orders/[id] PATCH)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      )
    }

    console.error('Refund error:', error)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
```

**Rationale:** Pattern already exists in `/api/orders/[id]` PATCH handler (line 86-90). Refund endpoint should follow the same convention.

---

## Audit Scope & Methodology

This audit verified:
1. ✅ **Page routing** — Every Link/href/router.push resolves to real route
2. ✅ **API routing** — Every fetch/axios call hits an existing endpoint with correct HTTP method
3. ✅ **Webhook wiring** — Stripe webhook is routable and has signature verification
4. ✅ **Cross-tenant isolation** — Order operations verify seller ownership
5. ✅ **Auth error handling** — Checked for proper HTTP status codes (401 vs 500)
6. ✅ **Back buttons** — Detail/edit/settings pages have escape routes

**Static analysis only.** Code reading + file existence checks. No runtime testing.

---

**Audit completed:** Day 83  
**Status:** RED · 2 critical issues (1 wiring, 1 security)  
**Next steps:** Engineer must fix #239 (create detail page) and #240 (auth error handling) before shipping. Stripe webhook (#241) is correctly wired.
