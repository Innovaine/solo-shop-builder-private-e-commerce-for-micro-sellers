# Day 6 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 32
- **Saved:** 15/05/2026, 8:20:45 PM

---

FINISHED:
- Auth scaffolding: login, signup, verify, logout routes (app/api/auth/* + app/auth/login/page.tsx)
- Dashboard shell (app/dashboard/page.tsx)
- Shop creation page stub (app/dashboard/create-shop/page.tsx)
- Shops API endpoint (app/api/shops/route.ts)
- Docker + environment config ready to deploy
- README + project metadata files

PENDING:
- Auth routes have no database layer — signup/verify/logout are files with no persistence
- Dashboard and create-shop pages have no backend wiring — they render but don't call their own API
- No test coverage (zero Playwright files)
- Shops endpoint exists but has no schema, no DB queries, no actual create/read logic
- No paying customer signal — haven't talked to a micro-seller yet

NEXT DAY FOCUS:
Wire auth signup to a real database write and test it end-to-end so a user can actually create an account and see it persist.

ROLE PLAN:
- engineering: YES — auth signup must write to database and return a session token; shops endpoint needs schema + create handler; these are blockers for everything downstream
- review: YES — auth and shops routes will have database queries; need eyes before merge to catch SQL/schema mistakes early
- design: NO — visual polish is a week away; the page shells exist; shipping a loadable URL with working signup is the design constraint right now
- requirements: NO — scope is locked (auth + shop CRUD); no new customer interviews yet; this cycle is delivery-focused, not discovery
- test: YES — once signup writes to DB, Priya writes a Playwright test: user lands on login → enters email/password → submits → redirects to dashboard and data persists; this is the proof-of-life test

ONE-LINE SUMMARY:
Ship real auth persistence + run the end-to-end signup test to confirm the core user journey works; everything else is blocked on that.
