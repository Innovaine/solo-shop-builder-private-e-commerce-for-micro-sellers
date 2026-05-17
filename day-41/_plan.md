# Day 41 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 89
- **Saved:** 17/05/2026, 6:11:51 AM

---

FINISHED:
- Repo initialized with Docker, env config, and root API scaffolding (app/api/account/password, app/api/analytics stubs exist)
- 41 tasks closed across 64 prior cycles — institutional muscle memory for shipping exists
- Day 40 state: 18 open, 1 in-progress (FR-21–FR-25 test suite); no blockers reported

PENDING:
- #82: Docker build blocker (missing dynamic exports) — unblocks everything downstream
- #59: Import path corrections in checkout + orders pages — payment flow currently broken
- #123: Login bug assigned to Anil — affects F1 (magic link signup)
- #106: Redeploy day 29 features (F31–F40) — 10 features waiting for infra confirmation
- #105: FR-21–FR-25 test suite in-progress with Priya — password auth, webhook, refund, CSV not yet verified

TODAY'S WORK STREAMS:

- **Stream 1 (engineer):** Fix #82 (Docker blockers) and #59 (import paths) first thing — these unblock payment. Then attack #77 (FR-1 through FR-10: auth → shop → products → cart → checkout → orders backend in parallel). Anil should ship login, shop creation, product CRUD API, and cart/checkout payload handlers today. Reference: #77, #82, #59.

- **Stream 2 (designer):** Ship mockups for #60 (product CRUD UI), #65 (verify page + product management layout), and #63 (category dropdown) in parallel. These unblock frontend engineer once Anil confirms API contracts. Target: design/pages/product-form.html, design/pages/verify-email.html, design/pages/product-list.html.

- **Stream 3 (tester):** Write Playwright test scaffolds for #74 (all 20 MVP features F1–F20) in parallel with engineer shipping. Don't wait for every API to be done — test the happy path signup → shop → product listing first, then expand. Reference: #74, #66 (product CRUD + category filter tests).

- **Stream 4 (reviewer):** Verify #82 Docker fix (confirm all exports present, image builds cleanly), then code-review #77 payload handlers (checkout webhook, order creation) before deployment. Watch import paths in #59 are corrected end-to-end.

- **Stream 5 (requirements):** Confirm with Kenji: Do we have Stripe test keys live? Does day 40 #105 (password auth tests) need to ship before checkout tests run, or can they run in parallel? One blocker per role maximum.

ROLE PLAN:
- engineering: YES — Docker blocker (#82) and import paths (#59) are killing velocity; Anil can ship 5 backend supertasks in parallel today if unblocked.
- review: YES — Payment flow (#59, #77) needs verification before demo; Docker fix (#82) must be validated before redeploy attempt.
- design: YES — Frontend is waiting on #60, #65, #63 mockups; Chiara can ship 3 page layouts today in parallel while engineer builds APIs.
- test: YES — #74 test scaffold can run alongside engineer's API work; Priya validates #105 (password auth) finish, then pivots to MVP feature tests.
- requirements: YES — Unblock Kenji to confirm Stripe environment + day 40 rollover status so no surprises mid-week.
- design_qa: NO — Design fidelity check comes after Chiara ships mockups; premature today.

ONE-LINE SUMMARY:
Today the team unblocks Docker + import paths, ships 5 backend supertasks (auth through orders), 3 frontend page layouts, and MVP test scaffold in parallel.
