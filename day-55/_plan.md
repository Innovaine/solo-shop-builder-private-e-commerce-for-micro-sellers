# Day 55 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 113
- **Saved:** 18/05/2026, 8:02:53 AM

---

FINISHED:
- 56 tasks completed across MVP feature set (F1–F12 + extended scope features FR-24, FR-25, FR-32, FR-37, FR-156, FR-157, FR-158)
- Docker image + deployment pipeline functional (Dockerfile, DEPLOYMENT.md in root)
- Stripe webhook integration + order creation from payment_intent.succeeded
- Seller dashboard + order status workflow (pending → paid → in-progress → shipped)
- Product CRUD, S3 image upload, public storefront, cart (localStorage), Stripe Checkout flow
- Authentication system (email magic link signup)

PENDING:
- **BLOCKER: app/dashboard/orders/page.tsx emptied to 0 bytes** — Docker build fails, JSX parse errors prevent verification of 4 completed features (FR-24, FR-156, FR-157, FR-158). Must restore from git + re-apply Day 54 changes immediately.
- 4 open tasks ready to assign: #144 (email template editor, FR-37), #143 (CSV product import, FR-32), #131 (seller profile, FR-25), #130 (inventory tracking, FR-24) — these are blocked from code review approval until build is fixed.

TODAY'S WORK STREAMS:
- **Stream 1 (engineer):** Fix the orders page blocker first (15 min max — git restore + re-apply Anil's Day 54 diffs). Then assign #130 (inventory tracking, FR-24) and #143 (CSV import, FR-32) in parallel — both are atomic, no cross-dependencies, and are high-priority seller workflow features that unblock customer feedback loops.
- **Stream 2 (designer):** Ship UI mockups for the 4 open tasks: email template editor (/dashboard/email-template page layout with merge-tag reference), CSV import modal (file upload + validation summary), seller profile card (bio + image + social links), inventory manager (stock count field on product edit). Reference design/pages/email-template.html, design/pages/csv-import.html, design/pages/seller-profile.html, design/pages/inventory-editor.html.
- **Stream 3 (tester):** Write Playwright tests for FR-24 (inventory: add-to-cart disabled when stock=0, stock decrements atomically post-payment) and FR-32 (CSV import: valid rows create products, invalid rows return error summary, malformed CSV rejected). Block on engineer's code landing.
- **Stream 4 (reviewer):** Verify the orders page fix compiles cleanly, then code-review the 4 parallel features as they land (FR-24, FR-32, FR-37, FR-25). Check atomicity on inventory decrement, XSS sanitization on email template HTML, CSV validation logic.
- **Stream 5 (requirements / PM):** Kenji: confirm acceptance criteria for #143 (CSV import edge cases—duplicate product titles, image_url validity, max file size). Confirm email template merge-tag list is complete (FR-37).

ROLE PLAN:
- engineering: **YES** — blocker must be cleared first (30 min), then two parallel high-priority features unblock seller workflows and real usage patterns.
- review: **YES** — code review is the gate; unblock the 4 landed features and verify the parallel work as it lands.
- design: **YES** — 4 features need UI mockups today to unblock engineering; storefront and dashboard pages compound shipping speed.
- connectivity_qa: **YES** — CSV import and inventory checkout require API validation; verify webhook atomicity on stock decrement + payment.
- design_qa: **YES** — fidelity check on email template editor (merge tags must be clearly labeled) and CSV import modal (error messaging legible).
- test: **YES** — FR-24 and FR-32 are logic-heavy and seller-critical; Playwright tests prevent regression on inventory.
- requirements: **YES** — Kenji confirms open task acceptance criteria + any clarifications on CSV edge cases or email merge-tag scope.

ONE-LINE SUMMARY:
Today the team ships the orders page fix (blocker), then runs 4 features in parallel (inventory + CSV import for engineering; email template + seller profile mockups for design; tests for FR-24/FR-32; code review gate) to unblock real seller workflows and regain momentum.
