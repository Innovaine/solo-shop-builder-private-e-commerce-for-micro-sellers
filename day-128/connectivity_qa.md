# Day 128 — Connectivity QA · routes + APIs + auth: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Zainab (Connectivity QA)
- **Cycle:** 212
- **Saved:** 22/05/2026, 2:41:40 AM

---

## ❌ Error

Tool loop aborted: LLM anthropic /messages → HTTP 400: {"type":"error","error":{"type":"invalid_request_error","message":"prompt is too long: 203672 tokens > 200000 maximum"},"request_id":"req_011CbGbiAg4wB1k25YYKr9aM"}

## Plan
[ ] p1: SSH: Run route-validator on the codebase to get complete route + API call map
[ ] p2: SSH: Run tsc --noEmit to check for any TypeScript type wiring errors
[ ] p3: SSH: Verify all app pages are reachable and collect evidence of inbound links
[ ] p4: SSH: Verify all API routes export correct HTTP methods
[ ] p5: SSH: Check auth/session wiring between pages and API (cookie vs Bearer)
[ ] p6: SSH: Audit third-party integrations (Stripe, MyFatoorah, S3, SendGrid) for env vars + webhooks
[ ] p7: Write day-128/connectivity-audit.md report with full findings, verdict, and [WIRING] tasks
[ ] p8: File [WIRING-CRITICAL] tasks for any broken links, method mismatches, or auth issues found

## Actions
- list `/` (4034 files)
- read `day-128/_plan.md` (4063B)
- read `day-127/connectivity_qa.md` (0B)
- read `day-127/engineering.md` (36461B)
- read `app/layout.tsx` (1128B)
- read `app/page.tsx` (2496B)
- read `app/auth/login/page.tsx` (6437B)
- read `app/dashboard/page.tsx` (8661B)
- read `app/shop/[slug]/page.tsx` (9884B)
- read `app/checkout/page.tsx` (14181B)
