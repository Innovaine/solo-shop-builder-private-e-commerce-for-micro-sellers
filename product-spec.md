# Product Spec: Solo Shop Builder — Private E-commerce for Micro-Sellers

## One-liner
A single-tenant shop platform where a full-time seller (Etsy reseller, local craftsperson) signs up, creates a branded shop with their products, and manages customer orders + payment without marketplace fees.

## Vision
By v1.0 (end of "Final" stage), a micro-seller running $15K–$80K annual revenue can operate their entire order-to-shipment workflow in one place: upload products (with images), receive payments, track orders, message customers, and see unified analytics. No more Etsy + email + spreadsheet. One URL, one dashboard, one source of truth. Sellers pay $20–30/month. We take 0% of GMV (only Stripe fees pass through). Success: 50+ paying sellers, $1M+ ARR, real profitability at that scale.

## Total feature count: ~100

## Stage breakdown

### Stage 0 — MVP (target ~20 features)
The first thing a real seller can actually use to run their business. Seller can sign up, list products, get a shop URL, receive orders via Stripe, see orders in a dashboard, update order status, and customer can track shipment.

- **F1: Seller signup via email magic link** — Seller receives email with login link, no password needed
- **F2: Shop creation (name, slug, basic info)** — Seller enters shop name, gets unique /shop/[slug] URL
- **F3: Product CRUD (create, read, update, delete)** — Seller can add/edit products (title, price, description, image)
- **F4: Product image upload to S3** — Seller uploads product images, auto-resized, served via CDN
- **F5: Public shop storefront** — Customers visit /shop/[slug], see product list, product detail pages
- **F6: Category assignment (dropdown)** — Seller picks from fixed categories (Handmade, Vintage, Supplies, Other) during product creation
- **F7: Product search/filter by category** — Customer filters products by category on storefront
- **F8: Shopping cart (browser session storage)** — Customer adds products to cart, cart persists in localStorage, no login needed
- **F9: Stripe Checkout integration** — Customer clicks checkout, redirected to Stripe Checkout (hosted), completes payment
- **F10: Order creation from Stripe webhook** — Stripe payment_intent.succeeded webhook creates order in database with customer email, items, total
- **F11: Seller order dashboard** — Seller logs in, sees table of all orders (no filtering, no date range)
- **F12: Order status updates (dropdown)** — Seller marks order as: pending → paid → in-progress → shipped → delivered
- **F13: Tracking ID input field** — Seller enters tracking URL or ID, saved to order
- **F14: Customer order tracking link** — Customer receives email with unique tracking link (no auth), sees order status + tracking info
- **F15: Order confirmation email (seller)** — Automated email to seller when order is paid
- **F16: Order confirmation email (customer)** — Automated email to customer with order summary + tracking link
- **F17: Seller logout** — Session cookie cleared, redirects to login
- **F18: Basic error handling** — 404, 500, payment failure pages
- **F19: Empty state pages** — "Your shop is empty" page, "No orders yet" page
- **F20: Seller account deletion** — Seller can delete their shop and all associated data (GDPR)

### Stage 1 — Hardened (target ~20 more features, ~40 cumulative)
Security audit complete. Payment processing edge cases handled. Basic seller onboarding flow.

- **F21: Seller password option (in addition to magic link)** — Seller can set password for faster login
- **F22: Seller password reset flow** — Forgot password email + reset link
- **F23: Seller 2FA (TOTP)** — Optional two-factor auth for seller accounts
- **F24: Webhook signature verification** — All Stripe webhooks verified with signing secret
- **F25: Idempotency on order creation** — Duplicate Stripe webhooks create order exactly once (idempotency key tracking)
- **F26: Order refund handling** — Seller can refund order, customer sees refund status
- **F27: Bulk image upload** — Seller can upload 5–10 images at once, all resized and stored
- **F28: Product CSV import** — Seller uploads CSV (title, price, description, category, image_url), bulk-creates products
- **F29: Product CSV export** — Seller downloads CSV of all products (for backup or migration)
- **F30: Order CSV export** — Seller exports orders as CSV (for accounting, fulfillment services)
- **F31: Seller profile page** — Seller can set public-facing shop description, social links
- **F32: Custom shop colors / branding** — Seller picks header color, logo image (limited theming)
- **F33: Customer address capture at checkout** — Stripe Checkout's built-in address collection
- **F34: Seller billing dashboard** — Seller sees monthly transaction volume, Stripe fees, payout schedule
- **F35: Email template customization** — Seller can edit order confirmation email body (pre-built template)
- **F36: Basic seller analytics** — Total revenue, order count, top products (last 30 days)
- **F37: Product variants (size, color)** — Product can have 1–3 variants, customer selects at checkout
- **F38: Inventory tracking** — Seller enters stock count per product, customer can't checkout if out of stock
- **F39: Seller help/FAQ page** — Static docs for common questions
- **F40: Mobile-responsive dashboard** — Seller dashboard works on mobile (portrait + landscape)

### Stage 2 — Closed Beta (target ~20 more features, ~60 cumulative)
Real beta users invited. Feedback loop active. Seller support touch-base calls.

- **F41: Seller messaging system (email transport)** — Seller composes message in dashboard, sent to customer email, replies land back in dashboard inbox
- **F42: Customer message threads** — Buyer can message seller about order via reply-to email or dashboard link (email-first, UI secondary)
- **F43: Automated restock alerts** — Seller sets threshold, gets notified when inventory hits N units
- **F44: Abandoned cart recovery email** — Customer added items but didn't checkout, seller gets email 24h later with link to recover
- **F45: Seller coupon/discount codes** — Seller creates discount code (% or fixed amount), shares with customers
- **F46: Bulk order status updates** — Seller can mark 5+ orders as shipped in one action
- **F47: Order tagging** — Seller adds custom tags to orders (e.g., "VIP", "wholesale", "gift"), filter by tag
- **F48: Customizable order confirmation page** — Seller can change post-purchase redirect, add thank-you message
- **F49: Review/rating system** — Customer can leave rating + review after shipment
- **F50: Seller rating display** — Public shop shows average rating, number of reviews
- **F51: Shipping calculator (flat rate)** — Seller sets flat shipping cost by region or order weight
- **F52: Tax calculation (basic)** — Seller enters sales tax %, system adds to order total at checkout
- **F53: Seller notifications (email)** — New order, new message, stock low → email alert
- **F54: Seller notifications (in-app bell)** — Dashboard shows unread notification count, notification center
- **F55: Seller activity log** — Log of all product changes, order updates (audit trail)
- **F56: Basic SEO (meta tags)** — Shop and product pages have customizable title, description, keywords
- **F57: Open Graph (social sharing)** — Products have og:image, og:title for Facebook/Pinterest share previews
- **F58: Sitemap.xml** — Auto-generated sitemap for search engines
- **F59: Google Analytics integration** — Seller can paste GA4 ID, track traffic
- **F60: Abandoned shop cleanup** — Shops with no activity >90 days archived (not deleted), can reactivate

### Stage 3 — Production-Ready (target ~20 more features, ~80 cumulative)
Real paying customers. Sales motion active. Billing + churn management.

- **F61: Stripe Connect (seller payouts)** — Seller connects their own Stripe account, we process payments and route to them (not hardcoded account)
- **F62: Monthly billing + invoicing** — Seller charged $20/month via Stripe, invoice emailed
- **F63: Billing dashboard** — Seller sees invoice history, upcoming charges, payment method management
- **F64: Plan upgrade/downgrade** — Starter ($20/mo, 100 products), Pro ($50/mo, unlimited products, advanced analytics)
- **F65: Trial period (14 days free)** — New sellers get 14 days free, then charged
- **F66: Churn recovery email** — Canceled seller sees win-back offer after 7 days
- **F67: Seller onboarding flow (video)** — Step-by-step video guides (shop creation, product upload, first order)
- **F68: Live chat support** — Seller can chat with support team during business hours
- **F69: Seller documentation (help center)** — Searchable knowledge base with articles on all features
- **F70: Seller community (forum)** — Basic discussion forum for sellers to share tips
- **F71: API for sellers** — REST API so sellers can sync orders to their accounting software
- **F72: Zapier/Make integration** — Seller can auto-send new orders to email, Slack, Google Sheets
- **F73: Email list builder** — Seller's customer email list exportable, integrates with Mailchimp/ConvertKit
- **F74: Multi-product order receipt** — Receipt email shows all items, formatted nicely
- **F75: Returns/RMA process** — Customer can request return, seller approves/denies, system tracks RMA
- **F76: Tracking number sync from major carriers** — Seller pastes tracking ID, we pull status from FedEx/UPS/DHL, auto-update order
- **F77: Seller team/collaborators** — Seller can invite team members with role-based access (admin, editor, viewer)
- **F78: Seller two-step verification** — Critical actions (delete shop, change email) require 2FA
- **F79: Rate limiting + DDoS protection** — API + storefront protected from abuse
- **F80: GDPR compliance (data export/deletion)** — Seller and customer can request data download, account deletion

### Stage 4 — Final (target ~20 more features, ~100 cumulative)
Mature product. Enterprise-adjacent features. Profitability optimized.

- **F81: Multi-location shop support** — Seller can list multiple physical locations (inventory per location)
- **F82: Wholesale/B2B pricing** — Seller can set different prices for wholesale buyers
- **F83: Pre-order + back-order management** — Seller can set product as pre-order (ships at date X)
- **F84: Subscription products** — Seller can sell subscriptions (e.g., monthly box), recurring billing
- **F85: Digital products** — Seller uploads digital files, customer receives download link after checkout
- **F86: Gift cards** — Seller can create and sell gift cards, buyer redeems for shop credit
- **F87: Loyalty program / rewards** — Customer earns points on purchase, redeemable for discount
- **F88: Smart email sequences** — Seller sets up automation: welcome email → 3 days later upsell → 7 days review request
- **F89: Instagram/TikTok product links** — Seller gets shareable links optimized for social (preview image, title, price)
- **F90: Instagram Checkout integration** — Customer checks out directly on Instagram via our feed
- **F91: Attribution reporting** — Seller sees which channels (organic, email, social, paid ads) drove orders
- **F92: Paid advertising dashboard** — Seller can launch Google/Facebook ads directly from dashboard (we handle setup)
- **F93: Inventory management (advanced)** — Product variants with per-variant stock, SKU tracking
- **F94: Barcode scanning** — Seller can scan product barcode at fulfillment, auto-marks item shipped
- **F95: Shipping label generation** — Auto-generate USPS/FedEx/UPS label from order, integrate with fulfillment partners
- **F96: Marketplace sync** — Seller's inventory syncs to Shopify, WooCommerce, Etsy (avoid overselling)
- **F97: AI product description generator** — Seller uploads image, AI auto-writes product description
- **F98: Competitor pricing monitor** — Track competitor prices on Amazon/Etsy, adjust pricing
- **F99: Seller benchmarking** — Compare metrics (AOV, conversion rate, shipping speed) to similar sellers anonymously
- **F100: Carbon-neutral shipping label** — Seller can choose carbon-offset shipping option (we pay offset)**

## Non-functional requirements (apply across all stages)

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | p95 page load time < 2s (storefront + seller dashboard) |
| NFR-2 | Performance | p95 API response time < 500ms (order creation, product CRUD) |
| NFR-3 | Performance | Stripe checkout redirect < 1s |
| NFR-4 | Security | All passwords hashed with bcrypt (min 12 rounds) |
| NFR-5 | Security | API keys (if exposed) cannot be used without rate limiting + IP whitelist |
| NFR-6 | Security | Stripe webhook signed with secret key (no unsigned payloads accepted) |
| NFR-7 | Security | All PII (email, address) encrypted at rest in database |
| NFR-8 | Security | Seller dashboard requires HTTPS only (no HTTP) |
| NFR-9 | Security | CSRF tokens on all state-changing forms |
| NFR-10 | Security | XSS protection (content sanitized, no inline scripts) |
| NFR-11 | Security | SQL injection prevention (parameterized queries, Prisma ORM) |
| NFR-12 | Browser support | Chrome (latest 2 versions), Safari (latest 2 versions), Firefox (latest 2 versions) |
| NFR-13 | Accessibility | WCAG 2.1 AA compliance on seller dashboard (forms have labels, focus states visible) |
| NFR-14 | Accessibility | Mobile touch targets ≥ 44px, headings properly nested |
| NFR-15 | Data durability | Daily automated database backups, 30-day retention |
| NFR-16 | Observability | All API errors logged with request ID, timestamp, user ID (if applicable) |
| NFR-17 | Observability | Stripe webhook logs stored in `webhooks` table forever (audit trail) |
| NFR-18 | Uptime | Target 99.5% uptime (SLA, production only) |
| NFR-19 | Email delivery | Transactional emails (order confirmation, tracking) delivered within 5 minutes |
| NFR-20 | Mobile | Seller dashboard mobile-responsive (works on 320px+ width) |
