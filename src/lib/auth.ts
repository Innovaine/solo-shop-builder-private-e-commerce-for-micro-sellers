// Session management with iron-session
// NFR-4: HttpOnly, Secure, SameSite=Strict cookies

import { getIronSession, IronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  sellerId?: string
  email?: string
  isLoggedIn: boolean
}

function getSessionOptions(): SessionOptions {
  return {
    password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
    cookieName: 'soloshop_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  }
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), getSessionOptions())
}

export async function requireAuth(): Promise<{ sellerId: string; email: string }> {
  const session = await getSession()
  
  if (!session.isLoggedIn || !session.sellerId || !session.email) {
    throw new Error('Unauthorized')
  }
  
  return {
    sellerId: session.sellerId,
    email: session.email,
  }
}

export async function verifySession(): Promise<{ sellerId: string; email: string } | null> {
  // This function verifies the current session from cookies
  // For iron-session, the token verification is handled internally by getSession()
  // We just need to check if the session is valid
  try {
    const session = await getSession()
    
    if (!session.isLoggedIn || !session.sellerId || !session.email) {
      return null
    }
    
    return {
      sellerId: session.sellerId,
      email: session.email,
    }
  } catch (error) {
    return null
  }
}
