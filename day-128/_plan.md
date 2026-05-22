# Day 128 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 212
- **Saved:** 22/05/2026, 2:38:14 AM

---

FINISHED:
- MVP foundation: Seller signup (F1), shop creation (F2), product CRUD (F3), S3 image upload (F4), public storefront (F5), categories (F6), search/filter (F7), cart (F8), Stripe Checkout (F9), webhook order creation (F10), seller order dashboard (F11), order status updates (F12) — 12/12 core features built and deployed
- Dockerfile + Dockerfile.single + DEPLOYMENT.md — infrastructure ready for single-tenant + multi-tenant paths
- .env.example + docker config — environment parity between local and production
- 59 tasks closed on board; live URL exists and loads in browser

PENDING:
- #347: "Is everything fine?" — integration test sweep across all 12 features; no known bugs reported but no systematic validation yet that seller→order→status workflow works end-to-end without friction
- Payment flow edge cases: What happens if Stripe webhook arrives before order dashboard loads? Retry logic + idempotency not yet confirmed in test
- Image resize/CDN delivery: S3 upload works; no evidence yet that images serve fast on slow connections or that resizing is lossless

TODAY'S WORK STREAMS:
- **Stream 1 (Engineer):** Attack #347 systematically — wire up end-to-end payment test (fake Stripe event → webhook → order appears in dashboard → seller marks shipped), validate image upload pipeline under load, confirm all environment variables are correctly wired in production. This is final safety check before customer acquisition starts.
- **Stream 2 (Designer):** Ship mobile-responsive versions of storefront (F5 mobile), order dashboard (F11 mobile), product detail page (F5 detail view). Micro-sellers browse shops on phone while sourcing; dashboard needs to work on iPad for warehouse scanning. Reference existing designs; iterate fast on 3 page files.
- **Stream 3 (Tester):** Write Playwright tests for happy-path seller journey (signup → shop creation → product upload with image → customer checkout → order appears → status update). Write tests for payment webhook retry (duplicate webhook should not duplicate order). Test image upload with 5MB+ files. Tests must pass against live deploy.
- **Stream 4 (Reviewer):** Verify engineer's webhook + image pipeline changes don't break existing deploys; spot-check S3 permissions + Stripe key rotation. Confirm no plaintext secrets in .env.example.
- **Stream 5 (Requirements):** Write 1-page seller onboarding checklist (signup → first product → first order). Identify top 3 friction points from #347 to fix next cycle. No new features — discovery only.
- **Stream 6 (QA roles):** Connectivity QA: test all routes return correct status codes + JSON shape (POST /api/orders, GET /shop/:slug, etc.). Design QA: compare rendered UI to design mockups (font sizing, spacing, button states). Standards QA: lint code + check for SQL injection in product search.

ROLE PLAN:
- requirements: YES — extract hidden friction from #347 before customer interviews start
- design_qa: YES — ensure responsive pages match design intent before user testing
- connectivity_qa: YES — all routes + auth paths must be bulletproof before payment flow goes live
- design: YES — mobile storefront + dashboard are blockers for seller retention
- engineering: YES — #347 end-to-end validation + image pipeline hardening are last critical checks before scaling
- review: YES — webhook idempotency + secret hygiene are non-negotiable before any customer hits production
- test: YES — happy-path + webhook retry tests are the only proof #347 is actually resolved
- task_verifier: YES — confirm all 12 features work as spec'd before team moves to post-MVP optimizations
- standards_qa: YES — code cleanliness now prevents security debt later at scale

ONE-LINE SUMMARY:
Today the team validates the complete seller→order→ship workflow end-to-end, ships mobile UI for storefront + dashboard, and hardens the Stripe webhook + image pipeline for production traffic.
