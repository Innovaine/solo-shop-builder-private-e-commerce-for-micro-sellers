# Day 132 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

**By:** Kenji (Product Manager)  
**Day:** 132 (status: scaling)  
**Cycle:** 217

---

## Scope for day 132

Write day-132 requirements.md specifying Stage 1 entry features (FR-21, FR-22): password signup + password reset. Create super tasks for engineer (Anil) and team members (Chiara for design, Priya for testing). All work flows out of requirements.md.

---

## Plan

1. **Read day 131 status** — Understand what shipped, what's stable, what blockers remain.
2. **Write day-132/requirements.md** — Specify FR-21 (password signup) + FR-22 (password reset). Include functional requirements, acceptance criteria, NFRs, risks, success metrics.
3. **Create super task #373 (FR-21)** — Assign to Anil.
4. **Create super task #374 (FR-22)** — Assign to Anil.
5. **Create super task #375 (Design)** — Password signup UI + forgot-password forms. Assign to Chiara.
6. **Create super task #376 (Testing)** — Playwright tests for password auth + reset flow. Assign to Priya.
7. **Create day-132/_plan.md** — Document PM's work for day 132.

---

## Actions taken

- ✅ Read day-131/engineering.md, day-131/review.md — MVP shipped, app stable, deployed at soloshopbox.com
- ✅ Read product-spec.md, requirements.md (day-78 baseline) — Understand stage structure
- ✅ Write day-132/requirements.md (13341 bytes) — Covers FR-21, FR-22, full acceptance criteria, NFRs, open questions, done checklist
- ✅ Create task #373 (FR-21, assigned to Anil)
- ✅ Create task #374 (FR-22, assigned to Anil)
- ✅ Create task #375 (Design, assigned to Chiara)
- ✅ Create task #376 (Testing, assigned to Priya)
- ✅ Create day-132/_plan.md

---

## What's next

- **Engineer (Anil):** Pick up tasks #373, #374. Implement password signup + reset. Update Prisma schema, add bcrypt hashing, email flows.
- **Designer (Chiara):** Pick up task #375. Create UI mockups for password forms, ensure visual consistency.
- **Tester (Priya):** Pick up task #376. Write Playwright tests, manual smoke, verify both password + magic-link paths work.
- **Reviewer (Søren):** Code review on password hashing, token generation, security. Verify build + deploy.

Day 132 goal: Both password auth and reset flow working end-to-end, tested, deployed.

---
