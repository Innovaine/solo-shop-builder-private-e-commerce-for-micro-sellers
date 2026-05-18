# CSV Import/Export Patterns — Solo Shop Builder

## Overview
Patterns and UI conventions for CSV-based data operations (import, export, error handling).

## CSV Import Flow

### 1. Upload Zone (Primary CTA)
**Pattern:** Drag-and-drop file input with visual affordance.

```html
<div class="upload-zone" id="uploadZone">
  <div class="upload-zone-icon">📄</div>
  <div class="upload-zone-text">Click to upload or drag and drop</div>
  <div class="upload-zone-hint">CSV file (max 10MB)</div>
  <input type="file" id="csvFile" accept=".csv" />
</div>
```

**Behavior:**
- Click anywhere to open file picker (accept `.csv` only)
- Drag file over zone → zone changes background color to green (#F0FDF4), border to green (#10B981)
- Drop file → immediately shows selected state
- Maximum file size: 10 MB (enforced client-side + server-side)

### 2. File Selected State
**Pattern:** Inline confirmation showing filename, size, and remove option.

```html
<div class="file-selected show">
  <div class="file-icon">✓</div>
  <div class="file-info">
    <div class="file-name">products.csv</div>
    <div class="file-size">2.4 MB</div>
  </div>
  <button class="file-remove">Remove</button>
</div>
```

**Behavior:**
- Shows when file is selected
- Remove button clears input and returns to upload zone
- Submit button becomes enabled (changes from disabled gray to green)

### 3. CSV Format Reference
**Pattern:** Collapsible/always-visible reference showing expected columns.

```html
<div class="csv-format">
  <h3>Expected CSV Format</h3>
  <ul class="csv-columns">
    <li><strong>title</strong> <span class="required">*</span> — Product name</li>
    <li><strong>price</strong> <span class="required">*</span> — Price in USD (19.99)</li>
    <li><strong>description</strong> <span class="required">*</span> — Description</li>
    <li><strong>category</strong> <span class="required">*</span> — Handmade, Vintage, Supplies, Other</li>
    <li><strong>image_url</strong> — Public image URL (optional)</li>
  </ul>
</div>
```

**Behavior:**
- Always visible on page load (not collapsible, easier to scan)
- Asterisk (*) in red (#F43F5E) marks required columns
- Shows data type expectations (e.g., "Price in USD (19.99)", not "number")
- Optional fields marked clearly

### 4. Import Results (Success State)
**Pattern:** Summary card with counts and optional error list.

```html
<div class="import-results show">
  <h3>Import Complete</h3>
  <div class="result-row">
    <div class="result-label">Products Imported</div>
    <div class="result-value">45</div>
  </div>
  <div class="result-row">
    <div class="result-label">Errors</div>
    <div class="result-value">3</div>
  </div>
  <div class="result-errors" style="display: block;">
    <h4>Issues to review:</h4>
    <div class="error-item">Row 2: title is required</div>
    <div class="error-item">Row 5: price must be a valid number (got "nineteen")</div>
    <div class="error-item">Row 9: category must be one of: Handmade, Vintage, Supplies, Other</div>
  </div>
</div>
```

**Behavior:**
- Shows after upload completes (no page reload)
- Displays imported count + error count side-by-side
- If errors > 0, expands error list showing row number + error message
- CTA button links to /dashboard/products to view newly imported products

### 5. Error Handling (Upload Errors)
**Pattern:** Inline alert above form, dismissible or auto-hide.

**File validation errors (client-side):**
- File not CSV: "Please upload a CSV file"
- File > 10 MB: "File must be smaller than 10MB"

**CSV parsing errors (server response):**
```html
<div class="alert alert-error show">
  <strong>Import Failed</strong>
  <p>Invalid CSV format: missing required column "price"</p>
</div>
```

**Behavior:**
- Appears at top of form (above heading)
- Red background (#FEF2F2), red text (#9F1239)
- Auto-dismisses after 5 seconds OR user clicks to close
- Server errors block import entirely (returns 400)
- Parsing errors allow partial success (row-level failures, not file-level)

---

## CSV Export Flow

### 1. Export Trigger Button
**Pattern:** Primary or secondary button in dashboard header.

```html
<div class="dashboard-actions">
  <button class="btn-primary">Export CSV</button>
</div>
```

**Behavior:**
- Location: top-right of data table/list
- Initiates download immediately (no modal)
- File name: `orders-YYYY-MM-DD.csv` (using seller's timezone or UTC)
- Format: RFC 4180 (standard CSV)

### 2. Export Confirmation
**Pattern:** Optional toast or success message after download.

```
✓ Exported 127 orders as orders-2026-05-17.csv
```

**Behavior:**
- Appears briefly (2–3 seconds) or not at all (browser handles download)
- Gives seller confidence file was generated

### 3. CSV Export Columns (Orders)
**Pattern:** Consistent column ordering for audit/accounting purposes.

```
Order ID, Date, Customer Email, Items (quantity), Total, Status, Tracking ID
```

**Behavior:**
- Always same column order (no customization for MVP)
- Dates in ISO 8601 (YYYY-MM-DD)
- Total as decimal with 2 places (e.g., 145.50)
- Status as single value (pending, paid, in-progress, shipped, delivered)
- Tracking ID as plain string (or empty if not set)

---

## Mobile Patterns

### Upload Zone (Mobile)
- Smaller padding (28px instead of 40px) to fit small screens
- Icon size same (emoji is scalable)
- Text stacks vertically, centered

### File Selected (Mobile)
- Full-width button layout (100% width)
- Remove button inline (no separate row)

### Error Display (Mobile)
- Alert text wraps naturally
- Error list scrollable if >5 items

### Buttons (Mobile)
- Full-width CTA buttons on mobile (<768px)
- Flex-wrap for button groups (stack vertically if needed)
- Min 44px touch target height (accessible)

---

## Accessibility Notes

### CSV Import Page
- File input label clearly linked: `<label for="csvFile">`
- Error alerts have `aria-live="polite"` for screen readers
- Merge tag reference (if applicable) uses `<details><summary>` for expandable sections

### Upload Zone
- Keyboard accessible: Tab to zone → Enter/Space opens file picker
- Focus styles visible (outline or shadow)

### Error List
- Each error item is separate list item: `<li>`
- Context clear: "Row 5: ..." tells user exact issue location

---

## Color Reference

| Element | Color | Usage |
|---------|-------|-------|
| Upload zone normal | #FAFBFC (bg), #E2E8F0 (border) | Default state |
| Upload zone hover | #F0F4F8 (bg), #3B4C63 (border) | Hover state |
| Upload zone dragover | #F0FDF4 (bg), #10B981 (border) | Active drag state |
| Success alert | #F0FDF4 (bg), #BBDF37 (border), #15803D (text) | Success feedback |
| Error alert | #FEF2F2 (bg), #FECDD3 (border), #9F1239 (text) | Error feedback |
| Button primary | #10B981 (bg), white (text) | Submit/import action |
| Button primary hover | #059669 (darker green) | Hover state |
| Required asterisk | #F43F5E (red) | Marks required fields |
| Disabled button | #D1D5DB (gray), gray text | Inactive state |

---

## Example CSV (Products)

```csv
title,price,description,category,image_url
Handmade Ceramic Bowl,29.99,Beautiful hand-thrown ceramic bowl with glaze finish,Handmade,https://example.com/bowl.jpg
Vintage Brass Clock,45.00,1970s brass mantle clock in working condition,Vintage,https://example.com/clock.jpg
Macramé Plant Hanger,19.99,Jute macramé hanger fits pots up to 8 inches,Supplies,https://example.com/hanger.jpg
```

---

## Example CSV (Orders)

```csv
Order ID,Date,Customer Email,Items,Total,Status,Tracking ID
ORD-1001,2026-05-15,jane@example.com,"Hand-thrown bowl (1), Mug (2)",145.50,shipped,1Z999AA10123456784
ORD-1002,2026-05-16,bob@example.com,"Plant hanger (3)",59.97,in-progress,
ORD-1003,2026-05-17,alice@example.com,"Ceramic set (1)",89.00,pending,
```

---

## Future Enhancements (Post-MVP)

- **Column mapping UI:** Let sellers map CSV columns to product fields
- **Scheduled imports:** Seller uploads file, system syncs daily/weekly
- **Duplicate detection:** Warn if product title already exists
- **Inventory sync:** Import stock counts from CSV
- **Export filters:** Date range, status filter, custom column selection
- **Error report download:** Generate CSV of failed rows with reasons
- **Batch operations:** Bulk update inventory, prices, categories (via CSV)

