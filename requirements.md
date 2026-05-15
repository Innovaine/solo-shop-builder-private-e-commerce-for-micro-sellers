# Day 1 — Requirements: Solo Shop Builder

## Goal today
A seller can sign up with email, create a shop with a name, and see an empty branded storefront at a public URL.

## Features in scope
- **F1: Seller email signup (magic link)** — Seller receives passwordless login link via email
- **F2: Shop creation form** — Seller enters shop name, gets unique /shop/[slug] URL
- **F3: Public shop storefront (empty state)** — Customer visits /shop/[slug], sees "This shop is empty" + shop name
- **F4: Shop persistence** — Shop data saved to Postgres database, survives server restart

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-1 | F1: Seller signup | POST /api/auth/signup with email. Generate 6-digit magic link token (valid 15 min). Send email with link https://app.example.com/auth/verify?token=XXX. Link logs seller in without password. | 1. Email delivered within 5 seconds. 2. Link valid exactly 15 minutes from send. 3. Clicking link sets session cookie, redirects to /dashboard. 4. Session persists on page reload. |
| FR-2 | F1: Seller login via magic link | GET /auth/verify?token=XXX validates token from email, creates session. | 1. Valid token → session created, cookie set, redirect to /dashboard. 2. Expired/invalid token → 403 with "Link expired, request new one". 3. Browser back button after login redirects to /dashboard (not back to login). |
| FR-3 | F2: Shop creation | POST /api/shops with { name, slug }. Seller must be logged in (session cookie required). Slug must be unique, lowercase, 3-20 chars, alphanumeric + hyphens. If slug taken or invalid, return 400 with error message. | 1. Valid request creates shop record in database. 2. Seller's session linked to shop. 3. Returns 200 with shop object { id, name, slug, createdAt }. 4. Duplicate slug returns 400 "Slug already taken". 5. Invalid slug (spaces, caps, <3 chars) returns 400 with reason. |
| FR-4 | F2: Shop creation UI form | Simple form page at /dashboard/create-shop. Fields: shop name (text input), slug (autofill from name, allow edit). Submit button, error display. | 1. Page loads without JavaScript errors. 2. Name → slug auto-populates (convert to lowercase, replace spaces with hyphens). 3. Seller can override slug. 4. Submit sends POST /api/shops, shows loading state. 5. On success, redirects to /dashboard/[shop-slug]. 6. On error, displays error message inline (e.g., "Slug taken"). |
| FR-5 | F3: Public shop storefront | GET /shop/[slug] serves a public HTML page with shop name, "This shop is empty" message, shop created date. No auth required. | 1. /shop/validslug returns 200 with shop name visible. 2. /shop/invalidslug returns 404 "Shop not found". 3. Page renders in <2 seconds (p95). 4. Page is mobile-responsive (320px width minimum). |
| FR-6 | F2: Shop persistence | Shop data in Postgres table: id (UUID), name (string), slug (string, unique index), seller_id (FK to sellers), createdAt (timestamp). | 1. Shop persists after server restart. 2. Seller can log back in and see their shop. 3. No shop data loss on deployment. |
| FR-7 | F1: Session management | Seller session stored in secure HTTP-only cookie. Cookie valid for 30 days. Logout clears cookie. | 1. Cookie set with HttpOnly + Secure flags. 2. SameSite=Strict. 3. Session persists across page reloads until 30 days expire or logout. 4. Logout endpoint clears cookie, next page load shows login page. |

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | p95 page load (storefront + dashboard form) < 2 seconds on 4G mobile |
| NFR-2 | Performance | API response time (auth, shop creation, shop fetch) < 500ms p95 |
| NFR-3 | Security | Email magic link token is cryptographically random, 6 digits, valid 15 min only |
| NFR-4 | Security | Session cookie: HttpOnly, Secure (HTTPS only), SameSite=Strict |
| NFR-5 | Security | Seller can only view/modify shops they own (row-level auth check on FR-3, FR-4) |
| NFR-6 | Security | No SQL injection (use Prisma parameterized queries) |
| NFR-7 | Security | No XSS on /shop/[slug] (sanitize shop name if user-input in future, not yet) |
| NFR-8 | Browser support | Chrome, Safari, Firefox (latest 2 versions) |
| NFR-9 | Accessibility | Form labels associated with inputs (label htmlFor), error messages linked to inputs (aria-describedby) |
| NFR-10 | Observability | Log every auth attempt (email, timestamp, success/failure) to stderr with request ID |
| NFR-11 | Observability | Every API error response includes X-Request-Id header for debugging |
| NFR-12 | Mobile | Seller dashboard form + storefront render correctly on iOS Safari, Chrome mobile (320px+ width) |

## Stack chosen (lock this in day 1)
- **Backend:** Node.js + Express/Fastify in TypeScript, deployed to a serverless function or EC2 via Vercel
- **Web frontend (if applicable):** Next.js (App Router, TypeScript, Tailwind CSS)
- **Database:** Postgres (via Vercel Postgres or self-hosted in docker-compose). Use Prisma ORM for migrations + type safety.
- **Authentication:** Email magic link (no external auth provider yet; Resend or SendGrid for email)
- **Hosting:** Vercel (frontend + serverless functions for backend)
- **Why this stack:** Team has 15+ cycles shipping with Next.js + Postgres + Prisma. Zero learning curve. Deploy to Vercel = ship to production in <5 minutes. Email magic link avoids password complexity + credential storage for v1.

## Out of scope (do NOT build today)
- Product upload UI or CSV import — products will be manually seeded in database for testing
- Product image handling — no images yet
- Shopping cart — no cart page or button
- Stripe integration — no payment processing
- Order management — no orders yet
- Seller messaging — not in MVP scope
- Category management UI — not building today
- Seller analytics dashboard — not building today
- Custom domain / subdomain support — fixed /shop/[slug] URL structure
- SEO optimization (meta tags, robots.txt, etc.) — default meta tags only
- Email transactional templates (SendGrid, Resend) — plain text for now, HTML later
- Rate limiting on auth endpoints — no protection against brute force (add week 2)
- 2FA or password-based auth — magic link only
- Seller team/collaborators — one seller per shop today

## Open questions (owner, please answer before EOD)
1. **Email service:** Are we using Resend, SendGrid, or AWS SES for transactional email? (Needed for FR-1 implementation.)
2. **Database:** Will we use Vercel Postgres (managed, $15/mo) or self-hosted Postgres in docker-compose for dev/staging? (Impacts deployment strategy.)
3. **Shop URL structure:** Confirmed /shop/[slug] (not subdomains like shop-name.example.com)? (Subdomain DNS/routing is complex; /shop/slug is simpler for week 1.)
4. **Magic link expiration:** Confirmed 15 minutes? Or different window? (Needs to be short enough for security, long enough users don't miss email.)
5. **Pre-committed sellers:** Have you confirmed the 3–5 sellers will actually create accounts + test this week? (No signal yet if this is real demand. Researcher flagged this risk.)

## Definition of done for day 1
A bulleted list the reviewer + tester use as their checklist:
- [ ] Seller can navigate to app homepage, sees a "Sign up" button
- [ ] Seller enters email, receives email with magic link within 5 seconds
- [ ] Clicking magic link logs seller in, redirects to /dashboard
- [ ] Seller sees shop creation form with name + slug inputs
- [ ] Seller creates shop, receives success message, sees shop detail page
- [ ] Seller can visit /shop/[their-slug] in incognito window (not logged in), sees shop name + empty state message
- [ ] Session cookie survives page reload (seller stays logged in without re-clicking email link)
- [ ] All above works on mobile (iOS Safari, Chrome mobile, 320px width)
- [ ] No console errors or server 500s during happy path
- [ ] Playwright test: signup → create shop → view public storefront (all 3 features in one test)
