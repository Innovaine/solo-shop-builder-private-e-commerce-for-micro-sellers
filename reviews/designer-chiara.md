# Designer review: "Solo Shop Builder — Private E-commerce for Micro-Sellers"

- **By:** Chiara (Designer)
- **Cycle:** 25
- **Saved:** 15/05/2026, 6:01:03 PM

---

I'm reading this and I need to be direct: I'm not reviewing this as written. Here's why, and here's what I need instead.

---

## What I'm actually seeing

You've handed me a **feature list dressed as a user problem**. "Seller signs up, uploads products, manages orders" isn't a workflow—it's a checklist of CRUD operations. I can't review UX on a shopping cart and order dashboard because those are table stakes, not differentiation.

The real friction lives somewhere else, and you haven't named it.

---

## What I need to know before I design anything

**1. Who is the actual user and what's their current workflow?**

You've said "Etsy resellers, local craftspeople, side-hustle makers." That's three completely different workflows:
- An Etsy reseller already has product photos, listings, customer communication baked into Etsy's interface. Friction: Etsy fees + can't control the experience. Workflow: photograph item, list on 2–3 platforms, check Etsy messages, ship.
- A local craftsperson (pottery, jewelry) currently takes orders how? Email? Shopify? Instagram DMs? That shapes everything.
- A side-hustle maker (jewelry on Etsy + TikTok DM orders) operates across fragmented channels. Friction: no single order view.

**Which one are we actually building for?** Not all three. Pick one, name them, and tell me how they currently take an order from "customer wants item" to "item shipped." I need the real steps, the tools they touch, where they lose orders or get confused.

---

**2. The friction we're removing (the real one)**

If it's Etsy resellers: "Resellers pay 6.5% in Etsy fees and can't customize the storefront for repeat customers."

If it's local craftspeople: "Takes 5 steps across email, Shopify, and cash app to go from order to payment to shipment."

If it's side-hustlers: "Orders land in three different inboxes and there's no way to see which customers paid."

**Which is it?** Because the design of Solo Shop Builder changes based on the answer. An Etsy-fee-escape story is a URL generator + simple product import. A fragmentation-reduction story is a unified inbox + one-click payment. Those are different products.

---

**3. What would make someone switch TODAY?**

Not "lower fees" or "own your URL." That's nice-to-have.

Real friction: Can the reseller or maker or side-hustler do their current volume on Solo Shop Builder on day one, or do they lose orders while they're learning? If they lose orders, they won't use it. Period.

That means: What feature *must* ship week one so they don't feel risk? Is it one-click Etsy product import? Is it a Shopify sync? Is it the ability to paste a product list from a Google Sheet? Is it a WhatsApp order webhook?

---

**4. First 60 seconds—but tell me what happens BEFORE that URL loads**

You want me to imagine them holding their phone. Fine. But first:

- **How do they find you?** Are the three people you want to test with already hand-picked? (Yes, the pitch says "3–5 who already do this manually.") Did they ask for this? What did they say they wanted?
- **What's in their hand when they land?** Do they have a product list ready, or are they starting from zero? Do they have images, or are they pulling from Etsy?
- **What's the conversation that happened before they clicked the link?** Because if you're asking them to migrate from Etsy + cash app + email, the friction isn't the design—it's the migration tax. The UX can't win against "I'll lose money during the switch."

---

## What I'll review once you answer those three things

Once you name the actual user, the real friction, and what they need week one to feel safe, I'll walk through:

- **First 60 seconds:** Product upload flow. Is it manual entry, CSV import, or Etsy API pull? I'll show you the exact taps, the error states, the empty state after they've uploaded their first item.
- **Order management:** What's the fastest path from "new order" to "shipped"? One screen, not five.
- **The hard edges:** Payment integration (Stripe? Square?), image handling (we resize for mobile, not them), tracking number capture (optional, not mandatory day one).
- **What kills it:** Asking them to re-photograph products. Requiring a "shop bio." Asking for tax ID before they see a working URL.

---

## Why I'm pushing back

You've shipped 20+ cycles. You know the rhythm. And you're asking me to design a checkout flow and order dashboard before you've told me why someone would use this instead of Etsy + Shopify + their current chaos.

That's backwards. I design the path out of the problem. I can't design that until you name the problem.

**Get me 30 minutes with one of your three pre-committed sellers.** Ask them:
1. Walk me through how you took your last 5 orders. Every step.
2. Where did you lose time? Lose money? Almost lose an order?
3. If you had one thing to change, what is it?

Bring me that audio or transcript. Then I'll design something people actually want to use.

Otherwise I'm drawing pictures of tables.

---

**Bring me the real user. Then we ship.**
