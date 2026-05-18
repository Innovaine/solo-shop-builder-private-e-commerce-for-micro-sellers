# Day 53 — Connectivity Audit

**Verdict: YELLOW · 2 critical wiring issues found**

---

## Routes found in the codebase

### Public routes
- `/` (homepage)
- `/auth/login` (login/signup)
- `/auth/forgot-password` (forgot password form)
- `/auth/verify` (email verification)
- `/auth/reset-password` (password reset)
- `/shop/[slug]` (public storefront)
- `/shop/[slug]/product/[productId]` (product detail)
- `/checkout` (checkout page)
- `/checkout/success` (checkout success confirmation)
- `/track/[orderId]` (order tracking page)

### Protected routes (authenticated sellers)
- `/dashboard` (dashboard home)
- `/dashboard/create-shop` (shop creation)
- `/dashboard/products` (product list)
- `/dashboard/products/new` (create product)
- `/dashboard/products/[id]/edit` (edit product)
- `/dashboard/products/import` (CSV import)
- `/dashboard/profile` (seller profile)
- `/dashboard/branding` (shop branding)
- `/dashboard/email-template` (email template editor)
- `/dashboard/analytics` (analytics dashboard)
- `/dashboard/billing` (billing dashboard)
- `/dashboard/orders` (orders list)
- `/dashboard/settings` (settings)

### API endpoints (all working)
- All 30 API routes present with correct HTTP methods ✅
  - Auth: login, signup, logout, verify, forgot-password, reset-password
  - Products: CRUD, variants, upload, export, import
  - Orders: CRUD, refund, export
  - Shops: CRUD, profile, branding, email-template
  - Checkout: Stripe + MyFatoorah
  - Webhooks: Stripe
  - Account: password, delete
  - Health: status check

---

## 🚨 CRITICAL ISSUES FOUND

### Issue 1: Cart → Checkout flow is broken

**Location**: `app/components/CartButton.tsx:117, 122`

The "Proceed to Checkout" button links to `/shop/${shopSlug}/checkout` but this route **does not exist**. The actual checkout page is at `/checkout`.

**Evidence**:
```tsx
// CartButton.tsx — WRONG
<Link href={`/shop/${shopSlug}/checkout`}>
  <Button variant="primary" size="lg" className="w-full">
    Proceed to Checkout
  </Button>
</Link>
```

**Actual route**:
```
app/checkout/page.tsx → route is /checkout (not /shop/[slug]/checkout)
```

**Impact**: CRITICAL
- Every customer trying to buy will click "Proceed to Checkout" → 404 Not Found
- Buy flow is completely broken at the final step
- This is the most critical wiring bug in the app

**Fix**: Change lines 117 and 122 in CartButton.tsx from:
```tsx
href={`/shop/${shopSlug}/checkout`}
href={`/shop/${cart.shopSlug}/checkout`}
```
to:
```tsx
href="/checkout"
href="/checkout"
```

---

### Issue 2: Dashboard has NO navigation to 7 sub-pages (orphaned)

**Location**: `app/dashboard/page.tsx` — main navigation

The dashboard home page only links to `/dashboard/products`. There is **no way for users to reach** 7 other dashboard pages that exist in the codebase:

| Sub-route | Status | Evidence |
|-----------|--------|----------|
| `/dashboard/analytics` | ❌ ORPHAN | Not linked anywhere except Stripe webhook email |
| `/dashboard/billing` | ❌ ORPHAN | Not linked anywhere |
| `/dashboard/orders` | ⚠️ PARTIAL | Only in Stripe webhook email (line: `dashboard/orders`) |
| `/dashboard/profile` | ❌ ORPHAN | Not linked anywhere |
| `/dashboard/branding` | ❌ ORPHAN | Not linked anywhere |
| `/dashboard/email-template` | ❌ ORPHAN | Not linked anywhere |
| `/dashboard/settings` | ❌ ORPHAN | Not linked anywhere |

**Evidence**:
```tsx
// app/dashboard/page.tsx — line 85
<Link href="/dashboard/products">
  <Button variant="secondary">
    Manage Products
  </Button>
</Link>
```
(No other dashboard sub-page links present)

**Impact**: HIGH
- Users can only access `/dashboard/products` from the dashboard
- All other features (analytics, billing, orders, profile, branding, email-template, settings) are unreachable
- These pages exist in the codebase but are invisible to users

**Fix**: Add a navigation menu to `app/dashboard/page.tsx` that links to all sub-pages:
```tsx
// Example structure (implement in Header or sidebar)
<nav className="space-y-2">
  <Link href="/dashboard/products">Products</Link>
  <Link href="/dashboard/analytics">Analytics</Link>
  <Link href="/dashboard/billing">Billing</Link>
  <Link href="/dashboard/orders">Orders</Link>
  <Link href="/dashboard/profile">Profile</Link>
  <Link href="/dashboard/branding">Branding</Link>
  <Link href="/dashboard/email-template">Email Template</Link>
  <Link href="/dashboard/settings">Settings</Link>
</nav>
```

---

## Auth / session wiring

**Session mechanism**: Cookie-based (iron-session, HttpOnly, Secure, SameSite=Strict)
- All protected pages check session via `await getSession()` → redirect `/auth/login` if missing ✅
- All protected API routes check auth via `await requireAuth()` which reads cookies ✅
- **Consistency**: ✅ Both use the SAME mechanism throughout

**Result**: Auth is correctly wired. No mismatches detected.

---

## Reachability check

### Reachable pages ✅
- `/` — public landing page
- `/auth/login` — linked from `/` (2 places)
- `/auth/forgot-password` — linked from `/auth/login`
- `/auth/reset-password` — linked from forgot-password email
- `/shop/[slug]` — public URL, accessible via dashboard
- `/shop/[slug]/product/[productId]` — linked from shop product grid
- `/checkout` — ❌ UNREACHABLE — **cart tries to link to `/shop/[slug]/checkout`** (Issue 1)
- `/checkout/success` — accessible from payment webhook
- `/track/[orderId]` — accessible from order confirmation email
- `/dashboard` — accessible after login
- `/dashboard/create-shop` — auto-redirect from dashboard if no shop exists
- `/dashboard/products` — linked from dashboard
- `/dashboard/products/new` — linked from products page
- `/dashboard/products/[id]/edit` — linked from products list

### Orphaned pages (no inbound links) ❌
- `/dashboard/analytics` — exists but unreachable
- `/dashboard/billing` — exists but unreachable
- `/dashboard/orders` — exists but unreachable (except via Stripe email deeplink)
- `/dashboard/profile` — exists but unreachable
- `/dashboard/branding` — exists but unreachable
- `/dashboard/email-template` — exists but unreachable
- `/dashboard/settings` — exists but unreachable
- `/dashboard/products/import` — exists but unreachable (should be linked from products page)

---

## Key flows connectivity

### Sign-up / Login Flow
1. User lands on `/` ✅
2. Clicks "Start selling today" → `/auth/login` ✅
3. Fills email + password, clicks "Sign In" → `POST /api/auth/login` ✅
4. API sets session cookie, `router.push('/dashboard')` ✅
5. Lands on `/dashboard` (protected, checks session) ✅
**Result**: ✅ Complete

### Shop Creation Flow
1. User on `/dashboard`, no shop exists ✅
2. Page auto-redirects to `/dashboard/create-shop` ✅
3. User enters shop name + slug, clicks "Create Shop" → `POST /api/shops` ✅
4. API creates shop, auto-redirect to `/dashboard` ✅
5. User now sees shop URL + "Manage Products" button ✅
**Result**: ✅ Complete

### Product Management Flow
1. User on `/dashboard`, clicks "Manage Products" → `/dashboard/products` ✅
2. Lists products with "Edit" and "Delete" buttons, "+ Add Product" button ✅
3. Click "Edit" → `/dashboard/products/[id]/edit` ✅
4. Form fetches product via `GET /api/products/[id]` ✅
5. User updates details, clicks "Update Product" → `PUT /api/products/[id]` ✅
6. Redirects to `/dashboard/products` ✅
**Result**: ✅ Complete

### Browse & Buy Flow
1. Customer lands on `/shop/[slug]` (public storefront) ✅
2. Sees product grid, clicks product → `/shop/[slug]/product/[productId]` ✅
3. Product detail shows "Add to Cart" button ✅
4. Clicks → `POST /api/cart/add` (in-memory client-side cart) ✅
5. Floating cart button shows cart count ✅
6. Clicks floating cart → cart modal opens ✅
7. Clicks "Proceed to Checkout" → tries `router.push('/shop/${shopSlug}/checkout')` ❌ **404 NOT FOUND**
8. **FLOW BREAKS HERE** ❌
**Result**: ❌ BROKEN — cart checkout links to non-existent route

---

## Back button coverage

### Product detail pages ✅
- `/shop/[slug]/product/[productId]` — has "← Back to Shop" link to `/shop/[slug]` ✅

### Edit/settings pages
- `/dashboard/products/[id]/edit` — has "Cancel" button but NO top-level back button
- `/dashboard/profile`, `/dashboard/branding`, `/dashboard/email-template` — have "Cancel" buttons but NO back buttons at top

**Verdict**: Most pages have escape routes (Cancel buttons), but no prominent back buttons at the top. Users on mobile must scroll to find Cancel.

---

## Summary of findings

| Issue | Severity | Type | Status |
|-------|----------|------|--------|
| Cart → Checkout links to 404 | **CRITICAL** | Wiring | ❌ BROKEN |
| Dashboard has 7 orphaned sub-pages | **CRITICAL** | Navigation | ❌ BROKEN |
| Product import page not linked from products list | HIGH | Navigation | ⚠️ Missing link |
| Missing top-level back buttons on settings pages | MEDIUM | UX | ⚠️ Minor |

---

## What's working ✅
- **Sign-up and login** are fully connected and functioning
- **Auth wiring** is consistent between pages and APIs (cookie-based)
- **Product management** flow works end-to-end (list → edit → save)
- **API endpoints** all exist with correct HTTP methods
- **Public storefront** navigation works correctly (products → details)
- All protected pages check session correctly

---

## What's broken ❌
- **Buy flow breaks at checkout**: Cart "Proceed to Checkout" button links to non-existent `/shop/[slug]/checkout` → 404
- **Dashboard is mostly hidden**: 7 out of 8 dashboard sub-pages are unreachable from the main dashboard page
- **Product import** feature exists but users can't find it (no link from products page)

---

## Recommendation for the engineer — TODAY (HIGH PRIORITY)

**BLOCKER 1: Fix cart checkout link (5 minutes)**
- File: `app/components/CartButton.tsx`
- Change lines 117 and 122 from `/shop/${shopSlug}/checkout` to `/checkout`
- **Why**: Every customer trying to buy will hit a 404. This is the most critical path.

**BLOCKER 2: Add dashboard navigation (20-30 minutes)**
- File: `app/dashboard/page.tsx`
- Add a navigation menu/sidebar that links to all 8 dashboard sub-pages:
  - Products, Analytics, Billing, Orders, Profile, Branding, Email Template, Settings
- Consider using a reusable Header component or sidebar so all pages have consistent navigation
- **Why**: 7 features are invisible to users. They can't access analytics, billing, orders, profile, etc.

**NICE-TO-HAVE: Add back buttons to settings pages (10 minutes)**
- Add "← Back" link at the top of:
  - `/dashboard/products/[id]/edit`
  - `/dashboard/profile`
  - `/dashboard/branding`
  - `/dashboard/email-template`
- **Why**: Better UX, especially on mobile

---

## Files to modify

1. **app/components/CartButton.tsx** — Fix checkout link
2. **app/dashboard/page.tsx** — Add navigation to sub-pages
3. (Optional) **app/dashboard/*.tsx** — Add back buttons to edit/settings pages

---

## Test checklist after fixes

- [ ] Cart "Proceed to Checkout" button navigates to `/checkout` (not 404)
- [ ] Checkout page loads with cart items visible
- [ ] Dashboard has visible links/nav to all 8 sub-pages
- [ ] Clicking analytics/billing/orders/profile/branding/email-template works
- [ ] All dashboard sub-pages have back or navigation to return to dashboard
- [ ] E2E test: Home → Login → Create Shop → Add Product → View Shop → Add to Cart → Proceed to Checkout ✅

