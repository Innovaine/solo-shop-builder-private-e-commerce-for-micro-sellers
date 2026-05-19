# Error Handling Design Specification

**Solo Shop Builder — Private E-commerce for Micro-Sellers**

This document defines how errors are shown to users across the entire product, with specific patterns for checkout, payment, order management, and general application errors.

---

## Principles

1. **Be specific.** Don't say "Error." Say "This shop name is already taken. Try another."
2. **Show recovery path.** Every error message includes a clear next step.
3. **Preserve context.** Errors appear where the action failed, not on a blank page.
4. **Don't use color alone.** Always pair red/rose with an icon or text label.
5. **Mobile-first.** Errors on mobile must be readable without scrolling sideways.

---

## Error Categories & Display Patterns

### 1. Validation Errors (Form Field Level)

**Used for:** Email format, password too short, required field missing, etc.

**Pattern:** Inline, below the input field

**Example:**
```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input type="email" id="email" value="notanemail" aria-invalid="true" />
  <span class="error-text">Please enter a valid email address (e.g., you@example.com)</span>
</div>
```

**Styles:**
- Input: 2px red border (`border-color: #F43F5E`)
- Error text: 12px, #F43F5E, 4px margin-top from input
- Icon: ❌ or ⚠️ optional, placed inline with text
- Focus state: Outline remains visible even with error border

**When to show:** On blur OR on form submission attempt

---

### 2. Form-Level Errors (Multi-field)

**Used for:** "This email is already registered," "Passwords don't match," "Address validation failed"

**Pattern:** Alert box at top of form, BEFORE the problematic fields

**Example:**
```html
<form>
  <!-- Error alert first -->
  <div class="error-alert" role="alert">
    <div class="error-icon">⚠️</div>
    <div class="error-content">
      <strong>Email already registered</strong>
      <p>This email address is already used. <a href="/login">Log in here</a> or use a different email.</p>
    </div>
  </div>

  <!-- Form fields below -->
  <input type="email" />
  ...
</form>
```

**Styles:**
- Background: #FEE2E2 (rose-100)
- Border: 1px #FECACA (rose-300)
- Border-radius: 8px
- Padding: 16px
- Icon: 24px, emoji (⚠️ or ℹ️ or 🔴)
- Title: 14px, #DC2626 (rose-600), bold
- Description: 13px, #991B1B (rose-900), line-height 1.5
- Link inside: blue/slate, underlined

---

### 3. Checkout & Payment Errors

**Used for:** Payment declined, Stripe errors, address validation failed, inventory out of stock at checkout

**Pattern:** Prominent alert ABOVE cart contents, with recovery options

**Example:**
```html
<div class="checkout-container">
  <!-- Error FIRST (before empty cart check in code) -->
  <div class="error-alert payment-error">
    <div class="error-icon">❌</div>
    <div class="error-content">
      <strong>Payment was declined</strong>
      <p>Your card was rejected by your bank. Please check your card details or use a different payment method.</p>
      <div class="error-code">error: declined</div>
    </div>
  </div>

  <!-- Then cart/empty state below -->
  <div class="cart-section">
    ...
  </div>
</div>
```

**Styles:**
- Same as form-level alert (rose-100 background)
- Add optional error code in monospace font (12px, gray)
- Icon: ❌ for payment failures, 🔄 for retry scenarios
- CTA buttons below: "Retry Payment" (primary), "Browse More" (secondary)

**Key rule:** Error display MUST NOT be hidden when cart is empty. Error alerts render outside the `if (cart.empty)` check.

**Specific payment error codes & messages:**

| Error Code | Message | Recovery |
|---|---|---|
| `payment_declined` | Payment was declined by your bank | Check card details; try different card |
| `payment_expired` | Payment session expired | Retry payment immediately |
| `payment_cancelled` | Payment was cancelled | Click "Retry" to start over |
| `invalid_address` | Address validation failed | Check shipping address |
| `out_of_stock` | One or more items are out of stock | Remove items and retry |
| `server_error` | Something went wrong. Please try again in a few moments | Retry or contact support |

---

### 4. API/Server Errors (500, timeouts, etc.)

**Used for:** Database down, Stripe API unreachable, webhook failures, unhandled exceptions

**Pattern:** Full-page error page with support contact info

**Example:**
```html
<!DOCTYPE html>
<html>
<head><title>Something went wrong</title></head>
<body style="background: #FAF9F7; color: #1F2937; font-family: system-ui;">
  <div style="max-width: 500px; margin: 100px auto; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
    <h1 style="font-size: 28px; margin-bottom: 8px;">Something went wrong</h1>
    <p style="font-size: 14px; color: #64748B; margin-bottom: 24px;">
      Our servers encountered an unexpected error. Your payment was NOT processed. Please refresh the page and try again.
    </p>
    <button onclick="location.reload()" style="background: #10B981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">Try Again</button>
    <p style="font-size: 12px; color: #64748B; margin-top: 24px;">Error ID: <code>err_1a2b3c</code></p>
  </div>
</body>
</html>
```

**Styles:**
- Full page: min-height 100vh, centered content
- Heading: 28px, bold, charcoal
- Description: 14px, slate, line-height 1.6
- Action button: primary emerald
- Error ID: monospace, 12px, gray (for support reference)

**Support contact:**
```
If this persists, contact support:
📧 support@soloshop.com
🔗 /help/contact
```

---

### 5. Empty States (Not technically errors, but similar messaging)

**Used for:** No products listed, no orders yet, no customers, no results from search

**Pattern:** Centered card with icon, message, and action

**Example:**
```html
<div class="empty-state">
  <div class="empty-icon">📦</div>
  <h2>You haven't added products yet</h2>
  <p>Start by creating your first product to open your shop to customers.</p>
  <button>Add Your First Product</button>
</div>
```

**Styles:**
- Icon: 48px emoji
- Heading: 24px, charcoal, bold
- Description: 14px, slate
- Button: primary action

**Difference from errors:** Use neutral emoji (📦, 📊, 📧) instead of warning icons (⚠️, ❌)

---

### 6. Warnings (Non-blocking, informational)

**Used for:** Low stock, payment method expiring soon, unused shop, trial ending

**Pattern:** Alert box with amber/yellow background, can appear inline or standalone

**Example:**
```html
<div class="warning-alert">
  <div class="warning-icon">⚡</div>
  <div class="warning-content">
    <strong>Low stock</strong>
    <p>You have only 3 units of "Ceramic Mug (Blue)" remaining.</p>
    <a href="/products/123">Update inventory</a>
  </div>
</div>
```

**Styles:**
- Background: #FFFBEB (amber-50)
- Border: 1px #FDE68A (amber-200)
- Text: #78350F (amber-900)
- Icon: 🔶 or ⚡ or ℹ️
- Dismiss: Optional X button (top-right)

---

### 7. Success Confirmations

**Used for:** Order confirmed, product added, settings saved, email sent

**Pattern:** Toast notification (temporary) or inline success message

**Toast (temporary, auto-dismiss in 4s):**
```html
<div class="toast toast-success" role="status">
  <span class="toast-icon">✓</span>
  <span class="toast-message">Order marked as shipped</span>
  <button class="toast-close" onclick="this.parentElement.remove();">×</button>
</div>
```

**Inline success (persistent):**
```html
<div class="success-card">
  <div class="success-icon">✓</div>
  <h3>Order confirmed</h3>
  <p>Confirmation email sent to you@example.com</p>
  <a href="/orders/123">View order details</a>
</div>
```

**Styles:**
- Background: #DCFCE7 (emerald-100)
- Border: 1px #BBF7D0 (emerald-200)
- Text: #15803D (emerald-700)
- Icon: ✓ in 24px emerald circle

---

## Implementation Checklist

- [ ] Every input field has visible error state (red border + text below)
- [ ] Every form has error alert BEFORE input fields
- [ ] Checkout page shows payment errors ABOVE empty cart check
- [ ] Every API error route returns < 200ms error page (no server-side slowness)
- [ ] All error messages are copy-edited (specific, actionable, non-technical)
- [ ] All error colors meet WCAG AA contrast (≥ 4.5:1 on background)
- [ ] Focus state visible on error inputs (outline still shows)
- [ ] Mobile: error text wraps correctly at 320px width
- [ ] Error codes included for engineering debugging (error_id in footer)
- [ ] Support contact info present on all 500-error pages

---

## Color Reference

| Use | Color | Hex | WCAG AA? |
|---|---|---|---|
| Error bg | Rose-100 | #FEE2E2 | ✓ |
| Error text | Rose-900 | #991B1B | ✓ (4.88:1 on white) |
| Warning bg | Amber-50 | #FFFBEB | ✓ |
| Warning text | Amber-900 | #78350F | ✓ (5.81:1 on white) |
| Success bg | Emerald-100 | #DCFCE7 | ✓ |
| Success text | Emerald-700 | #15803D | ✓ (5.26:1 on white) |
| Info bg | Sky-100 | #F0F9FF | ✓ |
| Info text | Sky-900 | #082F49 | ✓ (7.29:1 on white) |

---

## Reserved for Future Stages

- **Inline field hints** (stage 1) — help text next to labels
- **Progressive disclosure** (stage 2) — hide error details until user clicks "details"
- **Error analytics** (stage 3) — track which errors occur most, improve messages
- **Smart retry logic** (stage 4) — auto-retry transient errors (timeouts, rate limits)
