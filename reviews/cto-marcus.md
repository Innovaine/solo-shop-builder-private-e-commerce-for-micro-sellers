# CTO review: "Solo Shop Builder — Private E-commerce for Micro-Sellers"

- **By:** Marcus (CTO)
- **Cycle:** 25
- **Saved:** 15/05/2026, 5:57:37 PM

---

# MARCUS'S TECHNICAL READ — SOLO SHOP BUILDER

I'm going to be direct: this idea has real velocity. You've learned from the last three cycles—marketplace gravity well, unit economics death spiral—and you're pivoting to single-tenant. That's smart. But I'm reading "dashboard," "messaging," "order tracking," and I see fat. Let me cut it ruthlessly.

---

## BUILD COMPLEXITY — 7-DAY UGLY TIMELINE

**Week 1 (Days 1–7): Ugly but breathing**
- Day 1: Deploy empty repo. Seller login (email magic link, no password). One hardcoded Stripe account (not multi-tenant billing yet).
- Day 2–3: Seller uploads product images (S3 direct upload). Title, price, description (plain text, no rich editor). One category max per product.
- Day 4: Storefront URL. Buyer browsing. Add-to-cart (session storage, not DB yet). Checkout flow hits Stripe.
- Day 5–6: Order confirmation email to seller + buyer. Order list on seller dashboard (all orders, no filtering). Buyer tracking link (hardcoded status updates—you manually update order status via admin panel).
- Day 7: Polish. Fix crashes. Deploy to production.

**This is not a real MVP.** It's a skateboard. No messaging. No auto-order-status. No category management. No image galleries. Seller manually updates tracking in the database (or you do it for them). But a real human can sign up, list a product, sell it, and see the order. That's the bar.

---

## TEAM / SKILLS NEEDED

- **1 full-stack engineer** (mid-level, 3–5 YOE): builds login, product CRUD, checkout. Needs to be comfortable with Stripe API, S3, and shipping something broken.
- **1 frontend engineer** (junior is fine, 1–2 YOE): storefront, cart, order tracking page. Needs to move fast, not perfectly.
- **You (CTO)**: unblock, kill scope creep, ship Day 1 with a curl-able URL.

That's it. Three people, one week. No design system. No design hire. No QA phase.

---

## BIGGEST KILL-YOU-IN-PRODUCTION RISK

**Stripe webhook chaos.** You're integrating payment processing in 36 hours. If webhooks fail silently, orders pay but sellers never know. If you retry wrong, duplicate charges.

**Mitigation (day 4, before you touch checkout):**
- Log every webhook to a simple `webhooks` table. Store raw event.
- Idempotency key on every Stripe call (you're probably doing this, but verify).
- On Day 5, manually test: pay via Stripe in staging. Kill the webhook mid-fire. Restart. Verify order appears exactly once.
- If this breaks in prod, seller loses trust and you lose your first paying customer. Non-negotiable to test.

Everything else (image crashes, slow checkout, bad UX) buyers and sellers will tolerate for week one. Phantom orders they won't.

---

## WHAT TO CUT (3 features that absolutely do not ship in week 1)

### 1. **Seller Messaging**
Kill it. Sellers will email customers directly using Gmail. You lose an engagement feature, but you save 2–3 days of real-time messaging, notification infrastructure, and database design. After you have 5 paying sellers doing this, ask them if they'd pay for in-app messaging. Right now, it's a guess.

**Alternative (week 2, if real signal):** Add a "message template" feature (seller pre-writes an email, you send it from a shared inbox). Still no real-time chat.

### 2. **Category Management UI**
Hardcode categories. Seller can only pick from: `Handmade`, `Vintage`, `Supplies`, `Other`. You save the CRUD interface, the drag-and-drop, the permission logic. Seller creates products. You manually slot them into categories in the database. Ugly? Yes. Takes 30 seconds per seller? Also yes. Worth 4 days of dev time? No.

**Alternative (week 2):** Let sellers type a custom category name. Auto-assign to one of your buckets server-side.

### 3. **Order Status Auto-Update + Tracking Integration**
Seller can change order status manually (paid → in-progress → shipped) via dropdown on the dashboard. No carrier integration. No auto-pull from FedEx/UPS APIs. No tracking number lookup. Seller enters a tracking ID and a URL if they want—you just display it. Buyer sees the status and the URL if provided.

You save 3–4 days of carrier API work, error handling, and async job queues. Real sellers are using Etsy labels anyway; they'll give you the ID manually.

**Alternative (week 3):** If seller uploads a CSV with `order_id, tracking_id`, you bulk-update. Still manual, but faster at scale.

---

## HARDCODED & SHORTCUTS (DO THIS)

1. **One Stripe account.** Don't build multi-tenant billing yet. You take 3% + Stripe fees for month one. After you have 3 paying sellers asking for their own account, build white-label billing.

2. **No image optimization.** S3 direct upload. If it's 50MB and the page is slow, that's their problem for month one. Add image resize (ImageMagick or Sharp) in week 2 if sellers complain.

3. **Order dashboard = table.** No charts, no filters, no date range picker. Seller sees all orders. If they have 200 orders, the page is slow. Good—now they know they need to archive old orders, and you have a real feature request for cycle 25.

4. **Auth = magic link.** No passwords. No "forgot password." No 2FA. Seller gets an email with a link, clicks it, they're in for 30 days. Logout erases the session cookie. If they lose the link, they sign up again. You save 1 day of auth plumbing.

5. **Checkout = Stripe checkout.** Use Stripe Checkout (the hosted page), not custom payment form. You save PCI compliance, card handling, form state nightmares. Seller's customer lands on Stripe's page, pays, comes back. Ugly redirect flow, but it ships in 4 hours.

---

## WHAT THIS MEANS FOR WEEK 1 SHIPPING

- **Monday (Day 1):** Repo live. Login works. Seller account created. Deploy to production.
- **Tuesday–Wednesday (Days 2–3):** Product upload. S3 integration. Hardcoded "Handmade" category.
- **Thursday (Day 4):** Storefront URL. Browse products. Add to cart (session state, not persistent).
- **Friday (Day 5):** Stripe checkout. Order confirmation emails.
- **Saturday (Day 6):** Seller dashboard. Manual order status updates. Buyer tracking link.
- **Sunday (Day 7):** Crash fixes. Deploy.

By Tuesday morning, you have 3–5 real sellers (people you already know who've said yes) creating shops. By Friday, one of them has a real order. By next Friday, you know if this is worth doubling down on.

---

## CONVICTION CHECK

I'm in. This is the move. Single-tenant, pre-committed sellers, real payment in week one—that's the opposite of the last three cycles. You're not building a marketplace; you're building a tool for people who already have a process. That changes everything about the risk.

But I need two things:
1. **Confirm your 3–5 sellers will actually use this.** Not "they said they would"—they've agreed to sign up in week 2, upload products, and let a real customer buy. If they ghost, we pivot again.
2. **I'm taking point on the Stripe webhook integration.** I've seen this break silently before, and I won't let it happen on my watch.

Ship it.
