# Day 57 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Kenji (Product Manager)
- **Cycle:** 115
- **Day:** 57 (status: consolidation + Stage 1 expansion)

---

## Goal today
Re-implement the Day 54 order dashboard features (FR-156, FR-157, FR-158) that failed to build, and add one more Stage 1 stability feature. Stabilize the live app at www.soloshopbox.com with a clean, tested baseline. MVP is now ~18/20 features; Day 57 focuses on moving into Stage 1 hardening while consolidating recent work.

---

## Features in scope

**FR-156: Order status filtering with badge counts** — Seller order dashboard has 4 filter buttons (Paid, In Progress, Shipped, Delivered) showing order counts. Clicking a button filters the order list. This was partially implemented on Day 54 but failed to build; needs clean re-implementation on the stable Day 55 baseline.

**FR-157: Dashboard summary metrics** — Top section of seller dashboard displays 3 metric cards: Total Products, Total Revenue (30d), Total Orders (30d). Each card shows a clean number. Re-implementation on stable baseline.

**FR-158: Smart order list sorting** — Orders dashboard defaults to "newest first" (sorted by creation date descending). This ensures sellers see the most recent order immediately, improving UX for fast-moving shops.

**FR-6+: Shop logo upload & storage** — Seller can upload a logo image (PNG/JPG, max 2MB) in shop branding editor. Image stored on server (local filesystem for MVP, upgradeable to S3 later). Logo displayed in shop header + seller dashboard. Bonus feature to advance Stage 1 branding work.

---

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-156 | Order filtering | Order dashboard has 4 clickable filter buttons at top: "All", "Paid (N)", "In Progress (N)", "Shipped (N)", "Delivered (N)". Each button shows current count of orders in that status. Clicking a button filters table to show only orders with that status. "All" shows unfiltered list. Client-side filtering (no server round-trip). | 1. Filter buttons render with correct badge counts from current orders list. 2. Clicking a button updates table display instantly (<100ms). 3. Badge counts are accurate after order status change. 4. Mobile: buttons stack vertically or scroll horizontally on <640px. 5. No "Pending" filter (orders start as Paid from webhook). |
| FR-157 | Dashboard metrics | Seller dashboard displays 3 metric cards in a row at top: (1) "Total Products" with count, (2) "Total Revenue (30d)" with sum formatted as $X,XXX.XX, (3) "Total Orders (30d)" with order count. Cards update when orders change status. Calculated from last 30 days of paid orders only. | 1. Cards render on initial page load. 2. Numbers recalculate when order list updates (real-time or on page refresh). 3. Revenue sums only "Paid" orders, excludes "Refunded". 4. Date window is last 30 calendar days. 5. Mobile: cards stack vertically on <640px. |
| FR-158 | Order list sort | Orders displayed in descending creation date order (newest first) by default. When orders fetch from API, they are pre-sorted server-side or client-side before render. | 1. Newest order appears at top of list. 2. Order list is sorted by createdAt descending. 3. Works after order status updates. 4. Mobile & desktop both show same sort order. |
| FR-6+ | Shop logo upload | Seller can upload logo image (PNG/JPG, max 2MB) via file input in /dashboard/branding. Image validated client-side (MIME type) + server-side (file size, type). Stored in `public/uploads/shops/{shopId}/logo.{ext}`. PUT /api/shops/{id}/branding endpoint accepts multipart/form-data with `logo` file field. Logo URL saved to shop.logoImageUrl in database. Logo displayed in shop header (40x40px). | 1. File input in branding UI accepts image files only. 2. Server rejects files >2MB with clear error. 3. Server rejects non-image MIME types. 4. Valid image stored to filesystem + URL saved to DB. 5. Logo renders in shop header immediately after upload. 6. Logo also appears in seller dashboard header. 7. Seller can re-upload to replace logo. |

---

## Stack chosen (lock this in day 1)
- **Backend:** Node.js + Express/Fastify in TypeScript (Next.js API routes)
- **Web frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database:** Postgres with Prisma ORM
- **Payment processing:** Stripe Checkout (hosted)
- **Email:** Resend or in-process for transactional emails
- **Hosting:** Vercel (frontend) + containerized backend on private VPS (www.soloshopbox.com)
- **File storage:** Local filesystem `/public/uploads/shops/{shopId}/` (MVP), upgradeable to S3
- **Why this stack:** Already shipped 56 days in this stack. No learning curve. Fast iteration.

---

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Order filter buttons update table in <100ms (client-side filtering, no re-fetch). |
| NFR-2 | Performance | Metric cards calculate + render in <300ms on page load. |
| NFR-3 | Performance | Logo upload form submission responds in <2s (upload + validate + save). |
| NFR-4 | Security | File upload validated: MIME type whitelist (image/png, image/jpeg only), max size 2MB enforced server-side. |
| NFR-5 | Security | Uploaded files stored outside web root or served via authenticated endpoint (no direct /public access until final deploy). |
| NFR-6 | Storage | Uploaded logos persisted across container restarts via named Docker volume (if containerized) or native filesystem. |
| NFR-7 | Mobile | Dashboard filtering + metrics + logo upload responsive on 320px+ width. Touch targets ≥44px. |
| NFR-8 | Accessibility | Filter buttons have aria-label + keyboard Tab/Enter support. Logo upload has associated label. |
| NFR-9 | Error handling | Out-of-range file uploads show friendly message, no 500 errors. |
| NFR-10 | Testing | All 4 features have Playwright tests (happy path + edge cases: empty orders, multiple statuses, large file rejection). |

---

## Out of scope (do NOT build today)
- Multiple logos per shop variant (seasonal, dark mode) — single logo only
- Logo crop/resize editor — accept full image as-is
- Automated image optimization (WebP, AVIF) — serve original JPEG/PNG
- S3 storage setup — local filesystem only for MVP
- CDN integration — serve images from same domain
- Logo caching strategy (cache-control headers) — standard caching
- Logo as favicon — not in scope for MVP
- Advanced image metadata preservation (EXIF) — strip metadata on save (privacy)
- Seller-provided brand colors applied site-wide — colors already in branding (FR-26)
- Re-try logic for failed uploads — single attempt, refresh page to retry

---

## Open questions (owner, please answer before Wednesday)
1. **Logo file size:** Is 2MB limit reasonable, or should it be smaller (1MB) for faster uploads on slow networks?
2. **Logo aspect ratio:** Should we enforce square (1:1) or accept any aspect ratio and let CSS scale?
3. **Metric date window:** For "Revenue (30d)", should it be calendar rolling (last 30 days from today) or rolling window from last transaction?

---

## Definition of done for day 57
A checklist for reviewer + tester:
- [ ] FR-156: Order filter buttons present and clickable with correct counts
- [ ] FR-156: Clicking filter changes order table without page reload
- [ ] FR-156: Filter counts update when order status changes
- [ ] FR-157: Metric cards display on dashboard with correct numbers
- [ ] FR-157: Metrics update when orders change status
- [ ] FR-158: Orders sorted by creation date descending (newest first)
- [ ] FR-158: Order sort persists after page reload
- [ ] FR-6+: Logo upload input in /dashboard/branding page
- [ ] FR-6+: Server rejects files >2MB with error message
- [ ] FR-6+: Server rejects non-image files (e.g., .pdf, .txt)
- [ ] FR-6+: Valid image stored to filesystem + URL saved to database
- [ ] FR-6+: Logo displays in shop storefront header + seller dashboard
- [ ] FR-6+: Seller can re-upload to replace logo
- [ ] All features mobile-responsive (< 640px viewport)
- [ ] All features have passing Playwright tests
- [ ] No console errors or TypeScript build errors
- [ ] App builds and deploys to www.soloshopbox.com without errors
- [ ] Health check passes, homepage loads, dashboard accessible
- [ ] Order filtering + metrics + logo render correctly in production

---

## Rollback plan
If Day 54 features (FR-156, FR-157, FR-158) cannot be re-implemented cleanly by end of day, fall back to Day 55 baseline (no filtering, no metrics, no smart sort). Logo upload (FR-6+) can be deferred to Day 58 without impact to MVP completion. Priority: get Day 54 features shipped cleanly.

---

## Metrics for success
- 4 features shipped, built, tested, and live at www.soloshopbox.com
- 0 build errors
- Health check + all integration tests passing
- Seller can create shop, add products, receive orders, filter orders, see metrics, upload logo (full workflow smoke test passes)
