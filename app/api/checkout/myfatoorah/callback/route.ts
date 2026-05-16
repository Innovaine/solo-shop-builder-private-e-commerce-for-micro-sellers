// MyFatoorah payment callback
// Handles redirect after customer completes payment on MyFatoorah hosted page

import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return redirect('/checkout?error=payment_failed')
    }

    const myfatoorahApiKey = process.env.MYFATOORAH_API_KEY
    const myfatoorahApiUrl = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com'

    if (!myfatoorahApiKey) {
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
      console.error('Failed to fetch payment status from MyFatoorah')
      return redirect('/checkout?error=verification_failed')
    }

    const statusData = await statusResponse.json()

    if (!statusData.IsSuccess) {
      return redirect('/checkout?error=payment_failed')
    }

    const invoice = statusData.Data?.Invoice
    const transaction = statusData.Data?.Transaction

    if (!invoice || !transaction) {
      return redirect('/checkout?error=invalid_response')
    }

    // Check if payment was successful
    if (invoice.Status !== 'PAID' || transaction.Status !== 'SUCCESS') {
      return redirect('/checkout?error=payment_not_completed')
    }

    // Payment successful - redirect to success page
    // In a real implementation, you'd create the order here or via webhook
    // For now, we'll redirect to success with the payment ID
    return redirect(`/checkout/success?payment_id=${paymentId}&provider=myfatoorah`)

  } catch (error) {
    console.error('MyFatoorah callback error:', error)
    return redirect('/checkout?error=callback_error')
  }
}
