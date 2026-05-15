# HR staffing plan: "Solo Shop Builder — Private E-commerce for Micro-Sellers"

- **By:** Nalini (HR)
- **Cycle:** 25
- **Saved:** 15/05/2026, 6:02:46 PM

---

I'm reading this as: we're finally moving away from marketplace gravity and toward sellers who already have customers. That's the shift I've been waiting for. The unit economics math actually works here because we're not chasing network effects—we're automating work that's already happening in spreadsheets and WhatsApp. I can staff this.

---

## TEAM STRUCTURE

**Extend the Core Product team.** Don't spin a new department. We're still one product, one stack. This stays tight and integrated.

**Current Core Product:** (I'm assuming 1 FE, 1 BE, 1 PM from cycle 20 shape)
**Add:**
- 1 backend engineer (order state machine, payment webhook handling, seller messaging queue)
- 1 frontend engineer (seller dashboard, checkout flow, order tracking UI)
- 1 part-time design/UX (flows are straightforward—category org, order status, messaging—but checkout/payment UI needs one clean pass before launch)

**Total team:** 4 engineers + 1 PM + 0.5 design. Ship in 10–14 days.

---

## SCOPE FOR WEEK 1

**What ships by day 7 (MVP for testing with 3–5 real sellers):**
- Seller signup → unique shop URL (no custom domain yet)
- Product upload: image, title, price, category dropdown
- Buyer checkout: cart, Stripe one-time payment, order confirmation
- Seller dashboard: list of orders, mark paid/in-progress/shipped, add tracking ID

**Out of scope for v1:**
- Messaging (Stripe webhook notifications are enough signal for now)
- Customer order tracking page (we can email status updates)
- Inventory (stock counts come in cycle 2 if sellers ask)
- Multi-currency, shipping integrations, tax logic

---

## VALIDATION HOOK

3–5 pre-committed sellers (craft makers, Etsy resellers, local food vendors—find these in days 1–2, probably referrals or Twitter DMs). They onboard day 4–5, run real transactions day 7–10, give signal by day 12. Target: $30–50/month SaaS commitment from each by week 4 (paying customer threshold). If two of five convert, we have directional proof single-tenant works.

---

## CONCERNS (flagged after plan, not instead of it)

Two things I'm sitting with:

1. **We're still building a checkout for the nth time.** Stripe hosted checkout would be faster than custom checkout, but I know the PM wants to own the UX. If custom checkout isn't done by day 6, we should cut to Stripe hosted and iterate later. Don't let pride slow shipping.

2. **"Pre-committed sellers"—who owns finding them?** That's not in the headcount above. The PM will have to recruit them *during* build, not after. If we don't have 3 real sellers lined up by day 5, we're building for a ghost. That's a PM execution problem, but it's front-loaded and critical. Call it out in standup daily.

Neither is a reason to reject the team structure. Both are reasons to run hard the first 48 hours.
