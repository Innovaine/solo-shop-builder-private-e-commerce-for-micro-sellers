# Myfatoorah
> **Kind:** `text`
> **Last refreshed:** 2026-05-16T16:34:29.301Z
## Owner notes

Along side stripe add my fatoorah integration 

Note that it will send url to put card details

Add my Fatoorah key in env 

## 🧪 Sandbox / test credentials

> Owner-provided test card numbers, sandbox API keys, sandbox endpoints, test OTPs, etc. Use these for integration testing — never production data.

```
8888880000000001 09/30 pin-1234 captured

8888880000000001 06/10 pin-1234 not-captured
```

## Docs

MyFatoorah Integration — Engineering Spec
Status: MyFatoorah is partially implemented. This spec describes the correct end state. Sections marked [BUG — FIX THIS] describe code that exists today but is wrong. Do not rebuild working parts from scratch — fix the specific defects called out below.

1. Goal
Add MyFatoorah alongside Stripe as a second payment provider on /checkout. The customer picks "MyFatoorah" on the checkout page, is redirected to a MyFatoorah-hosted payment page, completes payment, and returns to /checkout/success with the order recorded as paid in the database — with the correct customer email attached.
Stripe is the reference implementation. When in doubt, do exactly what the Stripe route does. The MyFatoorah route should mirror it, not diverge from it.

2. Environment variables
The code references these. Values are set per-server and are not your concern:
* MYFATOORAH_API_KEY — Bearer token for the MyFatoorah API.
* MYFATOORAH_API_URL — base URL. Sandbox: https://apitest.myfatoorah.com.
* MYFATOORAH_WEBHOOK_SECRET — secret used to verify the server-to-server webhook signature (see §8).
Rule: read every process.env.* value inside the request handler at runtime, never at module scope. Module-scope reads get frozen into the build and break when the server's env changes. (Same rule that bit the Stripe/S3 integrations.)

3. API version
Always use the /v3/ endpoints:
* POST /v3/payments — create a payment, returns a PaymentURL.
* GET /v3/payments/{paymentId} — inquire payment status after the customer returns.

4. The data flow (end to end)
Customer on /checkout
   │  picks "MyFatoorah", enters email
   ▼
POST /api/checkout/myfatoorah        ← our route
   │  1. validate shop + items + prices
   │  2. create pending Order (status='pending', customerEmail = the form email)
   │  3. POST /v3/payments to MyFatoorah  (with Customer.Email + UserDefinedField)
   │  4. store returned InvoiceId on the Order
   │  5. return PaymentURL to the browser
   ▼
Browser redirects to MyFatoorah hosted page → customer pays
   │
   ├─(A) browser GET redirect → /api/checkout/myfatoorah/callback?paymentId=...
   └─(B) server POST webhook  → /api/checkout/myfatoorah/callback
   │
   ▼
callback handler
   │  1. (POST only) verify webhook signature → 401 if invalid
   │  2. GET /v3/payments/{paymentId}  → inquire real status
   │  3. find our Order by Invoice.Id OR UserDefinedField
   │  4. if already 'paid' → stop (idempotent)
   │  5. update Order: status='paid', fill customerEmail/name, decrement stock
   │  6. send confirmation email ONCE
   │  7. (GET) redirect to /checkout/success ; (POST) return 200

5. Create payment — POST /api/checkout/myfatoorah
5.1 Request our route accepts
The checkout page (app/checkout/page.tsx) already sends this body for both providers:
{ "shopSlug": "...", "items": [...], "customerEmail": "buyer@example.com" }
5.2 [BUG — FIX THIS] The route drops customerEmail
Today app/api/checkout/myfatoorah/route.ts destructures only:
const { shopSlug, items } = await req.json()   // ← customerEmail is thrown away
The Stripe route (app/api/checkout/route.ts) correctly reads { items, shopSlug, customerEmail }. That single missing field is why no email is ever saved on a MyFatoorah order. Fix:
const { shopSlug, items, customerEmail } = await req.json()
5.3 Create the pending order WITH the email
Today the pending order is created with customerEmail: ''. It must be created with the real email from the form:
const pendingOrder = await prisma.order.create({
  data: {
    shopId: shop.id,
    customerEmail: customerEmail || '',   // ← was '' — store the real email
    status: 'pending',
    total,
    metadata: JSON.stringify({ /* shop + items, as today */ }),
  },
})
Do not rely on the callback to "fill the email in later" — MyFatoorah only returns an email if we gave it one. The order must own the email from creation.
5.4 Call POST /v3/payments — and send the Customer object
The current request body has no Customer object, so MyFatoorah never receives the email. Send it:
const res = await fetch(`${apiUrl}/v3/payments`, {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'authorization': `Bearer ${apiKey}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    PaymentMethod: 'CARD',
    Customer: customerEmail ? { Email: customerEmail } : undefined,
    Order: {
      Amount: total / 100,            // total is stored in cents → MyFatoorah wants major units
      UserDefinedField: pendingOrder.id,  // our order UUID — echoed back at inquire time
    },
    IntegrationUrls: {
      Redirection: `${appUrl}/api/checkout/myfatoorah/callback`,
    },
  }),
})
Notes:
* Amount is in major currency units (e.g. 10 = 10.000 KWD), not cents. Solo Shop stores total in cents, so divide by 100. Do not send cents.
* PaymentMethod uses uppercase-with-underscores: CARD, APPLE_PAY, GOOGLE_PAY, KNET, BENEFIT, STC_PAY.
* UserDefinedField must carry our internal order UUID. This is the canonical fallback for finding the order in the callback.
* If paymentResponse.IsSuccess is false or there's no Data.PaymentURL, delete the pending order and return an error (as the code already does).
5.5 Store the InvoiceId
POST /v3/payments returns Data.InvoiceId. Store it on the order as the canonical payment reference (current code stores it in stripePaymentId — acceptable, keep it consistent):
await prisma.order.update({
  where: { id: pendingOrder.id },
  data: { stripePaymentId: invoiceId },   // canonical MyFatoorah reference
})
Return { paymentUrl, invoiceId, orderId } to the browser.

6. Callback / inquire — /api/checkout/myfatoorah/callback
MyFatoorah hits this twice for one payment:
* (A) A browser GET redirect after the customer finishes: ?paymentId=07076148071303658773
* (B) A server-to-server POST webhook (if the webhook is enabled in §8).
Both must run the same handleCallback logic, and it must be safe to run twice (see §7).
6.1 Inquire the real status — never trust the redirect alone
The paymentId in the URL only tells you which payment. You must call:
GET /v3/payments/{paymentId}
and read the inquire response, not the URL, for the actual result.
Treat the payment as successful only if:
invoice.Status === 'PAID' && transaction.Status === 'SUCCESS'
Anything else → redirect to /checkout?error=... with a specific reason (payment_cancelled, payment_expired, payment_declined_*). Do not mark the order paid.
6.2 Finding our order — link by InvoiceId or UserDefinedField, never by paymentId
The paymentId from the redirect URL did not exist at create time and is not stored on any order — looking up by it will never match. Look up by:
1. Data.Invoice.Id from the inquire response (matches the stripePaymentId we stored in §5.5), OR
2. Data.Invoice.UserDefinedField (our order UUID).
const order = await prisma.order.findFirst({
  where: {
    OR: [
      { stripePaymentId: invoice.Id },
      { id: invoice.UserDefinedField || 'no-match' },
    ],
  },
  include: { items: true, shop: true },
})
If no order is found, redirect to /checkout?error=order_not_found and log the invoice id + UserDefinedField.
6.3 Completing the order
When payment is confirmed and the order is found:
const customerEmail = customer?.Email || order.customerEmail || 'unknown@example.com'
const customerName  = customer?.Name  || order.customerName  || 'Anonymous'
Because §5.3 now stores the real email on the order, order.customerEmail is a valid fallback and unknown@example.com should never actually be reached.
Update the order to status: 'paid', fill customerEmail / customerName, persist the MyFatoorah transaction details into metadata, and decrement product/variant stock — the same atomic stock logic the Stripe webhook uses. Wrap the order update + stock decrement in a single prisma.$transaction.
[GAP — IMPLEMENT THIS] Stock is not decremented today. The Stripe webhook validates and decrements stock inside a transaction; the MyFatoorah callback does not. A MyFatoorah sale must decrement inventory exactly like a Stripe sale. Reuse the same logic.

7. Idempotency — the handler MUST be safe to run twice
Because of the GET redirect and the POST webhook, handleCallback runs at least twice per payment. Before any DB write or email send:
if (order.status === 'paid') {
  // already completed by the other delivery — do nothing
  return /* GET: redirect to success | POST: 200 */
}
Consequences if this is missed: duplicate confirmation emails, double stock decrement. The check above is mandatory and must come before the order update, the stock decrement, and the email send.

8. Webhook setup (do this after deploy)
The GET redirect depends on the customer's browser completing the round trip. If they close the tab, the order is stuck pending forever. The server-to-server POST webhook is what makes completion reliable — set it up.
1. MyFatoorah dashboard → Webhook → URL = https://www.soloshopbox.com/api/checkout/myfatoorah/callback
2. The POST handler must verify the signature header before processing anything. On a missing or invalid signature, return 401 and do nothing else.
3. Signature algorithm + exact header name: see https://docs.myfatoorah.com/edit/webhook. The secret is MYFATOORAH_WEBHOOK_SECRET.
[GAP — IMPLEMENT THIS] No signature verification today. The POST handler currently processes unauthenticated requests. Anyone who knows the URL could POST a fake "paid" notification. Signature verification is a hard requirement for the webhook to be safe to enable.

9. Currency
MyFatoorah's base/display currency is set by the account (sandbox examples use KWD). Solo Shop prices and total are in USD cents. Confirm with the server owner which currency the MyFatoorah account is configured for, and either:
* send Order.Currency explicitly to match Solo Shop's pricing, or
* document that the MyFatoorah account currency must equal Solo Shop's currency.
Do not silently let a USD-priced cart settle in KWD.

10. Test cards (sandbox only)
* 8888880000000001 exp 06/30 PIN 1234 — captured (happy path)
* 8888880000000001 exp 06/10 PIN 1234 — declined (failure path)

11. Acceptance criteria
* [ ] customerEmail is read from the checkout request body in app/api/checkout/myfatoorah/route.ts (§5.2).
* [ ] The pending order is created with the real customerEmail, not '' (§5.3).
* [ ] The POST /v3/payments request includes a Customer object carrying the email, and Order.UserDefinedField carries our order UUID (§5.4).
* [ ] Complete a sandbox checkout with the captured card → order status='paid' in the DB.
* [ ] The paid order's customerEmail equals the email typed on /checkout (not unknown@example.com).
* [ ] Product/variant stock is decremented on a MyFatoorah sale, atomically (§6.3).
* [ ] Confirmation email is sent exactly once — verify by letting the GET redirect AND the POST webhook both fire for the same payment (§7).
* [ ] The declined card (06/10) redirects to /checkout?error=payment_declined_* and leaves the order not paid.
* [ ] Close the browser tab before the redirect → the POST webhook still flips the order to paid (§8).
* [ ] The POST handler returns 401 on a missing or invalid webhook signature and processes nothing (§8).

12. Common mistakes — do NOT do these
* ❌ Reading process.env.MYFATOORAH_* at module scope. Read it at runtime.
* ❌ Looking up the order by the paymentId from the redirect URL. It never matches. Use Invoice.Id or UserDefinedField.
* ❌ Trusting the redirect URL to mean "paid". Always inquire GET /v3/payments/{paymentId} and check Invoice.Status === 'PAID' and Transaction.Status === 'SUCCESS'.
* ❌ Assuming MyFatoorah returns the customer email for free. It only returns an email you sent it (or one the hosted page collected). Capture the email on our side at create time.
* ❌ Sending Amount in cents. MyFatoorah wants major units.
* ❌ Writing to the DB or sending email before the status === 'paid' idempotency check.
* ❌ Enabling the POST webhook without signature verification.
