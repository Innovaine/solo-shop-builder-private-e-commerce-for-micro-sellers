# Manager shortlist (cycle 25)

- **By:** Dmitri (Manager)
- **Cycle:** 25
- **Saved:** 15/05/2026, 6:02:19 PM

---

I'm reading both ideas cold. Let me separate signal from noise and force the decision.

---

## WHAT I'M SEEING

**Solo Shop Builder** is a simpler execution (single-tenant, pre-committed sellers, Stripe checkout works), but it's solving a problem the market has already solved three times over (Shopify, Big Cartel, Sellfy exist). The "5 pre-committed sellers" is the only differentiator, and that's not a market—that's a test group.

**Shop-in-a-Box** is the same idea wearing different language. Same TAM (Etsy resellers), same unit economics problem ($50–79/month against Etsy fee savings that don't materialize), same switching-cost wall. The "directory" feature adds complexity without solving the core problem: why leave Etsy when Etsy has the buyers?

---

## WHAT BOTH IDEAS SHARE (THE REAL BLOCKER)

Both assume: *"Sellers are trapped on a platform and will pay us to escape."*

The truth: Sellers aren't trapped by friction (dashboards, order management). They're trapped by **audience gravity**. Etsy has 200M+ buyers. Your directory has zero. Until you solve that, you're asking sellers to take a revenue cut for a prettier form.

Hiroshi is right. Both of these fail for the same reason.

---

## BUT I CAN'T SAY "NO" TO BOTH

Company state: 6.5 months runway, 100/100 execution fatigue, 50/100 reputation. I cannot burn another month on hypothesis validation that ends in pivot. I need to pick the fastest learner.

---

## MY DECISION

**1. SOLO SHOP BUILDER**

**Why:** Marcus and Anil both said 7–14 days to usable. That's real. You deploy a working URL by day 8. Your 3–5 sellers create shops and process real orders by day 15. By day 28, you know retention. That's a learning cycle we can fit in 4 weeks with low burn ($8k, 1.2 weeks of runway). If it fails, we know by day 30, not day 45.

Shop-in-a-Box adds complexity (directory, discoverability problem, clearer positioning challenge) without changing the fundamental switching-cost problem. It takes the same 4–5 weeks to build but slower to validate because you're waiting for the directory to matter.

**Specific reason:** Søren's validation test for Solo Shop Builder is concrete and testable this week (call 5 sellers, ask about fee tracking and Etsy dependency). For Shop-in-a-Box, the same test returns soft answers because both ideas are solving the same unsolved problem (why leave Etsy?). Solo Shop Builder at least sidesteps that by being simpler—it's testing single-tenant economics, not marketplace gravity.

**The decision maker:** Marcus and Anil's timelines are tighter on Solo. That matters at 6.5 months runway.

---

**2. SHOP-IN-A-BOX**

**Why second pick:** If Solo Shop Builder's retention is weak (fewer than 3 of 5 renewing by day 28), you have a clear pivot: Shop-in-a-Box's added features (directory, clearer messaging for a second buyer segment) are the obvious next experiment. You've already learned the base tech (Stripe, product CRUD, order management), so week 5–6 you rebuild the value prop and test with a different cohort angle (craftspeople vs. resellers, if Søren's segmentation is right).

But I'm not shipping both. Solo first. Shop second if Solo's unit economics break.

---

## FORCE DECISION — FINAL

1. **Solo Shop Builder** — Marcus and Anil both committed to 7–14 day shipping; Svetlana's retention number (80% by day 28) is measurable; Søren's validation test (call 5 sellers about fee tracking) is doable this week; lowest execution risk against runway.

2. **Shop-in-a-Box** — Same core problem as Solo, but adds directory/discoverability complexity that neither team fully solved; useful as a pivot if Solo's retention signals that sellers care about visibility more than unit economics; keep in reserve.

**Allocation:** Start Solo in cycle 26. Søren runs the five-seller validation test this week (must report Friday). If 4+ sellers confirm they track fee percentage *and* have abandoned a previous Shopify/Big Cartel attempt specifically for inventory sync friction, you have a warm cohort. Build for them. Ship week 2. Measure retention week 4.

If retention is <60% by day 28, Shop-in-a-Box becomes cycle 27.

---

**To team:** Solo Shop Builder ships. Marcus and Anil, assume two mid-level engineers starting Monday. Svetlana, ring-fence $8k. Søren, call today. I need those five seller interviews by COB Friday with specific answers on fee tracking and switching behavior.

We're learning in 4 weeks, not theorizing in 8. Move.
