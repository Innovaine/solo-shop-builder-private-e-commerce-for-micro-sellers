# Tailwind Color Token Reference

## Quick Copy-Paste Reference

For Tailwind class usage, use EXACT token names with hyphens:

```
Text colors:           Background colors:       Border colors:
text-slate-blue        bg-slate-blue            border-whisper
text-charcoal          bg-cream                 border-emerald
text-slate             bg-white                 border-rose
text-emerald           bg-emerald
text-rose              bg-rose
text-amber             bg-amber
```

## Full Mapping

| Token Name | Hex | CSS Class | Use | Example |
|---|---|---|---|---|
| **slate-blue** | #3B4C63 | `.text-slate-blue`, `.bg-slate-blue`, `.border-slate-blue` | Primary, headers, seller UI | Button primary color, navigation background |
| **cream** | #FAF9F7 | `.bg-cream`, `.text-cream` | Page background, neutral surface | Dashboard background, card hover |
| **white** | #FFFFFF | `.bg-white`, `.text-white` | Card surfaces, text on dark | Form backgrounds, white text on slate-blue |
| **emerald** | #10B981 | `.text-emerald`, `.bg-emerald`, `.border-emerald` | Success, positive actions | "Paid" badge, "Add" button, checkmark |
| **rose** | #F43F5E | `.text-rose`, `.bg-rose`, `.border-rose` | Danger, errors, destructive | "Delete" button, error messages, "Failed" badge |
| **amber** | #F59E0B | `.text-amber`, `.bg-amber` | Warning, pending states | "Low stock" badge, "Processing" state |
| **charcoal** | #1F2937 | `.text-charcoal` | Body text, main copy | P tags, regular text |
| **slate** | #64748B | `.text-slate` | Secondary text, descriptions | Help text, captions, secondary info |
| **whisper** | #E2E8F0 | `.border-whisper`, `.bg-whisper`, `.text-whisper` | Borders, dividers, subtle backgrounds | Form borders, dividers, disabled states |

## Tailwind Configuration

These tokens are defined in `tailwind.config.ts` under `extend.colors`:

```js
colors: {
  'slate-blue': '#3B4C63',
  'cream': '#FAF9F7',
  'charcoal': '#1F2937',
  'slate': '#64748B',
  'emerald': '#10B981',
  'rose': '#F43F5E',
  'amber': '#F59E0B',
  'whisper': '#E2E8F0',
}
```

## Usage Examples

### ✅ CORRECT

```tsx
<button className="bg-slate-blue text-white">Save</button>
<div className="border border-whisper">Content</div>
<p className="text-slate">Secondary information</p>
<span className="bg-emerald text-white px-3 py-1 rounded">Success</span>
```

### ❌ WRONG

```tsx
<button className="bg-slateBlue">Save</button>  // camelCase ✗
<div className="border border-whisperGray">Content</div>  // invented name ✗
<p className="text-slate-gray">Info</p>  // doesn't exist ✗
<span className="bg-green-500">Success</span>  // standard Tailwind, not our palette ✗
```

## Fallback: Arbitrary Value Syntax

If a color class isn't resolving, use Tailwind's arbitrary value syntax:

```tsx
<button className="bg-[#3B4C63] text-white">Save</button>
<div className="border-[#E2E8F0]">Content</div>
```

This directly references the hex code without relying on the token configuration.

## Common Issues

### Issue: `text-slate-blue` class not resolving

**Check:**
1. Is `tailwind.config.ts` loading the color tokens correctly?
2. Run `npm run build` to see if Tailwind is generating the CSS classes
3. Check browser DevTools: is the class in the CSS output?
4. If not, use arbitrary value: `text-[#3B4C63]`

### Issue: Color looks wrong on screen

**Check:**
1. Is the parent element setting a conflicting color? (e.g., `text-charcoal` on a `text-white` parent)
2. Are you using opacity modifiers that didn't exist in config? (e.g., `bg-emerald/50` without configuring opacity)
3. Test in Chrome DevTools: inspect the element and verify the hex value in the computed styles

## Component Color Conventions

- **Buttons:**
  - Primary: `bg-emerald text-white` (success, main action)
  - Secondary: `bg-white text-slate-blue border border-whisper` (neutral, alternative)
  - Ghost: `bg-transparent text-slate-blue` (inline, lightweight)
  - Danger: `bg-rose text-white` (destructive, delete, refund)

- **Cards:**
  - Border: `border border-whisper`
  - Hover: `shadow-md` (not color-based)
  - Background: `bg-white` (default) or `bg-cream` (elevated)

- **Text:**
  - Headings: `text-charcoal`
  - Body: `text-charcoal` (main) or `text-slate` (secondary)
  - Help text: `text-slate text-sm`
  - Errors: `text-rose`

- **Status Badges:**
  - Success (Paid, Delivered): `bg-emerald text-white`
  - Warning (Processing, Low Stock): `bg-amber text-charcoal`
  - Error (Failed, Rejected): `bg-rose text-white`
  - Neutral (Pending): `bg-slate text-white`

Last updated: Day 30, Cycle 65  
For questions about color usage, check `design/branding/brand.md` for rationale.
