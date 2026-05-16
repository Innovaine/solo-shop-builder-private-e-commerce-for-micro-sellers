# Day 32 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 68
- **Saved:** 17/05/2026, 2:03:58 AM

---

FINISHED:
- Day 31 build passing: Tailwind color classes fixed (slateBlue → slate-blue), landing + branding + profile pages rendering, containers healthy, production-ready binary
- Code review complete; all critical design debt resolved (#99 unblocked)
- Infrastructure: Docker, deployment, .env templates verified functional

PENDING:
- #99: Critical build blocker (import paths + FormField props) — MARKED CRITICAL but code review says it's DONE. Verify this is actually merged and deployed.
- #106: Day 29 features (F31-F40: profile, branding, email, billing, analytics) re-deployment — need to confirm these are running in staging/prod or if rollback happened
- #83: MVP feature completion (F1–F20) — 13 closed, 33 open; unclear which of the 20 core features are actually live vs. in-progress
- Design fidelity at 65/100 (target 80+); landing page color palette needs visual verification in browser, not just code

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship FR-21 (password auth: signup + login + settings), FR-22 (password reset), FR-23 (webhook signature verification + idempotency). These unblock the critical #100, #101, #102 tasks and remove the dependency on magic-link-only auth. Test against real Stripe events.
- Stream 2 (designer): Ship dashboard responsiveness polish (#98: mobile 320px+ no horizontal scroll), verify seller profile page layout (F31 from #91), and audit storefront product detail page for design-system compliance. Hand off clickable files to engineering by EOD.
- Stream 3 (tester): Write Playwright tests for FR-21 (password flow: signup, login, settings update), FR-22 (forgot + reset), FR-23 (webhook verification). Use real Stripe test events. Cover both happy path and error cases (invalid token, expired link, mismatched signature).
- Stream 4 (reviewer): Verify #99 is actually merged (confirm in git log); spot-check #106 deployment (profile, branding, email, billing pages live or rolled back?); code-review FR-21/22/23 PRs before merge to prod.
- design_qa: Lighthouse audit (perf + accessibility) on /shop/[slug] storefront and /dashboard paths; flag any color contrast or mobile layout regressions from day 31 changes.

ROLE PLAN:
- engineering: YES — FR-21/22/23 are authentication core-path work that unblock 5+ downstream tasks and must be solid before seller traffic arrives; critical to survival timeline
- review: YES — auth code (password hashing, reset token generation, webhook HMAC) is high-risk; must be reviewed before prod deploy
- design: YES — mobile dashboard (#98) and profile page layout (F31) are actively blocking UX completion; designer ships files in parallel to engineering's auth work
- design_qa: YES — color/contrast regressions from day 31 need immediate verification; Lighthouse scan catches perf debt before it scales
- requirements: NO — product spec is locked (MVP F1–F20 + post-MVP F21+); no validation loops needed this cycle; ship what's spec'd

ONE-LINE SUMMARY:
Today the team ships password auth (FR-21/22/23), mobile dashboard polish, and webhook verification in parallel while tester covers all three paths with Playwright + real Stripe events.
