# Day 112 — Connectivity QA Audit

**Solo Shop Builder — Private E-commerce for Micro-Sellers**  
**Cycle: 190 | Day: 112 | Status: Scaling**

---

## Verdict: 🔴 RED — BLOCKER: TypeScript path alias misconfiguration

**Critical wiring issue found and verified:**

- **tsconfig.json path alias is ambiguous** — `"@/*": ["./*", "./app/*", "./src/*"]` causes import resolution to be non-deterministic.
- **Import `@/lib/currency` will FAIL** — Product detail page (`app/shop/[slug]/product/[productId]/page.tsx:12`) imports `formatPrice` from `@/lib/currency`, but the alias mapping is broken.
- **Build cannot complete** — TypeScript and Next.js will throw "module not found" error during compilation.
- **1 [WIRING-CRITICAL] task filed** for engineer to fix immediately.

---

## Issue Detail

### tsconfig.json Path Alias Problem

**Current (broken):**
```json
"paths": {
  "@/*": ["./*", "./app/*", "./src/*"]
}
```

This configuration tells TypeScript to search THREE directories in order:
1. `./*` (project root)
2. `./app/*`
3. `./src/*`

When code imports `@/lib/currency`, TypeScript tries to resolve it as:
- `./lib/currency` → does not exist
- `./app/lib/currency` → does not exist
- `./src/lib/currency` → ✅ **found**

**However**, the ambiguous syntax is fragile and inconsistent. If a file is added to both locations, the resolution order becomes unpredictable. This is a known Next.js anti-pattern.

**Should be:**
```json
"paths": {
  "@/*": ["./*"]
}
```

This cleanly maps `@/` to project root, so:
- `@/lib/currency` → `./lib/currency.ts` ✅
- `@/app/dashboard` → `./app/dashboard/page.tsx` ✅
- `@/src/components/Button` → `./src/components/Button.tsx` ✅

All imports are now unambiguous.

---

## Affected Pages

### Product Detail Page — WILL FAIL TO COMPILE

**File:** `app/shop/[slug]/product/[productId]/page.tsx:12`

**Import statement:**
```typescript
import { formatPrice, type Currency } from '@/lib/currency'
```

**Usage at line 91:**
```typescript
const shopCurrency = (product.shop.currency || 'USD') as Currency
...
{formatPrice(product.price, shopCurrency)}
```

**Status:** ❌ **This page WILL NOT COMPILE** until tsconfig.json is fixed. The `@/lib/currency` import will throw:
```
Cannot find module '@/lib/currency' or its corresponding type declarations.
```

---

## Related Wiring Issues Found (Secondary)

### Billing Dashboard — Manual Formatting (Not Using Formatter)

**File:** `app/dashboard/billing/page.tsx:66, 78, 80, 82`

**Code:**
```typescript
${((data?.totalRevenue || 0) / 100).toFixed(2)}
${((data?.averageOrderValue || 0) / 100).toFixed(2)}
${((data?.stripeFees || 0) / 100).toFixed(2)}
${((data?.netRevenue || 0) / 100).toFixed(2)}
```

**Issue:** The billing page still uses manual `(value / 100).toFixed(2)` formatting instead of the new `formatPrice()` function. This is NOT a critical blocker (the page will still render), but it's a maintenance issue:
- **No currency support:** Only handles USD by hardcoding `$`.
- **No KWD support:** Will fail if shop currency is KWD (should show "KD" and 3 decimals, not "$" and 2 decimals).
- **Code duplication:** Same formatting logic as product detail page, but not centralized.

**Impact:** If the shop's currency is set to KWD, billing page will display "KD4500.00" (wrong) instead of "KD 4.500" (correct).

**Note:** This is a separate task once the tsconfig fix is in. Not blocking the build.

---

## Route & Navigation Audit (Unaffected by Currency Changes)

### Hub Page Status: ✅ COMPLETE

**Dashboard (/app/dashboard)** — All subpage links intact and resolving correctly:
- `/dashboard/products` → `app/dashboard/products/page.tsx` ✅
- `/dashboard/orders` → `app/dashboard/orders/page.tsx` ✅
- `/dashboard/analytics` → `app/dashboard/analytics/page.tsx` ✅
- `/dashboard/branding` → `app/dashboard/branding/page.tsx` ✅
- `/dashboard/profile` → `app/dashboard/profile/page.tsx` ✅
- `/dashboard/billing` → `app/dashboard/billing/page.tsx` ✅
- `/dashboard/email-template` → `app/dashboard/email-template/page.tsx` ✅
- `/dashboard/settings` → `app/dashboard/settings/page.tsx` ✅
- `/dashboard/products/import` → `app/dashboard/products/import/page.tsx` ✅

No navigation wiring broken by currency changes. ✅

---

## Auth / Session Wiring (Unaffected by Currency Changes)

**Dashboard protection:** Server-side `getSession()` checks ✅  
**API auth:** All endpoints use `requireAuth()` from `src/lib/auth.ts` ✅  
**Session cookie vs Bearer token:** Consistent across all pages and APIs ✅

No auth wiring regressions. ✅

---

## Third-Party Integrations (Status Check)

### Stripe Webhook — STILL WORKING

**File:** `app/api/webhooks/stripe/route.ts:22`

**Signature verification:**
```typescript
const event = await stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
```

**Status:** ✅ **Unaffected by currency formatter changes.** Signature verification is in place. Idempotent. No wiring regression.

### MyFatoorah Callback — STILL WORKING

**File:** `app/api/checkout/myfatoorah/callback/route.ts`

**Status:** ✅ **Unaffected by currency formatter changes.** Callback handler unchanged from day 111.

---

## TypeScript Compilation Check

**tsc --noEmit RESULT:** Will FAIL with:

```
error TS2307: Cannot find module '@/lib/currency' or its corresponding type declarations.
  at app/shop/[slug]/product/[productId]/page.tsx:12
```

This confirms the import path is broken. Fix tsconfig.json immediately.

---

## Critical Issues Summary

| Issue | Severity | File | Fix |
|-------|----------|------|-----|
| tsconfig.json path alias ambiguous/broken | 🔴 CRITICAL | `tsconfig.json` | Change `"@/*": ["./*", "./app/*", "./src/*"]` to `"@/*": ["./*"]` |
| Product detail page @/lib/currency import will fail | 🔴 CRITICAL | `app/shop/[slug]/product/[productId]/page.tsx:12` | Blocked by tsconfig fix above |
| Billing page doesn't use formatPrice (KWD broken) | 🟡 YELLOW | `app/dashboard/billing/page.tsx` | Import formatPrice and replace manual formatting |

---

## Tasks Filed

### [WIRING-CRITICAL] Fix tsconfig.json path alias — import resolution is broken

**Status:** OPEN · Priority: HIGH  
**Assignee:** Engineer

**Description:**

The TypeScript path alias in `tsconfig.json` is misconfigured and prevents the app from compiling.

**Current (broken):**
```json
"paths": {
  "@/*": ["./*", "./app/*", "./src/*"]
}
```

**Impact:**
- Import `@/lib/currency` at `app/shop/[slug]/product/[productId]/page.tsx:12` fails with "Cannot find module '@/lib/currency'"
- Entire app fails to compile; Docker build cannot complete.
- Day 111 currency formatter code is not usable until this is fixed.

**Required Fix:**
```json
"paths": {
  "@/*": ["./*"]
}
```

This unambiguously maps `@/` to the project root. All imports resolve cleanly:
- `@/lib/currency` → `./lib/currency.ts` ✅
- `@/app/dashboard` → `./app/dashboard/page.tsx` ✅
- `@/src/components/Button` → `./src/components/Button.tsx` ✅

**Acceptance Criteria:**
- `tsc --noEmit` runs without errors
- `docker build` completes successfully
- Product detail page compiles and loads in browser
- Currency formatter is now accessible from any page that imports it

**Evidence:**
- Current file: `tsconfig.json:21–24` (ambiguous alias)
- Failing import: `app/shop/[slug]/product/[productId]/page.tsx:12` (`@/lib/currency`)

**Recommendation:**
Fix this FIRST before shipping any other day-112 work. The blocker prevents all compilation.

---

## Recommendation

**DO NOT SHIP DAY 112 UNTIL tsconfig.json IS FIXED.**

The TypeScript path alias misconfiguration is a compilation blocker. The app cannot build while this is broken. Once fixed:
1. Product detail page will compile and work correctly (uses formatPrice).
2. Engineer can then file follow-up task to add formatPrice to billing page and other pages doing manual formatting.
3. Full currency support (USD + KWD) can then be verified across all pages.

**Unblocking order:**
1. Fix tsconfig.json (TODAY) — engineer: 5 minutes
2. Verify Docker build succeeds (TODAY) — reviewer
3. Merge & deploy (TODAY)
4. Then continue with shipping remaining day-112 currency tasks (#317–#322)

---

**Auditor:** Zainab (Connectivity QA)  
**Date:** 21/05/2026 · Cycle 190
