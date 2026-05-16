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

## CRITICAL FIXES FOR DAY 30 PAGES (FORMFIELD VIOLATIONS)

### Issue 1: Wrong Prop Names

**PAGES AFFECTED:** `/dashboard/branding`, `/dashboard/email-template`

**WRONG (Current code):**
```tsx
<FormField
  label="Primary Color"
  help="Main brand color"  // ❌ WRONG PROP NAME
>
  <div className="flex gap-3">
    <input type="color" value={primaryColor} onChange={handleColorChange} />  // ❌ DON'T NEST INPUTS
    <input type="text" value={primaryHex} />
  </div>
</FormField>
```

**CORRECT:**
```tsx
<FormField
  label="Primary Color"
  id="primaryColor"
  type="text"
  placeholder="#3B4C63"
  helpText="Main brand color (headers, navigation)"  // ✅ CORRECT PROP NAME
  fullWidth={true}
/>
```

**Why:** FormField IS the input wrapper. It handles label, input, error, and helpText internally. Don't try to nest a raw `<input>` inside FormField — use the `type` prop instead.

### Issue 2: Multiple Inputs in One Field

If you need a color picker WITH a text input for the hex code, use TWO FormFields side-by-side:

```tsx
<div className="flex gap-4">
  <FormField
    label="Primary Color (Visual)"
    id="colorPicker"
    type="color"
    fullWidth={false}
    className="flex-none w-20"
  />
  <FormField
    label="Primary Color (Hex)"
    id="colorHex"
    type="text"
    placeholder="#3B4C63"
    helpText="Copy hex code here or choose above"
    fullWidth={true}
  />
</div>
```

### Issue 3: Color Class Names

**PAGES AFFECTED:** All pages using `text-slate-blue`, `text-slateBlue`, `bg-slate-blue`

**Why the confusion:** Tailwind config defines colors with hyphens (e.g., `slate-blue`), but the CSS class name is generated from that token. The class SHOULD be `text-slate-blue` (hyphenated), NOT `text-slateBlue` (camelCase).

**WRONG:**
```tsx
<div className="text-slateBlue">Text</div>  // ❌ camelCase doesn't work
<button className="bg-slate_blue">Button</button>  // ❌ underscores don't work
```

**CORRECT (if Tailwind is configured):**
```tsx
<div className="text-slate-blue">Text</div>  // ✅ if defined in tailwind.config.ts
<button className="bg-slate-blue">Button</button>
```

**If this doesn't work:** Fall back to arbitrary color values:
```tsx
<div className="text-[#3B4C63]">Text</div>  // ✅ Tailwind arbitrary value syntax
<button className="bg-[#3B4C63]">Button</button>
```

See `design/system/color-usage.md` for the complete mapping of color tokens to hex values.

### Issue 4: Textarea in FormField

**WRONG:**
```tsx
<FormField label="Description" helpText="Optional">
  <textarea placeholder="..." />  // ❌ DON'T NEST
</FormField>
```

**CORRECT:**
```tsx
<FormField
  label="Description"
  id="description"
  type="textarea"
  placeholder="Tell us about your product..."
  helpText="Optional. Maximum 500 characters."
/>
```

FormField handles textarea rendering when `type="textarea"` is passed.

---

## Summary of Common Mistakes (COPY-PASTE REFERENCE FOR ENGINEERS)

| Mistake | Wrong | Right |
|---------|-------|-------|
| Wrong prop name for help text | `help="text"` | `helpText="text"` |
| Nested input inside FormField | `<FormField><input /></FormField>` | `<FormField type="text" />` |
| Nested textarea inside FormField | `<FormField><textarea /></FormField>` | `<FormField type="textarea" />` |
| Button width prop | `<Button fullWidth>` | `<Button className="w-full">` |
| Card padding value | `padding="xl"` | `padding="lg"` (or `className="p-12"`) |
| Color class camelCase | `text-slateBlue` | `text-slate-blue` (or `text-[#3B4C63]`) |
| Inventing color class | `text-slate_blue` or `text-slateBlue` | Use exact token name or arbitrary value |

---

Last updated: Day 30, Cycle 65  
Questions? Check `design/system/components.html` for visual reference. File a task if your component needs different props.
