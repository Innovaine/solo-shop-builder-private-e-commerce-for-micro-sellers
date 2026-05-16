# Component API Guide

**For:** App engineers implementing pages  
**Purpose:** Reference exact prop names, types, and valid values for UI components  
**Status:** Day 26, Cycle 60

---

## Quick Reference

Use these exact prop signatures when building React pages. Do NOT invent props.

### Button

```tsx
<Button
  variant="primary" | "secondary" | "ghost" | "danger"  // optional, default: "primary"
  size="sm" | "md" | "lg"                                 // optional, default: "md"
  loading={boolean}                                       // optional, shows spinner + disables
  disabled={boolean}                                      // optional
  className="w-full"                                      // optional, use for width/extra styling
  onClick={() => {}}                                      // optional
>
  Button Text
</Button>
```

**Common mistakes:**
- ❌ `fullWidth={true}` → ✅ `className="w-full"`
- ❌ `p="lg"` (padding prop) → ✅ use `className="p-8"`
- ❌ `width="full"` → ✅ `className="w-full"`

---

### Card

```tsx
<Card
  variant="default" | "elevated" | "interactive"  // optional, default: "default"
  padding="none" | "sm" | "md" | "lg"             // optional, default: "md"
  className="..."                                  // optional, for extra styling
>
  Card content
</Card>
```

**Padding values:**
- `none` = 0 padding
- `sm` = p-3 (12px)
- `md` = p-6 (24px)
- `lg` = p-8 (32px)

**Common mistakes:**
- ❌ `padding="xl"` → ✅ `padding="lg"` or `className="p-12"`
- ❌ `p="lg"` → ✅ `padding="lg"`
- ❌ `variant="shadow"` → ✅ `variant="elevated"`

---

### FormField

```tsx
<FormField
  label="Label Text"                              // required
  id="field-id"                                   // optional, auto-generated if omitted
  type="text" | "email" | "password" | ...       // optional, default: "text"
  placeholder="Enter value..."                    // optional
  required={boolean}                              // optional, adds * to label
  error="Error message text"                      // optional, shows error state
  helpText="Help text below input"                // optional
  fullWidth={boolean}                             // optional, default: true
/>
```

**Common mistakes:**
- ❌ `htmlFor="id"` → ✅ `id="id"`
- ❌ `help="text"` → ✅ `helpText="text"`
- ❌ Nested input inside FormField → FormField IS the input wrapper, don't nest
- ❌ `name="field"` → ✅ use `id` instead, or pass through `...props`

---

### Input

Use `Input` only for inline cases without a label. For labeled inputs, wrap with `FormField`.

```tsx
<Input
  id="input-id"                                   // optional
  type="text" | "email" | "password" | ...       // optional, default: "text"
  placeholder="Enter value..."                    // optional
  value={string}                                  // optional, for controlled inputs
  onChange={(e) => {}}                            // optional
  error={boolean}                                 // optional, adds error styling (red border)
  fullWidth={boolean}                             // optional, default: true
  disabled={boolean}                              // optional
/>
```

---

## Real Examples

### ✅ Correct: Form with FormField

```tsx
<form>
  <FormField
    label="Email Address"
    id="email"
    type="email"
    placeholder="seller@example.com"
    required
    helpText="We'll send order notifications here."
  />
  
  <FormField
    label="Shop Name"
    id="shopName"
    placeholder="My Awesome Shop"
    error={shopNameError ? "This name is taken" : ""}
  />
  
  <Button variant="primary" onClick={handleSubmit}>
    Create Shop
  </Button>
</form>
```

### ✅ Correct: Button with width

```tsx
<Button variant="primary" className="w-full">
  Save Changes
</Button>
```

### ✅ Correct: Card with padding

```tsx
<Card variant="elevated" padding="lg">
  <h2>Order Summary</h2>
  <p>Your order total: $129.99</p>
</Card>
```

### ❌ WRONG: Inventing props

```tsx
// DON'T DO THIS:
<Card padding="xl" width="500px">
<Button fullWidth variant="primary">
<FormField htmlFor="id" label="Name" help="text">
```

---

## When Build Fails with Component Errors

**Error pattern:** `Type 'X' is not assignable to type 'Y'`

**Steps:**
1. Copy the prop name and value from the error
2. Check this file for the CORRECT prop signature
3. Replace with the correct prop name/value
4. Run `npm run build` again

**Example:**
```
Error: Property 'fullWidth' does not exist on type 'ButtonProps'
Fix: Change <Button fullWidth> to <Button className="w-full">
```

---

## Available Tailwind Classes for Overrides

All components accept `className` for Tailwind overrides:

- **Width:** `w-full`, `w-1/2`, `w-auto`, `max-w-md`, `max-w-lg`, `max-w-xl`
- **Padding:** `p-3`, `p-6`, `p-8`, `p-12`, `px-4`, `py-2`
- **Margin:** `mt-4`, `mb-6`, `mx-auto`
- **Text:** `text-sm`, `text-base`, `text-lg`, `font-bold`, `text-center`
- **Colors:** `text-emerald`, `text-rose`, `bg-cream`, `bg-charcoal`

Example:
```tsx
<Button 
  variant="primary" 
  className="w-full mt-4 text-lg"
>
  Save
</Button>
```

---

## Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ Implemented | All variants + sizes working |
| Card | ✅ Implemented | Padding options are `none`, `sm`, `md`, `lg` only |
| FormField | ✅ Implemented | Wrapper around Input with label + error |
| Input | ✅ Implemented | Use FormField for labeled inputs |
| Badge | ✅ Implemented | See components.html for variants |
| Table | ✅ Implemented | Standard HTML table, styled |
| Modal | ⚠️ Not yet | Use headless UI or custom div + backdrop |
| Dropdown | ⚠️ Not yet | Use custom or headless ui |

---

Last updated: Day 26, Cycle 60  
Questions? Check `design/system/components.html` for visual reference.
