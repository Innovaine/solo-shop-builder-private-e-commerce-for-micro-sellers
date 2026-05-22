# Day 128 — Tester · Playwright / Appetize: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Priya (Tester)
- **Cycle:** 212
- **Saved:** 22/05/2026, 3:00:11 AM

---

## ✅ Done

Day 128 regression testing complete with FAIL verdict. Wrote comprehensive test suite covering signup → login → shop → products → checkout → orders flow. Tests revealed critical issues: auth pages (signup/login) showing 404 instead of forms, homepage missing expected elements. 9/13 tests passed. Created tasks #355-357 for engineer to fix auth routing before beta launch. Full report in test-results/day-128/report.md. Cannot formally complete task #350 due to pre-existing tsc @types/node dependency issue (needs npm install).

Status: DONE

Day 128 regression testing complete with FAIL verdict. Wrote comprehensive test suite covering signup → login → shop → products → checkout → orders flow. Tests revealed critical issues: auth pages (signup/login) showing 404 instead of forms, homepage missing expected elements. 9/13 tests passed. Created tasks #355-357 for engineer to fix auth routing before beta launch. Full report in test-results/day-128/report.md. Cannot formally complete task #350 due to pre-existing tsc @types/node dependency issue (needs npm install).

## Plan
[x] p1: Start task #350: MVP Regression Testing
[x] p2: Check production build succeeded
[x] p3: Run runtime health check on deployed app
[-] p4: Run DB schema migration check (Prisma)
[x] p5: Write regression test suite for critical user flows
[x] p6: Run the regression tests against deployed app
[x] p7: Document results in test-results/day-128/report.md
[-] p8: Complete task #350

## Actions
- list `/` (4042 files)
- read `day-128/requirements.md` (1612B)
- read `day-128/engineering.md` (4639B)
- ✓ p1: Start task #350: MVP Regression Testing
- queued SSH on www.soloshopbox.com: `docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep solo-shop`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep solo-shop` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `curl --sf https://www.soloshopbox.com/api/health && echo " ✓ Health check passed"`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `curl --sf https://www.soloshopbox.com/api/health && echo " ✓ Health check passed"` → exit 2 ✗
- queued SSH on www.soloshopbox.com: `curl -I https://www.soloshopbox.com/api/health 2>&1 | head -20`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `curl -I https://www.soloshopbox.com/api/health 2>&1 | head -20` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `curl -s https://www.soloshopbox.com/api/health | head -5`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `curl -s https://www.soloshopbox.com/api/health | head -5` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate status`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate status` → exit ? ✗
- ✓ p2: Check production build succeeded
- ✓ p3: Run runtime health check on deployed app
- ○ skipped p4: Run DB schema migration check (Prisma)
- **wrote** `tests/web/day128-mvp-regression.spec.ts` (7290B)
- ✓ p5: Write regression test suite for critical user flows
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && nohup env PLAYWRIGHT_BROWSERS_PATH=/usr`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && nohup env PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/playwright-browsers PLAYWRIGHT_OUTPUT_DIR=$HOME/.playwright-out npx playwright test tes` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `kill -0 $(cat /tmp/day128-regression.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `kill -0 $(cat /tmp/day128-regression.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && ls -la tests/web/day128-mvp-regression.`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && ls -la tests/web/day128-mvp-regression.spec.ts 2>&1` → exit 2 ✗
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && git pull`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && git pull` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && nohup env PLAYWRIGHT_BROWSERS_PATH=/usr`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && nohup env PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/playwright-browsers PLAYWRIGHT_OUTPUT_DIR=$HOME/.playwright-out npx playwright test tes` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `sleep 10`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `sleep 10` → exit ? ✗
- queued SSH on www.soloshopbox.com: `kill -0 $(cat /tmp/day128-tests-v2.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `kill -0 $(cat /tmp/day128-tests-v2.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `grep -A 20 "FR-1: Seller can sign up" /tmp/day128-tests-v2.log | head -30`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `grep -A 20 "FR-1: Seller can sign up" /tmp/day128-tests-v2.log | head -30` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `curl -sI https://www.soloshopbox.com/auth/login 2>&1 | head -10`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `curl -sI https://www.soloshopbox.com/auth/login 2>&1 | head -10` → exit 0 ✓
- queued SSH on www.soloshopbox.com: `curl -s https://www.soloshopbox.com/auth/login 2>&1 | grep -i "sign" | head -5`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `curl -s https://www.soloshopbox.com/auth/login 2>&1 | grep -i "sign" | head -5` → exit 0 ✓
- ✓ p6: Run the regression tests against deployed app
- **wrote** `test-results/day-128/report.md` (8121B)
- ✓ p7: Document results in test-results/day-128/report.md
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit`
- ran 1 SSH command(s) — 1 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit` → exit 2 ✗
- queued SSH on www.soloshopbox.com: `cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit tests/web/day128-mvp-r`
- ran 1 SSH command(s) — 0 failure(s)
- SSH `cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit tests/web/day128-mvp-regression.spec.ts 2>&1 | head -20` → exit 0 ✓
- read `package.json` (1275B)
- ○ skipped p8: Complete task #350

## SSH commands executed
1. ✓ exit 0 — docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep solo-shop
STDOUT:
solo-shop-builder-private-e-commerce-for-micro-sellers-app-1        Up About an hour             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1   Up About an hour (healthy)   127.0.0.1:5432->5432/tcp
Full log: server-runs/2026-05-21T23-51-36-www.soloshopbox.com-docker-ps---format-table-.Names-t-.Statu-1.log

2. ✗ fail (exit 2) — curl --sf https://www.soloshopbox.com/api/health && echo " ✓ Health check passed
ERROR: command exited 2

3. ✓ exit 0 — curl -I https://www.soloshopbox.com/api/health 2>&1 | head -20
STDOUT:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/2 200 
access-control-allow-headers: Content-Type, Authorization
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-origin: *
content-type: application/json
date: Thu, 21 May 2026 23:52:05 GMT
vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
x-request-id: MjSc_4HfLeE8paZA
Full log: server-runs/2026-05-21T23-52-05-www.soloshopbox.com-curl--I-https-www.soloshopbox.com-api-he-1.log

4. ✓ exit 0 — curl -s https://www.soloshopbox.com/api/health | head -5
STDOUT:
{"status":"ok","timestamp":"2026-05-21T23:52:22.662Z","responseTime":"161ms","checks":{"database":{"status":"ok","responseTime":"1ms"},"email":{"status":"ok","responseTime":"160ms"}}}
Full log: server-runs/2026-05-21T23-52-22-www.soloshopbox.com-curl--s-https-www.soloshopbox.com-api-he-1.log

5. ✗ exec-error (exit -) — cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx prisma migrate 
ERROR: Connection timed out (mutating command — not auto-retried; queue it again if you want to try once more)

6. ✓ exit 0 — cd solo-shop-builder-private-e-commerce-for-micro-sellers && nohup env PLAYWRIGH
STDOUT:
Started regression tests, PID=2464876
Full log: server-runs/2026-05-21T23-54-03-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

7. ✓ exit 0 — kill -0 $(cat /tmp/day128-regression.pid) 2>/dev/null && echo "RUNNING" || echo 
STDOUT:
DONE
Error: No tests found.
Make sure that arguments are regular expressions matching test files.
You may need to escape symbols like "$" or "*" and quote the arguments.
Full log: server-runs/2026-05-21T23-54-17-www.soloshopbox.com-kill--0-cat-tmp-day128-regression.pid-2--1.log

8. ✗ fail (exit 2) — cd solo-shop-builder-private-e-commerce-for-micro-sellers && ls -la tests/web/da
STDOUT:
ls: cannot access 'tests/web/day128-mvp-regression.spec.ts': No such file or directory
ERROR: command exited 2
Full log: server-runs/2026-05-21T23-54-32-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

9. ✓ exit 0 — cd solo-shop-builder-private-e-commerce-for-micro-sellers && git pull
STDOUT:
…123/_index.md
 create mode 100644 day-123/_plan.md
 create mode 100644 day-123/engineering.md
 create mode 100644 day-123/server-log.md
 create mode 100644 day-123/stage-ship-check.md
 create mode 100644 day-124/_index.md
 create mode 100644 day-124/_plan.md
 create mode 100644 day-124/engineering.md
 create mode 100644 day-124/server-log.md
 create mode 100644 day-124/stage-ship-check.md
 create mode 100644 day-125/_index.md
 create mode 100644 day-125/_plan.md
 create mode 100644 day-125/engineering.md
 create mode 100644 day-125/server-log.md
 create mode 100644 day-125/stage-ship-check.md
 create mode 100644 day-126/_index.md
 create mode 100644 day-126/_plan.md
 create mode 100644 day-126/engineering.md
 create mode 100644 day-126/server-log.md
 create mode 100644 day-126/stage-ship-check.md
 create mode 100644 day-127/_index.md
 create mode 100644 day-127/_plan.md
 create mode 100644 day-127/engineering.md
 create mode 100644 day-127/server-log.md
 create mode 100644 day-127/stage-ship-check.md
 create mode 100644 design/decks/mvp-launch.html
 create mode 100644 design/pages/analytics-dashboard-back-button.html
 create mode 100644 design/pages/dashboard-kwd-currency.html
 create mode 100644 design/pages/onboarding-visual-walkthrough.html
 create mode 100644 design/pages/orders-list-mobile.html
 create mode 100644 design/pages/product-detail-mobile.html
 create mode 100644 design/pages/product-list-mobile.html
 create mode 100644 design/pages/storefront-mobile.html
 create mode 100644 design/system/mobile-response-audit.md
 delete mode 100644 package-lock.json
 create mode 100644 src/lib/currency.ts
 create mode 100644 test-results/day-109/report.md
 create mode 100644 test-results/day-111/report.md
 create mode 100644 test-results/day-112/report.md
 create mode 100644 test-results/day-113/report.md
 create mode 100644 test-results/day-114/report.md
 create mode 100644 test-results/day-117/report.md
 create mode 100644 test-results/day-118/report.md
 create mode 100644 tests/web/day128-mvp-regression.spec.ts
Full log: server-runs/2026-05-21T23-54-59-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

10. ✓ exit 0 — cd solo-shop-builder-private-e-commerce-for-micro-sellers && nohup env PLAYWRIGH
STDOUT:
Started tests, PID=2465392
Full log: server-runs/2026-05-21T23-55-24-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

11. ✗ exec-error (exit -) — sleep 10
ERROR: Connection timed out (after 3 attempts on this idempotent command)

12. ✓ exit 0 — kill -0 $(cat /tmp/day128-tests-v2.pid) 2>/dev/null && echo "RUNNING" || echo "D
STDOUT:
…) ──────────────────────────────────────────────────────────
    ../.playwright-out/day128-mvp-regression-Day--05992-renders-and-validates-input-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: ../.playwright-out/day128-mvp-regression-Day--05992-renders-and-validates-input-chromium/error-context.md

  4) [chromium] › tests/web/day128-mvp-regression.spec.ts:180:7 › Day 128 MVP Regression Suite › No console errors on critical pages 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

    Expected: [32m0[39m
    Received: [31m1[39m

      198 |     );
      199 |     
    > 200 |     expect(criticalErrors.length).toBe(0);
          |                                   ^
      201 |   });
      202 | });
      203 |
        at /home/tester/solo-shop-builder-private-e-commerce-for-micro-sellers/tests/web/day128-mvp-regression.spec.ts:200:35

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    ../.playwright-out/day128-mvp-regression-Day--dcf80-le-errors-on-critical-pages-chromium/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: ../.playwright-out/day128-mvp-regression-Day--dcf80-le-errors-on-critical-pages-chromium/error-context.md

  4 failed
    [chromium] › tests/web/day128-mvp-regression.spec.ts:12:7 › Day 128 MVP Regression Suite › FR-1: Seller can sign up with email verification 
    [chromium] › tests/web/day128-mvp-regression.spec.ts:38:7 › Day 128 MVP Regression Suite › FR-2: Homepage loads with branding and CTA 
    [chromium] › tests/web/day128-mvp-regression.spec.ts:49:7 › Day 128 MVP Regression Suite › FR-3: Login page renders and validates input 
    [chromium] › tests/web/day128-mvp-regression.spec.ts:180:7 › Day 128 MVP Regression Suite › No console errors on critical pages 
  9 passed (6.4s)
Full log: server-runs/2026-05-21T23-56-29-www.soloshopbox.com-kill--0-cat-tmp-day128-tests-v2.pid-2-de-1.log

13. ✓ exit 0 — grep -A 20 "FR-1: Seller can sign up" /tmp/day128-tests-v2.log | head -30
STDOUT:
  ✘   3 [chromium] › tests/web/day128-mvp-regression.spec.ts:12:7 › Day 128 MVP Regression Suite › FR-1: Seller can sign up with email verification (5.3s)
  ✘   1 [chromium] › tests/web/day128-mvp-regression.spec.ts:49:7 › Day 128 MVP Regression Suite › FR-3: Login page renders and validates input (5.4s)
  ✘   4 [chromium] › tests/web/day128-mvp-regression.spec.ts:38:7 › Day 128 MVP Regression Suite › FR-2: Homepage loads with branding and CTA (5.5s)


  1) [chromium] › tests/web/day128-mvp-regression.spec.ts:12:7 › Day 128 MVP Regression Suite › FR-1: Seller can sign up with email verification 

    Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

    Locator: locator('h1')
    Expected pattern: [32m/sign.*up/i[39m
    Received string:  [31m"Page Not Found"[39m
    Timeout: 5000ms

    Call log:
    [2m  - Expect "toContainText" with timeout 5000ms[22m
    [2m  - waiting for locator('h1')[22m
    [2m    14 × locator resolved to <h1 class="text-4xl font-bold text-charcoal mb-4">Page Not Found</h1>[22m
    [2m       - unexpected value "Page Not Found"[22m


      15 |     // Navigate to signup page
      16 |     await page.goto('https://www.soloshopbox.com/auth/signup');
    > 17 |     await expect(page.locator('h1')).toContainText(/sign.*up/i);
         |                                      ^
      18 |     
--
    [chromium] › tests/web/day128-mvp-regression.spec.ts:12:7 › Day 128 MVP Regression Suite › FR-1: Seller can sign up with email verification 
    [chromium] › tests/web/day128-mvp-regression.spec.ts:38:7 › Day 128 MVP Regression Suite › FR-2: Homepage loads with branding and CTA 
    [chromium] › tests/web/day128-mvp-regression.spec.ts:49:7 › Day 128 MVP Regression Suite › FR-3: Login page renders and validates input
Full log: server-runs/2026-05-21T23-56-43-www.soloshopbox.com-grep--A-20-FR-1-Seller-can-sign-up-tmp-d-1.log

14. ✓ exit 0 — curl -sI https://www.soloshopbox.com/auth/login 2>&1 | head -10
STDOUT:
HTTP/2 200 
access-control-allow-headers: Content-Type, Authorization
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-origin: *
cache-control: s-maxage=31536000, stale-while-revalidate
content-type: text/html; charset=utf-8
date: Thu, 21 May 2026 23:56:59 GMT
etag: "eraxc8zwhm5wo"
vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding
x-nextjs-cache: HIT
Full log: server-runs/2026-05-21T23-56-59-www.soloshopbox.com-curl--sI-https-www.soloshopbox.com-auth--1.log

15. ✓ exit 0 — curl -s https://www.soloshopbox.com/auth/login 2>&1 | grep -i "sign" | head -5

16. ✗ fail (exit 2) — cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit
STDOUT:
error TS2688: Cannot find type definition file for 'node'.
  The file is in the program because:
    Entry point of type library 'node' specified in compilerOptions
ERROR: command exited 2
Full log: server-runs/2026-05-21T23-59-17-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log

17. ✓ exit 0 — cd solo-shop-builder-private-e-commerce-for-micro-sellers && npx tsc --noEmit te
STDOUT:
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
Full log: server-runs/2026-05-21T23-59-33-www.soloshopbox.com-cd-solo-shop-builder-private-e-commerce--1.log
