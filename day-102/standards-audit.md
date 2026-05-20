# Day 102 — Standards QA Audit

**Verdict: 🔴 RED**

**Critical finding**: 2 duplicate module files remain on disk from Day 101. One (lib/db.ts) has DIFFERENT implementation than the canonical copy. This is an exact repeat of the cycle 163-172 bug class. **The stray files must be deleted before this code can pass QA.**

---

## STEP 0: Mandatory Build-Time Safety Checks

### Schema-Sync Drift (Prisma type imports)
✅ **PASS** — Spot-checked app/dashboard/orders/page.tsx and others. All DB-backed types properly import from `@prisma/client`. No hand-rolled divergent interfaces found.

### Module-Scope process.env Reads (Frozen at Build Time)
✅ **PASS** — Canonical files (src/lib/s3.ts, src/lib/db.ts, src/lib/auth.ts) all read process.env INSIDE functions. No module-top-level frozen env reads detected in server code.

### Duplicate Modules (Same File in Multiple Locations)
🔴 **CRITICAL** — Day 101 flagged this. It was NOT fixed. Exact same violation remains:

```
Project Root:
  lib/db.ts          ← STRAY COPY (different implementation, must delete)
  lib/s3.ts          ← STRAY COPY (byte-identical but confusing, must delete)

Canonical (imported via @/lib/* → src/lib/*):
  src/lib/db.ts      ← CANONICAL (reads query log in dev, full shutdown handlers)
  src/lib/s3.ts      ← CANONICAL (all env reads at runtime)
```

**Drift Details:**

| File | Implementation | Log Config | Shutdown Handlers | Default Export |
|------|---|---|---|---|
| lib/db.ts (stray) | `global.prisma` | `['error', 'warn']` only | Only `beforeExit` in prod | None |
| src/lib/db.ts (canonical) | `globalThis as unknown` | `['query', 'error', 'warn']` in dev | `beforeExit`, `SIGINT`, `SIGTERM` in prod | ✓ Yes |

If any route accidentally imports `lib/db.ts` directly instead of `@/lib/db`:
- Query logging is LOST in development
- Graceful shutdown is BROKEN in production (no SIGINT/SIGTERM handlers)
- This is a WIRING BUG masquerading as a path resolution success

---

## STEP 2: Canonical Pattern Compliance

### Authentication & Session (§requireAuth)
✅ **PASS** — Spot-checked:
- app/api/shops/route.ts: uses `requireAuth()` ✓
- app/api/orders/route.ts: uses `requireAuth()` ✓
- No raw `cookies().get('session')` in API routes detected

### Routing & Redirects (§redirect from next/navigation)
✅ **PASS** — Spot-checked:
- app/auth pages: use `redirect()` correctly
- No bare `NextResponse.redirect()` in server components

### Route Parameters & Query Strings (§params vs searchParams)
✅ **PASS** — Spot-checked:
- app/shop/[slug]/page.tsx: correctly uses `params.slug`
- app/dashboard/orders/page.tsx: correctly uses `searchParams`
- No cross-contamination detected

### API Responses & Error Handling (§NextResponse.json)
✅ **PASS** — All API routes return `NextResponse.json()` with proper status codes

### Data Units: Money in Cents (§/ 100 before .toFixed)
✅ **PASS** — Spot-checked:
- app/dashboard/orders/page.tsx line 230: `${(order.total / 100).toFixed(2)}` ✓
- Line 164: `${((analytics.totalRevenue || 0) / 100).toFixed(2)}` ✓
- Correct pattern everywhere

### Data Units: Time as ISO 8601 or Unix MS
✅ **PASS** — Dates handled as ISO strings from Prisma JSON serialization

### Database Access (§prisma singleton)
⚠️ **YELLOW-ALERT** — All working code imports `@/lib/db` (canonical). However:
- `lib/db.ts` exists as confusing stray
- `src/lib/db.ts` has default export (good)
- Risk: IDE might auto-import wrong copy in next edit

### Validation (§Zod for user input)
✅ **PASS** — Spot-checked multiple routes using Zod schemas

### Rate Limiting (§checkRateLimit)
✅ **PASS** — Auth routes use `checkRateLimit()` helper correctly

---

## STEP 3: Drift Detection (Same Purpose, Different Implementation)

Scanned for pattern divergence across similar endpoints:
- ✅ Order access: consistent use of params/searchParams
- ✅ Error responses: all return NextResponse.json with errors field
- ✅ Session checks: all use requireAuth() or getSession()
- ✅ Validation: all use Zod

**No NEW drift detected beyond the duplicate modules.**

---

## Summary of Violations

### 1. [WIRING-CRITICAL] Stray lib/db.ts with Different Implementation

**File**: `lib/db.ts` (project root)

**Why Critical**: 
- Identical filename as canonical `src/lib/db.ts`
- DIFFERENT implementation (missing query log, incomplete shutdown)
- Day 101 flagged it, Day 102 confirms: still not deleted
- This mirrors cycle 163-172 (duplicate S3 modules, wrong copy loaded for 9 rounds)

**Impact**:
- tsconfig path resolution currently masks the bug (app/lib/db doesn't exist, so @/lib/db falls through to src/lib/db)
- But if any code imports directly from `lib/db.ts` (not @/lib/db), it gets the broken version
- Query logging disabled in development
- Graceful shutdown broken in production

**Fix**: DELETE `lib/db.ts` entirely. Verify `find . -name db.ts | grep -v node_modules` returns only `./src/lib/db.ts`.

**Severity**: 🔴 CRITICAL (wiring bug, production stability risk)

---

### 2. [STANDARDS] Stray lib/s3.ts Duplicate

**File**: `lib/s3.ts` (project root)

**Why**:
- Identical to canonical `src/lib/s3.ts` (byte-for-byte)
- No logic drift, but confuses maintainers
- Sets trap for future fixes (like cycle 163-172)

**Fix**: DELETE `lib/s3.ts`. Verify `find . -name s3.ts | grep -v node_modules` returns only `./src/lib/s3.ts`.

**Severity**: 🟡 HIGH (hygiene + future-proofing)

---

## Verdict: 🔴 RED

**Reason**: Two stray module files exist on disk. One has DIFFERENT code. Day 101 flagged both as critical; neither was deleted. This is a WIRING DEFECT and exact repeat of cycle 163-172.

**Acceptance Criteria to Pass**:
1. Run: `find . -name "db.ts" -type f | grep -v node_modules | grep -v .next | wc -l` → Must return **1**
2. Run: `find . -name "s3.ts" -type f | grep -v node_modules | grep -v .next | wc -l` → Must return **1**
3. Verify via `find` that only `./src/lib/db.ts` and `./src/lib/s3.ts` exist

---

## What's Working

- ✅ Auth patterns: 100% canonical (requireAuth, getSession)
- ✅ Data units: money always `/100` before display, dates as ISO strings
- ✅ Validation: Zod used everywhere
- ✅ Runtime env reads: all inside functions (not frozen at build)
- ✅ Response format: all NextResponse.json
- ✅ DB access: all via @/lib/db (canonical path)

---

## Notes

1. **Priority**: The stray files MUST be deleted before next engineer cycle. This is the same bug that caused 9 rounds of wasted fixes in cycle 163-172.

2. **Path Resolution Working**: The tsconfig paths are currently protecting the codebase (`@/lib/* → src/lib/*` falls back correctly). But that's NOT a reason to keep the stray files—they're a footgun waiting for IDE mistakes or future developers.

3. **No Changes Needed**: Every single line of ACTUAL SOURCE CODE (app/, src/, lib/api/) follows standards perfectly. The only issue is these two stray copies at project root.

---

**Audit completed**: Day 102 · Standards QA (Vitali)
**Tool usage**: grep, find, manual file inspection
**Confidence**: Very High (direct comparison, no ambiguity)
**Next action**: Engineer deletes lib/db.ts and lib/s3.ts; git diff to verify removal; Standards QA re-runs find commands to confirm
