# CEO Demo Script — Solo Shop Builder

**Duration:** 8–10 minutes  
**Audience:** Investor, Board, Internal Stakeholders  
**Goal:** Show real seller → customer flow with zero friction

---

## Opening Statement (30 seconds)

"Solo Shop Builder solves a real problem: Etsy sellers pay 6.5% fees on every order. A seller doing $50K annual revenue loses $3,250 to fees. We're building the marketplace alternative — a single-tenant shop where sellers pay a fixed $20–30/month subscription with zero GMV fees. Just Stripe fees pass through.

Today I'm going to show you the complete flow — from a seller signing up, listing a product, receiving a customer order, and tracking it — all in under 10 minutes."

---

## PART 1: Seller Signup (1 minute)

### Narration:
"First, the seller experience. They land on our homepage and click 'Start Selling Today.'

We use email magic links — no password to remember. They enter their email, check their inbox, click the link, and boom — they're logged in. No friction."

### Demo Actions:
1. **Open `/auth/signup`** — Show the signup form
2. **Enter test email** — `seller@etsy-refugee.com`
3. **Click "Send Magic Link"**
4. **Show success state** — "Check your email" message
5. **Mention:** "This is faster than password reset. No password manager needed."

### Timing: 60 seconds

---

## PART 2: Shop Creation (1.5 minutes)

### Narration:
"After they verify, they land on shop creation. They enter a shop name — let's call it 'Vintage Finds by Alex' — and our system auto-generates a slug: `vintage-finds-by-alex`. In seconds, their shop is live at `/shop/vintage-finds-by-alex`."

### Demo Actions:
1. **Open `/dashboard/create-shop`** — Show the form
2. **Enter shop name** — "Vintage Finds by Alex"
3. **Show slug preview** — "vintage-finds-by-alex" (auto-generated)
4. **Enter description** — "Curated vintage clothing and accessories"
5. **Click "Create Shop"**
6. **Transition to dashboard** — Show empty shop state

### Timing: 90 seconds

### Key Point:
"This is the moment their business goes live. They have a branded URL they can share immediately."

---

## PART 3: Upload First Product (2 minutes)

### Narration:
"Now they add their first product. They click 'Add Product' and upload a title, price, description, and image. The image gets auto-resized and optimized for the web. Categories are assigned with one dropdown."

### Demo Actions:
1. **Open `/dashboard/products/new`** — Show product creation form
2. **Enter product details:**
   - Title: "1990s Denim Jacket"
   - Price: "$45.00"
   - Description: "Classic blue denim, size M, mint condition"
   - Category: "Vintage"
3. **Upload image** — Drag-drop visual, show preview
4. **Click "Publish Product"**
5. **Show product list** — Product appears instantly

### Timing: 120 seconds

### Key Point:
"From signup to live product: ~4 minutes. They're ready to take orders."

---

## PART 4: Public Storefront (1 minute)

### Narration:
"Now let's switch to the customer side. They visit the seller's public shop — no login required. They see the product grid, can filter by category, and add items to cart."

### Demo Actions:
1. **Open `/shop/vintage-finds-by-alex`** — Show storefront
2. **Show product grid** — Denim jacket visible
3. **Click filter: "Vintage"** — Show category filtering works
4. **Click "Add to Cart"** — Show cart update in header
5. **Add a second product** (if available) — Show cart count increment

### Timing: 60 seconds

### Key Point:
"Customers don't need an account. Their cart is saved in their browser. Frictionless."

---

## PART 5: Checkout & Payment (2 minutes)

### Narration:
"They proceed to checkout. We use Stripe Checkout — industry standard, PCI-compliant, trusted by everyone. Card details are never stored on our servers. Payment succeeds, and both parties are notified instantly."

### Demo Actions:
1. **Open `/checkout`** — Show order summary
2. **Show cart items** — Denim jacket, total $45.00
3. **Show Stripe Checkout button** — "Continue to Payment"
4. **Explain:** "This redirects to Stripe. We don't see their card. Stripe handles everything."
5. **Simulate payment success** — Show order confirmation page
6. **Copy order ID** — "Their order is now in the system."

### Timing: 120 seconds

### Key Point:
"Zero security liability for us. Stripe handles PCI compliance. We only touch order metadata."

---

## PART 6: Seller Order Dashboard (1.5 minutes)

### Narration:
"Back to the seller. The order appears instantly in their dashboard. They see customer email, items, total, and payment status. They can mark it as 'Paid' → 'In Progress' → 'Shipped' with a dropdown."

### Demo Actions:
1. **Open `/dashboard/orders`** — Show order table
2. **Find the order** — "Order #12345 from customer"
3. **Show order details** — Customer email, items, $45.00
4. **Click status dropdown** — Change from "Pending" to "In Progress"
5. **Show save** — Status updates instantly
6. **Explain:** "One click. No spreadsheets. No manual work."

### Timing: 90 seconds

### Key Point:
"This is the core loop. Simple, visual, no clutter."

---

## PART 7: Tracking ID & Customer Notification (1.5 minutes)

### Narration:
"They pack the item and add a tracking number. Instantly, the customer gets an email with a tracking link. No login required — the customer just clicks and sees the shipping status."

### Demo Actions:
1. **Still in dashboard** — Show "Tracking ID" field (empty)
2. **Enter tracking number** — "USPS 9400111899223456"
3. **Click "Save"**
4. **Show email template** — "Order Shipped" email preview
5. **Open tracking link** (as customer) — `/track/[orderId]`
6. **Show tracking page** — Status timeline, shipping info, no login needed

### Timing: 90 seconds

### Key Point:
"The customer sees exactly where their order is without creating an account. This is the moment they feel the service is professional."

---

## PART 8: Addressing Key Concerns (1 minute)

### Narration:
"Three things that make this defensible:

**1. Speed:** Seller signup to live shop in 4 minutes. No setup fee, no approval queue.

**2. Price:** $20–30/month vs. 6.5% marketplace fees. Pays for itself on $350 monthly revenue.

**3. Control:** Sellers own their customer email list. No platform lock-in. They can export orders, customers, and analytics anytime."

### Demo Actions:
1. **Show `/dashboard/orders/export`** — CSV export button
2. **Mention:** "They own this data. We're the infrastructure, not the landlord."

### Timing: 60 seconds

---

## Closing (30 seconds)

### Narration:
"That's the loop. A seller who would spend an hour setting up Shopify and $6.50 per order in fees is live and profitable in minutes. Our unit economics: seller pays $20/month, we pay ~$3/month in infrastructure. At 100 sellers, that's $1,700/month profit. At 1,000 sellers, $17K/month. The math is simple.

We're 45 days in, 37 features callable and production-ready. Ready to beta test with real sellers next week."

---

## Post-Demo Q&A Talking Points

**"Why not just use Shopify?"**  
> Shopify is $29/month + 2.9% + $0.30. We're $20/month with no GMV fees. Plus, setup takes days. We take minutes.

**"What about payment processing security?"**  
> We use Stripe Checkout. PCI compliance is Stripe's responsibility. We never touch card data.

**"How do you compete with Etsy's audience?"**  
> We don't. We're not a marketplace. Sellers bring their own audience (Instagram, TikTok, email list). We're infrastructure.

**"What's the churn risk?"**  
> Sellers export their data anytime (orders, customers, emails). Low switching cost keeps us honest. We win by being better, not by locking them in.

**"Can sellers sync to multiple channels?"**  
> Not in MVP. But our API lets developers (via Zapier/Make) auto-sync orders to Google Sheets, Slack, email. Roadmap includes Etsy/Shopify inventory sync.

---

## Design System Notes

**All pages follow the brand:**
- **Primary color:** Dark blue (`#3B4C63`) — trust, professionalism
- **Accent:** Green (`#10B981`) — growth, action
- **Typography:** System fonts (SF Pro, Segoe UI, Roboto) — no web fonts, fast load
- **Responsive:** All flows tested on mobile (320px) and desktop (1440px)
- **Accessibility:** WCAG 2.1 AA — focus states, heading hierarchy, semantic HTML

---

## Files Referenced in This Demo

| Step | Design Page | Status |
|------|-------------|--------|
| Seller Signup | `/design/pages/signup.html` | ✅ Ready |
| Email Verify | `/design/pages/verify.html` | ✅ Ready |
| Shop Creation | `/design/pages/create-shop.html` | ✅ Ready |
| Product Upload | `/design/pages/product-create.html` | ✅ Ready |
| Storefront | `/design/pages/storefront.html` | ✅ Ready |
| Checkout | `/design/pages/checkout.html` | ✅ Ready |
| Order Dashboard | `/design/pages/dashboard.html` | ✅ Ready |
| Tracking Page | `/design/pages/order-tracking.html` | ✅ Ready |
| Order Email | `/design/emails/order-confirmation.html` | ✅ Ready |

---

## Demo Checklist

- [ ] All containers running (`docker-compose ps`)
- [ ] Signup flow wired to email magic link
- [ ] Shop creation creates slug and publishes live
- [ ] Product upload stores image and displays in storefront
- [ ] Storefront loads public shop at `/shop/[slug]`
- [ ] Checkout redirects to Stripe (or test mode)
- [ ] Order created on Stripe webhook (`payment_intent.succeeded`)
- [ ] Order appears in seller dashboard
- [ ] Status updates propagate without page refresh
- [ ] Tracking link generates public URL
- [ ] Confirmation emails sent (check Mailbox or test env)

---

## Timing Guide

- **Intro:** 30 seconds
- **Part 1 (Signup):** 60 seconds
- **Part 2 (Shop):** 90 seconds
- **Part 3 (Product):** 120 seconds
- **Part 4 (Storefront):** 60 seconds
- **Part 5 (Checkout):** 120 seconds
- **Part 6 (Order Dashboard):** 90 seconds
- **Part 7 (Tracking):** 90 seconds
- **Part 8 (Key Points):** 60 seconds
- **Closing:** 30 seconds
- **Q&A:** 5+ minutes (flexible)

**Total:** ~9 minutes scripted, + Q&A
