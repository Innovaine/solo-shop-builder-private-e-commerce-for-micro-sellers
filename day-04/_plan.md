# Day 4 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 30
- **Saved:** 15/05/2026, 7:35:55 PM

---

FINISHED:
- Docker + Next.js project structure (Dockerfile, .dockerignore, tsconfig paths, app/ directory scaffold)
- Authentication routes (signup, login, verify, logout endpoints in `/api/auth/`)
- Login UI page (`/auth/login/page.tsx` with useSearchParams hook)
- Dashboard shell (`/dashboard/page.tsx`, create-shop page)
- Shop creation API route (`/api/shops/route.ts`)
- Global styles (`globals.css`)

PENDING:
- Docker build fails on login page static export — useSearchParams() incompatible with current dynamic directive placement (Day 3 fix incomplete)
- Login page needs either: Suspense boundary wrapping around useSearchParams, or refactor to server component pattern, or move hook to client-side child component
- Build is not testable until login page renders in Docker without static export error

NEXT DAY FOCUS:
Fix the Docker build by resolving the login page useSearchParams static export error — this is the gate for everything else.

ROLE PLAN:
- engineering: YES — Debug and ship the login page fix (Suspense wrap, component split, or directive repositioning); unblock the build so Docker runs clean
- review: YES — Verify the fix passes build in isolation before full Docker test; confirm no regression on tsconfig/Dockerfile changes from Day 3
- design: NO — UI is adequate for MVP; no design iteration until the product is runnable in a browser
- requirements: NO — Feature scope is clear (auth, shop creation, dashboard); no customer signal yet to justify pivoting scope
- test: NO — Cannot write meaningful tests until the build succeeds and the app loads; premature Playwright work wastes cycle time

ONE-LINE SUMMARY:
Anil fixes the login page static export blocker with engineering + Søren's verification; everything else waits until Docker builds clean.
