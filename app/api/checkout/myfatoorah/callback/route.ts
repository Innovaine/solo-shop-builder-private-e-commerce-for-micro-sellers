// MyFatoorah payment callback
// Handles redirect after customer completes payment on MyFatoorah hosted page

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
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
      return NextResponse.redirect(`${baseUrl}/checkout?error=payment_not_completed`)
    }

    // Find pending order by invoice ID or payment ID (stored as stripePaymentId during checkout)
    const pendingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { stripePaymentId: invoice.Id.toString() },
          { stripePaymentId: `myfatoorah_invoice_${invoice.Id}` },
        ],
      },
      include: {
        items: true,
        shop: true,
      },
    })

    if (!pendingOrder) {
      console.error('[MyFatoorah Callback] No pending order found for invoice:', invoice.Id)
      // Order might have already been completed, check by payment ID
      const completedOrder = await prisma.order.findFirst({
        where: { 
          OR: [
            { stripePaymentId: paymentId },
            { stripePaymentId: invoice.Id.toString() },
            { stripePaymentId: `myfatoorah_invoice_${invoice.Id}` },
          ],
          status: 'paid',
        },
      })
      
      if (completedOrder) {
        console.log('[MyFatoorah Callback] Order already completed:', completedOrder.id)
        return NextResponse.redirect(`${baseUrl}/checkout/success?payment_id=${paymentId}&provider=myfatoorah`)
      }
      
      console.error('[MyFatoorah Callback] Order not found in database')
      return NextResponse.redirect(`${baseUrl}/checkout?error=order_not_found`)
    }

    console.log('[MyFatoorah Callback] Found pending order:', pendingOrder.id)

    // Extract customer info
    const customerEmail = customer?.Email || pendingOrder.customerEmail || 'unknown@example.com'
    const customerName = customer?.Name || pendingOrder.customerName || 'Anonymous'

    console.log('[MyFatoorah Callback] Updating order with customer:', { email: customerEmail, name: customerName })

    // Update order with payment completion info
    const updatedOrder = await prisma.order.update({
      where: { id: pendingOrder.id },
      data: {
        status: 'paid',
        customerEmail: customerEmail,
        customerName: customerName,
        stripePaymentId: paymentId, // Update with actual payment ID
        metadata: JSON.stringify({
          ...JSON.parse(pendingOrder.metadata || '{}'),
          myfatoorah: {
            invoiceId: invoice.Id,
            paymentId: paymentId,
            transactionId: transaction.Id,
            authorizationId: transaction.AuthorizationId,
            paymentMethod: transaction.PaymentMethod,
            reference: invoice.Reference,
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
