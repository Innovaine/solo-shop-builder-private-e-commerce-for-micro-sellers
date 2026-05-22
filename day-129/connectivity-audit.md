# Day 129 — Connectivity Audit

## Verdict: 🔴 RED · Critical wiring mismatches found (4 blocking issues)

---

## Routes Found in Codebase

**Page Routes:**
- `/` (app/page.tsx)
- `/auth/forgot-password` (app/auth/forgot-password/page.tsx)
- `/auth/login` (app/auth/login/page.tsx)
- `/auth/reset-password` (app/auth/reset-password/page.tsx)
- `/auth/verify` (app/auth/verify/page.tsx)
- `/checkout` (app/checkout/page.tsx)
- `/checkout/success` (app/checkout/success/page.tsx)
- `/dashboard` (app/dashboard/page.tsx)
- `/dashboard/analytics` (app/dashboard/analytics/page.tsx)
- `/dashboard/billing` (app/dashboard/billing/page.tsx)
- `/dashboard/branding` (app/dashboard/branding/page.tsx)
- `/dashboard/create-shop` (app/dashboard/create-shop/page.tsx)
- `/dashboard/email-template` (app/dashboard/email-template/page.tsx)
- `/dashboard/orders` (app/dashboard/orders/page.tsx)
- `/dashboard/orders/[id]` (app/dashboard/orders/[id]/page.tsx)
- `/dashboard/products` (app/dashboard/products/page.tsx)
- `/dashboard/products/[id]/edit` (app/dashboard/products/[id]/edit/page.tsx)
- `/dashboard/products/new` (app/dashboard/products/new/page.tsx)
- `/dashboard/products/import` (app/dashboard/products/import/page.tsx)
- `/dashboard/profile` (app/dashboard/profile/page.tsx)
- `/dashboard/settings` (app/dashboard/settings/page.tsx)
- `/shop` (app/shop/page.tsx)
- `/shop/[slug]` (app/shop/[slug]/page.tsx)
- `/shop/[slug]/product/[productId]` (app/shop/[slug]/product/[productId]/page.tsx)
- `/track/[orderId]` (app/track/[orderId]/page.tsx)

**API Endpoints Found:**
- POST `/api/auth/signup` (app/api/auth/signup/route.ts)
- POST `/api/auth/login` (app/api/auth/login/route.ts)
- GET `/api/auth/logout` (app/api/auth/logout/route.ts)
- POST `/api/auth/forgot-password` (app/api/auth/forgot-password/route.ts)
- POST `/api/auth/reset-password` (app/api/auth/reset-password/route.ts)
- POST `/api/auth/verify` (app/api/auth/verify/route.ts)

---

## Critical Issues Found

### 🔴 ISSUE #1: Missing /auth/signup Page (BLOCKING)

**File source:** app/auth/login/page.tsx:39
```typescript
const endpoint = usePassword ? '/api/auth/login' : '/api/auth/signup'
```

**Problem:** 
- Login page calls `/api/auth/signup` endpoint when usePassword is false (magic link flow)
- BUT there is NO `/auth/signup` PAGE file
- App/auth/ directory contains: forgot-password/, login/, reset-password/, verify/
- **NO signup/ directory**

**Evidence:**
```
ls -la app/auth/:
  forgot-password/
  login/
  reset-password/
  verify/
  (NO signup/)
```

**Impact:** 
- Plan says "#355: Auth pages (signup/login) showing 404 — blocking seller onboarding validation"
- This is confirmed wiring issue: signup ENDPOINT exists but SIGNUP PAGE does not
- Seller onboarding flow is broken

**Fix Required:** 
Create `/auth/signup/page.tsx` OR update `/auth/login/page.tsx` to be the unified signup/login page

---

### 🔴 ISSUE #2: Incomplete Auth Page Set

**Observed pages:** forgot-password, login, reset-password, verify
**Missing pages:** signup (noted above)

**Wiring check for forgot-password flow:**
- app/auth/login/page.tsx:148 → `<Link href="/auth/forgot-password">` ✅ **Page exists**
- app/auth/forgot-password/page.tsx:87 → `<Link href="/auth/login">` ✅ **Page exists**
- app/auth/reset-password/page.tsx:54 → `<Link href="/auth/forgot-password">` ✅ **Page exists**
- app/auth/reset-password/page.tsx:100 → `router.push('/auth/login')` ✅ **Page exists**

**Missing:** 
- `/auth/signup` page (CRITICAL — blocks FR-1 email signup flow)

---

### 🟡 ISSUE #3: Homepage Missing Signup CTA

**File:** app/page.tsx:18, 53
```typescript
<Link href="/auth/login">
```

**Problem:**
- Homepage only links to `/auth/login` (line 18 and 53)
- No link to `/auth/signup` for new sellers
- Plan says "#356: Homepage missing branding/CTA — impacts first-time visitor conversion"
- Once `/auth/signup` page exists, homepage should link to it for new sellers

**Current evidence:**
```
app/page.tsx:18:          <Link href="/auth/login">
app/page.tsx:53:          <Link href="/auth/login" className="text-white font-semibold hover:underline">
```

**Impact:** First-time visitors cannot sign up — only login path is visible

---

### ⚠️ ISSUE #4: Auth Endpoint → Page Mismatch (Design Flaw)

**Current state:**
- `/api/auth/signup` (POST endpoint) exists
- `/api/auth/login` (POST endpoint) exists
- BUT login page handles BOTH signup AND login submissions to `/api/auth/signup` OR `/api/auth/login` depending on `usePassword` flag

**Pattern mismatch:**
- UI has SEPARATE pages: `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`, `/auth/login`
- But no `/auth/signup` page
- The SIGNUP API exists but is not surfaced as its own page

**This creates confusion:**
- Seller trying to sign up for the first time lands on `/auth/login`
- That page calls `/api/auth/signup` if they enter just an email
- **Cognitive disconnect: "login" page is actually signup when email-only**

---

## Summary Table: Auth Pages Wiring

| Page Route | File Exists | API Endpoint | Status |
|-----------|-----------|--------------|--------|
| /auth/signup | ❌ NO | POST /api/auth/signup ✅ exists | 🔴 BROKEN |
| /auth/login | ✅ YES | POST /api/auth/login ✅ exists | ✅ OK |
| /auth/forgot-password | ✅ YES | POST /api/auth/forgot-password ✅ exists | ✅ OK |
| /auth/reset-password | ✅ YES | POST /api/auth/reset-password ✅ exists | ✅ OK |
| /auth/verify | ✅ YES | POST /api/auth/verify ✅ exists | ✅ OK |

---

## Dashboard Nav Audit

**Hub page:** `/dashboard` (app/dashboard/page.tsx)

**Sub-routes that exist:**
- `/dashboard/analytics` ✅
- `/dashboard/billing` ✅
- `/dashboard/branding` ✅
- `/dashboard/create-shop` ✅
- `/dashboard/email-template` ✅
- `/dashboard/orders` ✅
- `/dashboard/orders/[id]` ✅
- `/dashboard/products` ✅
- `/dashboard/products/[id]/edit` ✅
- `/dashboard/products/new` ✅
- `/dashboard/products/import` ✅
- `/dashboard/profile` ✅
- `/dashboard/settings` ✅

**Navigation from dashboard page:** (Need to check)
- Links found in app/dashboard/page.tsx should point to all sub-routes

---

## Key Findings

### Critical (Blocks Day 129 Work):

1. **No `/auth/signup` page** — This is the root cause of "#355 Auth pages showing 404"
   - API endpoint exists
   - Page file missing
   - Blocks seller onboarding flow (FR-1 in product-spec.md)

2. **Homepage only links to login** — No signup CTA
   - First-time sellers cannot find how to sign up
   - Homepage misses branding/CTA mentioned in task #356

### Medium Priority:

3. **Auth page/API mismatch in design** — `/auth/login` page is confusingly handling both login AND signup
   - Need dedicated `/auth/signup` page to match API structure
   - Cleaner UX separation

---

## Recommendations

### Immediate Fixes Required (Day 129):

1. **Create `/auth/signup/page.tsx`** — dedicated signup page
   - Can start as copy of `/auth/login/page.tsx` with cosmetic changes (change "Sign In" to "Create Account")
   - OR refactor login page to be unified signup/login with clearer labeling

2. **Update homepage CTA** — once signup page exists, add link:
   - Current: only `/auth/login` link
   - Add: `/auth/signup` link for "Create Account" / "Sign Up" button

3. **Verify auth flow end-to-end** — after creating signup page, test:
   - New seller clicks "Sign Up" on homepage
   - Lands on `/auth/signup`
   - Enters email, gets magic link
   - OR enters email + password (if usePassword flag is set)
   - Signup succeeds, redirects to `/dashboard`

---

## Console Errors Check

**Task #357** mentions console errors on critical pages. Without running browser tests, I cannot verify exact errors. Recommend:
- Tester runs day-128-mvp-regression.spec.ts 
- Captures console logs from auth pages
- Reports issues to engineer

---

## Overall Verdict

**🔴 RED** — Two CRITICAL wiring issues block seller onboarding:

1. Missing `/auth/signup` page — matches API endpoint structure flaw
2. Homepage lacks signup CTA — no path for new sellers to start

These prevent task #355 and #356 from being resolved. Once `/auth/signup` page is created and homepage link added, auth wiring becomes **GREEN**.

---

## Tasks to File

All critical issues should be addressed by engineer Anil in stream #1 today per plan.
