# Stripe Webhooks
> **Kind:** `text`
> **Last refreshed:** (never)
## Docs

Here's how to handle webhooks from your server for AI applications:
Basic webhook endpoint setup
Create an endpoint to receive webhook events from Stripe:
example.js 

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Use raw body parser for webhook signature verification
app.use('/webhook', express.raw({type: 'application/json'}));

app.post('/webhook', (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  handleWebhookEvent(event);
  
  response.json({received: true});
});
AI-specific event handling
Process webhook events and trigger AI workflows:
example.js 

async function handleWebhookEvent(event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    case 'customer.subscription.created':
      await handleNewSubscription(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

async function handleSuccessfulPayment(paymentIntent) {
  // Trigger AI agent for successful payment follow-up
  await aiAgent.processEvent({
    type: 'payment_success',
    customerId: paymentIntent.customer,
    amount: paymentIntent.amount,
    metadata: paymentIntent.metadata
  });
}

async function handleFailedPayment(invoice) {
  // Trigger AI agent for payment recovery
  await aiAgent.processEvent({
    type: 'payment_failed',
    customerId: invoice.customer,
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count
  });
}
Webhook configuration for AI workflows
Register webhooks programmatically with events relevant to AI automation:
stripe webhook_endpoints create \
  --url="https://your-domain.com/webhook" \
  --enabled-events="payment_intent.succeeded" \
  --enabled-events="payment_intent.payment_failed" \
  --enabled-events="invoice.payment_failed" \
  --enabled-events="customer.subscription.updated" \
  --enabled-events="customer.subscription.deleted"
API v2 thin events
For API v2 endpoints, Stripe sends thin events that contain minimal data. You'll need to fetch the full object:
example.js 

async function handleV2Event(event) {
  if (event.type === 'v2.billing.subscription.updated') {
    // Fetch the full subscription object
    const subscription = await stripe.v2.billing.subscriptions.retrieve(
      event.related_object.id
    );
    
    // Process with your AI agent
    await aiAgent.handleSubscriptionChange(subscription);
  }
}
Testing with Stripe CLI
Test your webhook handling locally:
# Forward events to your local server
stripe listen --forward-to localhost:4242/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger invoice.payment_failed
Error handling and retries
Implement proper error handling for reliable webhook processing:
example.js 

app.post('/webhook', async (request, response) => {
  try {
    const event = stripe.webhooks.constructEvent(
      request.body, 
      request.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    await processEventWithRetry(event);
    response.status(200).json({received: true});
    
  } catch (err) {
    console.error('Webhook error:', err);
    // Return 500 to trigger Stripe's retry mechanism
    response.status(500).json({error: err.message});
  }
});

async function processEventWithRetry(event, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await handleWebhookEvent(event);
      return; // Success
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}




Webhook objects have a consistent structure with event metadata and the actual resource data. Here's how they look:
Basic webhook structure
 

{
  "id": "evt_1MqSU82eZvKYlo2CielWabt5",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1679090539,
  "data": {
    "object": {
      // The actual Stripe object (PaymentIntent, Invoice, etc.)
    },
    "previous_attributes": {
      // Only present for *.updated events
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_abc123",
    "idempotency_key": null
  },
  "type": "payment_intent.succeeded"
}
Payment Intent succeeded example
 

{
  "id": "evt_1MqSU82eZvKYlo2CielWabt5",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1679090539,
  "data": {
    "object": {
      "id": "pi_3MqSU82eZvKYlo2CXW6dr9xB",
      "object": "payment_intent",
      "amount": 2000,
      "amount_received": 2000,
      "currency": "usd",
      "customer": "cus_NffrFeUfNV2Hib",
      "description": "Payment for order #12345",
      "metadata": {
        "order_id": "12345",
        "user_id": "user_abc123"
      },
      "payment_method": "pm_1MqSU82eZvKYlo2CbYtjNIzu",
      "status": "succeeded",
      "created": 1679090538,
      "updated": 1679090539
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_abc123",
    "idempotency_key": "payment_12345"
  },
  "type": "payment_intent.succeeded"
}
Subscription updated example
 

{
  "id": "evt_1MqSU82eZvKYlo2CielWabt5",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1679090539,
  "data": {
    "object": {
      "id": "sub_1MqSU82eZvKYlo2CbYtjNIzu",
      "object": "subscription",
      "customer": "cus_NffrFeUfNV2Hib",
      "status": "active",
      "current_period_start": 1679090539,
      "current_period_end": 1681768939,
      "items": {
        "data": [
          {
            "id": "si_NffrFeUfNV2Hib",
            "price": {
              "id": "price_1MqSU82eZvKYlo2CbYtjNIzu",
              "unit_amount": 2000,
              "currency": "usd"
            },
            "quantity": 1
          }
        ]
      }
    },
    "previous_attributes": {
      "status": "trialing"
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_def456",
    "idempotency_key": null
  },
  "type": "customer.subscription.updated"
}
Invoice payment failed example
 

{
  "id": "evt_1MqSU82eZvKYlo2CielWabt5",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1679090539,
  "data": {
    "object": {
      "id": "in_1MqSU82eZvKYlo2CbYtjNIzu",
      "object": "invoice",
      "customer": "cus_NffrFeUfNV2Hib",
      "subscription": "sub_1MqSU82eZvKYlo2CbYtjNIzu",
      "amount_due": 2000,
      "amount_paid": 0,
      "currency": "usd",
      "status": "open",
      "attempt_count": 2,
      "next_payment_attempt": 1679694339,
      "last_finalization_error": {
        "type": "card_error",
        "code": "card_declined",
        "message": "Your card was declined."
      }
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_ghi789",
    "idempotency_key": null
  },
  "type": "invoice.payment_failed"
}
API v2 thin events
API v2 events contain minimal data and reference the full object:
 

{
  "id": "evt_1MqSU82eZvKYlo2CielWabt5",
  "object": "event",
  "type": "v2.billing.subscription.updated",
  "created": "2024-01-15T10:30:00Z",
  "related_object": {
    "id": "sub_1MqSU82eZvKYlo2CbYtjNIzu",
    "type": "billing.subscription",
    "url": "/v2/billing/subscriptions/sub_1MqSU82eZvKYlo2CbYtjNIzu"
  },
  "reason": {
    "type": "request",
    "request": {
      "id": "req_abc123",
      "idempotency_key": "sub_update_12345"
    }
  }
}
Key fields to understand
* data.object - Contains the full Stripe resource (PaymentIntent, Subscription, etc.)
* data.previous_attributes - Only present in *.updated events, shows what changed
* type - The event type (like payment_intent.succeeded)
* livemode - Whether this is a live or test event
* request.id - The API request that triggered this event
* request.idempotency_key - Idempotency key used in the original request
