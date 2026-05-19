# Day 84 — Task Verification

## Current stage: MVP (20 features)

## Verdict: 🛑 BLOCKED — 2 Critical wiring issues found

MVP stage CANNOT ship with current wiring issues. Two critical method mismatch bugs will cause runtime failures for customers. Must fix before deployment.

---

## Tool outputs (MANDATORY)

### route-validator . --json (Day 84)
```json
{
  "summary": {
    "routes": 58,
    "pages": 24,
    "apis": 34,
    "links": 92,
    "apiCalls": 36,
    "broken": 3,
    "orphans": 4,
    "methodMismatches": 2
  }
}
```

**CRITICAL ISSUES FOUND:**

### 🔴 METHOD MISMATCH #1: /api/shops/profile missing GET
```
File: app/dashboard/email-template/page.tsx:55
Caller: fetch('/api/shops/profile', { method: 'GET' })
Route handler: app/api/shops/profile/route.ts — only exports PATCH

Result: GET request will fail with 405 Method Not Allowed
Impact: Email template page cannot load seller's shop profile data
```

### 🔴 METHOD MISMATCH #2: /api/orders/[id] missing GET
```
File: app/track/[orderId]/page.tsx:44
Caller: fetch(`/api/orders/${orderId}`, { method: 'GET' })
Route handler: app/api/orders/[id]/route.ts — only exports PATCH

Result: GET request will fail with 405 Method Not Allowed
Impact: Customer order tracking page cannot load order details (FR-14 BROKEN)
```

### Broken links (3 found — minor)
```
1. app/shop/[slug]/SortDropdown.tsx:32 — router.push("/shop/${shopSlug}${queryString") — unterminated template string
2. app/shop/[slug]/product/[productId]/page.tsx:63 — <Link href="/shop/${slug}"> — unterminated template string
3. app/shop/[slug]/product/[productId]/page.tsx:170 — same issue
```

These are typos in string interpolation that will produce broken URLs at runtime.

### Orphaned pages (4 found — non-critical)
```
- /auth/reset-password — exists but not linked from anywhere
- /auth/verify — exists but not linked from anywhere
- /dashboard/orders/[id] — exists but not linked from hub (though back button works)
- /shop/[slug]/product/[productId] — exists but should be accessible via normal flow
```

These pages ARE reachable (some via query params, some via deep links) but not discoverable from hub navigation. Acceptable.

### Connectivity audit (day-84)
✅ GREEN per Zainab (before route-validator recheck)
- 24 pages enumerated ✅
- 34 API endpoints enumerated ✅
- All critical flows manually verified ✅

**Note:** Connectivity QA's manual audit missed the method mismatch issues (they verified routes exist, not that HTTP methods are properly exported). route-validator caught them.

### Build status
```
✅ Build successful, containers running
✅ Health check passing: {"status":"ok","database":"ok","email":"ok"}
✅ Code review: all 3 Day 84 fixes approved and deployed
```

**However:** The wiring issues exist in the deployed code. They were NOT caught by earlier QA because they require integration testing (caller + callee method match).

---

## Issues requiring immediate fix

### [WIRING-CRITICAL] #1: GET not exported from /api/shops/profile

**File:** `app/api/shops/profile/route.ts`

**Current state:**
```typescript
export async function PATCH(req: NextRequest) {
  // Updates shop profile
}
```

**Problem:** `app/dashboard/email-template/page.tsx:55` calls:
```typescript
const response = await fetch('/api/shops/profile', {
  method: 'GET',
  ...
})
```

**Fix options:**
1. Add GET handler:
```typescript
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn || !session.sellerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const shop = await prisma.shop.findFirst({
    where: { sellerId: session.sellerId }
  })
  
  return NextResponse.json(shop)
}
```

2. Or change page to PATCH (if that's the intent)

**Impact:** Blocks FR-35 (email template customization) — page cannot load.

---

### [WIRING-CRITICAL] #2: GET not exported from /api/orders/[id]

**File:** `app/api/orders/[id]/route.ts`

**Current state:**
```typescript
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Updates order status
}
```

**Problem:** `app/track/[orderId]/page.tsx:44` calls:
```typescript
const response = await fetch(`/api/orders/${orderId}`, {
  method: 'GET',
  ...
})
```

**Fix:** Add GET handler:
```typescript
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, shop: true }
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Return order data (no auth required for customer tracking)
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
```

**Impact:** Blocks FR-14 (customer order tracking) — CORE MVP FEATURE broken.

---

## Stage readiness assessment

### ✅ Code quality (verified by engineer + reviewer)
- TypeScript compilation: Pass
- Prisma patterns: Pass
- Build deployment: Pass
- Health checks: Pass

### ❌ Wiring completeness (FAILED — 2 critical issues)
- Method mismatches found: 2
- Broken links: 3 (minor)
- Orphaned pages: 4 (non-blocking)

### Decision
**DO NOT SHIP.** The 2 method mismatch issues will cause immediate runtime failures for:
1. Sellers trying to customize email templates (FR-35)
2. Customers trying to track orders (FR-14)

Both are CORE MVP features. The code exists, but the wiring is incomplete.

---

## Recommendation
1. **Engineer:** Fix the two missing GET handlers (1 hour)
2. **Engineer:** Test /dashboard/email-template page to verify GET now works
3. **Engineer:** Test /track/[orderId] page to verify GET now works
4. **Tester:** Verify order tracking flow end-to-end (customer receives email, clicks link, sees order)
5. **Task Verifier:** Re-run route-validator, re-verify
6. **Then:** Advance to ship

---

## Previous work (Day 84) — Still valid

### ✅ Task #244 verified: MyFatoorah error handling
- Code is correct and deployed ✅
- Error messages map correctly (payment_cancelled, payment_expired, payment_declined) ✅

### ✅ Task #225 verified: Prisma singleton pattern
- Checkout route uses correct import pattern ✅
- Deployed and building successfully ✅

### ✅ Order detail TypeScript fix verified
- Invalid product relation removed ✅
- Denormalized fields used correctly ✅

---

**Verification completed:** Day 84, 2026-05-20  
**Verifier:** Mehrdad, Task Verifier  
**Tools run:**
- route-validator . --json: 2 method mismatches, 3 broken links, 4 orphaned pages found
- curl health: OK
- Connectivity audit (read): GREEN (but missed method mismatch issues)
- Code review (read): PASS for Day 84 work

**Status:** BLOCKED — File tasks, wait for engineer fix, re-verify.
