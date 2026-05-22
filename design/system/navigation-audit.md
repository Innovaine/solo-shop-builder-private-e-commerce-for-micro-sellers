# Navigation Audit & Patterns — Day 134

**Purpose:** Document navigation patterns across auth, seller dashboard, and public shop. Engineering reference for consistent linking and routing.

---

## Navigation Layer Breakdown

### 1. AUTH PAGES (Unauthenticated users)

**Pages:** `landing.html` → `signup.html` → `password-signup.html` → `password-signup-set.html` → `login.html`

**Pattern:** Linear onboarding flow, no sidebars. All pages reference the main entry point.

| Page | Purpose | Links To | Linked From |
|---|---|---|---|
| `/landing` | Public marketing site | `/auth/signup`, `/auth/login`, `/help` | Search engines, external |
| `/auth/signup` | Email signup form (magic link) | `/auth/login` (footer) | `/landing` |
| `/auth/password-signup` | Set initial password (if magic link was skipped) | `/auth/password-signup-set` | `/auth/signup` |
| `/auth/password-signup-set` | Password requirements & confirmation | `/auth/login` (success), `/auth/login` (footer) | `/auth/password-signup` |
| `/auth/login` | Email/password login | `/auth/forgot-password`, `/auth/signup`, `/dashboard` (post-auth redirect) | `/landing`, auth pages |
| `/auth/forgot-password` | Email recovery flow | `/auth/reset-password` (email link), `/auth/login` (footer) | `/auth/login` |
| `/auth/reset-password` | Set new password after recovery | `/auth/login` (success) | Emailed reset link |
| `/verify` | Email verification (optional) | `/auth/login`, `/dashboard` | Auth email link |

**CSS Pattern:** Gradient background (`linear-gradient(135deg, #3B4C63 0%, #2C3A4F 100%)`), centered white card, max-width: 420px

**Footer Rule:** All auth forms link back to `/auth/login` or `/auth/signup` for recovery. No exceptions.

---

### 2. SELLER DASHBOARD (Authenticated)

**Pages:** `dashboard.html` (main hub) → feature-specific pages

**Pattern:** Sidebar + main content. Persistent nav bar. All pages must link back to `/dashboard`.

**Main Navigation Items:**
- `📊 Dashboard` → `/dashboard`
- `📦 Products` → `/products` (list/inventory grid)
- `📋 Orders` → `/orders` (list with filters)
- `👤 Profile` → `/seller-profile`
- `⚙️ Settings` → `/settings`
- `❓ Help` → `/help`
- `Sign Out` → `/auth/logout`

**Breadcrumb Pattern:**
- All sub-pages must show: `Dashboard > [Current Page]`
- Clicking "Dashboard" always returns to `/dashboard`
- Back button (mobile) goes to previous page OR `/dashboard` if no history

**Specific Pages & Linking:**

| Page | Sidebar? | Links Out | Links Back |
|---|---|---|---|
| `/dashboard` | Yes | `/products`, `/orders`, `/profile`, `/settings`, `/help` | N/A (home) |
| `/products` | Yes | Product detail, `/products/create`, back to `/dashboard` | `/dashboard` breadcrumb |
| `/products/create` | Yes (breadcrumb) | File upload, category picker, `/products` | `/products` (cancel) |
| `/products/:id/edit` | Yes (breadcrumb) | Form save, `/products` | `/products` (cancel) |
| `/orders` | Yes | Order detail page, filters, exports | `/dashboard` breadcrumb |
| `/orders/:id` | Yes (breadcrumb) | Update status, refund modal, tracking link | `/orders` (back button) |
| `/profile` | Yes (breadcrumb) | Edit form, avatar upload | `/dashboard` breadcrumb |
| `/settings` | Yes (breadcrumb) | Billing, email, shop customization | `/dashboard` breadcrumb |
| `/help` | No sidebar | FAQ links, email support form | `/dashboard` (back button) |

**Responsive Behavior (Mobile <768px):**
- Sidebar collapses to hamburger menu
- Main nav items appear as mobile nav bar (bottom sticky)
- Breadcrumbs condense to "← Back"
- All touch targets remain ≥ 44px

---

### 3. PUBLIC SHOP / STOREFRONT (Unauthenticated customer)

**Pages:** `/shop/:slug` (product list) → `/shop/:slug/products/:id` (detail) → `/shop/:slug/checkout`

**Pattern:** No authentication required. Minimal nav. Cart persists in localStorage.

| Page | Purpose | Links To | Links Back |
|---|---|---|---|
| `/shop/:slug` | Public storefront, product grid + filters | Product detail pages, `/shop/:slug/checkout` (from cart), shop branding page | Search engines, customer links |
| `/shop/:slug/products/:id` | Single product detail + "add to cart" | `/shop/:slug` (back), `/shop/:slug/checkout` (if adding to cart) | `/shop/:slug` category filter |
| `/shop/:slug/checkout` | Stripe checkout (redirects to Stripe-hosted page) | Stripe payment processing, then webhook to order confirmation | Cart add button |
| `/order/:trackingToken` | Public order tracking (no auth) | None (read-only) | Order confirmation email link |
| `/shop/:slug/offline` | Shop is closed / inactive | `/` (home), email shop owner button | Direct URL |

**CSS Pattern:** Clean, minimal header with shop name/logo. Shopping cart icon (top-right). Footer with shop social links + contact.

**No Authentication:** Users should never be prompted to sign in when browsing products.

---

### 4. ERROR & FALLBACK PAGES

| Page | When | Links To | Notes |
|---|---|---|---|
| `/404` | Page not found | `/`, `/dashboard`, `/auth/login`, `/help` | 2-column icon grid of suggestions |
| `/error` | Server error (500) | `/`, `/help`, email support | Sympathetic tone, ask to refresh |
| `/empty` | No data state | Contextual (e.g., "Add your first product") | Primary CTA back to relevant page |
| `/loading` | Async state | None (overlay) | Spinner + brief message |

---

## Wiring Rules (Engineering)

### ✅ DO

- **Use relative links where possible:** `href="/dashboard"` not `href="https://example.com/dashboard"`
- **Always have a back button on secondary pages:** Either via breadcrumb or explicit back button
- **Sidebar always links to itself:** `/products` page header says "Products" and is highlighted in nav
- **Mobile nav:** Sticky bottom nav on mobile (hamburger for desktop sidebar)
- **Link colors:** All links are `#3B4C63` (slate blue), underlined on hover
- **Active nav state:** Current page in sidebar is highlighted with `background: #D1FAE5` (light emerald)

### ❌ DON'T

- **Orphan pages:** No page should exist without a way back to dashboard or home
- **Deep nesting without breadcrumbs:** `/orders/:id/refund/history/detail` needs full breadcrumb trail
- **External links in dashboard:** Keep sellers inside the app; external links open in new tab (`target="_blank"`)
- **Hardcode URLs:** Use routing/navigation helper (Next.js `Link` component or equivalent)
- **Change link underline on non-hover:** Reserved for active nav state only

---

## Navigation Checklist (Before Shipping)

- [ ] Auth pages all link to login/signup footer links
- [ ] Dashboard sidebar has 6+ main items (Products, Orders, Profile, Settings, Help, Sign Out)
- [ ] All sub-pages have breadcrumb OR back button
- [ ] Public shop storefront has NO auth prompt
- [ ] 404 page links to home + dashboard + login + help
- [ ] Mobile nav collapses to hamburger (<768px)
- [ ] All links use relative paths (`/page` not `https://...`)
- [ ] Active nav state is visually distinct (background color, not just text)
- [ ] Touch targets are ≥ 44px on mobile
- [ ] No orphaned pages (every page has an exit path)

---

## Color Reference (Navigation Elements)

- **Active nav item background:** `#D1FAE5` (light emerald)
- **Active nav item text:** `#10B981` (emerald, bold)
- **Nav link color:** `#3B4C63` (slate blue)
- **Nav link hover:** Underlined, `#059669` (dark emerald)
- **Breadcrumb separator:** `#E2E8F0` (whisper, light gray)

---

## Next Steps

- [ ] Engineer: Verify all pages in design/pages/ have clear navigation targets
- [ ] Engineer: Implement active nav state highlighting in dashboard sidebar
- [ ] Tester: Walk through full user journey (landing → signup → dashboard → orders → logout) and report broken links
- [ ] Designer: Update any new pages to follow breadcrumb / back button rule
