# Engineer review: "Solo Shop Builder — Private E-commerce for Micro-Sellers"

- **By:** Carla (Engineer)
- **Cycle:** 25
- **Saved:** 15/05/2026, 6:00:12 PM

---

I'm going to walk you through this the way I'd stand at the whiteboard with the team, not as a cheerleader.

---

## 1. REAL BUILD TIME: 5–6 weeks to something usable

**Week 1–2: Core shop + checkout**
- Seller signup (email, password, shop name → unique subdomain or /shop/[slug])
- Product upload (title, price, image, description, category)
- Basic cart + Stripe checkout
- Order webhook receiver (mark paid in DB)

This is the MVP. It's live by day 7 if you don't scope-creep. It's ugly. It works.

**Week 3–4: Order + seller UX**
- Seller dashboard: order list, status buttons (paid/in-progress/shipped)
- Tracking ID field + customer-facing order status page
- Customer email notifications (order received, shipped)
- Basic product categorization (just a dropdown during upload, no drag-reorder)

**Week 5–6: Polish + real seller flow**
- Message system (simple: seller → customer via email reply, or basic in-app DM)
- Bulk image upload or drag-drop (not today — week 5 minimum)
- Category management UI (reorder, rename)

By end of week 6: a seller can list 20 products, get a customer order, mark it shipped, and the customer sees it. Real signal.

---

## 2. WHERE YOU HIT THE WALL

**Image hosting & optimization.** You upload an image, it needs to resize, compress, and serve fast. If you DIY this: GCS/S3 + sharp library for Node = 3–4 days lost to getting it right. If you use Cloudinary free tier today: 1 day, scales to paid later.

**Subdomain routing.** If you go unique subdomain per seller (shop-name.yourdomain.com), you need wildcard DNS + reverse proxy routing in your app. That's 2 days of infrastructure. If you do /shop/[slug] instead, it's 2 hours. Subdomain is cooler. /shop/ ships first.

**Messaging complexity.** Real messaging system = websockets or polling + read/unread state + notifications. That's a week minimum. Email-as-the-transport (seller replies to order notification email, reply lands in the app) = 3 days and you're shipping something that works.

**Payment reconciliation.** Stripe webhooks work, but tracking refunds, partial refunds, failed charges requires careful state management. Don't overthink this week 1–4. Accept that refunds happen outside the system for now. Week 6 you can wire it up.

**Still concerned about** the category/filtering UI. Drag-reorder for categories is a prestige feature. Dropdown at upload time works.

---

## 3. WHAT I'D CUT

**Cut immediately:**
- Analytics dashboard (seller wants to know orders; seller does NOT need cohort analysis or funnel charts in week 6)
- Inventory tracking / stock warnings
- Customer accounts / saved addresses (guest checkout only)
- Bulk order operations (export, bulk-mark-shipped)
- Product variants (one SKU per product listing)
- Tax/shipping calculator (seller enters flat rate or free; customer sees it at checkout)
- Email templates / customization (use hardcoded, branded transactionals)
- SEO settings, custom domain (subdomain comes week 8–9)
- A/B testing, analytics, conversion tracking

**Keep, but naive:**
- Messaging: email-only transport, in-app threading is just a mailbox view
- Checkout: Stripe embedded form, no address validation, no shipping zones
- Orders: 5 statuses (pending, paid, in-progress, shipped, delivered). That's it.

---

## 4. WHICH TOOLS SAVE A MONTH

**Next.js + Postgres + Prisma.** If you're already here, stay. You can ship both the seller app and customer storefront in one codebase. Deploy to Vercel (week 1, 30 minutes). Database migrations work. Prisma schema is readable. Cost: $0–50/month at this scale.

**Stripe.** Don't build payments. Stripe Elements embedded, webhooks for order confirmation. You spend two days integrating, never touch payment code again. Cost: 2.9% + $0.30 per transaction.

**Cloudinary free tier.** Handles image upload, resizing, CDN delivery. Library: next-cloudinary. One afternoon to integrate. Cost: free until 25GB/month (you won't hit it).

**SendGrid or Resend.** Transactional email (order confirmation, shipping notification, seller-to-customer messages). Template library is overkill; use strings. One day to set up. Cost: free tier covers it.

**Vercel Postgres + Vercel KV.** If you need a session store or cache layer, Vercel's managed offerings integrate instantly. Don't spin up Redis yourself. Cost: built into Vercel bill.

**Don't use:**
- Any "low-code" ecommerce builder (too constrained, you'll rebuild anyway)
- Your own auth system (use NextAuth.js, it's 4 hours)
- A separate CMS (products live in your DB; schema is simple)
- Webhooks queue (Stripe → your API; if it fails, retry via webhook — Stripe retries)

---

## 5. RED FLAGS IN THIS SPEC

**"Organize into categories"** — Does this mean seller creates categories and assigns products, or system auto-suggests? I'm reading it as seller creates + assigns. That's fine. Drag-reorder comes later.

**"Message customers directly"** — I'm assuming this is threaded email, not chat. If it's chat, add a week. Say it plainly.

**"Manage incoming orders"** — Does "manage" mean just status updates, or refunds, order edits, quantity adjustments? For v1, it means status only. Refunds happen in Stripe, not the app.

---

## 6. THE PATH TO WEEK 4 USABLE

**Day 1–2:** Seller signup + product CRUD (title, price, description, one image upload, category dropdown). Test with a dummy shop.

**Day 3–4:** Customer storefront (list products, category filter, product detail).

**Day 5–6:** Cart + Stripe checkout.

**Day 7:** Order webhook, seller sees orders appear in a simple list.

That's a working URL. A real seller can list products and a real customer can buy.

Week 2–3: order status updates, tracking, notifications.

Week 4–5: message system, category management, edge case handling.

---

## 7. WHAT CHANGES MY MIND

You tell me:
- Who are the 3–5 pre-committed sellers? Have you talked to them? Do they actually want this, or are you inferring?
- Do they currently use Etsy or Shopify? Why are they staying instead of moving?
- What's the switching cost? (Today they manage orders in email or a spreadsheet. Will they actually use a new URL instead?)

If the answer is "they're warm but not committed" or "we haven't asked yet," that's not a blocker — but it means week 1 you validate with a landing page and seller interviews, not a perfect product. You can ship a half-finished dashboard and iterate based on what they actually click.

---

## FINAL CALL

**This ships in 5–6 weeks if:**
- You use Next.js, Postgres, Stripe, Cloudinary (no debates)
- You cut categories/drag-reorder, refunds, inventory, variants
- Messaging is email-only transport
- You don't try to build "a better Shopify" — you build a better "seller running things on spreadsheet"

**Do not start this if:**
- You don't have 3–5 sellers who've said yes to beta testing by week 1
- Anyone on the team wants to debate architecture (framework, database, auth system)
- You think you can do this in 3 weeks

I'd build it. But I need confirmation: are there real sellers waiting, or are we building for an idea of a seller?
