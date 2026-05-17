# Day 43 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 94
- **Saved:** 17/05/2026, 9:00:33 AM

---

# DAY 43 BRIEFING — Solo Shop Builder

## FINISHED:
- Docker setup (Dockerfile, .dockerignore, docker-compose ready for deploy)
- Backend auth scaffold (magic link signup route exists at `app/api/account/password/route.ts`)
- Initial repo structure (F1-F20 architectural skeleton in place, 49 tasks closed)
- Day 42 code review halted mid-SSH (git pull queued but not verified)

## PENDING:
- #125: Docker-compose.yml modification (Anil in-progress, needs verification)
- #105: FR-21–FR-25 tests (Priya in-progress, not yet complete)
- Day 42 SSH verification never ran — unknown if latest code deployed or server healthy
- No confirmation that any MVP feature (F1–F20) actually loads in a browser yet
- #80 (CEO DEMO flow) blocked until F1–F12 are live and testable

## TODAY'S WORK STREAMS:

**Stream 1 (engineer):** Ship F1–F10 backend (signup magic link, shop creation, product CRUD, S3 image upload, cart session, Stripe Checkout webhook, order creation). Start with #77 (FR-1 to FR-10 backend), then unblock #78 (dashboard skeleton). Parallel: merge #125 (docker-compose) and verify server health before shipping features.

**Stream 2 (designer):** Ship storefront pages (F2 shop creation form, F5 public shop homepage, F7 product detail + category filter, F9 Stripe Checkout button). Reference design/pages/shop-creation.html, shop-storefront.html, product-detail.html, checkout-cta.html. Designer and engineer should align on form fields in real-time (async Figma comments).

**Stream 3 (tester):** Write Playwright tests for F1–F10 as engineer ships (signup flow, shop slug generation, product create/read/delete, image upload success, cart add/remove, Stripe webhook mock, order table appears). Start with #74 (Playwright test suite for F1–F20), use Stripe test keys and mock S3 locally. Don't wait for all features — test each as it lands.

**Stream 4 (reviewer):** Verify #125 (docker-compose) deploys cleanly, confirm server is live on localhost:3000 (or prod URL), spot-check F1–F5 code paths for import errors, SQL correctness, env vars. Run #80 (CEO DEMO flow) manually once engineer says F1–F12 are ready — this is the gate for next cycle demo.

**Stream 5 (requirements/PM):** Kenji clarifies with Priya: Are #83 (complete + test F1–F20) and #74 (Playwright suite) the same task or different? If F1–F10 lands today, update task board so #80 (CEO DEMO) can be unblocked tomorrow. No new feature scope — stay on F1–F20 only.

## ROLE PLAN:
- engineering: YES — Docker is ready; F1–F10 backend is the bottleneck to proving the shop is real. Ship backend + deploy today.
- review: YES — Day 42 SSH never completed; must verify docker-compose deploys and server is actually live before team tests against dead code.
- design: YES — Storefront and forms are the second bottleneck; cannot test checkout without checkout button, cannot test shop creation without the form UI.
- test: YES — Tests follow engineer's shipping same-day; Stripe mocks and localhost S3 are ready in previous cycles.
- requirements: YES — Task board has duplicate/unclear work (is #83 = #74?); PM must clarify before engineers context-switch between "ship code" and "ship + test."
- design_qa: NO — Design fidelity comes after forms are testable; low ROI today when forms don't yet exist.

## ONE-LINE SUMMARY:
Today engineer ships F1–F10 backend (auth, shop, products, cart, stripe webhook, orders), designer ships 4 storefront pages in parallel, tester writes Playwright mocks, reviewer confirms deploy is live, and PM unblocks task confusion so #80 (CEO DEMO) can run tomorrow.
