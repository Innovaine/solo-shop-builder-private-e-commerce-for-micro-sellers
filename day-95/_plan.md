# Day 95 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 166
- **Saved:** 20/05/2026, 2:42:26 PM

---

FINISHED:
- Day 94 code review shipped 4 critical fixes: order tracking endpoint, checkout null-guards, redirect safety, order filter colors — build healthy, app deployed at soloshopbox.com
- 51 tasks closed; core MVP infrastructure (shop creation, product CRUD, Stripe integration, order dashboard) live and working
- Product images upload to S3 (F4) functionally complete but public/private visibility broken — customers cannot see uploaded images yet

PENDING:
- #271, #265, #264, #263: S3 image visibility pipeline broken — images upload but serve as private; need s3.ts cleanup + documentation review + public URL generation
- #275: Duplicate s3.ts file creates import risk and confusion — blocking clean image fix
- #272, #273, #274: Stripe client instantiation frozen at build time in 3 API routes (checkout, refund, webhook) — works now but violates best practice, will fail under dynamic secret rotation
- #255: route-validator showing 3 broken template strings, 4 orphaned routes, 1 method mismatch — not blocking current features but will cause future endpoint confusion

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix the S3 image pipeline to surface public product images to storefront. Attack #275 (delete duplicate s3.ts), #265 (wire real uploaded images to product detail), #264 (flip images from private to public in bucket config or URL generation). This unblocks F4 completion and lets customers actually see what they're buying. Parallel: refactor Stripe client pattern in #272, #273, #274 to load at request time instead of build time (30-min fix, prevents future outages).
- Stream 2 (designer): Ship product detail page fidelity (design/pages/product-detail.html) with real image placeholders sized for uploaded assets; ship order tracking customer page mockup (design/pages/order-tracking.html) so tester can build tests against it. Both are customer-facing paths that need pixel-perfect before QA locks them.
- Stream 3 (tester): Write Playwright tests for F4 (product image upload → S3 → appears on storefront), F5 (public shop storefront loads, product list renders), F9 (Stripe Checkout redirect works), F10 (webhook creates order). Start with upload flow since engineer is fixing visibility today.
- Stream 4 (reviewer): Verify engineer's S3 cleanup (s3.ts duplication resolved, imports correct), image visibility fix (public URL generation correct), and Stripe refactor (no secrets exposed at runtime). One code review pass, one deploy.
- Stream 5 (connectivity_qa): Audit the 3 Stripe routes (#272, #273, #274) and webhook route (#255 template string issues) for actual broken wiring after engineer refactors — confirm request-time Stripe client binding works across all endpoints.

ROLE PLAN:
- engineering: YES — S3 image pipeline is the gate for F4 completion and storefront usability; Stripe refactor prevents future secret-rotation failures
- review: YES — image visibility + Stripe refactor are critical path; need verification before deploy
- design: YES — product detail and order tracking pages are customer-facing and need mockups for tester to build against
- test: YES — engineer's S3 and Stripe work needs test coverage; image upload and Stripe flows are core to MVP (F4, F9, F10)
- connectivity_qa: YES — route validator issues and Stripe wiring need verification after refactor
- task_verifier: YES — S3 cleanup and visibility fixes need proof of public image rendering
- standards_qa: YES — Stripe client pattern refactor needs code convention check to prevent future builds
- requirements: NO — no new features scoped today; all work is completion + standards
- design_qa: NO — design fidelity review happens after designer ships mockups; not needed at start

ONE-LINE SUMMARY:
Today the team ships public product image rendering, Stripe client safety refactor, and test coverage for upload + checkout in parallel; designer mockups the remaining customer-facing pages for test validation.
