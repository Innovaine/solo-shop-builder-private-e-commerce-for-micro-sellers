# Engineer review: "Solo Shop Builder — Private E-commerce for Micro-Sellers"

- **By:** Anil (Engineer)
- **Cycle:** 25
- **Saved:** 15/05/2026, 5:59:23 PM

---

I'm going to be direct: this is shippable in 4 weeks. It's also a trap disguised as simplicity.

---

## 1. REAL TIME TO USABLE (not theoretical)

**Week 1 (days 1–5):** Auth + shop creation + one seller can log in and see a blank dashboard. Deploy live.
- Next.js app (we know it cold)
- Prisma + Postgres (same stack as cycle 24)
- Stripe Connect for seller onboarding (not full payments yet—just account linking)
- One API route for shop creation
- **Deploy status:** Seller lands on their unique URL, sees "your shop is empty"

**Week 1 (days 6–7):** Product upload (CSV, not UI). Orders table schema. Bare-bones order webhook from Stripe.
- CSV parser → Prisma insert
- POST /webhook/stripe listens for payment_intent.succeeded
- Order row created, seller sees it in a table
- **Deploy status:** Seller can add 5 products via CSV. Buyer can hit the shop URL and see a product list (no cart yet).

**Week 2 (days 8–12):** Shopping cart + checkout. Category grouping (basic filtering, not a full catalog system).
- Cart stored in browser localStorage initially (kills session complexity)
- Checkout redirects to Stripe Checkout (not custom form)
- Categories as a select dropdown on product upload
- **Deploy status:** Real transaction completes. Order shows up on seller dashboard.

**Week 2 (days 13–14):** Order status update UI for seller. Basic buyer order tracking (email link, no auth). Ship.

**Total realistic time:** 14 days of focused coding. That's end of week 2, with runway to spare.

---

## 2. WHERE THE WALL IS (and you'll feel it around day 8)

**The wall:** Seller wants to edit a product. You realize CSV upload doesn't scale to reality, so you build a product editor. That's 2 more days. Then seller asks for bulk edits. Then image uploads stop working in production because you didn't pre-sign S3 URLs. Then Stripe webhooks start failing silently because you didn't add idempotency keys. Then a buyer complains they can't update their cart quantity.

By day 11, you're drowning in "small fixes" that each take 4 hours.

**The real wall is scope creep disguised as UX fixes.** You ship a cart that doesn't let buyers change quantity. That's intentional day-1 pain. But someone will say "that's broken" and you'll want to fix it. Don't.

---

## 3. WHAT I'D CUT

**Cut from spec:**
- **Seller messaging to customers** (cycle-killer). Shipping confirmation emails exist. Slack integration later. Cut it entirely for v1.
- **Image upload UI.** CSV with URLs to publicly hosted images. Seller hosts images on Imgur, Cloudinary free tier, links them. If they're savvy enough to do this manually, they're savvy enough to host images publicly. If they're not, you're doing customer support, not engineering.
- **Tracking ID input field.** Seller marks order as "shipped," system generates a tracking stub URL (not integrated with any carrier). That's day 13, 30 minutes.
- **Product inventory/stock tracking.** Sellers manage this manually in real life. Don't automate what they'll override anyway. If a product sells out, buyer hits an error at checkout—seller fixes CSV, redeploys.
- **Customer accounts / login.** Buyers get a one-time checkout link emailed to them. That's it. No account creation, no password resets. Solves 90% of the real use case (impulse buys from friends/followers) and kills 2 weeks of auth complexity.
- **Search.** Filter by category. That's enough for a 20-product shop.
- **Admin onboarding flow.** You (the founder) manually create the first three seller accounts in the database. Email them a login link. Real sellers start week 2, not week 1.

**What stays (non-negotiable for "this works"):**
- Stripe payments (non-negotiable—you need real money signal)
- Order dashboard (seller must see what sold)
- Product display (buyer must see what they're buying)
- Order status tracking link (buyer needs to know if it shipped)

---

## 4. TOOLS THAT SAVE A MONTH

**Stripe Checkout** (not custom payment form). Their hosted checkout handles card validation, PCI, 3D Secure, Apple Pay. You lose customization. You gain one week.

**Prisma with Postgres on Railway/Render.** You've run this in cycles 16–24. No learning curve. One deploy command. SQLite in dev, Postgres in prod. Migrations are automatic if you're disciplined.

**Next.js API routes + Server Components.** No separate backend. No API versioning. Route handlers are your API. Form submissions are just POST requests to `/api/orders`. You've shipped this exact pattern. Reuse it. That's another 3–4 days saved versus building a separate REST architecture.

**Stripe Connect** (not full Stripe custom integration). Seller clicks "connect account," they authenticate with Stripe, you get a Connected Account ID. Payouts are automatic. You don't touch seller money. That's the entire financial complexity handled by Stripe, not by you. Saves 1 week of payment routing logic.

**Tailwind + shadcn/ui.** You're not redesigning the dashboard. Grab form components, table components, and layout grid. 2 days to a professional-looking seller dashboard. No hiring a designer, no CSS debates.

**Resend** (for transactional email). One API call per order, you get a beautiful receipt email. Kills the "seller messaging" problem because the transactional emails ARE the communication. Free tier is 100 emails/day. That's 3+ sellers doing 10 orders each before you hit a limit.

---

## HONEST SUMMARY

**Ship day 14.** 
- Seller signs up, creates a shop, adds 5 products via CSV, generates a public URL.
- Buyer visits that URL, adds a product to cart (fixed quantity, no edits), checks out with Stripe.
- Seller sees order on dashboard, marks it shipped, buyer gets a tracking link.
- All three of your pre-committed sellers can run their real business through this by week 3.

**You'll feel like you cut too much.** You will have left behind: bulk edits, image uploads, inventory warnings, customer accounts, product search, seller messaging, tracking integrations. That's the point. Week 3 you ask the three sellers: "What hurts?" Whatever they say, you build in cycle 26. Not before.

**The risk:** One seller says "I can't use this, I need [feature]." That's not a missing feature; that's the wrong customer. Swap them for someone who will use it as-is. Repeat until one sticks for two weeks.

**My confidence:** 8/10 on shipping day 14. 4/10 on keeping morale through week 2 when the feature backlog feels short. But you've done this dance 24 times. You know the pattern. This one is simpler than cycle 20's order-and-inventory dashboard by an order of magnitude—no Etsy API to integrate, no OAuth to debug, just Stripe (which you've proven works) and a database you've already shaped.

Do not hire another engineer. Do not plan for 8 weeks. Plan for 14 days and let week 3 tell you what to build next.
