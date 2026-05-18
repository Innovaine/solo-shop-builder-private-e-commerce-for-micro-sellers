# Form Validation & Error Patterns — Solo Shop Builder

## Overview
UI patterns for form validation, error states, and success feedback across the seller dashboard.

---

## Inline Field Validation

### 1. Required Field Indicator
**Pattern:** Asterisk (*) in red, placed after label.

```html
<label for="title">
  Product Title
  <span class="required">*</span>
</label>
<input id="title" type="text" required />
```

**Styling:**
```css
.required {
  color: #F43F5E;
  font-weight: 600;
}
```

**Behavior:**
- Visible at page load (not just on blur/submit)
- Asterisk only; no explanatory text like "(required)"
- Applies to all required fields consistently

### 2. Field-Level Error Message
**Pattern:** Error message appears below input when validation fails.

```html
<div class="form-group">
  <label for="price">Price</label>
  <input type="text" id="price" value="invalid" />
  <div class="field-error">Price must be a valid number (e.g., 19.99)</div>
</div>
```

**Styling:**
```css
.field-error {
  color: #DC2626;
  font-size: 12px;
  margin-top: 6px;
  display: block;
}

input.error {
  border-color: #FCA5A5;
  background-color: #FEF2F2;
}
```

**Behavior:**
- Only shows if field fails validation (not on focus)
- Red text (#DC2626) for visibility
- Input border turns light red, background tinted light red
- Message is specific to the error (not generic "Invalid input")

### 3. Character Count
**Pattern:** Real-time character counter for textarea/text inputs with max length.

```html
<div class="form-group">
  <label for="description">Description</label>
  <textarea id="description" maxlength="1000"></textarea>
  <div class="char-count">
    <span id="charCount">0</span>/1000 characters
  </div>
</div>
```

**Styling:**
```css
.char-count {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

.char-count.warning {
  color: #F59E0B; /* Amber, at 80%+ capacity */
}

.char-count.full {
  color: #DC2626; /* Red, at max */
}
```

**Behavior:**
- Updates as user types (real-time)
- Changes color to amber (#F59E0B) at 80% capacity
- Changes color to red (#DC2626) when at max
- Users can continue typing but input stops accepting (native maxlength behavior)

### 4. Input Hint / Helper Text
**Pattern:** Explanatory text below label, above input.

```html
<div class="form-group">
  <label for="email">Email Address</label>
  <div class="form-hint">
    We'll send you order updates and support to this address.
  </div>
  <input type="email" id="email" />
</div>
```

**Styling:**
```css
.form-hint {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
  margin-bottom: 8px;
}
```

**Behavior:**
- Light gray text (#64748B)
- Positioned between label and input for visual hierarchy
- Short, actionable guidance (not marketing copy)

---

## Form-Level Alerts

### 1. Success Alert
**Pattern:** Green banner above form, appears after successful submission.

```html
<div class="alert alert-success show">
  <strong>✓ Changes saved successfully!</strong>
  <p>Your email template will be used for future orders.</p>
</div>
```

**Styling:**
```css
.alert {
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: none;
  border: 1px solid;
}

.alert.show {
  display: block;
  animation: slideDown 0.3s ease-out;
}

.alert-success {
  background: #F0FDF4;
  border-color: #BBDF37;
  color: #15803D;
}

.alert strong {
  font-weight: 600;
}
```

**Behavior:**
- Appears at top of form (above all inputs)
- Auto-hides after 4–5 seconds OR stays visible if critical
- Green background (#F0FDF4), green border (#BBDF37), dark green text (#15803D)
- Checkmark emoji (✓) for instant visual confirmation

### 2. Error Alert
**Pattern:** Red banner above form if server validation fails.

```html
<div class="alert alert-error show">
  <strong>Import failed</strong>
  <p>Invalid CSV format: missing required column "price" in header row.</p>
</div>
```

**Styling:**
```css
.alert-error {
  background: #FEF2F2;
  border-color: #FECDD3;
  color: #9F1239;
}
```

**Behavior:**
- Appears at top of form (above all inputs)
- Red background (#FEF2F2), light red border (#FECDD3), dark red text (#9F1239)
- Stays visible until user fixes issue or clicks dismiss
- Message explains the root cause (not "Error occurred")

### 3. Info Alert
**Pattern:** Blue banner for informational context (e.g., before action that can't be undone).

```html
<div class="alert alert-info show">
  <strong>ℹ️ Note:</strong> Resetting the template will delete your custom changes and restore the default.
</div>
```

**Styling:**
```css
.alert-info {
  background: #EFF6FF;
  border-color: #BFDBFE;
  color: #1E40AF;
}
```

---

## Validation Timing

### On Input (Real-time)
- Character count updates
- Character count color changes (amber/red)
- No error messages (would be too noisy)

### On Blur (Field loses focus)
- Check for required fields (empty)
- Check for format validation (email, price, URL)
- Show field-level error if invalid

### On Submit
- Check all required fields
- Check all format validations
- If any field invalid: show field-level errors, keep form visible, focus first error
- If all valid: disable submit button, show loading spinner, POST to server
- Server returns: show form-level alert (success or error)

---

## Disabled States

### Submit Button (Disabled)
**Pattern:** Gray button, not clickable, appears when form invalid or file not selected.

```html
<button type="submit" class="btn-primary" disabled>
  Import Products
</button>
```

**Styling:**
```css
button:disabled {
  background: #D1D5DB;
  color: #6B7280;
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Behavior:**
- Never shows submit button enabled until form is "valid enough" to attempt
- File upload: submit disabled until file selected
- Email template: submit enabled once textarea has content
- Product form: submit enabled once all required fields filled

---

## Multi-Step Form Patterns

### Progress Indicator (Future)
**Pattern:** Breadcrumb or step counter for multi-page forms.

```
Step 1: Upload CSV → Step 2: Review → Step 3: Confirm
```

(Not used in MVP, but referenced for future sellers flow)

---

## Mobile Form Patterns

### Touch Target Size
- All inputs, buttons, labels: minimum 44px height
- Touch-friendly spacing: 12px between controls

### Input Focus on Mobile
- When input focused, keyboard opens
- Content doesn't shift (use viewport-fit or proper padding)
- Label stays visible above keyboard (no scroll-away)

### Error Message on Mobile
- Error text stays visible below input (doesn't hide under keyboard)
- Font size remains 12px (readable, not squeezed)

### Button Layout on Mobile
- Primary button: 100% width, stacked
- Secondary buttons: stacked below primary, or small inline

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Color contrast:**
   - Alert text vs. background: 4.5:1 minimum
   - Label text vs. background: 4.5:1 minimum
   - Helper text: 3:1 (non-critical info allowed)

2. **Form associations:**
   ```html
   <label for="inputId">Label text</label>
   <input id="inputId" type="text" />
   <!-- NOT <label>Label <input type="text" /></label> -->
   ```

3. **Error identification:**
   - Error message linked to input via `aria-describedby`
   - Required fields marked with `aria-required="true"`

4. **Focus indicators:**
   - All inputs have visible focus state (outline or shadow)
   - Tab order follows visual order (top to bottom, left to right)

### Example Accessible Form Field:

```html
<div class="form-group">
  <label for="title">Product Title <span class="required">*</span></label>
  <div class="form-hint" id="title-hint">
    Give your product a clear, descriptive name.
  </div>
  <input
    id="title"
    type="text"
    required
    aria-required="true"
    aria-describedby="title-hint"
    maxlength="200"
  />
  <div class="char-count">
    <span id="title-count">0</span>/200 characters
  </div>
</div>
```

---

## Color Reference

| Element | Color | Usage |
|---------|-------|-------|
| Required asterisk | #F43F5E (red) | Marks required fields |
| Field error text | #DC2626 (dark red) | Input validation errors |
| Field error border | #FCA5A5 (light red) | Error input border |
| Field error bg | #FEF2F2 (very light red) | Error input background |
| Helper text | #64748B (slate) | Explanatory text below label |
| Char count normal | #94A3B8 (slate) | Counter under limit |
| Char count warning | #F59E0B (amber) | Counter at 80%+ |
| Char count full | #DC2626 (red) | Counter at max |
| Success alert bg | #F0FDF4 (light green) | Success message background |
| Success alert border | #BBDF37 (green) | Success message border |
| Success alert text | #15803D (dark green) | Success message text |
| Error alert bg | #FEF2F2 (light red) | Error message background |
| Error alert border | #FECDD3 (light red) | Error message border |
| Error alert text | #9F1239 (dark red) | Error message text |
| Info alert bg | #EFF6FF (light blue) | Info message background |
| Info alert border | #BFDBFE (light blue) | Info message border |
| Info alert text | #1E40AF (dark blue) | Info message text |
| Disabled button bg | #D1D5DB (gray) | Disabled button background |

---

## Example Forms

### Short Form (Product Title Only)
```
┌─────────────────────────────────┐
│ Product Title *                 │
│ Give your product a clear name. │
│ [_______________]               │
│ 0/200 characters                │
└─────────────────────────────────┘
[Save] [Cancel]
```

### Complex Form (Email Template)
```
┌──────────────────────────────────────┐
│ Email Subject Line *                 │
│ Max 100 characters.                  │
│ [Order Confirmation from {{shop}}___] │
│ 32/100 characters                    │
│                                      │
│ Email Body *                         │
│ Max 5000 characters. HTML allowed.   │
│ [_______________________________]    │
│ [Hello {{customerName}},   ]         │
│ [                           ]        │
│ [                           ]        │
│ [                           ]        │
│ 1200/5000 characters                │
│                                      │
│ Available Merge Tags                │
│ {{customerName}} {{orderDate}}       │
│ {{orderTotal}}   {{items}}           │
│                                      │
│ [Save] [Reset to Default] [Test]    │
└──────────────────────────────────────┘
```

---

## Testing Checklist

- [ ] Required field marked with red asterisk
- [ ] Placeholder text doesn't replace label
- [ ] Character count updates in real-time
- [ ] Character count color changes (amber at 80%, red at max)
- [ ] Field error appears on blur (if invalid)
- [ ] Submit button disabled until form valid
- [ ] Form-level success alert appears after submit
- [ ] Form-level error alert appears if server rejects
- [ ] Error message is specific (not "invalid input")
- [ ] Focus visible on all inputs (outline/shadow)
- [ ] Mobile: all touch targets ≥44px
- [ ] Mobile: label stays visible above keyboard
- [ ] Keyboard tab order follows visual order
- [ ] Error message linked via aria-describedby

