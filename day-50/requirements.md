# Day 50 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

## Goal today
Unlock seller operational visibility: dashboard showing revenue/order metrics, seller profile with public description, and basic CSV export of orders for fulfillment.

## Features in scope
- **FR-31: Seller profile page** — Seller can edit public shop description, display name. Changes visible on storefront.
- **FR-36: Basic seller analytics** — Dashboard shows: total revenue (last 30 days), total orders, top 3 products by revenue, order trend chart.
- **FR-30: Order CSV export** — Seller downloads CSV of all orders (date, customer email, items, total, status) for accounting/fulfillment software.

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-31 | Seller profile page | GET /dashboard/profile, POST /api/shops/{shopId}/profile with { displayName, publicDescription }. Display name is seller's shop brand name (max 100 chars). Public description appears on storefront header (max 500 chars). | 1. Seller can load /dashboard/profile and see form with 2 fields. 2. Form submission sends POST to /api/shops/{shopId}/profile, validates max lengths, returns 200 with updated shop object. 3. Changes appear on /shop/{slug} storefront within <1s of save. 4. Storefront shows display name + description in header (or about section if design has one). 5. Empty description doesn't break layout (graceful empty state). 6. Invalid input (>500 chars) shows error message in form. |
| FR-36 | Seller analytics dashboard | GET /dashboard/analytics, GET /api/analytics (endpoint returns JSON). Query last 30 days of orders from Stripe webhook log + database. Calculate: total revenue (sum of successful orders), order count, top 3 products (by revenue or unit count, seller's choice), daily order trend (chart-ready JSON: array of {date, orderCount, revenue}). | 1. Dashboard loads chart showing daily orders + revenue for past 30 days (default view). 2. Cards show: "Total Revenue: $XXX", "Total Orders: N", "Top Products: Product A ($YYY), Product B ($ZZZ), Product C ($WWW)". 3. If no orders in 30 days, shows "No orders yet" message (graceful empty state). 4. Chart data updates within 5s of new order (no stale cache). 5. API returns 200 with structured JSON: { totalRevenue, orderCount, topProducts: [{name, revenue, units}], dailyTrend: [{date, orders, revenue}] }. 6. Dates in API response are ISO 8601 format. 7. All monetary values formatted as USD (e.g., "$123.45") in UI, cents as numbers in API. |
| FR-30 | Order CSV export | GET /api/orders/export?format=csv, returns CSV file with columns: Date, Customer Email, Items (comma-separated product names + quantities), Total ($), Status. One order per row. File downloads as "orders-YYYY-MM-DD.csv". | 1. Seller navigates to /dashboard/orders, clicks "Export as CSV" button. 2. Clicking button fetches GET /api/orders/export?format=csv with seller session. 3. Browser downloads CSV file (content-disposition: attachment). 4. File contains all orders (no date limit, all history). 5. CSV is valid (RFC 4180: quotes special chars, escapes commas in cells). 6. Items column shows "Product A (qty: 2), Product B (qty: 1)" for multi-item orders. 7. Status column shows current order status (paid, in-progress, shipped, delivered). 8. If no orders exist, file has headers only + message row "No orders to export". 9. File timestamp is current date in format orders-2026-05-17.csv (YYYY-MM-DD, ISO). |

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Analytics dashboard loads and renders chart in <1.5s (p95) on 4G mobile. |
| NFR-2 | Performance | CSV export request completes (file download starts) within 3 seconds, even with 10K+ orders. |
| NFR-3 | Security | Seller can only export/view their own orders. Row-level auth check: verify session seller_id matches order.shop_id. |
| NFR-4 | Security | No stored XSS on seller profile public description. Sanitize output on storefront (use React escape or DOMPurify). |
| NFR-5 | Browser support | Analytics dashboard, profile form, CSV export button all work on Chrome, Safari, Firefox (latest 2 versions). |
| NFR-6 | Accessibility | Analytics dashboard: chart has alt text or data table fallback for screen readers. Profile form labels have htmlFor + aria-required. |
| NFR-7 | Data format | CSV export must be RFC 4180 compliant (valid for import into Excel, Google Sheets, accounting software). |
| NFR-8 | Observability | Log each CSV export request with seller_id, order count, timestamp. |

## Stack chosen
- **Backend:** Node.js + Express/Fastify in TypeScript (existing, no change)
- **Web frontend:** Next.js App Router, TypeScript, Tailwind CSS (existing)
- **Database:** Postgres + Prisma ORM (existing)
- **Charts:** Recharts or Chart.js for analytics dashboard trend visualization
- **Why this stack:** Team already shipping React/Next.js. Recharts integrates cleanly with TypeScript + Tailwind. CSV generation uses built-in Node APIs (no library needed for simple CSV).

## Out of scope (do NOT build today)
- Advanced analytics (cohort analysis, funnel, attribution) — Stage 2+ feature
- Real-time analytics streaming or WebSocket updates — batch refresh on page load is fine for MVP
- Email/SMS notifications for metrics — Stage 2 feature (F53)
- Custom date range picker — fixed 30 days for MVP, UI to pick range is Stage 2
- Predictive analytics or ML — not MVP scope
- A/B testing on storefront — sales optimization, not MVP
- Seller billing/payment processing — Stage 2 feature (F62+)
- Team/collaborator access to analytics — single seller per shop for MVP (F77 is Stage 3)

## Open questions
1. **Chart library choice:** Should we use Recharts (React-native, excellent TS support) or lighter Chart.js + wrapper? Recommend Recharts for DX.
2. **Analytics time window:** Confirmed 30 days? Or should it be configurable (7, 14, 30, 90)? For MVP, 30-day fixed is best.
3. **Top products metric:** By revenue or unit count? Recommend revenue (tells seller which items make money).
4. **CSV encoding:** UTF-8 with BOM for Excel compatibility, or plain UTF-8? UTF-8 plain is standard, will work in all tools.

## Definition of done for day 50
- [ ] FR-31: Seller profile form loads at /dashboard/profile with displayName + publicDescription fields
- [ ] FR-31: Seller can submit form, changes persist to database, render on /shop/{slug} within 1s
- [ ] FR-31: Public description sanitized on storefront (no XSS risk)
- [ ] FR-36: Analytics dashboard loads at /dashboard/analytics with cards + chart
- [ ] FR-36: Dashboard shows total revenue, order count, top 3 products, 30-day daily trend chart
- [ ] FR-36: Empty state handles no orders gracefully (shows message, no chart errors)
- [ ] FR-36: API endpoint GET /api/analytics returns valid JSON with expected fields
- [ ] FR-30: CSV export button appears on /dashboard/orders
- [ ] FR-30: Clicking export downloads RFC 4180-compliant CSV file named orders-YYYY-MM-DD.csv
- [ ] FR-30: CSV contains all order history (not date-limited) with correct columns + formatting
- [ ] FR-30: Each feature has ≥1 Playwright test covering happy path + error state
- [ ] FR-31, FR-36, FR-30 all verified working on mobile (320px+ width) and desktop
- [ ] All features verified via code review (Søren checks auth, CSV format, chart data accuracy)
