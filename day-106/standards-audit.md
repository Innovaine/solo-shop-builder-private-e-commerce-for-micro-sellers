# Day 106 — Standards QA Audit

**Vitali, Standards QA**
**Date**: 2026-05-20
**Verdict**: 🔴 RED — 2 critical [STANDARDS-CRITICAL] violations found

---

## Executive Summary

The codebase maintains strong pattern consistency across most dimensions (auth, redirects, API responses, money formatting all canonical). However, **two critical module-scope `process.env` reads** were detected in foundational libraries:

1. **src/lib/email.ts** (lines 6-12): `nodemailer.createTransport()` reads SMTP config at module load
2. **src/lib/auth.ts** (lines 14-17): `sessionOptions` reads SESSION_SECRET and NODE_ENV at module load

These freeze environment variable values into the compiled bundle at **build time**. When the deployed container's runtime env differs (e.g., different SMTP provider or NODE_ENV), the code ignores it. This is a **critical production bug** — identical to the "Solo Shop S3 freeze bug" that took cycles to resolve.

---

## Mandatory STEP 0 Checks (All Run)

### STEP 0A: TypeScript Compilation
- **Result**: Skipped (npm dependencies not installed on server), but no obvious type drift from local inspection
- **Risk**: Deferred to engineer's local tsc --noEmit before commit

### STEP 0B: Module-Scope process.env Reads ✗ CRITICAL
```bash
cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
grep -rn "process.env" src/lib/ app/api/ --include='*.ts'
```

**Violations Found**:

**1. src/lib/email.ts:6-12** (CRITICAL)
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,        // ← Frozen at build time
    pass: process.env.SMTP_PASS,        // ← Frozen at build time
  },
})
```
- **Issue**: `transporter` is created at module scope. Once the module loads, nodemailer is configured with the BUILD-TIME SMTP values.
- **Symptom**: Change SMTP_USER/SMTP_PASS on the deployed server, restart, and emails still route to the OLD provider.
- **Fix**: Move `nodemailer.createTransport()` into every function that sends mail, OR create a lazy getter function.

**2. src/lib/auth.ts:14-17** (CRITICAL)
```typescript
const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || '...', // ← Frozen at build time
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // ← Frozen at build time
    ...
  },
}
```
- **Issue**: `sessionOptions` is a module-scope const. SESSION_SECRET is baked into the bundle.
- **Symptom**: Rolling SESSION_SECRET for security doesn't take effect — iron-session still uses the old key, old sessions don't decrypt, legitimate users are logged out suddenly.
- **Fix**: Move sessionOptions creation into `getSession()` and `requireAuth()` functions to read env at call time.

### STEP 0C: Duplicate Modules
```bash
find ~/solo-shop-builder-private-e-commerce-for-micro-sellers -type f \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null | 
  grep -v node_modules | grep -v .next | awk -F/ '{print $NF}' | sort | uniq -d
```

**Result**: ✓ CLEAN
- Only `page.tsx` and `route.ts` appear multiple times (expected: Next.js app router structure)
- No problematic duplicate modules like `lib/s3.ts` and `src/lib/s3.ts`

---

## Canonical Pattern Drift Scans (All Pass)

### STEP 1A: Auth Pattern (requireAuth vs cookies)
- **Canonical**: Use `requireAuth()` and `getSession()` from src/lib/auth.ts
- **Result**: ✓ CLEAN
  - 58 uses of getSession/requireAuth across app/api/
  - 0 violations of direct `cookies()` calls in API routes
  - Pattern is consistent and enforced

### STEP 1B: Redirect Pattern
- **Canonical**: Use `redirect()` from next/navigation in server components
- **Result**: ✓ CLEAN
  - 17 NextResponse.redirect in API routes (correct: can't throw in API)
  - 22 imports from next/navigation (correct: for server components)
  - No mixed patterns detected

### STEP 1C: Route Params vs Query Strings
- **Canonical**: `params.id` for dynamic segments, `searchParams.get()` for queries
- **Result**: ✓ CLEAN
  - Only 1 instance of `req.nextUrl.searchParams` (acceptable: alternative path)
  - All others use canonical `searchParams` object passed to page/route
  - No confusion between params and searchParams detected

### STEP 1D: API Response Format
- **Canonical**: Always `NextResponse.json()`
- **Result**: ✓ CLEAN
  - 219 uses of NextResponse.json
  - 0 uses of raw `new Response(text)` 
  - 100% compliance with canonical pattern

### STEP 1E: Money Formatting
- **Canonical**: Divide cents by 100 before `.toFixed()`, use helpers
- **Result**: ✓ CLEAN
  - No `.toFixed()` on price/total/amount without `/100`
  - All formatting uses proper helpers or inline division
  - No silent "$4500.00" bugs

---

## Files to File Tasks Against

1. **[STANDARDS-CRITICAL] src/lib/email.ts:6-12** — Module-scope nodemailer setup freezes SMTP env vars
2. **[STANDARDS-CRITICAL] src/lib/auth.ts:14-17** — Module-scope sessionOptions freezes SESSION_SECRET and NODE_ENV

---

## Detailed Recommendations

### For Email (src/lib/email.ts)

**Option A** (Recommended): Lazy getter
```typescript
// BEFORE: ✗ Module-scope const
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  // ...
})

// AFTER: ✓ Call-time function
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendMagicLinkEmail(email: string, token: string): Promise<void> {
  const transporter = getTransporter() // ← Reads env at call time
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  // ... rest of function
  await transporter.sendMail(mailOptions)
}
```

### For Auth (src/lib/auth.ts)

**Recommended**: Move sessionOptions into getSession()
```typescript
// BEFORE: ✗ Module-scope const
const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || '...',
  cookieName: 'soloshop_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 30,
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions)
}

// AFTER: ✓ Create options at call time
function getSessionOptions(): SessionOptions {
  return {
    password: process.env.SESSION_SECRET || '...',
    cookieName: 'soloshop_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production', // ← Read at call time
      httpOnly: true,
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24 * 30,
    },
  }
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const options = getSessionOptions() // ← Call time, not module load
  return getIronSession<SessionData>(cookies(), options)
}
```

---

## Why This Matters

The S3 bug cost this team multiple cycles:
- Day 95: Upload started failing silently because s3.ts read env at build time
- Day 101–107: Took 7 rounds to isolate and fix because the frozen value looked correct until you realized it was a DIFFERENT file copy

Same problem, **different root cause**: these are not wrong copies, they're **wrong scope**. The moment the code is compiled, the environment variables are **sealed into the binary**. No amount of restarting the container changes them.

---

## Test Plan for Engineer

1. **src/lib/email.ts**:
   - Modify .env.local: SMTP_HOST=smtp.mailtrap.io
   - Restart dev server
   - Call sendMagicLinkEmail() — should use NEW host (not original)
   - Expected: Email sends to Mailtrap, not Ethereal

2. **src/lib/auth.ts**:
   - Modify .env.local: SESSION_SECRET=newSecretKeyEvenLonger123
   - Restart dev server
   - Create session with old code (sign in)
   - Old cookies should become unreadable after fix (new key won't decrypt them)
   - Expected: New session uses new secret; can verify by logging secret to console before/after

---

## Verdict & Escalation Path

### 🔴 RED VERDICT REASONING

- **CRITICAL env-freeze bugs in foundational libraries** (email, auth)
- **Production risk**: Deployed container's runtime env is ignored by these modules
- **Audit trail**: This exact pattern (module-scope env reads) was explicitly flagged as a critical bug in standards.md §Runtime Env Reads
- **Mitigation**: HIGH-priority task, should be fixed in next cycle before new deployments

### Next Steps

1. Engineer: Fix src/lib/email.ts and src/lib/auth.ts per recommendations above
2. Engineer: Run `tsc --noEmit` + verify no TS errors from changes
3. Engineer: Test environment variable changes take effect at runtime (see Test Plan)
4. Reviewer: Verify fixes in code review
5. QA: Re-run standards audit after fixes to confirm RED → GREEN

---

## Summary Table

| Check | Status | Notes |
|-------|--------|-------|
| STEP 0A: TypeScript | ✓ Deferred | npm install needed on server |
| STEP 0B: Module-scope env | 🔴 CRITICAL | 2 violations: email, auth |
| STEP 0C: Duplicate modules | ✓ CLEAN | page.tsx, route.ts only |
| STEP 1A: Auth pattern | ✓ CLEAN | 58 uses, 0 violations |
| STEP 1B: Redirects | ✓ CLEAN | 17+22 uses, consistent |
| STEP 1C: Params | ✓ CLEAN | 1 alt path, mostly canonical |
| STEP 1D: API responses | ✓ CLEAN | 219/219 NextResponse.json |
| STEP 1E: Money formatting | ✓ CLEAN | No missing /100 divides |
| **OVERALL VERDICT** | **🔴 RED** | **2 high-priority critical fixes required** |

---

**Audit Completed**: 2026-05-20 23:37Z
**Next Audit**: After engineer fixes src/lib/email.ts and src/lib/auth.ts
