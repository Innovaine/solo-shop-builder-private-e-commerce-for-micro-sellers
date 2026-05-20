// MyFatoorah payment callback
// Handles redirect after customer completes payment on MyFatoorah hosted page

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

async function handleCallback(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')
    const baseUrl = process.env.APP_URL || 'https://www.soloshopbox.com'

    console.log('[MyFatoorah Callback] Received paymentId:', paymentId)

    if (!paymentId) {
      console.error('[MyFatoorah Callback] Missing paymentId parameter')
      return NextResponse.redirect(`${baseUrl}/checkout?error=payment_failed`)
    }

    const myfatoorahApiKey = process.env.MYFATOORAH_API_KEY
    const myfatoorahApiUrl = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com'

    if (!myfatoorahApiKey) {
      console.error('[MyFatoorah Callback] Missing MYFATOORAH_API_KEY environment variable')
      return NextResponse.redirect(`${baseUrl}/checkout?error=configuration_error`)
    }

    console.log('[MyFatoorah Callback] Querying payment status from:', `${myfatoorahApiUrl}/v3/payments/${paymentId}`)

    // Query payment status from MyFatoorah
    const statusResponse = await fetch(`${myfatoorahApiUrl}/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${myfatoorahApiKey}`,
      },
    })

    const statusData = await statusResponse.json()
    console.log('[MyFatoorah Callback] API Response:', JSON.stringify(statusData))

    if (!statusResponse.ok || !statusData.IsSuccess) {
      console.error('[MyFatoorah Callback] API request failed:', {
        status: statusResponse.status,
        isSuccess: statusData.IsSuccess,
        message: statusData.Message,
        errors: statusData.ValidationErrors,
      })
      return NextResponse.redirect(`${baseUrl}/checkout?error=verification_failed`)
    }

    const invoice = statusData.Data?.Invoice
    const transaction = statusData.Data?.Transaction
    const customer = statusData.Data?.Customer
    const amount = statusData.Data?.Amount

    if (!invoice) {
      console.error('[MyFatoorah Callback] Missing Invoice in response data')
      return NextResponse.redirect(`${baseUrl}/checkout?error=invalid_response`)
    }

    if (!transaction) {
      console.error('[MyFatoorah Callback] Missing Transaction in response data')
      return NextResponse.redirect(`${baseUrl}/checkout?error=invalid_response`)
    }

    console.log('[MyFatoorah Callback] Invoice Status:', invoice.Status, 'Transaction Status:', transaction.Status)

    // Check if payment was successful
    if (invoice.Status !== 'PAID' || transaction.Status !== 'SUCCESS') {
      console.error('[MyFatoorah Callback] Payment not completed:', {
        invoiceStatus: invoice.Status,
        transactionStatus: transaction.Status,
        transactionError: transaction.Error,
      })
      
      // Provide specific error messages based on payment failure reason
      let errorMessage = 'payment_failed'
      
      if (invoice.Status === 'CANCELLED' || transaction.Status === 'CANCELLED') {
        errorMessage = 'payment_cancelled'
      } else if (invoice.Status === 'EXPIRED' || transaction.Status === 'EXPIRED') {
        errorMessage = 'payment_expired'
      } else if (transaction.Error) {
        // Include transaction error for debugging (truncated to avoid URL length issues)
        const errorSnippet = transaction.Error.substring(0, 50).replace(/[^a-zA-Z0-9_-]/g, '_')
        errorMessage = `payment_declined_${errorSnippet}`
      }
      
      return NextResponse.redirect(`${baseUrl}/checkout?error=${errorMessage}`)
    }

    // Idempotency check — if order already paid, redirect to success
    // Try to find by InvoiceId first (canonical reference per new docs)
    let pendingOrder = await prisma.order.findFirst({
      where: {
        stripePaymentId: invoice.Id,
        status: 'paid',
      },
      include: {
        items: true,
        shop: true,
      },
    })

    if (pendingOrder) {
      console.log('[MyFatoorah Callback] Order already completed:', pendingOrder.id)
      return NextResponse.redirect(`${baseUrl}/checkout/success?payment_id=${paymentId}&provider=myfatoorah`)
    }

    // Find pending order by InvoiceId (stored as stripePaymentId during checkout)
    // OR by UserDefinedField (our order ID) as fallback
    pendingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { stripePaymentId: invoice.Id },
          { id: invoice.UserDefinedField || 'no-match' },
        ],
        status: { not: 'paid' },
      },
      include: {
        items: true,
        shop: true,
      },
    })

    if (!pendingOrder) {
      console.error('[MyFatoorah Callback] No pending order found for invoice:', invoice.Id, 'userDefined:', invoice.UserDefinedField)
      return NextResponse.redirect(`${baseUrl}/checkout?error=order_not_found`)
    }

    console.log('[MyFatoorah Callback] Found pending order:', pendingOrder.id, 'for invoice:', invoice.Id)

    // Extract customer info
    const customerEmail = customer?.Email || pendingOrder.customerEmail || 'unknown@example.com'
    const customerName = customer?.Name || pendingOrder.customerName || 'Anonymous'

    console.log('[MyFatoorah Callback] Updating order with customer:', { email: customerEmail, name: customerName })

    // Update order with payment completion info (InvoiceId is canonical reference per new docs)
    const updatedOrder = await prisma.order.update({
      where: { id: pendingOrder.id },
      data: {
        status: 'paid',
        customerEmail: customerEmail,
        customerName: customerName,
        stripePaymentId: invoice.Id, // Store InvoiceId as canonical reference (per new docs)
        metadata: JSON.stringify({
          ...JSON.parse(pendingOrder.metadata || '{}'),
          myfatoorah: {
            invoiceId: invoice.Id,
            paymentId: paymentId,
            transactionId: transaction.Id,
            authorizationId: transaction.AuthorizationId,
            paymentMethod: transaction.PaymentMethod,
            reference: invoice.Reference,
            invoiceStatus: invoice.Status,
            transactionStatus: transaction.Status,
          },
        }),
      },
    })

    console.log('[MyFatoorah Callback] Order completed successfully:', updatedOrder.id, 'for payment:', paymentId)

    // Send order confirmation email to customer
    try {
      const trackingUrl = `${process.env.APP_URL || 'http://localhost:3000'}/track/${updatedOrder.id}`
      const orderTotal = ((updatedOrder.total || 0) / 100).toFixed(2)
      const emailText = `Thank you for your order!

Order #${updatedOrder.id.substring(0, 8)} has been confirmed.
Total: ${orderTotal}

Track your order: ${trackingUrl}`

      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation - ${pendingOrder.shop.name}`,
        text: emailText,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B4C63;">Thank you for your order!</h2>
            <p>Your order <strong>#${updatedOrder.id.substring(0, 8)}</strong> has been confirmed.</p>
            <p><strong>Total:</strong> ${orderTotal}</p>
            <p><a href="${trackingUrl}" style="color: #10B981;">Track your order</a></p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the callback if email fails
    }

    return NextResponse.redirect(`${baseUrl}/checkout/success?payment_id=${paymentId}&provider=myfatoorah`)

  } catch (error: any) {
    console.error('[MyFatoorah Callback] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      type: typeof error,
      errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    })
    console.error('[MyFatoorah Callback] Full error object:', error)
    const baseUrl = process.env.APP_URL || 'https://www.soloshopbox.com'
    return NextResponse.redirect(`${baseUrl}/checkout?error=callback_error`)
  }
}

// GET /api/checkout/myfatoorah/callback — Handle redirect after payment
export async function GET(req: NextRequest) {
  return handleCallback(req)
}

// POST /api/checkout/myfatoorah/callback — Handle webhook notification
export async function POST(req: NextRequest) {
  // CRITICAL: Verify webhook signature before processing
  // MyFatoorah sends HMAC-SHA256 signature in X-MyFatoorah-Signature header
  
  const webhookSecret = process.env.MYFATOORAH_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.error('[MyFatoorah Webhook] MYFATOORAH_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }
  
  // Read raw body for signature verification
  const rawBody = await req.text()
  const receivedSignature = req.headers.get('x-myfatoorah-signature') || req.headers.get('x-webhook-signature')
  
  if (!receivedSignature) {
    console.error('[MyFatoorah Webhook] Missing signature header')
    return NextResponse.json(
      { error: 'Unauthorized: missing signature' },
      { status: 401 }
    )
  }
  
  // Compute HMAC-SHA256 signature using webhook secret
  const computedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')
  
  // Compare signatures (constant-time comparison to prevent timing attacks)
  const signaturesMatch = crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(computedSignature)
  )
  
  if (!signaturesMatch) {
    console.error('[MyFatoorah Webhook] Invalid signature')
    return NextResponse.json(
      { error: 'Unauthorized: invalid signature' },
      { status: 401 }
    )
  }
  
  console.log('[MyFatoorah Webhook] Signature verified successfully')
  
  // Signature is valid — reconstruct NextRequest with parsed body
  // handleCallback expects searchParams, so parse the rawBody as JSON and extract paymentId
  let paymentId: string | undefined
  try {
    const webhookData = JSON.parse(rawBody)
    paymentId = webhookData.paymentId || webhookData.Data?.PaymentId
  } catch {
    console.error('[MyFatoorah Webhook] Failed to parse webhook body')
    return NextResponse.json(
      { error: 'Invalid webhook payload' },
      { status: 400 }
    )
  }
  
  if (!paymentId) {
    console.error('[MyFatoorah Webhook] Missing paymentId in webhook body')
    return NextResponse.json(
      { error: 'Missing paymentId' },
      { status: 400 }
    )
  }
  
  // Construct a URL with paymentId as query param so handleCallback can process it
  const url = new URL(req.url)
  url.searchParams.set('paymentId', paymentId)
  
  // Create a new Request with the updated URL
  const modifiedReq = new NextRequest(url.toString(), {
    method: 'POST',
    headers: req.headers,
  })
  
  return handleCallback(modifiedReq)
}
