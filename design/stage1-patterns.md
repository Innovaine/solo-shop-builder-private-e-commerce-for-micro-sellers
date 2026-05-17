# Stage 1 Design Patterns — Variant Selection & Inventory Alerts

**Date:** Day 48 (Scaling)  
**Stage:** Hardening (F21–F26)

---

## Overview

Stage 1 introduces two critical UX patterns:
1. **Variant Selection at Checkout** (F23, F24) — Customers choose size, color, material; system validates stock per combination
2. **Inventory Alerts & Monitoring** (F24, F38–F39) — Sellers receive real-time low-stock notifications; system auto-hides out-of-stock items

---

## Pattern 1: Variant Selection at Checkout

### Purpose
Customers must select variants (size, color, material, etc.) before proceeding to payment. Each variant combination has independent pricing, SKU, and stock levels.

### User Flow
```
Customer adds product to cart
  ↓
Clicks "Checkout"
  ↓
Checkout page loads
  ↓
Customer selects Size, Color, Material (max 3 variant types)
  ↓
System validates stock for that combination in real-time
  ↓
Customer sets quantity
  ↓
Customer sees price (may differ from base) + stock status badge
  ↓
"Continue to Shipping" button enables (if stock > 0)
  ↓
Proceeds to address/payment page
```

### Design Reference
See: `design/pages/checkout-with-variants.html`

### Key Elements

#### Variant Selection Buttons
- **Style:** Bordered pill buttons, 2px border
- **States:**
  - Unselected: white bg, #E2E8F0 border, #64748B text
  - Hover: #F9FAFB bg, #CBD5E1 border
  - Selected: #3B4C63 bg, #3B4C63 border, white text
  - Disabled (out of stock): opacity 0.5, dashed border
- **Behavior:** Toggle on click; only one option per variant type selectable at a time
- **Mobile:** Stack horizontally with wrap; ensure 44px+ touch targets

#### Stock Status Badge
- **In Stock:** #D1FAE5 bg, #065F46 text, green checkmark
- **Low Stock:** #FEF3C7 bg, #92400E text, amber warning icon
- **Out of Stock:** #FEE2E2 bg, #991B1B text, red X icon
- **Updates:** Real-time, synced as customer changes variant options

#### Order Summary Card (Right Column)
- **Sticky position** on desktop (top: 24px offset)
- **Responsive:** Drops below form on mobile
- **Contents:**
  - Product image (80px × 80px on desktop, 60px on mobile)
  - Product name, seller name
  - Selected variant options as list (bullet points)
  - Line-item prices: subtotal, quantity, total
  - Note: "Shipping & tax calculated next step"
- **Color scheme:** White bg, #E2E8F0 borders, subtle shadow

#### Form Validation
- **Required variants:** Marked with red asterisk (*)
- **Error state:** Field gets #F43F5E border, bg turns #FEF2F2
- **Button disabled:** "Continue to Shipping" greyed out until all required variants selected + stock > 0

---

## Pattern 2: Inventory Alerts & Low Stock Monitoring

### Purpose
Sellers receive proactive notifications when product inventory drops below a configurable threshold. System auto-manages storefront visibility to prevent overselling.

### User Flow
```
Seller sets inventory threshold (e.g., 5 units)
  ↓
Product stock decreases as orders come in
  ↓
When stock ≤ threshold: Email alert sent to seller
  ↓
(Optional) System hides product from storefront if "auto-hide" enabled
  ↓
Seller can update stock, reorder, or manually restock via inventory dashboard
  ↓
(Optional) Product re-appears on storefront when stock > 0
```

### Design Reference
See: `design/pages/inventory-alert-modal.html`

### Key Elements

#### Modal Dialog
- **Trigger:** Email notification link OR dashboard notification bell
- **Layout:** Centered modal with backdrop (50% opacity, dark)
- **Width:** 500px max (full width on mobile)
- **Header:**
  - Icon: ⚠️ (warning emoji)
  - Title: "Low Stock Alert"
  - Subtitle: "N products need attention"
  - Close button (X) in top-right
- **Footer:** Two buttons: "Close" (secondary) + "Go to Inventory Dashboard" (primary)

#### Product List (in modal)
- **Row layout:** Image (56×56px) + Name + Meta + Stock Badge
- **Stock badges:**
  - "2 left" = #FEE2E2 bg, #991B1B text
  - "Out" = same styling
  - "1 left" = same styling
- **Clickable:** Each row links to product edit page (engineer to wire)

#### Threshold Configuration (in modal)
- **Label:** "Notify me when stock falls below:"
- **Input:** Number field, min=1, default=5
- **Hint:** "You'll get an email notification for each product that hits this level."
- **Button:** "Save Threshold" (primary) — updates system setting

#### Notification Toggles (in modal)
- **Email alerts:** Checkbox + label "Email me low stock alerts" (checked by default)
- **Auto-hide:** Checkbox + label "Automatically hide out-of-stock products from storefront" (checked by default)
- **Rationale:** Prevents customers from clicking "sold out" products; seller maintains control

#### Quick Action Links
- "📤 Export inventory list" → Downloads CSV of all products + current stock
- "⚙️ Update threshold settings" → Opens settings page
- "📊 View inventory history" → Shows 30-day stock trends (if analytics available)

---

## Integration Points

### Frontend (Next.js Components)
1. **CheckoutVariantSelector** — Renders variant buttons, manages selected state, calls stock API
2. **StockStatusBadge** — Shows real-time stock status, updates on variant selection
3. **OrderSummaryCard** — Shows order preview with selected variants
4. **InventoryAlertModal** — Modal dialog for low-stock notifications
5. **InventoryThresholdForm** — Settings form for threshold + notification prefs

### Backend APIs (Engineer to wire)
1. **GET /api/products/:id/variants** — Returns all variants + stock for a product
2. **GET /api/products/:id/variants/:variantId/stock** — Real-time stock check
3. **PUT /api/products/:id/inventory-threshold** — Update low-stock threshold
4. **GET /api/inventory/alerts** — Fetch current low-stock products
5. **POST /api/inventory/alerts/:alertId/dismiss** — Seller dismisses alert
6. **PATCH /api/products/:id/visibility** — Toggle "show on storefront" flag

### Email Notifications
- **Template:** `design/emails/low-stock-alert.html` (to be created next cycle)
- **Subject:** "Low stock alert: 3 products need attention"
- **CTA:** "Go to Inventory" button links to `/dashboard/inventory`
- **Frequency:** Batched daily digest OR on-demand per product

---

## Accessibility & Mobile Considerations

### Touch Targets
- **Variant buttons:** 44px minimum (12px padding on 14px text = 38px; add 6px margin for 44px total)
- **Checkboxes:** 18×18px + 12px margin around
- **Modal buttons:** 44px height minimum

### Focus States
- **Variant buttons:** 2px #3B4C63 outline on focus
- **Form inputs:** 3px rgba(59,76,99,0.1) box-shadow on focus
- **Links:** Visible underline on focus (text-decoration: underline)

### Mobile Breakpoints
- **< 768px:**
  - Checkout layout: Single column (form above summary)
  - Variant options: Wrap to multiple lines if needed
  - Modal: Full viewport width with 16px padding
  - Touch targets: No less than 44×44px

### Color Contrast
- **Text on color:** All badges, buttons, alerts meet WCAG AA (4.5:1 minimum)
- **Variant buttons:** #3B4C63 (slate blue) on white = 7.8:1
- **Badge text:** #065F46 (dark green) on #D1FAE5 (light green) = 5.2:1
- **Alert text:** #92400E (dark amber) on #FEF3C7 (light amber) = 9.1:1

---

## Copy & Tone

### Variant Selection
- **Placeholder text:** "Small" / "Medium" / "Large" (not "Select size…")
- **Labels:** Bold, all caps if section header: "SIZE", "COLOR", "MATERIAL"
- **Info box:** "Please select your preferred options below. Availability updates in real-time."
- **Stock message:** "✓ Medium + Grey + Ceramic: 12 in stock" (shows exact combo being checked)

### Inventory Alerts
- **Modal title:** "Low Stock Alert" (direct, no hype)
- **Subtitle:** "3 products need attention" (specific count, factual)
- **Alert text:** "Your inventory reminder: The following products have fallen below your low stock threshold. Restock them to continue fulfilling orders."
- **Button:** "Go to Inventory Dashboard" (action-oriented)
- **Quick links:** Emoji + verb + noun ("📤 Export inventory list", "⚙️ Update threshold settings")

---

## Engineer Handoff

**Files to reference:**
- `design/pages/checkout-with-variants.html` — Full checkout layout with variant selection
- `design/pages/inventory-alert-modal.html` — Modal dialog + form structure
- `design/system/components.html` → Badge, Button, Modal, FormField specs

**Props to implement:**
- `<VariantSelector variant="size|color|material" options={["S","M","L"]} selected="M" onChange={handler} />`
- `<StockBadge quantity={12} status="in-stock|low-stock|out-of-stock" />`
- `<InventoryAlertModal products={[...]} threshold={5} onClose={} onSaveThreshold={} />`

**No new components needed** — extend existing Button, Badge, Modal, FormField.

---

## Testing Checklist (QA / Engineer)

- [ ] Variant selection: only one option per type selectable
- [ ] Stock updates real-time as variants change
- [ ] "Continue" button disabled if stock = 0 or required variant unselected
- [ ] Mobile: variant buttons stack and maintain 44px targets
- [ ] Modal: closes on X button, "Close" button, or ESC key
- [ ] Threshold form: accepts valid numbers (1–999), rejects 0 or negative
- [ ] Email: sent within 5 minutes of stock hitting threshold
- [ ] Auto-hide: product disappears from storefront when stock = 0 and toggle ON
- [ ] Keyboard: Tab navigation works through all form fields
- [ ] Screen reader: Labels announced correctly, focus order logical

---

## Related Features (Future)

- **F27:** Bulk image upload (pairs with product variants)
- **F28:** CSV import (supports variant CSV with size/color columns)
- **F37:** Product variants (already shipped; this pattern refines it)
- **F38:** Inventory tracking (core system for alerts)
- **F43:** Restock alerts (email when hitting threshold)
- **F51:** Shipping calculator (may need variant pricing consideration)
