// MyFatoorah payment callback
// Handles redirect after customer completes payment on MyFatoorah hosted page

import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      console.error('MyFatoorah callback: missing paymentId')
      return redirect('/checkout?error=payment_failed')
    }

    const myfatoorahApiKey = process.env.MYFATOORAH_API_KEY
    const myfatoorahApiUrl = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com'

    if (!myfatoorahApiKey) {
      console.error('MyFatoorah callback: missing API key')
      return redirect('/checkout?error=configuration_error')
    }

    // Query payment status from MyFatoorah
    const statusResponse = await fetch(`${myfatoorahApiUrl}/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${myfatoorahApiKey}`,
      },
    })

    if (!statusResponse.ok) {
      console.error('Failed to fetch payment status from MyFatoorah:', statusResponse.status)
      return redirect('/checkout?error=verification_failed')
    }

    const statusData = await statusResponse.json()

    if (!statusData.IsSuccess) {
      console.error('MyFatoorah API returned failure:', statusData)
      return redirect('/checkout?error=payment_failed')
    }

    const invoice = statusData.Data?.Invoice
    const transaction = statusData.Data?.Transaction
    const customer = statusData.Data?.Customer
    const amount = statusData.Data?.Amount

    if (!invoice || !transaction) {
      console.error('MyFatoorah callback: missing invoice or transaction data')
      return redirect('/checkout?error=invalid_response')
    }

    // Check if payment was successful
    if (invoice.Status !== 'PAID' || transaction.Status !== 'SUCCESS') {
      console.error('MyFatoorah callback: payment not completed', { invoiceStatus: invoice.Status, transactionStatus: transaction.Status })
      return redirect('/checkout?error=payment_not_completed')
    }

    // Find pending order by invoice ID (stored as stripePaymentId during checkout)
    const pendingOrder = await prisma.order.findFirst({
      where: { stripePaymentId: invoice.Id.toString() },
      include: {
        items: true,
        shop: true,
      },
    })

    if (!pendingOrder) {
      console.error('MyFatoorah callback: no pending order found for invoice', invoice.Id)
      // Order might have already been completed, check by payment ID
      const completedOrder = await prisma.order.findFirst({
        where: { 
          OR: [
            { stripePaymentId: paymentId },
            { stripePaymentId: invoice.Id.toString() },
          ],
          status: 'paid',
        },
      })
      
      if (completedOrder) {
        console.log('MyFatoorah callback: order already completed', completedOrder.id)
        return redirect(`/checkout/success?payment_id=${paymentId}&provider=myfatoorah`)
      }
      
      return redirect('/checkout?error=order_not_found')
    }

    // Extract customer info
    const customerEmail = customer?.Email || 'unknown@example.com'
    const customerName = customer?.Name || 'Anonymous'

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
          },
        }),
      },
    })

    console.log('MyFatoorah callback: order completed', updatedOrder.id, 'for payment', paymentId)

    // Send order confirmation email to customer
    try {
      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation - ${pendingOrder.shop.name}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order #${updatedOrder.id.substring(0, 8)} has been confirmed.</p>
          <p>Total: ${(updatedOrder.total / 100).toFixed(2)}</p>
          <p>Track your order: ${process.env.APP_URL || 'http://localhost:3000'}/track/${updatedOrder.id}</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the callback if email fails
    }

    return redirect(`/checkout/success?payment_id=${paymentId}&provider=myfatoorah`)

  } catch (error: any) {
    console.error('MyFatoorah callback error:', error.message || error)
    return redirect('/checkout?error=callback_error')
  }
}
