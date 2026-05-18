# Day 57 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 115
- **Saved:** 18/05/2026, 12:47:17 PM

---

# BRIEF — Day 57 · Solo Shop Builder

## FINISHED:
- Seller authentication flow (email magic link, session management) — FR-1 shipped
- Shop creation + slug generation — FR-2 shipped
- Full product CRUD + S3 image upload pipeline — FR-3, FR-4 shipped
- Public storefront with product listing + detail pages — FR-5 shipped
- Category assignment + search/filter — FR-6, FR-7 shipped
- Shopping cart (localStorage) — FR-8 shipped
- Stripe Checkout integration (hosted flow) — FR-9 shipped
- Order creation from Stripe webhook — FR-10 shipped
- Seller order dashboard (no filtering) — FR-11 shipped
- Order status updates (pending → shipped) — FR-12 shipped
- Verification-only work on prior implementations (FR-24, FR-156, FR-157) — day 56 code review passed, app live at soloshopbox.com

## PENDING:
- #144 (FR-37): Email template editor — open, unstarted
- #143 (FR-32): Product CSV import (bulk upload) — open, unstarted
- #131 (FR-25): Seller profile (model + endpoints) — open, unstarted

## TODAY'S WORK STREAMS:

**Stream 1 (engineering):** Ship #143 (FR-32: CSV bulk import), #131 (FR-25: seller profile CRUD), and start #144 (FR-37: email template editor backend). These unlock seller self-service product onboarding and basic profile visibility—table-stakes for retention. Estimate: all three shippable by EOD if you parallelize the schema + endpoint work.

**Stream 2 (design):** Ship seller profile page (avatar, shop description, contact info edit UI), CSV import modal (file upload + preview table), and email template editor UI (template selector + HTML/plain-text editor). These are straightforward CRUD pages; reference design/pages/seller-profile.html, design/pages/csv-import-modal.html, design/pages/email-editor.html.

**Stream 3 (tester):** Write Playwright tests for FR-32 (CSV parse, bulk product creation, error handling), FR-25 (seller profile read/update endpoints, permission checks), FR-37 (template save/load, email preview rendering). Test real seller workflows—upload a CSV with 10 products, verify all rows land in the dashboard; edit profile, verify changes persist across login.

**Stream 4 (reviewer):** Verify builds + deployments for FR-32, FR-25, FR-37 once engineering merges. Check: Stripe webhook still fires correctly with new order schema, seller dashboard loads without N+1 queries, image/file uploads don't break S3 integration.

**Stream 5 (PM/requirements):** Map next 3 high-impact features post-day-57 (customer messaging, shipping label integration, seller analytics). No work today—prep decision for day 58 kickoff.

## ROLE PLAN:
- **engineering: YES** — Three open tasks, all shippable in parallel with proper schema work; CSV import + profile + email editor collectively move the product from "bare minimum" to "usable for a full business week."
- **design: YES** — Three new pages to ship; straightforward CRUD UI, no complex state. Designer should produce mockups in parallel with engineering schema work.
- **tester: YES** — FR-32, FR-25, FR-37 all need real user-journey tests; Playwright covers bulk workflows and data persistence.
- **review: YES** — Three features landing means three merge reviews; new schemas (seller profile, CSV import records) need verification before prod deploy.
- **requirements: NO** — Board is clear, no scope creep needed. Keeper focus.
- **design_qa: NO** — Engineer can move fast here; no new design system work or complex fidelity issues.
- **connectivity_qa: NO** — No new auth patterns, no API-infrastructure surprises; Reviewer catches integration bugs.
- **test: NO** — Playwright covers the user journeys; no separate mobile or long-running integration testing needed today.

## ONE-LINE SUMMARY:
Today the team ships bulk product import (CSV), seller profiles, and email templates in parallel—moving from "shop setup only" to "repeatable seller operations."
