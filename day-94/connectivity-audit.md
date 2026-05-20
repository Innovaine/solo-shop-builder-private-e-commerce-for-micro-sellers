# Day 94 — Connectivity QA Audit Report: Solo Shop Builder

- **By:** Zainab (Connectivity QA)
- **Cycle:** 165
- **Date:** 20/05/2026, 9:30 AM
- **Status:** 🔴 RED (2 critical wiring issues found)

---

## EXECUTIVE SUMMARY

**Verdict: 🔴 RED — 2 critical wiring bugs block customer flows today**

Found 2 **must-fix** issues that will cause runtime failures in customer-facing flows:
1. **#266 [WIRING-CRITICAL]**: Order tracking GET /api/orders/[id] → endpoint exports PATCH only, not GET. Page calls `fetch(/api/orders/{id})` which returns **405 Method Not Allowed**. Customer order tracking completely broken.
2. **#267 [WIRING]**: Checkout "Continue shopping" button uses template literal `router.push(\`/shop/${cart.shopSlug}\`)` which resolves to `/shop/undefined` if shopSlug is missing, causing 404 on click. Risk: customer can't navigate back to shop after failed checkout.

Both are enum-level bugs—easy fixes but required before Day 95 cutoff. No changes to overall wiring since Day 93; these are **pre-existing regressions** from the engineer's code.

---

## DETAILED FINDINGS

### 1. **#266 [WIRING-CRITICAL]: Order Tracking API Method Mismatch**

**Severity:** CRITICAL — Blocks FR-14 (Order Tracking)

**Issue:**
- **Page:** `app/track/[orderId]/page.tsx:50` calls `fetch(\`/api/orders/${orderId}\`)`
- **API Route:** `app/api/orders/[id]/route.ts` **only exports PATCH**, no GET
- **Result:** Runtime 405 Method Not Allowed when customer tries to load tracking page
- **Impact:** Every customer attempting to track their order will see a failure page

**Evidence:**

File: `app/api/orders/[id]/route.ts`
```ts
// Only exports:
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) { ... }

// Missing:
export async function GET(...) { ... }
```

File: `app/track/[orderId]/page.tsx:50`
```ts
const response = await fetch(`/api/orders/${orderId}`)
if (!response.ok) {
  throw new Error('Order not found')
}
```

**Fix:** Add GET handler to `app/api/orders/[id]/route.ts` that returns order details for customer view (public read access, no auth required for order ID).

---

### 2. **#267 [WIRING]: Checkout "Continue Shopping" Button — Undefined Shop Slug**

**Severity:** HIGH — UX friction + potential 404

**Issue:**
- **Page:** `app/checkout/page.tsx:232` calls `router.push(\`/shop/${cart.shopSlug}\`)`
- **Problem:** If `cart.shopSlug` is undefined (edge case: cart expires or is recreated), resolves to `/shop/undefined`
- **Also found:** `app/checkout/success/page.tsx:190` same pattern
- **Result:** If shopSlug is null, user lands on non-existent route

**Evidence:**

File: `app/checkout/page.tsx:232`
```ts
<Button
  variant="secondary"
  onClick={() => router.push(`/shop/${cart.shopSlug}`)}  // Risk: shopSlug could be undefined
  disabled={isLoading}
  className="flex-1"
>
  Continue shopping
</Button>
```

File: `app/checkout/success/page.tsx:190`
```ts
{orderDetails && (
  <Button 
    variant="primary" 
    onClick={() => router.push(`/shop/${orderDetails.shop.slug}`)}  // This one is safe (guarded by orderDetails check)
    className="w-full"
  >
    Back to {orderDetails.shop.name}
  </Button>
)}
```

**Fix:** Add defensive check: `cart.shopSlug ? `/shop/${cart.shopSlug}` : '/'` or disable button if shopSlug is missing.

---

## S3 IMAGE RENDERING — NOT A WIRING BUG

Verified: **Product images render correctly on storefront BUT show emoji on detail pages.**

- **Storefront listing** (`app/shop/[slug]/page.tsx:271-281`): ✅ Renders `<img src={product.imageUrl}>` correctly
- **Product detail** (`app/shop/[slug]/product/[productId]/page.tsx:57-60`): ❌ Still shows emoji `💎` instead of `<img>`

**Verdict:** Not a wiring issue—the API returns imageUrl correctly, but the component markup chooses emoji. Mark as design/engineer rendering task, not connectivity.

---

## AUTH WIRING — ✅ CORRECT

Verified auth pattern across protected APIs:
- `app/api/shops/profile/route.ts`: Uses `requireAuth()`, returns 401 on failure ✅
- `app/api/webhooks/stripe/route.ts`: Has signature verification via `stripe.webhooks.constructEvent()` ✅
- `app/api/orders/[id]/route.ts`: Uses `requireAuth()` with proper scope check ✅

No auth mismatches found.

---

## CART → CHECKOUT → SUCCESS FLOW — ✅ CONNECTED

**Flow verification:**

| Step                                                 | Route / URL                  | Status |
|------------------------------------------------------|------------------------------|--------|
| User clicks "Proceed to Checkout" (CartButton:179) | `/checkout`                  | ✅ Link correct, page exists |
| Checkout page displays items (CheckoutPage)        | `/checkout`                  | ✅ Page loads |
| User clicks "Proceed to payment"                   | POST `/api/checkout` or `/api/checkout/myfatoorah` | ✅ Both endpoints exist with POST |
| Browser redirected to payment provider             | Stripe/MyFatoorah            | ✅ Stripe webhook verified |
| After payment, redirected back                     | `/checkout/success?session_id=...` | ✅ Page exists |
| Success page shows "Back to {shop}" button         | `/shop/${orderDetails.shop.slug}` | ✅ Safe (guarded by orderDetails) |

The core flow is connected. **Issue #267 is edge case, not main flow.**

---

## OVERALL WIRING MAP — UNCHANGED

Verified routes from Day 93 remain correct:
- 25 page routes (/ → /track/[id], all connected)
- 34 API endpoints (verified POST /api/checkout, GET /api/products, etc.)
- 0 orphan pages
- 0 broken nav links (except #267 edge case above)

---

## TASKS TO FILE

1. **#266 (HIGH)**: Engineer — Add GET handler to `app/api/orders/[id]` for order tracking flow
2. **#267 (MEDIUM)**: Engineer — Defensive check on `cart.shopSlug` in checkout page before template literal

---

## CHECKLIST

- [x] Page routes enumerated (25 pages)
- [x] API endpoints enumerated (34 endpoints)
- [x] Links from page to page verified (all connected except #267 edge case)
- [x] API method matches caller (found #266 mismatch)
- [x] Auth wiring on protected routes (all correct)
- [x] Webhook signature verification (Stripe verified)
- [x] S3 image URL rendering (confirmed storefront ✅, detail ❌ markup issue)
- [x] Third-party integrations (Stripe ✅, MyFatoorah callback ✅)

---

## NEXT STEPS

**For engineer today (Day 94):**
1. Add `GET` export to `app/api/orders/[id]/route.ts` (5 min fix)
2. Add null-check on `cart.shopSlug` before template literal in checkout (3 min fix)
3. (Optional, low priority) Fix emoji → image on product detail page

**Recommendation:** Fix #266 first (blocking customer feature), then #267 (edge case UX).

---

**Report submitted:** Zainab (Connectivity QA)
