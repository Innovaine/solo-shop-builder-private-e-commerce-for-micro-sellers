# Day 58 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Kenji (Product Manager)
- **Cycle:** 116
- **Day:** 58 (status: scaling)

---

## Goal today
Consolidate Stage 1 features and verify MVP + early Stage 1 work is production-grade. Day 57 shipped 4 features (order filtering, metrics, logo upload, smart sorting); Day 58 focuses on **verification**, **hardening**, and **next-tier Stage 1 features**. Priority: ensure the live app at www.soloshopbox.com is stable, all core features work end-to-end, and identify blockers before scaling.

---

## Features in scope

**FR-21: Password authentication (seller login option)** — Seller can sign up with email + password instead of magic link. Login with email + password. Existing magic-link flow remains as option. Backward compatible.

**FR-22: Password reset flow (forgot password)** — Seller forgets password, clicks "Forgot password" on login, enters email, receives reset link via email, clicks link, enters new password, logs in. One-time token validation (10 min expiry).

**FR-24 (revisit): Inventory atomic validation** — When customer checks out, system atomically decrements inventory. If out of stock during checkout, payment is rejected with friendly error. Prevents overselling even under concurrent checkout attempts.

**FR-27: Seller analytics dashboard (complete)** — Seller sees: total revenue (all-time), order count (all-time), top 5 products by revenue. Cards + simple bar chart. Calculated real-time from database.

**FR-29: Product CSV export** — Seller exports all their products as CSV (title, price, description, category, image_url). Used for backup or migration to other platforms.

---

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-21 | Password signup/login | Seller signup page has two options: (1) "Email magic link" (existing), (2) "Email + password" (new). Password field ≥12 chars on signup, hashed with bcrypt (12 rounds) on save. Login page has email + password fields. POST /api/auth/signup (password variant) and POST /api/auth/login handle password auth. Backward compat: magic link still works for existing sellers. | 1. Signup page shows both options. 2. Password field validated (min 12 chars, feedback on weak passwords). 3. Password hashed in database (never plaintext). 4. Login with email + password works. 5. Magic link still works for existing users. 6. Session cookie same format regardless of auth method. 7. No plaintext password in logs or errors. |
| FR-22 | Password reset | Login page shows "Forgot password?" link → forgot-password form (email only) → email sent with 10-min reset link → click link opens reset form (new password) → POST /api/auth/reset-password with token + new password → validate token (timestamp, not expired) → update password, clear old token → redirect to login with success message. | 1. Forgot password form accepts email. 2. Email sent within 5 min to that address. 3. Reset link valid for exactly 10 minutes. 4. Reset link single-use (token deleted after first use). 5. Expired/invalid token shows clear error. 6. New password hashed on save. 7. Old sessions NOT invalidated (allow login with new password). |
| FR-24 | Inventory atomic check | Checkout flow: (1) customer selects product variant, (2) system checks `product.stock >= quantity` before payment, (3) if insufficient, show error "Only N left in stock", cancel payment, (4) if sufficient, proceed to Stripe Checkout, (5) on webhook success, decrement stock atomically (UPDATE ... SET stock = stock - quantity WHERE id = X AND stock >= quantity). If decrement fails (concurrent order), payment is already done; seller manually refunds customer. | 1. Out-of-stock error shown before Stripe redirect. 2. Stock decrements exactly once per order (no duplicates on webhook retry). 3. Concurrent checkouts don't oversell (use SQL atomic update). 4. Seller sees current stock in product edit form. 5. Stock updates instantly in dashboard (reload shows new count). 6. Oversold detection: if stock goes negative, alert seller. |
| FR-27 | Analytics dashboard | /dashboard/analytics page shows: (1) "Total Revenue (All-time)" card with $X,XXX.XX format, (2) "Total Orders" card, (3) "Top 5 Products by Revenue" with product name + revenue (bar chart or table). Data calculated from all paid/shipped orders. Filters on load: >= created date (all-time). Refresh every page load (no real-time updates, OK). | 1. Cards render with correct numbers. 2. Revenue sums only "Paid" orders, excludes "Refunded". 3. Top 5 list is accurate (by total revenue per product, not quantity). 4. Mobile: stacks vertically on <640px. 5. No division by zero errors (empty shop shows 0s). 6. Page load <2s (optimize queries with indexes). |
| FR-29 | Product CSV export | Seller clicks "Export as CSV" on products page, downloads file `products-{timestamp}.csv` with columns: title, price, description, category, imageUrl. One row per product. Seller can re-import this CSV with FR-28 on another shop or platform. CSV is UTF-8 encoded. | 1. Export button on products page. 2. CSV file generated correctly (no broken fields, no Unicode errors). 3. Downloadable (no UI errors, correct MIME type). 4. All products included in export. 5. Column order matches spec (title, price, description, category, imageUrl). 6. Empty shop exports header row only (no data rows). |

---

## Stack chosen (lock in day 1)
- **Backend:** Node.js + Express/Fastify in TypeScript (Next.js API routes)
- **Web frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database:** Postgres with Prisma ORM
- **Payment:** Stripe Checkout + Webhooks
- **Email:** Resend or in-process transactional emails
- **Hosting:** Vercel (frontend) + containerized backend on VPS (www.soloshopbox.com)
- **File storage:** Local filesystem `/public/uploads/shops/{shopId}/`
- **Why:** 58 days in this stack. Proven. No switching.

---

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Security | Password hashed with bcrypt (min 12 rounds). Reset tokens single-use + 10-min expiry. |
| NFR-2 | Security | Inventory decrement uses atomic SQL (UPDATE ... WHERE ... AND ...). Prevents race condition oversells. |
| NFR-3 | Performance | Inventory check on checkout <200ms (no N+1 queries). |
| NFR-4 | Performance | Analytics queries <1s even with 10K+ orders (add DB indexes on created_at, status). |
| NFR-5 | Performance | CSV export completes in <5s for 1000 products (stream to file, not load all in memory). |
| NFR-6 | Email | Reset link email delivered within 5 min. |
| NFR-7 | Mobile | Password signup/login, reset flow responsive on 320px+ width. Touch targets ≥44px. |
| NFR-8 | Accessibility | Password fields have associated labels. "Show password" toggle has aria-label. |
| NFR-9 | Error handling | Reset token expiry shows friendly message (not raw error). Out-of-stock shows clear UX (not confusing). |
| NFR-10 | Testing | All 5 features have Playwright tests (password signup/login, reset flow, inventory check, analytics load, CSV export). |

---

## Out of scope (do NOT build today)
- 2FA/TOTP for password auth (FR-23 — Stage 1 later)
- Social login (Google, GitHub) — password + magic link only
- Webhook signature verification (FR-24 in spec) — assume trusted for now, harden in Stage 1 later
- Rate limiting on password login — implement generic rate-limit middleware separately
- Password complexity rules (uppercase, numbers, symbols) — just require ≥12 chars for MVP
- Password expiry / forced resets — no expiry, seller controls when to change
- Inventory overstock alerts — out-of-stock only for now
- Advanced analytics (charts, filters, date ranges) — simple cards + top 5 products only
- CSV import validation (duplicate SKU detection) — import as-is, seller responsible for cleanup
- CSV export scheduled/automated — manual download only

---

## Open questions (owner, please answer before Wednesday)
1. **Password reset email domain:** Should reset link come from (a) marketing@soloshopbox.com, (b) noreply@soloshopbox.com, or (c) support@soloshopbox.com?
2. **Analytics date filter:** For Day 58, should analytics show all-time, or last 90 days? (All-time simpler for MVP, filters can come later.)
3. **CSV column order:** Is the proposed order (title, price, description, category, imageUrl) correct, or should it match a specific standard (Shopify, WooCommerce, Etsy)?

---

## Definition of done for day 58

Reviewer + tester checklist:

**FR-21: Password authentication**
- [ ] Signup page shows both "Magic link" and "Email + password" options
- [ ] Password field validates ≥12 chars with feedback
- [ ] Password hashed in database (bcrypt 12+ rounds)
- [ ] Login with email + password works
- [ ] Magic link still works for existing users
- [ ] Session cookie same regardless of auth method

**FR-22: Password reset**
- [ ] Forgot password form on login page
- [ ] Reset link email sent within 5 minutes
- [ ] Reset link valid for exactly 10 minutes
- [ ] Reset link single-use (token cleared after use)
- [ ] Expired token shows clear error
- [ ] New password hashed on save

**FR-24: Inventory atomic validation**
- [ ] Out-of-stock error shown before Stripe redirect
- [ ] Stock decrements exactly once per order (idempotent)
- [ ] Concurrent checkouts don't oversell
- [ ] Stock count visible in product edit form
- [ ] Stock updates instantly after order

**FR-27: Analytics dashboard**
- [ ] Analytics page loads at /dashboard/analytics
- [ ] Total Revenue card shows all-time sum of paid orders
- [ ] Total Orders card shows order count
- [ ] Top 5 Products list shows by revenue (not quantity)
- [ ] Numbers are correct (spot check with database)
- [ ] Mobile responsive (<640px)
- [ ] Page loads in <2s

**FR-29: Product CSV export**
- [ ] Export button visible on products page
- [ ] CSV file downloads with correct name (products-{timestamp}.csv)
- [ ] CSV columns are: title, price, description, category, imageUrl
- [ ] All products included
- [ ] CSV is valid (opens in Excel/Google Sheets without errors)
- [ ] Empty shop exports header row only

**Overall**
- [ ] All 5 features have Playwright tests (happy path + edge cases)
- [ ] No TypeScript build errors
- [ ] No console errors in browser
- [ ] App builds and deploys to www.soloshopbox.com
- [ ] Health check passes
- [ ] Full smoke test passes: signup (password option), login, add product, checkout, analytics page, export CSV

---

## Rollback plan
If any feature cannot ship cleanly by end of day:
- FR-21/22 (password auth) can be deferred to Day 59 — magic link still works
- FR-24 (inventory check) is critical for correctness — if not shipping, revert to "disable checkout if out of stock" (simpler)
- FR-27 (analytics) can be deferred to Day 59 — dashboard still works without it
- FR-29 (CSV export) can be deferred to Day 59 — seller can use database tool for backup

Priority ship order: FR-24 > FR-21/22 > FR-27 > FR-29

---

## Metrics for success
- 5 features shipped, tested, live at www.soloshopbox.com
- 0 build errors
- All integration tests passing
- Full smoke test: password signup → login → add product → inventory check → checkout → analytics → CSV export
- MVP + Stage 1 features working smoothly under load
- App ready for beta user testing
