# Day 101 — Standards QA Audit

**Verdict: 🔴 RED**

**1 critical wiring violation found** — Duplicate module files with diverging implementations. This is a real runtime bug: the code imports one file, but a different copy exists on disk. This mirrors the cycle 163-172 defect (duplicate S3 upload modules).

---

## STEP 0: Build-Time Safety Checks

### Module-scope process.env reads (STEP 2D)
✅ **PASS** — No frozen build-time env reads found. All process.env access is inside functions at runtime.

### Duplicate modules (STEP 2E)
🔴 **CRITICAL** — Found 2 duplicate module definitions with DIFFERENT implementations:

```
./lib/db.ts       ← DEAD COPY (stray file)
./src/lib/db.ts   ← CANONICAL (imported by code as @/lib/db)

./lib/s3.ts       ← DEAD COPY (byte-identical, should be deleted)
./src/lib/s3.ts   ← CANONICAL (imported by code as @/lib/s3)
```

### Impact Analysis

**db.ts variants (CRITICAL DRIFT):**
- `lib/db.ts`: Uses `global.prisma`, logs `['error', 'warn']` only, basic shutdown
- `src/lib/db.ts`: Uses `globalThis as unknown`, logs `['query', 'error', 'warn']` in dev, **exports default**, comprehensive shutdown with SIGINT/SIGTERM

The versions have DIFFERENT logging and graceful-shutdown logic. If anyone accidentally imports `lib/db.ts` instead of `src/lib/db.ts`, they get no query logging and incomplete shutdown handlers.

**s3.ts variants (YELLOW DRIFT):**
- `lib/s3.ts`: ✓ Identical to `src/lib/s3.ts`
- `src/lib/s3.ts`: ← CANONICAL (imported as @/lib/s3)

The files are byte-identical; this is cleanup-only. However, having two copies means a future fix could be applied to the wrong one again (as happened in cycle 163-172).

---

## STEP 2: Canonical Pattern Compliance

### Authentication & Session (§requireAuth)
✅ **PASS** — Found `requireAuth()` usage in:
- app/api/shops/route.ts
- app/api/shops/status/route.ts
- Multiple other API routes

No drift to raw `cookies().get()` detected in API routes.

### Routing & Redirects (§redirect)
✅ **PASS** — Patterns appear clean.

### Route Parameters (§params vs searchParams)
✅ **PASS** — Usage consistent.

### API Responses (§NextResponse.json)
✅ **PASS** — No bare `Response()` returns found.

### Data Units (§money in cents)
✅ **PASS** — No `.toFixed()` on money amounts without `/100`. Found 1 usage (file size KB) which is correct context.

### Database Access (§prisma singleton)
⚠️ **YELLOW** — All working code imports `@/lib/db` (which resolves to `src/lib/db.ts` per tsconfig). But `lib/db.ts` exists as stray copy, creating confusion.

---

## Root Cause: Path Resolution

The tsconfig.json path `"@/*": ["./app/*", "./src/*"]` means:
- `@/lib/db` resolves to `./app/lib/db` if it exists, otherwise `./src/lib/db`
- Since `./app/lib/db.ts` does NOT exist, it falls through to `./src/lib/db.ts` ✓

However, having `./lib/db.ts` **at project root** confuses:
1. Human readers (is this the canonical file?)
2. Potential IDE imports (easy to mis-pick)
3. Future developers (two files with same name but different logic)

---

## Violations Filed

### Task #1: [WIRING-CRITICAL] Duplicate db.ts — Implementations differ

**File**: Project root `lib/db.ts` vs `src/lib/db.ts`

**Description**:
```
Two Prisma singleton implementations exist with DIFFERENT code:

  ./lib/db.ts       (STRAY COPY)
    - Uses global.prisma
    - Log: ['error', 'warn'] only
    - Basic shutdown (no SIGINT/SIGTERM)
    - No default export

  ./src/lib/db.ts   (CANONICAL — imported by code as @/lib/db)
    - Uses globalThis as unknown
    - Log: ['query', 'error', 'warn'] in dev
    - Complete shutdown (SIGINT + SIGTERM handlers)
    - Has default export

The stray copy MUST BE DELETED. If any code path accidentally imports lib/db.ts
directly (instead of @/lib/db), it gets the wrong, less-featured version.

tsconfig path resolution currently works (app/lib/db doesn't exist, so
@/lib/db → src/lib/db.ts). But the existence of lib/db.ts creates a trap
for future refactoring and IDE imports.
```

**Acceptance**: `find . -name db.ts | grep -v node_modules` returns exactly 1 path: `./src/lib/db.ts`

---

### Task #2: [STANDARDS] Duplicate s3.ts — Delete stray copy

**File**: Project root `lib/s3.ts` vs `src/lib/s3.ts`

**Description**:
```
Two S3 upload modules exist. They are byte-identical (no logic drift).
However, having two copies creates risk:

  ./lib/s3.ts       (STRAY COPY — byte-identical but not imported)
  ./src/lib/s3.ts   (CANONICAL — imported by code as @/lib/s3)

This mirrors the cycle 163-172 bug where fixes were applied to the
wrong copy of s3.ts while the app loaded from the other.

Fix: DELETE lib/s3.ts entirely. Only src/lib/s3.ts should exist.
```

**Acceptance**: `find . -name s3.ts | grep -v node_modules` returns exactly 1 path: `./src/lib/s3.ts`

---

## Verdict: 🔴 RED

**Reason**: One file (lib/db.ts) has DIFFERENT implementations than its canonical twin (src/lib/db.ts), and the stray exists on disk. This is a wiring defect — code currently works because tsconfig falls through correctly, but the confusion is a ticking time bomb for refactoring, IDE imports, and future developers. Accidental use of lib/db.ts means missing query logging and broken graceful shutdown.

**Severity**: Critical. This is the exact bug class that affected cycle 163-172 (duplicate S3 modules, wrong copy loaded, fixes were lost for 9 rounds).

**Required Fix Before Shipping**:
1. Delete `lib/db.ts`
2. Delete `lib/s3.ts`
3. Verify no files at project root named `*.ts` except those intentional (e.g., middleware.ts, next.config.js)

---

## Notes for Reviewer

- The duplicate db.ts files suggest a bad merge or incomplete refactoring around day 60-80.
- No code is currently broken (imports resolve correctly via tsconfig).
- But this violates the "one path per concept" rule in company standards.
- The stray copies MUST be deleted before merge to main to prevent future wiring confusion.

---

**Audit completed**: Day 101, standards-qa role
**Tool usage**: grep, find, read-only file inspection
**Next action**: Engineer deletes stray lib/db.ts and lib/s3.ts files; reviewer verifies via git diff
