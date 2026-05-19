# Day 79 — Connectivity Audit

**Verdict: YELLOW · 1 HIGH-priority wiring issue identified**

**Status:** Application wiring is mostly correct. All critical user flows connect end-to-end. Dashboard navigation is fully linked. Back buttons are present on detail/edit pages. **However, one HTTP method mismatch will cause a runtime 405 error when sellers upload logos.**

---

## Routes Found in the Codebase

**Page Routes (23 total):**
- `/` (landing)
- `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`
- `/dashboard` (main hub)
  - `/dashboard/products`, `/dashboard/products/new`, `/dashboard/products/[id]/edit`, `/dashboard/products/import`
  - `/dashboard/orders`
  - `/dashboard/analytics`
  - `/dashboard/billing`
  - `/dashboard/branding`
  - `/dashboard/profile`
  - `/dashboard/settings`
  - `/dashboard/email-template`
  - `/dashboard/create-shop`
- `/shop/[slug]` (public storefront)
  - `/shop/[slug]/product/[productId]` (product detail)
- `/checkout`, `/checkout/success`
- `/track/[orderId]` (order tracking)

**API Endpoints (34 total):**
- Auth: POST `/api/auth/{login,signup,logout,forgot-password,reset-password,verify}`
- Account: DELETE `/api/account/delete`, PATCH `/api/account/password`
- Shops: GET/POST `/api/shops`, GET/POST `/api/shops/branding` ⚠ **METHOD MISMATCH** (see [WIRING] task below)
- Shops (continued): PATCH `/api/shops/profile`, PATCH `/api/shops/status`, PATCH `/api/shops/email-template`
- Products: GET/POST/PATCH `/api/products`, GET/PATCH/DELETE `/api/products/[id]`, POST `/api/products/import`, POST `/api/products/upload`
  - Variants: GET/POST `/api/products/[id]/variants`, GET/PATCH/DELETE `/api/products/[id]/variants/[variantId]`
  - Status: PATCH `/api/products/[id]/status`, PATCH `/api/products/bulk-status`
  - Export: GET `/api/products/export`
- Orders: GET/POST `/api/orders`, GET/PATCH `/api/orders/[id]`, GET `/api/orders/[id]/history`
  - Refund: POST `/api/orders/[id]/refund`, GET `/api/orders/export`
- Checkout: POST `/api/checkout`, POST `/api/checkout/myfatoorah`, POST `/api/checkout/myfatoorah/callback`
- Billing: GET `/api/billing`
- Analytics: GET `/api/analytics`
- Health: GET `/api/health`
- Webhooks: POST `/api/webhooks/stripe`

---

## Critical User Flows — Connectivity Check

### ✅ Sign-up Flow
Landing (`/`) → Sign-up (`/auth/signup` — Link from `/page.tsx:40`) → Dashboard (`/dashboard` — redirect on POST `/api/auth/signup` success)

### ✅ Sign-in Flow
Landing (`/`) → Login (`/auth/login` — Link from `/page.tsx:40`) → Dashboard (`/dashboard` — redirect on POST `/api/auth/login` success)

### ✅ Browse & Buy Flow
Shop Storefront (`/shop/[slug]` — public route) → Product Detail (`/shop/[slug]/product/[productId]` — Link from `/shop/[slug]/page.tsx:220`) → Add to Cart → View Cart Modal → Checkout (`/checkout` — Link from `CartButton.tsx:167`) → Payment Success (`/checkout/success` — redirect from POST `/api/checkout`)

### ✅ Dashboard Hub Navigation
Dashboard (`/dashboard`) fully links to all 9 subpages:
- Products (`/dashboard/products` — Link at line 109)
- Orders (`/dashboard/orders` — Link at line 115)
- Analytics (`/dashboard/analytics` — Link at line 121)
- Branding (`/dashboard/branding` — Link at line 127)
- Profile (`/dashboard/profile` — Link at line 133)
- Billing (`/dashboard/billing` — Link at line 139)
- Email Templates (`/dashboard/email-template` — Link at line 145)
- Settings (`/dashboard/settings` — Link at line 151)
- CSV Import (`/dashboard/products/import` — Link at line 157)

### ✅ Product Edit Flow
Products List → Edit Product (`/dashboard/products/[id]/edit` — Link from product actions) → Back button exists (`dashboard/products/[id]/edit/page.tsx:144`) pointing to `/dashboard/products`

### ⚠ **Profile Update Flow** — **METHOD MISMATCH** (see [WIRING] task below)
Profile Page (`/dashboard/profile/page.tsx:195`) calls:
- `POST /api/shops/branding` (line 195) for logo upload
- `PATCH /api/shops/profile` (line 206) for profile text

**BUT:** `/api/shops/branding/route.ts` only exports `PATCH`, not `POST`. This will cause **405 Method Not Allowed** when sellers try to upload a logo.

---

## Hub-Page Navigation Audit

**Dashboard (`/dashboard/page.tsx`)** — Primary hub for authenticated sellers

| Sub-route | Linked? | Evidence |
|-----------|---------|----------|
| `/dashboard/products` | ✅ | `Link href="/dashboard/products"` at line 109 |
| `/dashboard/orders` | ✅ | `Link href="/dashboard/orders"` at line 115 |
| `/dashboard/analytics` | ✅ | `Link href="/dashboard/analytics"` at line 121 |
| `/dashboard/branding` | ✅ | `Link href="/dashboard/branding"` at line 127 |
| `/dashboard/profile` | ✅ | `Link href="/dashboard/profile"` at line 133 |
| `/dashboard/billing` | ✅ | `Link href="/dashboard/billing"` at line 139 |
| `/dashboard/email-template` | ✅ | `Link href="/dashboard/email-template"` at line 145 |
| `/dashboard/settings` | ✅ | `Link href="/dashboard/settings"` at line 151 |
| `/dashboard/products/import` | ✅ | `Link href="/dashboard/products/import"` at line 157 |

**Verdict:** All dashboard subpages are reachable from the hub. No orphans.

---

## Back Button / Escape Navigation Check

| Page | Has Back Button? | Evidence |
|------|------------------|----------|
| `/dashboard/products/[id]/edit` | ✅ | `Button onClick={() => router.push('/dashboard/products')}` at line 144 |
| `/dashboard/profile` | ✅ | `Button onClick={() => router.push('/dashboard')}` at line 58 |
| `/shop/[slug]/product/[productId]` | ✅ | `Link href={`/shop/${slug}`} "← Back to Shop"` at line 37 |
| `/checkout` | ✅ | "Continue shopping" button at line 95 → `router.push('/')` |
| `/auth/reset-password` | ✅ | "Back to login" link present (implicit in form) |

**Verdict:** All detail/edit pages have escape routes. No users trapped.

---

## Auth / Session Wiring

**Protected Routes (require login):**
- `/dashboard/*` — All pages check `getSession()` and redirect to `/auth/login` if not authenticated ✅
- `/api/shops` (GET/POST) — Uses `requireAuth()` from `@/lib/auth` ✅
- `/api/shops/profile` (PATCH) — Uses `requireAuth()` ✅
- `/api/shops/branding` (PATCH) — Uses `requireAuth()` ✅
- All `/api/orders/*` — Use `requireAuth()` ✅

**Session Mechanism:**
- Pages use `getSession()` from `@/lib/auth` (iron-session cookie-based) ✅
- API routes use `requireAuth()` which reads the same session cookie ✅
- Consistency: Both page and API use same auth library, same session source ✅

**Verdict:** Auth wiring is consistent. No session mismatches detected.

---

## HTTP Method Mismatches

### ⚠ **[WIRING-CRITICAL] Profile page calls POST but API only exports PATCH**

**Location of Issue:**
- **File:** `app/dashboard/profile/page.tsx`
- **Line:** 195
- **Code:** `const uploadRes = await fetch('/api/shops/branding', { method: 'POST', body: formDataImg })`

**API Handler:**
- **File:** `app/api/shops/branding/route.ts`
- **Line:** 9
- **Exported Methods:** `PATCH` only (no `POST`)

**Impact:**
Every time a seller tries to upload a logo on `/dashboard/profile`, the browser sends:
```
POST /api/shops/branding
```
The API responds with:
```
405 Method Not Allowed
```
User sees error toast: "Failed to upload logo" (from catch block on line 201).

**Fix Options:**
1. **Recommended:** Change page to use `PATCH` instead of `POST` (line 195)
2. **Alternative:** Add `export async function POST(...)` to the API route that delegates to the PATCH handler

---

## Missing Inbound Links (Orphaned Pages)

✅ All pages have at least one inbound link or are entry points:
- `/auth/*` — Entry points (reachable from landing)
- `/dashboard/*` — Reachable from `/dashboard` hub page
- `/shop/[slug]` — Deep link entry point (from emails, shared links)
- `/shop/[slug]/product/[productId]` — Linked from `/shop/[slug]`
- `/checkout/success` — Redirect target from POST `/api/checkout`
- `/track/[orderId]` — Deep link entry point (order tracking emails)

**No orphans detected.** ✅

---

## What's Working

✅ **Sign-up / sign-in flows** — Users can authenticate and reach the dashboard
✅ **Browse & buy flows** — Customers can add items to cart, proceed to checkout, see order confirmation
✅ **Dashboard navigation** — All 9 subpages are reachable from the main hub
✅ **Back buttons** — Product edit, detail, and profile pages all have escape routes
✅ **Auth consistency** — Pages and APIs use the same session mechanism (iron-session cookies)
✅ **API endpoints** — Most routes are fully wired with correct HTTP methods
✅ **Public storefronts** — Shop and product pages are public (no auth required) ✅

---

## What's Not Working

❌ **Logo upload on seller profile fails** — `POST /api/shops/branding` returns 405 Method Not Allowed because the API route only exports `PATCH`

---

## Tasks Filed

- **#1 [WIRING-CRITICAL]** Profile logo upload returns 405 — POST/PATCH mismatch (HIGH priority)

---

## Recommendation for the Engineer

**Fix the method mismatch TODAY.** Sellers trying to upload logos will see a silent failure. This is a UX blocker even though it's just one line to fix.

Option A (recommended, 10 seconds):
- Change line 195 of `app/dashboard/profile/page.tsx` from `method: 'POST'` to `method: 'PATCH'`

Option B (more work):
- Keep POST as-is and add a POST handler to the API route that proxies to the existing PATCH logic

Once fixed, the entire profile update flow (text + logo) will work correctly.
