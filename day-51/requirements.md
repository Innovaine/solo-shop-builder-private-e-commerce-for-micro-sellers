# Day 51 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

## Goal today
Enable sellers to bulk import products from CSV (Etsy migration use-case) and customize their order confirmation emails (branding + messaging control).

## Features in scope
- **FR-28: Product CSV import** — Seller uploads CSV file (title, price, description, category, image_url), system bulk-creates products for their shop.
- **FR-35: Order confirmation email template editor** — Seller can customize order confirmation email body (pre-built template with merge tags like {{customerName}}, {{orderTotal}}, {{trackingLink}}). Email sent to customer after payment with seller's custom message.

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-28 | Product CSV import | GET /dashboard/products/import (page with file upload). POST /api/products/import with multipart file. Expected CSV columns: title, price, description, category, image_url (all except image_url required). Parse CSV, validate each row, create Product records. Seller_id inferred from session. Return success/error summary: "Imported 45 products, 3 errors (row 2: title missing, row 5: invalid price)". | 1. Page loads at /dashboard/products/import with file input + submit button. 2. Upload accepts .csv files only (MIME check). 3. File size ≤ 10 MB. 4. CSV parsing: skip header row, validate required columns + data types. 5. Price must be valid decimal (e.g., 19.99, not "nineteen"). 6. Category must be one of: Handmade, Vintage, Supplies, Other (enum validation). 7. image_url optional; if provided, must be valid URL. 8. On success: return 200 with {imported: 45, errors: [{row, message}], downloadErrorReport: "errors.csv" (optional file)}. 9. Validation errors don't abort import; create products that pass validation, report failures. 10. All new products inherit category from CSV, appear on storefront immediately. 11. Duplicate product names within same shop are allowed (no uniqueness constraint per product name). |
| FR-35 | Email template editor | GET /dashboard/email-template, PUT /api/shops/{shopId}/email-template with {subject, body}. Subject is email subject line (max 100 chars). Body is HTML + text with merge tags: {{customerName}}, {{orderDate}}, {{orderTotal}}, {{items}} (product names/qtys), {{trackingLink}}, {{shopName}}. Pre-fill form with default template on first load. On save, validate merge tags exist in body, return 200 with updated Shop. Send test email to seller's registered email address with real merge tag values (sample order). | 1. Page loads at /dashboard/email-template with form: subject input (text), body textarea (HTML editor). 2. Form pre-fills with default template (subject: "Order Confirmation from {{shopName}}", body: includes standard sections for greeting, items table, tracking info, footer). 3. Subject max 100 chars, body max 5000 chars. 4. Merge tag reference (?) shows list of available tags + example values. 5. Save button sends PUT /api/shops/{shopId}/email-template. 6. Returns 200 with "Template saved". 7. "Send test email" button: sends preview email to seller's email (Session.email) with sample order data (mock customer name, real shop name, etc.). 8. On form validation error (e.g., invalid merge tags, missing required fields), show error message inline (don't create/update). 9. On successful save, "Template updated" confirmation appears. 10. Editor supports line breaks + basic HTML formatting (no script tags). Sanitize on save (DOMPurify or similar). |

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | CSV import: process 1000-row file in <10 seconds (p95). Return success summary within 15s. |
| NFR-2 | Performance | Email template editor: page loads in <1.5s, save completes in <2s. Test email delivers within 5 minutes. |
| NFR-3 | Security | Seller can only import/edit templates for their own shop (session seller_id must match shop_id). |
| NFR-4 | Security | CSV parsing must prevent XSS: sanitize title, description, and any user input before storage. |
| NFR-5 | Security | Email template body sanitized: strip <script>, <iframe>, onclick handlers; allow safe HTML (p, a, b, i, ul, li, br, table). Use DOMPurify or Sanitize-html npm package. |
| NFR-6 | Security | File upload: verify MIME type is text/csv (not executable). Reject files >10 MB. |
| NFR-7 | Data | Products created from CSV inherit default inventory (quantity_available unset or NULL; seller must edit individually or implement bulk inventory edit later). |
| NFR-8 | Observability | Log each CSV import attempt: seller_id, filename, row count, success/failure count, errors summary. |
| NFR-9 | Accessibility | CSV import page: file input has label "Choose CSV file", error summary is aria-live. Email template editor: textarea has label "Email body", merge tag reference is expandable (details/summary element or modal). |
| NFR-10 | Mobile | CSV import page works on mobile (file picker, error display responsive). Email template editor textarea usable on mobile (keyboard open, content doesn't overflow). |

## Stack chosen
- **Backend:** Node.js + Express/Fastify in TypeScript (existing, no change)
- **Web frontend:** Next.js App Router, TypeScript, Tailwind CSS (existing)
- **Database:** Postgres + Prisma ORM (existing)
- **CSV parsing library:** papaparse (Papa.js) for robust CSV parsing with error handling
- **Email sanitization:** DOMPurify (npm) for template body XSS prevention
- **Why this stack:** Team already shipping React/Next. PapaParse is lightweight and handles edge cases (quoted cells, line breaks). DOMPurify is trusted XSS prevention library.

## Out of scope (do NOT build today)
- **Advanced CSV import:** no column mapping UI (fixed column order), no duplicate detection, no conditional category mapping
- **Email template designer UI:** no WYSIWYG editor, plain textarea with merge tag reference only
- **Scheduled emails:** emails sent on-demand only (no automation like "email if order not shipped 48h")
- **Email preview in browser:** test email delivery is the verification method (not in-app preview)
- **Bulk inventory edit via CSV:** FR-27 (Bulk image upload) separate; inventory per-product edit only
- **Product image download/sync from CSV URLs:** image_url is metadata only; seller provides valid public image URLs (we don't cache/proxy)
- **CSV export template:** FR-29 (Product CSV export) and FR-30 (Order CSV export) exist separately for sellers exporting their own products
- **Multi-language email templates:** English only for MVP
- **Conditional merge tags:** all merge tags rendered in all templates (no if/else logic)

## Open questions (owner, please answer before Wednesday)
1. **CSV file size limit:** Confirmed 10 MB? (Affects memory usage during parsing. 10MB = ~50K rows, reasonable for micro-sellers with 100–500 products.)
2. **Inventory handling:** Should bulk-imported products default to quantity_available = 999 (assume in stock) or NULL (seller must manually set)? Recommend NULL to force seller attention, prevent overselling.
3. **Email template versioning:** Should we store template history (revert to previous version)? Recommend NO for MVP (single version only).
4. **Error report download:** Should CSV import return downloadable error report (errors.csv) or just summary in response? Recommend summary in response (simpler UX for now).
5. **Test email recipient:** Should test email go to seller's registered email or a custom email they specify? Recommend seller's registered email (simplest, no additional field).

## Definition of done for day 51
- [ ] FR-28: CSV import page loads at /dashboard/products/import with file input + submit button
- [ ] FR-28: Seller can select .csv file, submit, receive success/error summary ("Imported 45, 3 errors")
- [ ] FR-28: CSV parsing validates: required columns (title, price, description, category), data types, enum values
- [ ] FR-28: Products created from valid CSV rows appear on /shop/{slug} storefront immediately
- [ ] FR-28: Products sanitized (no XSS risk in title/description)
- [ ] FR-35: Email template editor loads at /dashboard/email-template with form (subject + body textarea)
- [ ] FR-35: Form pre-fills with default template (subject + body)
- [ ] FR-35: Seller can edit subject/body, save template, receive "Template saved" confirmation
- [ ] FR-35: Merge tags sanitized in body (no <script>, onclick); allowed tags: p, a, b, i, ul, li, br, table
- [ ] FR-35: "Send test email" button sends preview email to seller's registered email with real merge tag values
- [ ] FR-35: Email template persists to database (Shop.emailTemplateSubject + Shop.emailTemplateBody)
- [ ] FR-35: Future order confirmation emails use seller's custom template (verified in test)
- [ ] FR-28 + FR-35: Both features mobile-responsive (320px+)
- [ ] FR-28 + FR-35: Verified via code review (Søren checks auth, XSS prevention, CSV parsing edge cases, merge tag validation)
- [ ] FR-28 + FR-35: Each feature has ≥1 Playwright test covering happy path + error state (invalid CSV format, invalid email tags)
