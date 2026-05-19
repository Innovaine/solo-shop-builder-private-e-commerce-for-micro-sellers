# Day 85 — Tester · Playwright / Appetize: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Priya (Tester)
- **Cycle:** 155
- **Saved:** 20/05/2026, 2:22:40 AM

---

## ✅ Done

Day 85 testing complete with BLOCKED verdict. Engineer claimed both fixes (#246 profile GET endpoint, #247 Prisma import) are deployed, but verification shows the code changes exist only in the warehouse — the server is still running day-84 code. The deployed app's orders/route.ts still uses `import prisma from` (default) instead of `import { prisma } from` (named), violating standards. Root cause: engineer ran `git pull` before the warehouse auto-pushed to GitHub, so the build used stale code. Wrote test report documenting the deployment gap and created test file tests/web/day85-profile-fix.spec.ts for future verification once code is actually deployed.

Status: DONE

Day 85 testing complete with BLOCKED verdict. Engineer claimed both fixes (#246 profile GET endpoint, #247 Prisma import) are deployed, but verification shows the code changes exist only in the warehouse — the server is still running day-84 code. The deployed app's orders/route.ts still uses `import prisma from` (default) instead of `import { prisma } from` (named), violating standards. Root cause: engineer ran `git pull` before the warehouse auto-pushed to GitHub, so the build used stale code. Wrote test report documenting the deployment gap and created test file tests/web/day85-profile-fix.spec.ts for future verification once code is actually deployed.

## Plan
[x] p1: Read server status and verify health endpoint working
[x] p2: Test GET /api/shops/profile endpoint (engineer's fix #246)
[x] p3: Verify orders route uses correct Prisma import pattern (engineer's fix #247)
[x] p4: Write smoke test for profile GET endpoint
[x] p5: Run smoke tests and collect results
[x] p6: Write test report in test-results/day-85/report.md with verdict

## Actions
- list `/` (2555 files)
- read `day-85/_plan.md` (4281B)
- read `day-85/engineering.md` (12799B)
- queued SSH on www.soloshopbox.com: `docker ps --format '.Names\t.Status' | grep solo-shop`
- ran 1 SSH command(s) — 1 failure(s)
- queued SSH on www.soloshopbox.com: `docker ps | grep solo-shop`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `echo "Test 1: GET /api/shops/profile without auth (should 401)"`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- read `app/api/orders/route.ts` (1865B)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p1: Read server status and verify health endpoint working
- ✓ p2: Test GET /api/shops/profile endpoint (engineer's fix #246)
- ✓ p3: Verify orders route uses correct Prisma import pattern (engineer's fix #247)
- **wrote** `tests/web/day85-profile-fix.spec.ts` (1853B)
- ✓ p4: Write smoke test for profile GET endpoint
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `sleep 10`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `echo "Day 85 Manual Verification Tests"`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on www.soloshopbox.com: `echo "Comprehensive Day 85 Test Report - Current Deployed State"`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p5: Run smoke tests and collect results
- **wrote** `test-results/day-85/report.md` (5636B)
- ✓ p6: Write test report in test-results/day-85/report.md with verdict

## SSH commands executed
1. ✗ fail (exit 1) — docker ps --format '.Names\t.Status' | grep solo-shop
ERROR: command exited 1

2. ✓ exit 0 — docker ps | grep solo-shop
STDOUT:
2ceb99209cf4   solo-shop-builder-private-e-commerce-for-micro-sellers-app   "docker-entrypoint.s…"   5 minutes ago   Up 5 minutes            0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   solo-shop-builder-private-e-commerce-for-micro-sellers-app-1
c98ed978a89b   postgres:16-alpine                                           "docker-entrypoint.s…"   27 hours ago    Up 27 hours (healthy)   127.0.0.1:5432->5432/tcp                      solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1
{"status":"ok","timestamp":"2026-05-19T23:16:30.970Z","responseTime":"177ms","checks":{"database":{"status":"ok","responseTime":"2ms"},"email":{"status":"ok","responseTime":"175ms"}}}OK
Full log: server-runs/2026-05-19T23-16-31-www.soloshopbox.com-docker-ps-grep-solo-shop-1.log

3. ✓ exit 0 — echo "Test 1: GET /api/shops/profile without auth (should 401)"
STDOUT:
Test 1: GET /api/shops/profile without auth (should 401)
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/2 401 
access-control-allow-headers: Content-Type, Authorization
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-origin: *
content-type: application/json
date: Tue, 19 May 2026 23:17:04 GMT
vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
x-request-id: DXF93zlAV7aLGg1P


Test 2: Verify endpoint accepts GET method (not just POST/PATCH)
< allow: GET, HEAD, OPTIONS, PATCH
Full log: server-runs/2026-05-19T23-17-04-www.soloshopbox.com-echo-Test-1-GET-api-shops-profile-withou-1.log

4. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
Checking Prisma import pattern in app/api/orders/route.ts:
7:import prisma from '@/lib/db'

Verifying it matches standards.md canonical pattern (named import):
Full log: server-runs/2026-05-19T23-17-35-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

5. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
**Usage**:
```typescript
import { prisma } from '@/lib/db'

const orders = await prisma.order.findMany({
  where: { shopId },
Full log: server-runs/2026-05-19T23-18-09-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

6. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
Started Playwright tests, PID=1844306
Full log: server-runs/2026-05-19T23-19-10-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

7. ✓ exit 0 — sleep 10
STDOUT:
DONE
Error: No tests found.
Make sure that arguments are regular expressions matching test files.
You may need to escape symbols like "$" or "*" and quote the arguments.
Full log: server-runs/2026-05-19T23-19-47-www.soloshopbox.com-sleep-10-1.log

8. ✓ exit 0 — echo "Day 85 Manual Verification Tests"
STDOUT:
Day 85 Manual Verification Tests
=================================

Test 1: Profile GET endpoint (Fix #246)
HTTP/2 401 

Test 2: Health check
ok
ok

Test 3: Homepage loads
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

Test 4: Login page loads

Test 5: Orders API auth check
HTTP/2 500 

Test 6: Verify Prisma import in orders/route.ts
import prisma from '@/lib/db'
Full log: server-runs/2026-05-19T23-20-16-www.soloshopbox.com-echo-Day-85-Manual-Verification-Tests-1.log

9. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
// GET /api/orders - Fetch all orders for the seller's shops
// FR-17: Seller order dashboard

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
Full log: server-runs/2026-05-19T23-20-39-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

10. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
98fb508 Priya (tester, day 84) — pre-SSH sync
775b10e Priya (tester, day 84) — pre-SSH sync
95706b1 Priya (tester, day 84) — pre-SSH sync
cf7a8f3 Anil (engineer, day 84) — pre-SSH sync
f3f7b1c Anil (engineer, day 84) — pre-SSH sync

Last commit timestamp:
Tue May 19 22:31:36 2026 +0000

Current file content at line 7:
import prisma from '@/lib/db'
Full log: server-runs/2026-05-19T23-21-10-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

11. ✓ exit 0 — echo "Comprehensive Day 85 Test Report - Current Deployed State"
STDOUT:
Comprehensive Day 85 Test Report - Current Deployed State
==========================================================

1. Server Status
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1: Up 10 minutes
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1: Up 27 hours (healthy)

2. Health Check
{
  "status": "ok",
  "db": "ok",
  "email": "ok"
}

3. Profile Endpoint Test (Fix #246 claim)
   GET /api/shops/profile:
HTTP/2 401 

4. Code Verification (Fix #247 claim)
   Current Prisma import in orders/route.ts:
import prisma from '@/lib/db'
   Standards.md canonical pattern:
import { prisma } from '@/lib/db'

5. Homepage Test
<title>Solo Shop Builder — Your own storefront. No marketplace fees.</title>

6. Auth Test - Login page
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
Full log: server-runs/2026-05-19T23-21-41-www.soloshopbox.com-echo-Comprehensive-Day-85-Test-Report----1.log
