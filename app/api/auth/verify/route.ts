// FR-2: Magic link verification
// GET /auth/verify?token=XXX
// Validates token, creates session, redirects to dashboard

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

// POST handler for AJAX verification (called from verify page client-side)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find token in database
    const authToken = await prisma.authToken.findUnique({
      where: { token },
      include: { seller: true },
    })

    // Check if token exists and is valid
    if (!authToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    if (authToken.used) {
      return NextResponse.json(
        { error: 'This token has already been used' },
        { status: 400 }
      )
    }

    if (new Date() > authToken.expiresAt) {
      return NextResponse.json(
        { error: 'This token has expired' },
        { status: 400 }
      )
    }

    // Mark token as used
    await prisma.authToken.update({
      where: { id: authToken.id },
      data: { used: true },
    })

    // Create session
    const session = await getSession()
    session.sellerId = authToken.seller.id
    session.email = authToken.seller.email
    session.isLoggedIn = true
    await session.save()

    // Check if seller has a shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId: authToken.seller.id },
    })

    return NextResponse.json({
      success: true,
      hasShop: !!shop,
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

// GET handler for direct link clicks (legacy/email links)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/login?error=missing_token', request.url)
      )
    }

    // Find token in database
    const authToken = await prisma.authToken.findUnique({
      where: { token },
      include: { seller: true },
    })

    // Check if token exists and is valid
    if (!authToken) {
      return NextResponse.redirect(
        new URL('/auth/login?error=invalid_token', request.url)
      )
    }

    if (authToken.used) {
      return NextResponse.redirect(
        new URL('/auth/login?error=token_already_used', request.url)
      )
    }

    if (new Date() > authToken.expiresAt) {
      return NextResponse.redirect(
        new URL('/auth/login?error=token_expired', request.url)
      )
    }

    // Mark token as used
    await prisma.authToken.update({
      where: { id: authToken.id },
      data: { used: true },
    })

    // Create session
    const session = await getSession()
    session.sellerId = authToken.seller.id
    session.email = authToken.seller.email
    session.isLoggedIn = true
    await session.save()

    // Check if seller has a shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId: authToken.seller.id },
    })

    // Redirect to dashboard or shop creation
    if (shop) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard/create-shop', request.url))
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=server_error', request.url)
    )
  }
}
