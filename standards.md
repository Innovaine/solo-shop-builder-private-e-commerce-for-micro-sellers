# Solo Shop Builder — Engineering Standards

**Last updated**: Day 75 QA Audit
**Scope**: MVP stage — canonical patterns for all layers
**Owner**: Standards QA (Vitali)

## Table of Contents

1. [Authentication & Session](#authentication--session)
2. [Routing & Redirects](#routing--redirects)
3. [Route Parameters & Query Strings](#route-parameters--query-strings)
4. [API Responses & Error Handling](#api-responses--error-handling)
5. [Data Types & Units](#data-types--units)
6. [Database Access](#database-access)
7. [Validation](#validation)
8. [Rate Limiting](#rate-limiting)

---

## Authentication & Session

### Canonical Pattern: `requireAuth()` helper

**Location**: `src/lib/auth.ts`

**What**: Use the `requireAuth()` function to enforce authenticated requests in API routes and server components.

**Why**: Centralizes session verification, reduces boilerplate, ensures consistent error handling, and makes security audits easier.

**Usage**:
```typescript
import { requireAuth } from '@/lib/auth'

// In API route:
export async function POST(request: NextRequest) {
  try {
    const { sellerId, email } = await requireAuth()
    // Now you know sellerId and email are valid
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // handle other errors
  }
}

// In server component:
import { getSession } from '@/lib/auth'
const session = await getSession()
if (!session.isLoggedIn) {
  redirect('/auth/login')
}
```

**Banned patterns**:
- ❌ `const cookieStore = cookies(); cookieStore.get('session')` — use `getSession()` or `requireAuth()` instead
- ❌ Direct cookie parsing in routes — breaks if session encryption changes
- ❌ Raw `request.headers.get('cookie')` — loses iron-session's encryption

---

## Routing & Redirects

### Canonical Pattern: `redirect()` from next/navigation

**Location**: Use `next/navigation`'s `redirect()` in server components and route handlers.

**Why**: Properly handles Next.js server-side routing semantics; throws which prevents further execution; works with streaming.

**Usage**:
```typescript
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    redirect('/auth/login')
  }
  // Safe to continue
}
```

**Banned patterns**:
- ❌ `NextResponse.redirect()` in server components — can leak headers
- ❌ Manual `<Link>` in conditionals without redirect — doesn't enforce it at the boundary
- ❌ Client-side `useRouter().push()` for auth gates — race conditions on page load

---

## Route Parameters & Query Strings

### Canonical Pattern: `params` for dynamic segments, `searchParams` for query strings

**Location**: Enforced in all page.tsx and route.ts files.

**Why**: Matches URL semantics: `/shop/[slug]` → `params.slug`; `?sort=price` → `searchParams.get('sort')`.

**Usage**:
```typescript
// Page with dynamic segment + query params
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { shopSlug: string; productId: string }
  searchParams: Record<string, string | string[]>
}) {
  const sort = searchParams.sort as string || 'newest'
  const shop = await prisma.shop.findUnique({
    where: { slug: params.shopSlug },
  })
  // ...
}

// API route
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId') // query param
  const result = await prisma.order.findUnique({
    where: { id: orderId },
  })
}
```

**Banned patterns**:
- ❌ Reading `params` as `req.nextUrl.searchParams` — wrong source
- ❌ Reading `searchParams` from URL pathname — loses array handling
- ❌ Mixing request.url parsing with page params — inconsistent

---

## API Responses & Error Handling

### Canonical Pattern: Always return NextResponse.json()

**Location**: All `app/api/*/route.ts` files.

**Why**: Consistent content-type, proper status codes, structured error responses, easy to test.

**Usage**:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Banned patterns**:
- ❌ `return new Response('text')` — no JSON content-type
- ❌ Throwing errors without catching — crashes handler
- ❌ Returning status codes without NextResponse — loses context

---

## Data Types & Units

### Canonical Pattern: Money in CENTS, no fractions

**Location**: Database schema, API responses, calculations.

**Why**: Avoids floating-point precision errors (0.1 + 0.2 ≠ 0.3 in JS).

**Schema**:
```prisma
model Product {
  price Int  // in cents, e.g., 4500 = $45.00
}

model Order {
  total Int  // in cents, e.g., 45000 = $450.00
}
```

**Display**:
```typescript
// ❌ WRONG: displays $45.0000
export function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`
}

// ✅ RIGHT: displays $45.00
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// Use in templates:
<span>{formatPrice(product.price)}</span>  // $45.00
```

**Banned patterns**:
- ❌ `.toFixed(2)` on cents without `/100` → $4500.00 instead of $45.00
- ❌ Storing decimals in DB (price: 45.00) → precision issues
- ❌ Mixing cents and dollars in same codebase → silent bugs

### Canonical Pattern: Time as ISO 8601 string or Unix milliseconds

**Location**: Database (createdAt, updatedAt as DateTime), API responses (JSON.stringify).

**Usage**:
```prisma
model Order {
  createdAt DateTime @default(now())  // Postgres TIMESTAMP
}
```

```typescript
// In API responses, Prisma auto-serializes to ISO 8601:
// { createdAt: "2026-05-18T15:30:00.000Z" }

// For display:
import { formatDate } from '@/lib/time'
<span>{formatDate(order.createdAt)}</span>
```

**Banned patterns**:
- ❌ Returning `createdAt` as seconds in one endpoint, ms in another
- ❌ Parsing dates manually instead of using a helper

---

## Database Access

### Canonical Pattern: Use prisma singleton from `src/lib/db.ts`

**Location**: Every file that touches the database.

**Why**: Single connection pool, avoids "too many connections" errors, centralizes logging.

**Usage**:
```typescript
import { prisma } from '@/lib/db'

const orders = await prisma.order.findMany({
  where: { shopId },
  include: { items: true },
})
```

**Banned patterns**:
- ❌ `import { PrismaClient } from '@prisma/client'; new PrismaClient()` — creates new connection per file
- ❌ Creating prisma client in a .ts file in app/api/ — doesn't use singleton

---

## Validation

### Canonical Pattern: Zod for all user input

**Location**: API routes, server actions, anywhere parsing request body/params.

**Why**: Type-safe, composable, generates good error messages.

**Usage**:
```typescript
import { z } from 'zod'

const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().int().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productData = createProductSchema.parse(body)
    // Now productData is typed and validated
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    // ...
  }
}
```

**Banned patterns**:
- ❌ `if (!body.title)` checks — loose validation
- ❌ Hand-rolled TypeScript interfaces for request shapes — no runtime checking
- ❌ Relying on Prisma schema validation alone — data can be malformed before it reaches DB

---

## Rate Limiting

### Canonical Pattern: Use `checkRateLimit()` from `src/lib/rate-limit.ts`

**Location**: Authentication routes (signup, login), and any expensive endpoint.

**Why**: Prevents brute force, DDoS, abuse; centralized configuration.

**Usage**:
```typescript
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request)
  const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.AUTH_LOGIN)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
        },
      }
    )
  }

  // Proceed with request
}
```

**Banned patterns**:
- ❌ Rolling your own rate limiter — doesn't track across requests
- ❌ No rate limiting on auth endpoints — vulnerable to brute force

---

## Notes for Reviewers

1. **Schema-type sync**: If you see an interface like `interface Order { title: string }` in frontend code, it MUST be imported from `@prisma/client`. Hand-rolled interfaces drift when the schema changes.

2. **Error messages**: Never expose internal details (database IDs, SQL, stack traces) in error responses returned to clients.

3. **Session leaks**: Ensure `session.save()` is always called after mutating the session object, otherwise changes are lost.

4. **Redirect boundaries**: `redirect()` in server components is the enforcement point for auth. Never trust client-side checks alone.

---

## Deviations & Rationale

- **When to use async/await vs promises**: Always use async/await for clarity. Only use `.then()` in event handlers or streams.
- **When to break validation rules**: Document it. `// Exception: allow unauthenticated access for public shop pages` is better than a drift bug.
