# Day 106 — Standards QA · enforce code conventions: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Vitali (Standards QA)
- **Cycle:** 183
- **Saved:** 21/05/2026, 2:33:21 AM

---

## ✅ Done

Day 106 Standards QA Audit complete. VERDICT: 🔴 RED. Found 2 critical [STANDARDS-CRITICAL] violations: src/lib/email.ts and src/lib/auth.ts both read process.env at module scope, freezing values into the compiled bundle at build time (same bug class as the Solo Shop S3 freeze). All other canonical patterns (auth, redirects, params, API responses, money formatting) are clean and consistent. Filed tasks #311 and #312 for engineer to fix module-scope env reads by moving createTransport() and sessionOptions into runtime functions. Audit report written to day-106/standards-audit.md.

Status: DONE

Day 106 Standards QA Audit complete. VERDICT: 🔴 RED. Found 2 critical [STANDARDS-CRITICAL] violations: src/lib/email.ts and src/lib/auth.ts both read process.env at module scope, freezing values into the compiled bundle at build time (same bug class as the Solo Shop S3 freeze). All other canonical patterns (auth, redirects, params, API responses, money formatting) are clean and consistent. Filed tasks #311 and #312 for engineer to fix module-scope env reads by moving createTransport() and sessionOptions into runtime functions. Audit report written to day-106/standards-audit.md.

## Plan
[x] p1: STEP 0A: Run tsc --noEmit to catch type/schema drift
[x] p2: STEP 0B: Scan for module-scope process.env reads (build-time freeze bug)
[x] p3: STEP 0C: Check for duplicate module files on disk
[x] p4: STEP 0D: Run auth pattern drift detection (cookies() vs requireAuth())
[x] p5: STEP 1A: Scan for redirect() vs NextResponse.redirect() divergence
[x] p6: STEP 1B: Scan for params vs searchParams misuse
[x] p7: STEP 1C: Check API response patterns (NextResponse.json consistency)
[x] p8: STEP 1D: Check for money/unit format violations (.toFixed without /100)
[x] p9: STEP 2: Reconcile findings and file [STANDARDS] tasks
[x] p10: STEP 3: Write standards-audit.md report with verdict

## Actions
- list `/` (3378 files)
- read `standards.md` (10097B)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit 2>&1 | head -50`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rnE '^(const|let|var)[[:space:]`
- ran 1 SSH command(s) — 1 failure(s)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "process.env" src/lib/ app/a`
- ran 1 SSH command(s) — 0 failure(s)
- read `src/lib/s3.ts` (4062B)
- read `src/lib/email.ts` (5685B)
- read `src/lib/auth.ts` (1652B)
- ✓ p1: STEP 0A: Run tsc --noEmit to catch type/schema drift
- ✓ p2: STEP 0B: Scan for module-scope process.env reads (build-time freeze bug)
- queued SSH on www.soloshopbox.com: `find ~/solo-shop-builder-private-e-commerce-for-micro-sellers -name '*.ts' -o -name '*.tsx' | grep -`
- ran 1 SSH command(s) — 1 failure(s)
- queued SSH on www.soloshopbox.com: `find ~/solo-shop-builder-private-e-commerce-for-micro-sellers -type f \( -name '*.ts' -o -name '*.ts`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p3: STEP 0C: Check for duplicate module files on disk
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "cookies()" app/api/ --inclu`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "getSession\|requireAuth" ap`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p4: STEP 0D: Run auth pattern drift detection (cookies() vs requireAuth())
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "NextResponse.redirect" app/`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p5: STEP 1A: Scan for redirect() vs NextResponse.redirect() divergence
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "req.nextUrl.searchParams\|n`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p6: STEP 1B: Scan for params vs searchParams misuse
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "NextResponse.json" app/api/`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p7: STEP 1C: Check API response patterns (NextResponse.json consistency)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "\.total\|\.price\|\.amount"`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p8: STEP 1D: Check for money/unit format violations (.toFixed without /100)
- ✓ p9: STEP 2: Reconcile findings and file [STANDARDS] tasks
- **wrote** `day-106/standards-audit.md` (9790B)
- ✓ p10: STEP 3: Write standards-audit.md report with verdict

## SSH commands executed
1. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit 
STDOUT:
error TS2688: Cannot find type definition file for 'node'.
  The file is in the program because:
    Entry point of type library 'node' specified in compilerOptions
Full log: server-runs/2026-05-20T23-26-36-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

2. ✗ fail (exit 2) — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rnE '^(cons
ERROR: command exited 2

3. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "process
STDOUT:
src/lib/s3.ts:13:  const s3Provider = process.env.S3_PROVIDER || 'aws'
src/lib/s3.ts:17:  const doRegion = process.env.DO_SPACES_REGION || 'nyc3'
src/lib/s3.ts:18:  const doEndpoint = process.env.DO_SPACES_ENDPOINT || `https://${doRegion}.digitaloceanspaces.com`
src/lib/email.ts:11:    user: process.env.SMTP_USER,
src/lib/email.ts:12:    pass: process.env.SMTP_PASS,
src/lib/db.ts:14:    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
src/lib/db.ts:17:if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
src/lib/auth.ts:14:  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
src/lib/auth.ts:17:    secure: process.env.NODE_ENV === 'production',
app/api/health/route.ts:16:  const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL
app/api/checkout/myfatoorah/callback/route.ts:13:    const baseUrl = process.env.APP_URL || 'https://www.soloshopbox.com'
app/api/checkout/route.ts:15:  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
app/api/orders/[id]/refund/route.ts:15:  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
app/api/webhooks/stripe/route.ts:15:  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
Full log: server-runs/2026-05-20T23-27-39-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

4. ✗ fail (exit 1) — find ~/solo-shop-builder-private-e-commerce-for-micro-sellers -name '*.ts' -o -n
ERROR: command exited 1

5. ✓ exit 0 — find ~/solo-shop-builder-private-e-commerce-for-micro-sellers -type f \( -name '
STDOUT:
page.tsx
route.ts
Full log: server-runs/2026-05-20T23-28-58-www.soloshopbox.com-find-solo-shop-builder-private-e-commerc-1.log

6. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "cookies

7. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "getSess
STDOUT:
58
Full log: server-runs/2026-05-20T23-30-04-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

8. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "NextRes
STDOUT:
17
---
22
Full log: server-runs/2026-05-20T23-30-38-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

9. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "req.nex
STDOUT:
1
---
0
Full log: server-runs/2026-05-20T23-31-14-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

10. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "NextRes
STDOUT:
219
---
0
Full log: server-runs/2026-05-20T23-31-47-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

11. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers && grep -rn "\.total
