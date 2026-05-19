# Day 78 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

**By:** Kenji (Product Manager)
**Day:** 78 (status: scaling)
**Cycle:** 142

---

## Goal today

**Stabilize MVP, fix open standards issues, and unblock Stage 1 feature work.** Day 77 shipped payment callback fixes and Prisma singleton pattern. Day 78 focus: (1) resolve open standards debt (#224 Prisma import), (2) regression testing across all MVP features (signup, shop creation, product CRUD, checkout, orders, analytics), (3) identify + document blockers for next Stage 1 features. Target: clean build, zero blocking issues, app ready for beta customer outreach.

---

## Features in scope

**No new features in scope today.** Focus is **stabilization + regression + standards compliance**.

---

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| STAB-1 | Fix Prisma import syntax [STANDARDS] | app/api/checkout/route.ts line 9 has incorrect Prisma import syntax (`new PrismaClient()` instead of singleton pattern). Replace with `import prisma from '@/lib/db'` per task #224. | 1. Import changed to singleton pattern. 2. No `new PrismaClient()` in checkout route. 3. TypeScript build passes. 4. Route still functional (test with curl or Playwright). |
| STAB-2 | Regression test: signup → shop → products → checkout | End-to-end flow: (1) signup with email magic link, (2) create shop, (3) add 2 products, (4) add to cart, (5) checkout with Stripe, (6) order appears in seller dashboard, (7) customer receives confirmation email. Validates all MVP features still work together. | 1. Signup succeeds (email + magic link). 2. Shop created with slug. 3. Products visible on storefront. 4. Cart adds items. 5. Stripe checkout loads. 6. Order webhook processed. 7. Order visible in /dashboard/orders. 8. Email received (check test inbox). |
| STAB-3 | Regression test: order status flow | Seller dashboard: (1) view all orders, (2) mark order as in-progress, (3) update with tracking ID, (4) mark shipped, (5) customer tracking link shows correct status. Validates order state machine + email notifications. | 1. Orders table loads. 2. Status dropdown works (pending → paid → in-progress → shipped). 3. Tracking ID field accepts URL. 4. Updates save to DB. 5. Customer tracking page reflects new status. 6. Confirmation emails sent. |
| STAB-4 | Regression test: seller settings pages | Test all dashboard pages load and save without 401/500: (1) /dashboard/profile, (2) /dashboard/settings, (3) /dashboard/branding, (4) /dashboard/billing, (5) /dashboard/email-template. Ensures auth + API responses are correct. | 1. All pages load (no 401 Unauthorized). 2. Form fields render correctly. 3. Save button works (no validation errors). 4. Success message shows. 5. Data persists on page reload. 6. No console errors. |
| STAB-5 | Build + deploy verification | Full build pipeline: (1) git pull, (2) docker compose build, (3) docker compose up -d, (4) health check /api/health, (5) smoke test key routes. Validates deployment is clean. | 1. No build errors (TypeScript, Next.js). 2. Docker image builds successfully. 3. Container starts within 30s. 4. Health check returns 200 OK. 5. Homepage loads. 6. Admin login works. 7. Shop storefront loads. |

---

## Stack chosen (lock in day 1)
- **Backend:** Node.js + TypeScript (Next.js API routes)
- **Frontend:** Next.js 14 (App Router, Tailwind CSS)
- **Database:** Postgres 16 + Prisma ORM (singleton pattern in lib/db.ts)
- **Payment:** Stripe Checkout + Webhooks (Stripe) + MyFatoorah (backup)
- **Email:** Resend (transactional)
- **Hosting:** www.soloshopbox.com (Docker on VPS)
- **Why:** 78 days in this stack. Proven, deployed, live with paying flows.

---

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Standards | No `new PrismaClient()` anywhere in codebase — use singleton in lib/db.ts |
| NFR-2 | Performance | Build time <5 minutes (docker compose build + push) |
| NFR-3 | Performance | /api/health returns in <500ms |
| NFR-4 | Performance | Homepage loads in <2s (p95) |
| NFR-5 | Reliability | All MVP routes return correct HTTP status (200 for success, 401 for auth, 400 for validation) |
| NFR-6 | Testing | Regression suite covers: signup → shop → products → checkout → orders → tracking |
| NFR-7 | Testing | All 5 regressions pass before day end |
| NFR-8 | Observability | Logs show clear request ID + timestamp on all errors |

---

## Out of scope (do NOT build today)
- New features or Stage 1 additions
- Performance optimization (caching, indexing)
- Security audit or penetration testing
- UI/UX improvements
- Mobile responsiveness refinements
- Webhook signature verification (already hardened)

---

## Open questions for owner
1. **Beta customer outreach timeline:** Should we target outreach to first 5 beta sellers on Day 79–80, or wait until Stage 1 features ship?
2. **Known issue triage:** Are there any known seller complaints or bugs NOT in the task board that should be prioritized?
3. **Stage 1 priority:** Which Stage 1 features should be next in queue? (Suggested: password auth + reset [FR-21/22] for faster seller login, then inventory validation [FR-24], then analytics hardening [FR-27])

---

## Definition of done for day 78

**Engineer + Reviewer checklist:**

**STAB-1: Fix Prisma import**
- [ ] Task #224 addressed: app/api/checkout/route.ts imports from @/lib/db
- [ ] No `new PrismaClient()` in checkout route
- [ ] All imports in all /api routes use singleton pattern
- [ ] TypeScript build passes (tsc --noEmit)

**STAB-2: End-to-end regression**
- [ ] Signup → magic link email received
- [ ] Shop creation successful + slug unique
- [ ] Product create + edit + delete works
- [ ] Products visible on /shop/[slug]
- [ ] Cart add/remove works (localStorage)
- [ ] Stripe checkout flow completes
- [ ] Order created from webhook
- [ ] Order visible in /dashboard/orders
- [ ] Customer confirmation email received
- [ ] Tracking link shows order status

**STAB-3: Order status flow**
- [ ] Orders load in dashboard
- [ ] Status dropdown shows all 5 states
- [ ] Tracking ID field accepts input
- [ ] Status updates save + persist
- [ ] Customer tracking page reflects updates
- [ ] Status change emails sent to customer

**STAB-4: Settings pages regression**
- [ ] /dashboard/profile loads (no 401)
- [ ] /dashboard/settings loads (no 401)
- [ ] /dashboard/branding loads (no 401)
- [ ] /dashboard/billing loads (no 401)
- [ ] /dashboard/email-template loads (no 401)
- [ ] Each page save button works
- [ ] Data persists on reload
- [ ] No console errors

**STAB-5: Build + deploy**
- [ ] Full build succeeds (docker compose build)
- [ ] No TypeScript errors
- [ ] Container starts + stays running >5 min
- [ ] Health check returns 200 OK
- [ ] Homepage loads
- [ ] Login page loads
- [ ] Shop storefront loads
- [ ] Dashboard loads with auth

**Overall**
- [ ] All regression tests passing (Playwright suite)
- [ ] App deployed to www.soloshopbox.com
- [ ] Health check: https://www.soloshopbox.com/api/health → 200
- [ ] No critical errors in logs
- [ ] Ready for beta customer testing

---

## Rollback plan
If any regression fails critically:
- Revert to last good commit (git revert)
- Document failure + root cause in day-78/risks.md
- File blocker task for next cycle
- Deploy previous stable version

---

## Metrics for success
- 5 regression tests passed
- 0 TypeScript errors
- 0 critical bugs blocking checkout or order flow
- Build + deploy successful
- Health check + smoke test passing
- App stable for beta testing
- Team confidence: ready to add Stage 1 features next sprint

---

## Dependencies & handoffs
- **Engineer:** Fix #224, run regression suite, deploy
- **Tester:** Playwright regression suite (already written), report failures
- **Reviewer:** Code review on #224 fix, verify no new debt introduced
- **Designer:** No changes needed (MVP UI stable)

---

## Notes for team
- Day 78 is a **stabilization day**, not a feature day. Think of it as "sprint consolidation."
- If regressions pass smoothly, team can begin Day 79 with fresh energy on Stage 1 features.
- Runway is critical (0.0 months) — we need this app rock-solid before beta customer inbound to prove market fit.
- Every regression failure is a blocker for Stage 1 planning. Flag early.
- Let's ship a clean, solid checkpoint today.
