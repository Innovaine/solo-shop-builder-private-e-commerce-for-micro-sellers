# Stripe Webhooks Integration — Payment Processing & Order Creation

**Provider:** Stripe
**Purpose:** Process payment events and automatically create orders when checkout completes
**Features Used:** F9 (Stripe Checkout), F10 (Webhook order creation), F15 (Seller email), F16 (Customer email)
**Sandbox:** Yes — use Stripe test mode credentials

---

## Overview

Solo Shop Builder uses Stripe Webhooks to receive real-time notifications when payments are completed. When a customer checks out via Stripe Checkout, Stripe sends a `checkout.session.completed` webhook event to our server, which triggers:

1. **Order creation** in our database with customer details and line items
2. **Inventory decrement** (atomic stock reduction to prevent overselling)
3. **Email notifications** to both seller and customer
4. **Audit trail** logging all webhook events

**Security:** All webhooks are verified using HMAC signature validation (Stripe webhook secret) to prevent spoofing.

---

## Configuration

### Environment Variables

Add these to `.env` (already present in `.env.example`):

```bash
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY="pk_test_..."  # For frontend checkout
STRIPE_SECRET_KEY="sk_test_..."       # For server-side API calls
STRIPE_WEBHOOK_SECRET="whsec_test_..." # For webhook signature verification

# App URL (needed for tracking links in emails)
APP_URL="https://www.soloshopbox.com"
```

### Stripe Dashboard Setup

1. **Create Stripe account** (or use existing test account)
   - Sign up at https://stripe.com
   - Switch to **Test Mode** (toggle in top-right)

2. **Get API keys:**
   - Navigate to: Developers → API keys
   - Copy **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`

3. **Configure webhook endpoint:**
   - Navigate to: Developers → Webhooks
   - Click **Add endpoint**
   - Endpoint URL: `https://www.soloshopbox.com/api/webhooks/stripe`
   - Select events to listen for:
     - `checkout.session.completed` ✅ (required)
     - `payment_intent.succeeded` ✅ (logged)
     - `payment_intent.payment_failed` ✅ (logged)
   - Click **Add endpoint**
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

4. **Test webhook delivery:**
   - In webhook details page, click **Send test webhook**
   - Choose `checkout.session.completed`
   - Verify response status is `200 OK`

---

## 🧪 Sandbox / Test Credentials

**Mode:** Stripe Test Mode

**Test API keys** (already in `.env`):
```bash
STRIPE_PUBLISHABLE_KEY="pk_test_51ABC123..."
STRIPE_SECRET_KEY="sk_test_51ABC123..."
STRIPE_WEBHOOK_SECRET="whsec_test_xyz789..."
```

**Test card numbers:**
- **Success:** `4242 4242 4242 4242` (any future expiry, any CVC)
- **Decline:** `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`
- **3D Secure required:** `4000 0025 0000 3155`

**Test flow:**
1. Add product to cart on a test shop
2. Go to checkout
3. Click "Pay with Stripe"
4. Enter test card: `4242 4242 4242 4242`, expiry `12/34`, CVC `123`
5. Submit payment
6. Verify order appears in `/dashboard/orders`
7. Check seller receives email confirmation

---

## How It Works

### Payment Flow

```
Customer → Checkout Page → Stripe Checkout (hosted) → Payment success
                                                            ↓
                                               Stripe sends webhook
                                                            ↓
                                          POST /api/webhooks/stripe
                                                            ↓
                                    [Signature verification (HMAC)]
                                                            ↓
                                         [Create order + decrement stock]
                                                            ↓
                                    [Send email to seller & customer]
                                                            ↓
                                           Return 200 OK to Stripe
```

### Webhook Processing Steps

1. **Receive webhook:**
   - Stripe POSTs JSON event to `/api/webhooks/stripe`
   - Includes `stripe-signature` header for HMAC validation

2. **Verify signature (NFR-6):**
   - Extract signature from header
   - Use `stripe.webhooks.constructEvent()` to validate
   - Reject if signature is invalid (prevents spoofed webhooks)

3. **Log to audit trail (NFR-17):**
   - Save webhook event to `webhooks` table
   - Fields: `stripeEventId`, `eventType`, `payload`, `status`, `processedAt`
   - Status: `pending` → `processed` or `failed`

4. **Handle event type:**
   - `checkout.session.completed`:
     - Extract `shopId` and `cartItems` from metadata
     - Retrieve full session with line items
     - Check for duplicate order (idempotency via `stripePaymentId`)
     - **Transaction:** Validate stock → Create order → Decrement stock
     - Send confirmation emails to seller and customer
   - `payment_intent.succeeded`: Log only (order already created)
   - `payment_intent.payment_failed`: Log error

5. **Return response:**
   - `200 OK` → Stripe stops retrying
   - `400/500` → Stripe retries with exponential backoff (up to 3 days)

---

## Implementation Files

### `app/api/webhooks/stripe/route.ts` — Webhook handler

**Route:** `POST /api/webhooks/stripe`

**Headers required:**
- `stripe-signature` (HMAC signature from Stripe)

**Request body:** Raw JSON event from Stripe (don't parse as JSON manually — pass raw body to `constructEvent`)

**Response (success):**
```json
{
  "received": true
}
```

**Response (error):**
```json
{
  "error": "Webhook Error: Invalid signature"
}
```

**Features:**
- ✅ Signature verification using `stripe.webhooks.constructEvent()`
- ✅ Idempotency check (don't create duplicate orders)
- ✅ Atomic stock decrement (transaction ensures consistency)
- ✅ Email notifications (seller + customer)
- ✅ Audit trail (all events logged to `webhooks` table)
- ✅ Error handling (failed webhooks logged, don't crash)

### Database Schema

**`Webhook` model:**
```prisma
model Webhook {
  id             String   @id @default(cuid())
  stripeEventId  String   @unique
  eventType      String
  payload        String   // JSON
  status         String   // "pending" | "processed" | "failed"
  processedAt    DateTime?
  createdAt      DateTime @default(now())
}
```

**`Order` model:**
```prisma
model Order {
  id                String   @id @default(cuid())
  shopId            String
  customerEmail     String
  customerName      String?
  status            String   // "paid" | "in-progress" | "shipped" | "delivered"
  total             Int      // in cents
  stripePaymentId   String   @unique  // Idempotency key
  createdAt         DateTime @default(now())
  items             OrderItem[]
  shop              Shop     @relation(fields: [shopId], references: [id])
}
```

---

## Security & Access Control

### Signature Verification (NFR-6)
- **Why:** Prevents attackers from spoofing webhook events (e.g., creating fake "paid" orders)
- **How:** Stripe signs each webhook with HMAC-SHA256 using the webhook secret
- **Validation:** `stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)` throws if invalid

### Idempotency (NFR-25)
- **Why:** Stripe may retry webhooks if it doesn't receive 200 OK (network issues, server restarts)
- **How:** Check if order with same `stripePaymentId` already exists before creating
- **Result:** Duplicate webhook events don't create duplicate orders

### Audit Trail (NFR-17)
- **Why:** Compliance, debugging payment issues, dispute resolution
- **How:** Every webhook event logged to `webhooks` table with full payload
- **Retention:** Forever (never delete webhook logs)

---

## Atomic Stock Management

**Problem:** Customer checks out 2 units, but only 1 in stock. Without atomicity:
- Order created (success)
- Stock decrement fails (negative stock)
- Seller ships non-existent item

**Solution:** Prisma transaction wraps both operations:
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Validate stock availability for ALL items
  for (const item of cartItems) {
    const variant = await tx.productVariant.findUnique(...)
    if (variant.stock < item.quantity) {
      throw new Error('Insufficient stock')
    }
  }

  // 2. Create order (only if all stock checks passed)
  const order = await tx.order.create(...)

  // 3. Atomically decrement stock
  for (const item of cartItems) {
    await tx.productVariant.update({
      data: { stock: { decrement: item.quantity } }
    })
  }

  return order
})
```

**Result:** Either all succeed, or all rollback. No partial state.

---

## Email Notifications

### Seller Email (F15)
**Trigger:** Order created from webhook  
**To:** `shop.seller.email`  
**Subject:** `New Order #{orderId} - {shopName}`  
**Content:**
- Order ID
- Customer name/email
- Line items (title, quantity, price)
- Total amount
- Link to `/dashboard/orders`

### Customer Email (F16)
**Trigger:** Order created from webhook  
**To:** `session.customer_email`  
**Subject:** `Order Confirmation - {shopName}`  
**Content:**
- Custom template body (if seller configured via `/dashboard/email-template`)
- Order summary (items, total)
- Tracking link: `{APP_URL}/track/{orderId}`
- Shop name and branding

**Template customization:**
- Seller can edit email body via `/dashboard/email-template`
- Saved in `shop.emailTemplateBody` field
- Falls back to default template if not customized

---

## Event Types

| Event | Description | Action |
|---|---|---|
| `checkout.session.completed` | Customer completed payment | Create order, decrement stock, send emails |
| `payment_intent.succeeded` | Payment processed successfully | Log only (order already created) |
| `payment_intent.payment_failed` | Payment failed (card declined, etc.) | Log error (TODO: update order status if exists) |

**Note:** We use `checkout.session.completed` as the primary trigger because it fires AFTER payment is confirmed, and includes customer email and metadata.

---

## Testing

### Local Testing with Stripe CLI

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   # or download from https://stripe.com/docs/stripe-cli
   ```

2. **Login:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy webhook signing secret:**
   ```
   > Ready! Your webhook signing secret is whsec_test_xyz123...
   ```
   Update `.env`: `STRIPE_WEBHOOK_SECRET="whsec_test_xyz123..."`

5. **Trigger test event:**
   ```bash
   stripe trigger checkout.session.completed
   ```

6. **Verify in console:**
   - Check server logs: "Order created: {orderId}"
   - Check database: new order in `orders` table
   - Check emails: confirmation sent

### Production Testing

1. **Use Stripe Dashboard:**
   - Webhooks → Select endpoint → Send test webhook
   - Choose `checkout.session.completed`
   - Verify 200 OK response

2. **Real checkout flow:**
   - Create test product
   - Add to cart
   - Checkout with test card `4242...`
   - Verify order created

---

## Monitoring & Logs

### Stripe Dashboard
- **Webhook logs:** Developers → Webhooks → {endpoint} → Attempts tab
- Shows: Request body, response code, retry attempts
- Red = failed, Green = succeeded

### Application Logs
```typescript
console.log(`Order created: ${order.id} for shop ${shopId}`)
console.log(`Order confirmation emails sent for order ${order.id}`)
console.error('Webhook signature verification failed:', err.message)
```

### Database Audit
Query `webhooks` table for failed events:
```sql
SELECT * FROM "Webhook" WHERE status = 'failed' ORDER BY "createdAt" DESC;
```

---

## Troubleshooting

### "Webhook Error: Invalid signature"
**Cause:** `STRIPE_WEBHOOK_SECRET` doesn't match actual webhook secret  
**Fix:** Re-copy signing secret from Stripe Dashboard → Webhooks → {endpoint}

### "Order already exists for payment_intent..."
**Cause:** Duplicate webhook delivery (Stripe retry)  
**Fix:** This is expected! Idempotency check prevents duplicate orders. Return 200 OK.

### Webhook never fires
**Cause:** Endpoint URL incorrect or not accessible  
**Fix:**
- Verify endpoint URL in Stripe Dashboard matches production domain
- Check server is running and reachable from internet
- Test with `curl -X POST https://www.soloshopbox.com/api/webhooks/stripe`

### Stock not decremented
**Cause:** Transaction failed (stock validation error)  
**Fix:** Check server logs for "Insufficient stock" error. Increase product stock.

### Emails not sent
**Cause:** SMTP credentials not configured  
**Fix:** Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in `.env` (see lib/email.ts)

---

## Retry Behavior

Stripe retries failed webhooks automatically:
- **Schedule:** Exponential backoff (1 hour, 2 hours, 4 hours, ..., up to 3 days)
- **Max attempts:** ~72 attempts over 3 days
- **Stop retrying if:** Response is `200 OK`
- **Disable endpoint if:** All attempts fail for 7 days

**Best practice:** Always return `200 OK`, even if internal processing fails (log error, don't crash webhook handler).

---

## Next Steps

1. ✅ Webhook endpoint implemented with signature verification
2. ✅ Order creation with stock decrement (atomic)
3. ✅ Email notifications (seller + customer)
4. ✅ Audit trail (webhook logs)
5. ⏳ Handle `payment_intent.payment_failed` (update order status)
6. ⏳ Add webhook retry dashboard (show failed events to seller)
7. ⏳ Implement refund webhook handler (`charge.refunded`)

---

**Last updated:** Day 86  
**Owner:** Anil (Engineer)  
**Status:** ✅ Production-ready (test mode verified)
