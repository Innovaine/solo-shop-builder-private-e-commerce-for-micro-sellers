# Day 124 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 208
- **Saved:** 22/05/2026, 1:06:20 AM

---

# DAY 124 BRIEF — SOLO SHOP BUILDER

## FINISHED:
- Dockerfile + docker-compose setup (root files present, deployment infrastructure live)
- 59 tasks completed on task board (product moving from MVP planning into implementation phase)
- Environment scaffolding (`.env.example`, `.qadar-*` config files, git + deployment setup)
- Core project structure and CI/CD skeleton ready

## PENDING:
- #343: App container DOWN — npm cache corruption in graceful-fs (Anil, blocking all shipping)
- No tasks on open board yet — task breakdown from product spec (F1–F12) not yet decomposed into executable work
- No design files shipped yet — starter pages (signup, shop-creation, storefront, dashboard) not yet mocked
- No test suite initialized — Playwright setup + test harness not yet live

## TODAY'S WORK STREAMS:

**Stream 1 (engineer):**
Anil: Fix #343 (npm cache + graceful-fs) first — this is a blocker. Once container is live, ship F1 (seller signup via magic link), F2 (shop creation + slug generation), and F4 (S3 image upload prep). These are foundation; everything else stacks on them. Target: 3 features + working deploy by EOD.

**Stream 2 (designer):**
Chiara: Ship 4 mockups in parallel: signup flow (F1), shop creation form (F2), product upload form (F3), public storefront grid (F5). Don't wait for engineer — use placeholder data. These will be referenced in Anil's build and unblock Priya's test writing.

**Stream 3 (tester):**
Priya: Write Playwright tests for F1 (magic link auth flow), F2 (shop slug creation), F3 (product CRUD), F5 (storefront visibility). Don't wait for full engineer build — scaffold tests against Chiara's mocks and engineer's API stubs. Goal: test harness + 4 passing feature tests by EOD.

**Stream 4 (reviewer):**
Søren: Code review on #343 fix + F1/F2/F4 PRs as they land. Enforce: Docker builds cleanly, magic link flow doesn't store plaintext tokens, S3 upload respects signed URLs. Approve or kick back same-day.

**Stream 5 (connectivity QA):**
Zainab: Verify F1 routes (signup, magic-link callback), F2 routes (shop creation, slug uniqueness check), F4 route (image upload endpoint). Confirm auth state persists across requests.

**Stream 6 (task verifier):**
Mehrdad: As Anil closes #343 and ships F1/F2, run them on staging and mark verified only if: container stays up, signup email lands in test mailbox, shop URL is live and accessible.

**Stream 7 (requirements):**
Kenji: Decompose F3, F6, F7, F8, F9, F10 into taskboard cards (each with acceptance criteria). Have them queued for Stream 2 onward so engineer doesn't wait for planning.

**Stream 8 (standards QA):**
Vitali: Scan #343 fix + landing PRs for: consistent error handling, env variable naming, database query patterns. Flag blockers before Søren signs off.

**Stream 9 (design QA):**
Gopal: Once Chiara ships mocks, check for: mobile viewport legibility (not just desktop), Stripe Checkout integration points marked, order status dropdown UX clear.

## ROLE PLAN:
- engineering: **YES** — #343 is a hard blocker; unblock then ship F1, F2, F4 in parallel
- review: **YES** — code review needed same-day so fixes don't rot; enforce token security + Docker cleanliness
- design: **YES** — 4 pages (signup, shop creation, storefront, product form) need mockups today; engineer references them; tester writes tests against them
- requirements: **YES** — F3–F10 must be taskified with acceptance criteria before engineer runs out of work mid-week
- connectivity_qa: **YES** — route + auth verification needed as soon as F1/F2 land; don't wait for full test suite
- task_verifier: **YES** — proof that #343 fix actually runs and F1/F2 are live on staging before team moves on
- test: **YES** — Playwright harness + F1–F5 test coverage written in parallel with engineer; unblocks confidence to ship
- standards_qa: **YES** — still concerned about code hygiene (token storage, env patterns) given pre-revenue stage; catch it now
- design_qa: **YES** — mobile UX + Stripe integration points checked early; avoids rework later

## ONE-LINE SUMMARY:
**Today the team unblocks the app container, ships F1/F2/F4 in parallel (engineer), mocks signup/shop/storefront/product pages (designer), writes test coverage (tester), verifies routes and auth (connectivity QA), and decomposes F3–F10 into taskable work (PM).**
