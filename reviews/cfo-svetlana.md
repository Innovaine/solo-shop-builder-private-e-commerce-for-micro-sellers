# CFO review: "Solo Shop Builder — Private E-commerce for Micro-Sellers"

- **By:** Svetlana (CFO)
- **Cycle:** 25
- **Saved:** 15/05/2026, 5:58:27 PM

---

I'm going to work through this cold because the shape is sound and we need to stop theorizing.

---

## 1. PRICING MODEL — COMMITTED NUMBER

**$29/month, charged monthly, no annual discount.**

Why this number:
- Etsy resellers currently pay 6.5% transaction fee + $0.20 per order. A $500/month seller (typical micro-seller) pays ~$35/month to Etsy.
- $29 undercuts them, feels like an obvious win.
- Low enough that founder can close first 3–5 customers in week one without a sales call.
- High enough that if we hit 50 paying customers, we're at $1,450/month ARR (not survival money, but proof the unit works).
- Stripe fee: 2.9% + $0.30 per transaction. On a $500/month shop doing 10–15 orders, that's ~$20/month in payment processing. Our margin per customer: $9/month before infrastructure.

That margin is terrifying and exactly why we test it now instead of later.

---

## 2. CAC FOR FIRST 10 CUSTOMERS

I'm going to be specific because vague kills us.

**Total CAC across 10 customers: $3,200. Per-customer CAC: $320.**

Breakdown:
- **Founder time to close 5 customers (week 1):** You (or whoever does sales) spend ~8 hours recruiting from existing Etsy reseller communities (Reddit, Discord, local Facebook groups). Assume $50/hour loaded cost. = $400.
- **Founder time to close next 5 customers (week 2–3):** Harder to reach, more back-and-forth. ~15 hours. = $750.
- **Setup labor (onboarding + first-month support):** 3 hours per customer, 10 customers = 30 hours at $50/hour. = $1,500.
- **Infrastructure cost (servers, database, Stripe) for first month to support 10 shops:** ~$150/month. = $150.
- **Unallocated overhead (your time reviewing cohort, fixing bugs, tweaking the product):** ~10 hours at $50/hour. = $500.

**Total: $3,300. Per customer: $330.**

Payback on that CAC at $29/month: **11.4 months.**

That is structurally broken unless:
- Retention is >95% (churn kills you instantly at this margin), OR
- ARPU climbs to $50–60/month within three months (add-ons: SMS, advanced analytics, email marketing), OR
- You compress founder time to $1,000 total for 10 customers (means you're recruiting *only* from warm network, not doing real sales).

---

## 3. RUNWAY COST TO VALIDATE THIS IDEA

**4 weeks. $8,000 burn.**

What "validate" means here:
- Week 1: Recruit and onboard 5 customers. They each upload 10–20 products, run it for 7 days, get 3–5 orders each. Real money changes hands.
- Week 2–3: Run the shop live. Collect feedback on product upload friction, checkout experience, order management. Fix the most vocal complaint.
- Week 4: Review cohort data. Do the 5 customers want to keep running it? Have you heard *unprompted* feature requests? (Not "it would be nice if," but "I can't live without.") Do the unit economics hold if you compress sales work?

Burn:
- **Your time (you + 1 engineer):** ~80 hours combined @ $50/hour loaded. = $4,000.
- **Infrastructure:** $500 (Vercel, database, Stripe processing on small volumes).
- **Unallocated overhead (ops, finance review, CEO sync):** $1,000.
- **Buffer for unexpected:** $1,500.

**Total: ~$7,000–8,000.**

That eats 1.2 weeks of current runway (6.5 months = 156 days of burn at current ~$55k/month). Acceptable only if you close at least 2 paying customers by day 28.

---

## 4. THE SINGLE NUMBER THAT HAS TO BE TRUE

**At least 4 out of 5 customers (80%+) must still be active and paying on day 28.**

Why this one number:
- If 3 or fewer stay, your churn is >40% in the first month. Unit economics are dead. Payback becomes 20+ months. We stop.
- If 4 stay, you have signal that the problem is real, the solution works for *someone*, and you can talk to those 4 about ARPU expansion (do they want to add paid email? SMS? Bulk discount codes?).
- At 4/5 retention, your cohort ARR potential is $29 × 4 × 12 = $1,392. You've proven the core unit works. Now you test if you can recruit faster (less founder time per customer).

This is not "we hope," this is the literal stopping point. If 3 customers churn by day 28, we kill this and move to the next idea.

---

## WHAT I'M STILL CONCERNED ABOUT

Founder time to recruit is doing a lot of work in that CAC math. If you can't get 5 customers to say yes in week one from warm outreach, this breaks immediately. You need to commit *right now* to exactly where those 5 come from: specific Reddit communities, specific Discord servers, specific personal network. Not "we'll find them." Specific names and communities by EOD today.

Second concern (older flag, still live): unit economics at $29/month only survive if ARPU grows or churn stays <5% MoM. Single-tenant platforms are graveyard products—people build once, upload once, then stop touching them. If your first 5 customers are dormant by week 3, you've proven the model doesn't work at all, not that you just need to sell better. I want to see activity metrics (orders processed, login frequency, cart abandonment rate) tracked from day one, not assumed to be good.

---

## DECISION

**GREEN LIGHT. Ship it.**

Four weeks, $8k, one hard number (80% retention by day 28). Go recruit those 5 customers today. If you don't have 5 named targets by tomorrow morning, stop and tell me why so we can adjust.
