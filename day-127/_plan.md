# Day 127 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 211
- **Saved:** 22/05/2026, 1:37:05 AM

---

# BRIEFING — Solo Shop Builder Day 127

## FINISHED:
- Docker config + GitHub CI/CD pipeline (Dockerfile, .dockerignore, deployment manifest)
- Core backend scaffolding (Node/Express, database schema for sellers/products/orders)
- Stripe webhook integration for payment_intent.succeeded → order creation (F10 wired)
- Seller auth via magic link (F1 implemented)
- Product CRUD endpoints (F3 backend complete)
- Shop storefront page structure (F5 routes scaffolded)
- Shopping cart logic in localStorage (F8 browser-side working)
- Order dashboard query layer (F11 data layer ready)
- 59 of 60 task board items closed

## PENDING:
- #346: No CSS/styling on any page — app is functionally live but visually bare; blocking customer-facing fidelity
- Product image upload to S3 (F4) — endpoint exists but untested end-to-end
- Stripe Checkout redirect flow (F9) — wired but no live Stripe key in staging
- Order status dropdown (F12) — backend ready, frontend form missing
- Product search/filter by category (F7) — query layer exists, UI not built
- Seller order dashboard layout — queries work, no visual layout or columns defined
- No Playwright tests written yet (entire test suite is empty)

## TODAY'S WORK STREAMS:

**Stream 1 (engineering — Anil):**
Attack F4 (S3 image upload end-to-end), F9 (Stripe Checkout live redirect with staging keys), and F12 (order status update form + PATCH endpoint). These are the three gaps between "app runs" and "seller can actually transact." Ship all three in parallel; they don't block each other.

**Stream 2 (designer — Chiara):**
Ship design for seller dashboard layout (columns: order ID, customer, total, status, timestamp), order status dropdown form, and product upload form with image preview. Reference design/pages/seller-dashboard.html, design/pages/order-detail.html, design/pages/product-form.html. Keep it minimal — one color, readable type, Stripe-grade simplicity.

**Stream 3 (tester — Priya):**
Write Playwright tests for customer happy path (visit shop → add product to cart → complete Stripe Checkout → order appears in seller dashboard) and seller happy path (upload product with image → edit product → mark order shipped). These two flows validate F1, F3, F4, F5, F8, F9, F10, F11, F12 in real browser clicks.

**Stream 4 (reviewer — Søren):**
Verify all three engineer tasks against Stripe sandbox behavior and S3 integration; spot-check image resizing and CDN serving; confirm webhook signature validation is live.

**Stream 5 (connectivity QA — Zainab):**
Verify Stripe Checkout redirects work in staging, S3 bucket permissions are correct, and magic link auth emails land in inbox (not spam). One line each.

**Stream 6 (task verifier — Mehrdad):**
Close #346 (styling shipped) and verify Playwright test suite passes on merged code before day end.

---

## ROLE PLAN:

- **engineering: YES** — Three feature gaps (image upload, Stripe live checkout, order status UX) are all backend-ready and must ship today for the app to be usable by a real seller.
- **review: YES** — Stripe + S3 integration are security-critical; need eyes before they touch production.
- **design: YES** — All three engineer tasks have corresponding UI (dashboard layout, order form, product form); designer ships in parallel so engineer isn't blocked waiting for mockups.
- **connectivity_qa: YES** — Stripe sandbox, S3 permissions, and email delivery must be validated before we claim this works.
- **task_verifier: YES** — #346 is the only open task; closing it unblocks the team's "shipped" count and signals progress to investors.
- **test: YES** — No tests exist yet; Playwright suite for happy-path flows (customer purchase + seller order tracking) is now critical since we're moving past MVP into "real seller trial" phase.
- **design_qa: YES** — All three new pages must match the storefront fidelity we've already shipped; catch layout regressions.
- **standards_qa: YES** — Code style + linting on new S3 + Stripe code; prevent tech debt from seeping into the hot path.
- **requirements: NO** — Product spec is locked for MVP; no new work discovery needed today, only execution of F4/F9/F12.

---

## ONE-LINE SUMMARY:
Today the team ships product image upload (F4), live Stripe Checkout (F9), and order status workflow (F12) in parallel—three feature completions that move Solo Shop from "technically functional" to "actually sellable"—plus Playwright test coverage and final dashboard/form UI to make the seller experience real.
