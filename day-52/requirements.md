# Day 52 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

## Goal today
Protect seller operations from overselling and provide password-based login with secure reset flow for faster seller access.

## Features in scope
- **FR-24: Inventory tracking** — Seller enters stock count per product at creation/edit. Storefront shows "In stock" / "Out of stock" label. Add to cart disabled if out of stock. Checkout rejects order if stock == 0 (atomic check). Decrement stock after successful payment.
- **FR-22: Password reset flow** — Seller can request password reset via email link (similar to magic link). Reset link valid for 30 minutes, one-time use. Seller clicks link, sets new password, can log in immediately.

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-24 | Inventory tracking | Product model has `quantity_available` field (integer ≥ 0). Seller can set stock at product creation + edit it on product detail page (/dashboard/products/[id]/edit). Storefront /shop/[slug] shows product labels: "In Stock" (green badge) or "Out of Stock" (gray badge, disabled button). Add to Cart button disabled if quantity_available == 0 or NULL. POST /api/checkout validates stock atomically: fetch product, check quantity_available > 0, decrement by order total quantity in same transaction. Reject with 400 "Product out of stock" if check fails. On successful payment webhook, stock decrement is idempotent (exactly once). | 1. Product creation form includes "Stock count" input (number, defaults to 0 or NULL). 2. Edit product page loads current stock, allows seller to update. 3. Stock field persists to database (Product.quantity_available). 4. Storefront badge shows "In Stock" or "Out of Stock" based on quantity_available > 0. 5. Add to Cart button is enabled only if quantity_available > 0. 6. Cart + checkout show stock availability (e.g., "Only 2 left!"). 7. POST /api/checkout checks stock atomically: query product with lock, verify quantity_available >= order_quantity, decrement in same transaction. 8. Concurrent checkouts: if 2 orders try to buy the last item simultaneously, only 1 succeeds (no overselling). 9. Failed stock check returns 400 JSON: {error: "Product X out of stock"}. 10. Successful payment webhook decrements stock exactly once (idempotent via Stripe payment_intent.id). 11. If stock reaches 0, future checkout attempts fail with 400. 12. Seller can edit stock to negative (manual adjustment for damaged goods, returns); system treats negative as "out of stock" on storefront. 13. Analytics dashboard reflects current inventory status (optional: show low-stock alerts if qty < 5). |
| FR-22 | Password reset flow | Seller forgets password, clicks "Forgot password?" on /auth/login, enters email. POST /api/auth/forgot-password sends reset link (token valid 30 min, one-time use) to seller's registered email. Seller clicks link (GET /auth/reset-password?token=XXX), sees form to enter new password. POST /api/auth/reset-password validates token, hashes password, clears passwordResetToken. Redirect to /auth/login with "Password reset successful" message. Token consumed after first use (or 30 min expiry, whichever comes first). | 1. Login page has "Forgot password?" link, visible + clickable. 2. /auth/forgot-password page has email input + submit button. 3. Submitting valid email sends email with reset link within 5 seconds. 4. Reset link format: https://app.example.com/auth/reset-password?token=XXX (30-char random token). 5. Link valid exactly 30 minutes from send. 6. Clicking link opens /auth/reset-password?token=XXX (requires valid token, returns 400 if expired/invalid). 7. Reset form has password input (min 8 chars, suggest password strength indicator). 8. Submitting password hashes it (bcrypt, 12+ rounds), stores in Seller.passwordHash, clears Seller.passwordResetToken + Seller.passwordResetExpires. 9. Returns 200 with redirect to /auth/login + flash message "Password reset successful, please log in". 10. Old reset tokens invalidated when new reset request sent (only 1 active token per seller at a time). 11. Clicking reset link twice (double-click or multiple requests) uses token once, 2nd attempt returns 400 "Token already used". 12. Resetting password does NOT log seller out if they're currently logged in (opt: can clear session for security). 13. Reset flow works on mobile (form readable, keyboard doesn't hide submit button). |

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Checkout validation (stock check + decrement) completes in <100ms (p95), even with 10K+ products. Database query must be indexed on shop_id + product_id. |
| NFR-2 | Performance | Password reset email sent within 5 seconds, link valid instantly after send. |
| NFR-3 | Performance | /auth/reset-password?token=XXX validates token in <500ms p95. |
| NFR-4 | Security | Inventory decrement is atomic: database lock (SELECT ... FOR UPDATE) prevents race conditions. No overselling with concurrent checkouts. |
| NFR-5 | Security | Stock check in checkout API prevents negative values. Decrement only if quantity_available > 0. |
| NFR-6 | Security | Password reset token is cryptographically random, 30+ chars, one-time use (consumed on successful reset). |
| NFR-7 | Security | Password reset tokens expire after 30 minutes (cron job or lazy delete on validation). |
| NFR-8 | Security | Reset link token stored as hash in database (not plaintext) to prevent disclosure if DB is compromised. |
| NFR-9 | Security | Old reset tokens invalidated when new reset request issued (Seller.passwordResetToken uniquely constrained). |
| NFR-10 | Security | Password must be hashed with bcrypt (min 12 rounds) before storage. |
| NFR-11 | Data | Inventory changes logged: each decrement tied to order_id for audit trail (optional: OrderInventoryLog table). |
| NFR-12 | Observability | Log each stock check + decrement attempt: product_id, seller_id, quantity_before, quantity_after, result (success/fail). |
| NFR-13 | Observability | Log each password reset request: seller_id, email, token sent (not token value), timestamp. |
| NFR-14 | Accessibility | Forgot password form: email input has label, password reset form: password input has label + aria-required. Submit buttons visible + keyboard-accessible. |
| NFR-15 | Mobile | Stock badge + "Add to Cart" button responsive on 320px width. Checkout remains functional on mobile (no UX regression). Password reset form works on mobile (password input, submit button, confirm visible). |

## Stack chosen
- **Backend:** Node.js + Express/Fastify in TypeScript (existing, no change)
- **Web frontend:** Next.js App Router, TypeScript, Tailwind CSS (existing)
- **Database:** Postgres + Prisma ORM (existing)
- **Password hashing:** bcrypt (npm package, already in use)
- **Database transactions:** Prisma $transaction() with SELECT...FOR UPDATE for atomic stock decrement
- **Why this stack:** Team already shipping React/Next.js + Postgres. Bcrypt is battle-tested. Prisma transactions handle atomic stock operations cleanly. SELECT...FOR UPDATE prevents race conditions without application-level locks.

## Out of scope (do NOT build today)
- **Inventory alerts:** Seller notifications when stock < 5 units (Stage 2 feature, F43)
- **Bulk inventory edit:** CSV import inventory column (Stage 1, but requires FR-28 to be completed first)
- **Per-variant inventory:** Product variants (FR-37) have their own stock (separate feature, addressed later)
- **Reorder points:** Automatic purchase suggestions (Stage 2)
- **Password strength meter:** Basic validation only (can add UI polish later)
- **2FA on password reset:** No additional authentication layer for reset (basic flow for MVP)
- **Email reset link click tracking:** No analytics on reset attempts (audit trail only)
- **Backup codes for account recovery:** No fallback if seller loses email access (out of scope for now)

## Open questions (owner, please answer before Wednesday)
1. **Stock field default:** Should new products default to quantity_available = 0 (out of stock) or NULL (unset by seller)? Recommend 0 to force seller attention.
2. **Overselling grace period:** If stock reaches 0 during checkout, reject immediately or allow final order to complete? Recommend reject immediately (no grace).
3. **Reset email branding:** Should password reset email match existing order confirmation email template (using {{shopName}}) or be plain text? Recommend plain text for simplicity (template is for customer emails only).
4. **Password validation:** Require numbers + special chars, or just min 8 chars? Recommend min 8 chars (OWASP guidance: length > complexity for security + UX).

## Definition of done for day 52
- [ ] FR-24: Product model has quantity_available field (integer, defaults to 0)
- [ ] FR-24: Product creation + edit forms include "Stock count" input
- [ ] FR-24: Stock persists to database, survives page reload
- [ ] FR-24: Storefront shows "In Stock" / "Out of Stock" badge based on quantity_available
- [ ] FR-24: Add to Cart button disabled (visually + functionally) if quantity_available == 0
- [ ] FR-24: Checkout API (POST /api/checkout) validates stock atomically with database lock (SELECT...FOR UPDATE)
- [ ] FR-24: Checkout rejects order with 400 if stock insufficient; returns JSON error message
- [ ] FR-24: Successful payment decrements stock exactly once (no double-decrement on webhook retry)
- [ ] FR-24: Concurrent checkout attempts: if stock = 1 and 2 orders submitted simultaneously, only 1 succeeds (race condition prevented)
- [ ] FR-22: Login page has "Forgot password?" link
- [ ] FR-22: /auth/forgot-password page loads with email input + submit button
- [ ] FR-22: POST /api/auth/forgot-password sends reset email within 5 seconds
- [ ] FR-22: Reset link in email is valid and clickable (token included)
- [ ] FR-22: Clicking reset link opens /auth/reset-password?token=XXX (validates token, returns 400 if expired)
- [ ] FR-22: Reset form allows seller to enter new password (min 8 chars)
- [ ] FR-22: Submitting password hashes it (bcrypt), updates database, clears reset token
- [ ] FR-22: Seller can log in immediately after reset with new password
- [ ] FR-22: Reset token expires after 30 minutes (link becomes invalid)
- [ ] FR-22: Reset token is one-time use (clicking link twice fails on 2nd attempt)
- [ ] FR-22: Old reset tokens invalidated when new reset requested (Seller.passwordResetToken unique)
- [ ] FR-24 + FR-22: Both features mobile-responsive (320px+ width)
- [ ] FR-24 + FR-22: Each feature has ≥1 Playwright test covering happy path + error state (out of stock, expired reset link)
- [ ] FR-24 + FR-22: Verified via code review (Søren checks atomic stock decrement, token validation, XSS prevention, password hashing)
- [ ] No overselling in concurrent scenario: verified via integration test with 2+ simultaneous checkout requests
