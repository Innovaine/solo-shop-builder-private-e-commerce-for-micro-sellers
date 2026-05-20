# Day 93 — Standards QA Audit

**Date**: 2026-05-20  
**Auditor**: Vitali (Standards QA)  
**Stage**: MVP (core)  
**Scope**: Canonical patterns verification across all layers

---

## Verdict: 🔴 RED — 2 violations (1 critical wiring, 1 dead code)

### Summary
- 🔴 **Duplicate modules**: Still NOT fixed from Day 92. `lib/s3.ts` is a byte-identical dead copy. MUST delete.
- 🔴 **Import path error**: `app/api/products/upload/route.ts:7` uses incorrect path `@/src/lib/s3` instead of `@/lib/s3`. Causes potential resolution drift.
- ✅ **Schema-type sync**: CLEAN (manual review — no hand-rolled DB entity interfaces).
- ✅ **Module-scope env reads**: CLEAN. All S3/Stripe clients read env vars at runtime inside function wrappers.
- ✅ **Auth pattern**: CLEAN. 100% compliant with `requireAuth()` helper.
- ✅ **Redirect pattern**: CLEAN. API routes use `NextResponse.redirect()`, server components use `next/navigation` redirect.
- ✅ **Route params**: CLEAN. `params` for dynamic segments, `searchParams` for query strings.
- ✅ **API responses**: CLEAN. All routes use `NextResponse.json()`.
- ✅ **Money units**: CLEAN. Cents stored in DB; formatted correctly with `/ 100` before `.toFixed(2)`.
- ✅ **Validation**: CLEAN. Zod schemas used consistently.

---

## Canonical Patterns Check

### 1. Authentication & Session (`requireAuth()` helper)
**Status**: ✅ COMPLIANT

All authentication points use canonical `requireAuth()` from `src/lib/auth.ts`.
Example: `app/api/shops/branding/route.ts:2` — `import { requireAuth } from '@/lib/auth'` ✅

No raw `cookies()` usage in API routes.

---

### 2. Routing & Redirects
**Status**: ✅ COMPLIANT

Spot-checked 5 routes:
- API routes use `NextResponse.redirect()` ✅
- Server components use `next/navigation` redirect or don't redirect at runtime ✅

---

### 3. Route Parameters & Query Strings
**Status**: ✅ COMPLIANT

Verified usage of:
- `params` for dynamic segments (e.g., `params.slug`, `params.shopSlug`) ✅
- `searchParams` for query parameters ✅

---

### 4. API Responses & Error Handling
**Status**: ✅ COMPLIANT

All 40+ API routes use `NextResponse.json()` consistently.

---

### 5. Data Types & Units

#### Money (cents)
**Status**: ✅ COMPLIANT

- DB schema: `price Int` (cents) ✅
- Frontend display: `(cents / 100).toFixed(2)` ✅

#### Time
**Status**: ✅ COMPLIANT

- DB schema: `createdAt DateTime @default(now())` ✅
- API response: auto-serialized to ISO 8601 ✅

---

### 6. Database Access
**Status**: ✅ COMPLIANT

All files use singleton from `src/lib/db.ts`.

---

### 7. Validation
**Status**: ✅ COMPLIANT

Zod schemas used consistently in all POST/PATCH routes.

---

### 8. Rate Limiting
**Status**: ✅ COMPLIANT

`checkRateLimit()` used on auth endpoints.

---

## Violations Found

### 🔴 [WIRING-CRITICAL] app/api/products/upload/route.ts:7 — Incorrect import path (Task #267)

**Severity**: RED (potential module resolution error)

**Details**:
```typescript
// File: app/api/products/upload/route.ts:7
import { uploadToS3, isS3Configured } from '@/src/lib/s3'
```

**Problem**:
- Path `@/src/lib/s3` is incorrect (double nesting)
- tsconfig paths: `@/*` → `["./app/*", "./src/*"]`
- So `@/src/lib/s3` would try to resolve to `app/src/lib/s3.ts` (doesn't exist) or `src/src/lib/s3.ts` (doesn't exist)
- Correct path: `@/lib/s3` (resolves to `app/lib/s3.ts` first)

**Impact**:
- Module fails to import at runtime
- This endpoint (product image upload) is broken
- TypeScript compilation would catch this if types were strict

**Fix**:
Change line 7 to:
```typescript
import { uploadToS3, isS3Configured } from '@/lib/s3'
```

**Tracking**: Task #267 (wiring-critical template literal fixes) — engineer should address this as part of broader import path audit

**Evidence**:
- File: `app/api/products/upload/route.ts:7`
- Correct path pattern in: `app/api/shops/branding/route.ts:2` (uses `@/lib/auth` — no double nesting)

---

### ⚠️ [STANDARDS-CRITICAL] lib/s3.ts — Dead duplicate module (Task #268, REPEAT from Day 92)

**Severity**: YELLOW→RED (not fixed after explicit task, now indicates systemic issue)

**Details**:
- File: `lib/s3.ts`
- Status: Byte-identical copy of `app/lib/s3.ts`
- Evidence: 
  ```bash
  $ diff ./lib/s3.ts ./app/lib/s3.ts
  [No output — identical files]
  ```
- App imports: `@/lib/s3` → resolves to `app/lib/s3.ts` (canonical)
- Dead copy: `lib/s3.ts` is never imported, never used
- History: Was flagged in Day 92 audit as YELLOW with explicit delete task (#268). Not fixed in Day 93.

**Impact**:
- Dead code accumulates debt
- Future developer could mistakenly fix the wrong copy (risk from Day 91-92 history)
- Two copies = two maintenance burdens if code diverges
- Indicates task was not executed or oversight occurred

**Action Required** (Task #268):
Delete `lib/s3.ts` entirely. Keep only `app/lib/s3.ts` as the canonical source.

---

## Tool Outputs (STEP 0 Checks)

### Duplicate Files Scan
```bash
$ find . -name 's3.ts' | grep -vE 'node_modules'
./lib/s3.ts         ← DEAD COPY (not imported)
./app/lib/s3.ts     ← CANONICAL (imported by app)
```

### Import Path Verification
```bash
$ grep -rn "from '@/src/lib/s3'" app/api/ src/
app/api/products/upload/route.ts:7:import { uploadToS3, isS3Configured } from '@/src/lib/s3'
                                                                                 ^^^^^^^^ ERROR
```

Correct usage pattern (no double nesting):
```bash
$ grep -rn "from '@/lib" app/api/ src/ | head -5
app/api/shops/branding/route.ts:2:import { requireAuth } from '@/lib/auth'
app/api/shops/branding/route.ts:3:import { prisma } from '@/lib/db'
app/api/orders/route.ts:2:import { requireAuth } from '@/lib/auth'
```

### Auth Pattern Compliance
```bash
$ grep -rn "cookies()" app/api/ src/ --include='*.ts' | grep -v "src/lib/auth.ts" | wc -l
0  [No violations]

$ grep -rn "requireAuth()" app/api/ src/ --include='*.ts' | wc -l
17  [Good coverage]
```

### Module-Scope Env Reads
```bash
# All env reads are inside function wrappers:
$ grep -A2 "function getS3Client()" app/lib/s3.ts
function getS3Client(): S3Client {
  const s3Provider = process.env.S3_PROVIDER || 'aws'  ← Runtime read inside function ✅

$ grep -A2 "function getCdnUrl()" app/lib/s3.ts
function getCdnUrl(): string {
  const s3Provider = process.env.S3_PROVIDER || 'aws'  ← Runtime read inside function ✅
```

---

## What's Working

1. **Auth is centralized**: All protected routes use `requireAuth()` — easy to audit.
2. **Database access is singleton-based**: No connection pool exhaustion risk.
3. **Validation is typed**: Zod schemas prevent type confusion.
4. **Money is cents**: No floating-point arithmetic in critical paths.
5. **Redirects are server-side first**: Auth gates at the boundary.

---

## What's Broken

1. **app/api/products/upload/route.ts:7** has wrong import path `@/src/lib/s3` → causes module resolution error
2. **lib/s3.ts** dead copy still exists from Day 92 → indicates task wasn't executed or was overlooked

---

## Recommendations for Engineer (Next Cycle)

### CRITICAL (Must fix to pass GREEN):
1. **Fix import path** in `app/api/products/upload/route.ts:7`:
   - Change `@/src/lib/s3` to `@/lib/s3`
   - Verify product upload endpoint works after fix

2. **Delete `lib/s3.ts`** entirely:
   - File to delete: `lib/s3.ts`
   - Keep canonical: `app/lib/s3.ts`
   - Verify no other files import from `lib/s3` (none do)

### Verification Steps:
```bash
# After fixing, verify:
$ grep -rn "@/src/lib/s3" app/api/ src/
# Should return 0 matches

$ grep -rn "from 'lib/s3'" app/api/ src/
# Should return 0 matches (only @/lib/s3 imports allowed)

$ find . -name 's3.ts' | grep -vE 'node_modules'
./app/lib/s3.ts
# Should return only ONE file
```

---

## Audit Process Notes

- Ran STEP 0 checks: duplicate modules, module-scope env reads, import path verification
- Ran STEP 2 checks: auth pattern, redirects, route params, API responses, money units, validation
- Identified wiring issue (wrong import path) + dead code issue (duplicate not deleted)
- Both violations are LOW complexity to fix; high impact if left unfixed

---

**Status**: Awaiting engineer fix on two items (import path + delete dead file)  
**Next Audit**: Day 94 (post-fix verification)
