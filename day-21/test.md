# Day 21 — Testing (Playwright / Appetize): Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Priya (Tester)
- **Cycle:** 52
- **Saved:** 16/05/2026, 4:41:24 PM

---

## ✅ Done

Day 21 testing complete with PASS verdict. All 11 shopping cart tests (FR-11 & FR-12) passed in 3.0s. Engineer successfully fixed the Day 20 TypeScript blocking issue - cart functionality now works end-to-end with localStorage persistence, quantity management, and proper UI integration. App is deployed, healthy, and ready to ship.

Status: DONE

Day 21 testing complete with PASS verdict. All 11 shopping cart tests (FR-11 & FR-12) passed in 3.0s. Engineer successfully fixed the Day 20 TypeScript blocking issue - cart functionality now works end-to-end with localStorage persistence, quantity management, and proper UI integration. App is deployed, healthy, and ready to ship.

## Plan
[x] p1: SSH: Check server status and pull latest code
[x] p2: SSH: Verify app is running and health check passes
[x] p3: SSH: Run existing cart.spec.ts tests against deployed app
[x] p4: Read test results and determine pass/fail status
[x] p5: Write Day 21 test report with verdict
[ ] p6: Finish with status summary

## Actions
- list `/` (688 files)
- read `day-21/_plan.md` (1994B)
- read `day-21/engineering.md` (24910B)
- read `requirements.md` (8009B)
- read `test-results/day-20/report.md` (5036B)
- read `README.md` (1426B)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers 2>/dev/null || echo "Repo not cloned yet`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p1: SSH: Check server status and pull latest code
- ✓ p2: SSH: Verify app is running and health check passes
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `kill -0 $(cat /tmp/cart-test-day21.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `sleep 10`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `sleep 15`
- ran 1 SSH command(s) — 1 failure(s)
- queued SSH on app: `kill -0 $(cat /tmp/cart-test-day21-v3.pid) 2>/dev/null && echo "RUNNING" || echo "DONE"`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- queued SSH on app: `cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers`
- ran 1 SSH command(s) — 0 failure(s)
- ✓ p3: SSH: Run existing cart.spec.ts tests against deployed app
- ✓ p4: Read test results and determine pass/fail status
- **wrote** `test-results/day-21/report.md` (5760B)
- ✓ p5: Write Day 21 test report with verdict

## SSH commands executed
1. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers 2>/dev/null || echo 
STDOUT:
d11d49dc643d   solo-shop-builder-private-e-commerce-for-micro-sellers-app   "docker-entrypoint.s…"   5 minutes ago   Up 3 minutes             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   solo-shop-builder-private-e-commerce-for-micro-sellers-app-1
5f319186e48e   postgres:16-alpine                                           "docker-entrypoint.s…"   5 minutes ago   Up 5 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   solo-shop-builder-private-e-commerce-for-micro-sellers-postgres-1
/dev/sda1       387G   53G  335G  14% /
 13:35:02 up 3 days, 14:38,  5 users,  load average: 0.03, 0.06, 0.04
Full log: server-runs/2026-05-16T13-35-03-app-cd-solo-shop-builder-private-e-commerce--1.log

2. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
✓ Health check PASS
HTTP/1.1 200 OK
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding
x-nextjs-cache: HIT
X-Powered-By: Next.js
Cache-Control: s-maxage=31536000, stale-while-revalidate
ETag: "d5vb1f2l6b6pa"
Content-Type: text/html; charset=utf-8
Content-Length: 8707
Date: Sat, 16 May 2026 13:35:18 GMT
Connection: keep-alive
Full log: server-runs/2026-05-16T13-35-18-app-cd-solo-shop-builder-private-e-commerce--1.log

3. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
Started cart tests, PID=986282
Full log: server-runs/2026-05-16T13-35-41-app-cd-solo-shop-builder-private-e-commerce--1.log

4. ✓ exit 0 — kill -0 $(cat /tmp/cart-test-day21.pid) 2>/dev/null && echo "RUNNING" || echo "D
STDOUT:
DONE
Error: No tests found.
Make sure that arguments are regular expressions matching test files.
You may need to escape symbols like "$" or "*" and quote the arguments.
Full log: server-runs/2026-05-16T13-35-58-app-kill--0-cat-tmp-cart-test-day21.pid-2-de-1.log

5. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
cart.spec.ts NOT FOUND
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
da5807b Priya (tester, day 17) — pre-SSH sync
cd059dc Priya (tester, day 17) — pre-SSH sync
be19d7d Priya (tester, day 17) — pre-SSH sync
b55a251 Priya (tester, day 17) — pre-SSH sync
19c55a7 Anil (engineer, day 17) — pre-SSH sync
Full log: server-runs/2026-05-16T13-36-15-app-cd-solo-shop-builder-private-e-commerce--1.log

6. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
…  |   33 +
 day-21/engineering.md                        |  415 +++++
 day-21/review.md                             |   21 +
 docker-compose.yml                           |    2 +-
 playwright.config.ts                         |   59 +
 prisma/schema.prisma                         |   40 +
 server-log.md                                | 2087 ++++++++++++++++++++++++++
 src/lib/cart.ts                              |  162 ++
 test-results/day-17/report.md                |  179 +++
 test-results/day-18/report.md                |  134 ++
 test-results/day-20/report.md                |  106 ++
 tests/web/cart.spec.ts                       |  283 ++++
 tests/web/scaling-day18.spec.ts              |  308 ++++
 tests/web/scaling-day19.spec.ts              |  345 +++++
 34 files changed, 5771 insertions(+), 28 deletions(-)
 create mode 100644 app/components/AddToCartButton.tsx
 create mode 100644 app/components/CartButton.tsx
 create mode 100644 day-17/_index.md
 create mode 100644 day-17/test.md
 create mode 100644 day-18/_index.md
 create mode 100644 day-18/_plan.md
 create mode 100644 day-18/engineering.md
 create mode 100644 day-18/test.md
 create mode 100644 day-19/_index.md
 create mode 100644 day-19/_plan.md
 create mode 100644 day-19/engineering.md
 create mode 100644 day-19/review.md
 create mode 100644 day-20/_index.md
 create mode 100644 day-20/_plan.md
 create mode 100644 day-20/engineering.md
 create mode 100644 day-20/review.md
 create mode 100644 day-20/test.md
 create mode 100644 day-21/_plan.md
 create mode 100644 day-21/engineering.md
 create mode 100644 day-21/review.md
 create mode 100644 playwright.config.ts
 create mode 100644 src/lib/cart.ts
 create mode 100644 test-results/day-17/report.md
 create mode 100644 test-results/day-18/report.md
 create mode 100644 test-results/day-20/report.md
 create mode 100644 tests/web/cart.spec.ts
 create mode 100644 tests/web/scaling-day18.spec.ts
 create mode 100644 tests/web/scaling-day19.spec.ts
-rw-rw-r-- 1 tester tester 9361 May 16 13:36 tests/web/cart.spec.ts
Full log: server-runs/2026-05-16T13-36-31-app-cd-solo-shop-builder-private-e-commerce--1.log

7. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
Started cart tests v2, PID=986799
Full log: server-runs/2026-05-16T13-36-54-app-cd-solo-shop-builder-private-e-commerce--1.log

8. ✓ exit 0 — sleep 10
STDOUT:
DONE
Error: EACCES: permission denied, rmdir '/tmp/playwright-test-results/scaling-day19-Day-19-—-Sca-b75d5-es-include-security-headers-chromium'

Error in reporter Error: EACCES: permission denied, open '/tmp/playwright-test-results/.last-run.json'
    at open (node:internal/fs/promises:640:25)
    at Object.writeFile (node:internal/fs/promises:1257:14)
    at LastRunReporter.onEnd (/usr/lib/node_modules/playwright/lib/runner/index.js:6153:5)
    at wrapAsync (/usr/lib/node_modules/playwright/lib/runner/index.js:1614:12)
    at Multiplexer.onEnd (/usr/lib/node_modules/playwright/lib/runner/index.js:1582:25)
    at InternalReporter.onEnd (/usr/lib/node_modules/playwright/lib/runner/index.js:1749:12)
    at finishTaskRun (/usr/lib/node_modules/playwright/lib/runner/index.js:5822:26)
    at runTasks (/usr/lib/node_modules/playwright/lib/runner/index.js:5809:10)
    at Object.runAllTestsWithConfig (/usr/lib/node_modules/playwright/lib/runner/index.js:6480:18)
    at runTests (/usr/lib/node_modules/playwright/lib/cli/testActions.js:93:18)
    at _Command.<anonymous> (/usr/lib/node_modules/playwright/lib/program.js:50:7) {
  errno: -13,
  code: 'EACCES',
  syscall: 'open',
  path: '/tmp/playwright-test-results/.last-run.json'
}
Full log: server-runs/2026-05-16T13-37-19-app-sleep-10-1.log

9. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
Started cart tests v3, PID=987101
Full log: server-runs/2026-05-16T13-37-41-app-cd-solo-shop-builder-private-e-commerce--1.log

10. ✗ exec-error (exit -) — sleep 15
ERROR: Connection timed out (after 3 attempts on this idempotent command)

11. ✓ exit 0 — kill -0 $(cat /tmp/cart-test-day21-v3.pid) 2>/dev/null && echo "RUNNING" || echo
STDOUT:
DONE
Full log: server-runs/2026-05-16T13-39-23-app-kill--0-cat-tmp-cart-test-day21-v3.pid-2-1.log

12. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
total 12K
drwxrwxr-x 2 tester tester 4.0K May 16 13:37 .
drwxrwxr-x 6 tester tester 4.0K May 16 13:37 ..
-rw-rw-r-- 1 tester tester   45 May 16 13:37 .last-run.json
No run.log
/usr/bin/npx
11.12.1
Full log: server-runs/2026-05-16T13-39-39-app-cd-solo-shop-builder-private-e-commerce--1.log

13. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:
{
  "status": "passed",
  "failedTests": []
}Error: EACCES: permission denied, unlink '/tmp/playwright-test-results/.last-run.json'

Error in reporter Error: EACCES: permission denied, open '/tmp/playwright-test-results/.last-run.json'
    at open (node:internal/fs/promises:640:25)
    at Object.writeFile (node:internal/fs/promises:1257:14)
    at LastRunReporter.onEnd (/usr/lib/node_modules/playwright/lib/runner/index.js:6153:5)
    at wrapAsync (/usr/lib/node_modules/playwright/lib/runner/index.js:1614:12)
    at Multiplexer.onEnd (/usr/lib/node_modules/playwright/lib/runner/index.js:1582:25)
    at InternalReporter.onEnd (/usr/lib/node_modules/playwright/lib/runner/index.js:1749:12)
    at finishTaskRun (/usr/lib/node_modules/playwright/lib/runner/index.js:5822:26)
    at runTasks (/usr/lib/node_modules/playwright/lib/runner/index.js:5809:10)
    at Object.runAllTestsWithConfig (/usr/lib/node_modules/playwright/lib/runner/index.js:6480:18)
    at runTests (/usr/lib/node_modules/playwright/lib/cli/testActions.js:93:18)
    at _Command.<anonymous> (/usr/lib/node_modules/playwright/lib/program.js:50:7) {
  errno: -13,
  code: 'EACCES',
  syscall: 'open',
  path: '/tmp/playwright-test-results/.last-run.json'
}
Full log: server-runs/2026-05-16T13-40-06-app-cd-solo-shop-builder-private-e-commerce--1.log

14. ✓ exit 0 — cd ~/solo-shop-builder-private-e-commerce-for-micro-sellers
STDOUT:

Running 11 tests using 4 workers

  ✓   4 [chromium] › tests/web/cart.spec.ts:34:7 › Shopping Cart — Add to Cart › Clicking Add to Cart shows success message (770ms)
  ✓   3 [chromium] › tests/web/cart.spec.ts:76:7 › Shopping Cart — Cart UI › Cart modal opens when clicking cart button (814ms)
  ✓   1 [chromium] › tests/web/cart.spec.ts:57:7 › Shopping Cart — Cart UI › Cart button appears after adding item (825ms)
  ✓   2 [chromium] › tests/web/cart.spec.ts:17:7 › Shopping Cart — Add to Cart › Product detail page has Add to Cart button (829ms)
  ✓   5 [chromium] › tests/web/cart.spec.ts:98:7 › Shopping Cart — Cart UI › Cart displays item count badge (730ms)
  ✓   6 [chromium] › tests/web/cart.spec.ts:120:7 › Shopping Cart — Quantity Management › Can increase quantity in cart modal (756ms)
  ✓   7 [chromium] › tests/web/cart.spec.ts:153:7 › Shopping Cart — Quantity Management › Can remove item from cart (750ms)
  ✓   8 [chromium] › tests/web/cart.spec.ts:184:7 › Shopping Cart — Persistence › Cart persists across page navigation (749ms)
  ✓   9 [chromium] › tests/web/cart.spec.ts:213:7 › Shopping Cart — Storefront Integration › Cart button appears on shop storefront page (678ms)
  ✓  11 [chromium] › tests/web/cart.spec.ts:264:7 › Shopping Cart — Error Handling › Shows error when localStorage is full (664ms)
  ✓  10 [chromium] › tests/web/cart.spec.ts:237:7 › Shopping Cart — Storefront Integration › Cart modal shows Proceed to Checkout button (681ms)

  11 passed (3.0s)
Full log: server-runs/2026-05-16T13-40-34-app-cd-solo-shop-builder-private-e-commerce--1.log
