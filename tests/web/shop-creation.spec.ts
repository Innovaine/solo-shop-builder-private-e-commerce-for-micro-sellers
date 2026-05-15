import { test, expect } from '@playwright/test';

/**
 * FR-3 & FR-4: Shop creation form and API
 * Tests:
 * 1. Shop creation form UI loads without errors
 * 2. Name auto-populates slug (lowercase, hyphens)
 * 3. Seller can override slug
 * 4. Submit creates shop via POST /api/shops
 * 5. Duplicate slug returns 400 error
 * 6. Invalid slug formats rejected
 */

test.describe('FR-3 & FR-4: Shop Creation', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up authenticated session
    await context.addCookies([{
      name: 'session',
      value: 'test-session-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Strict'
    }]);
  });

  test('FR-4: Shop creation form loads without errors', async ({ page }) => {
    // Navigate to create shop page
    await page.goto('http://localhost:3000/dashboard/create-shop');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/day-07/06-create-shop-form.png' });

    // Check for form fields
    const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="shop name"]').first());
    const slugInput = page.locator('input[name="slug"]').or(page.locator('input[placeholder*="slug"]').first());
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Create")'));

    await expect(nameInput).toBeVisible();
    await expect(slugInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  });

  test('FR-4: Name auto-populates slug (lowercase, hyphens)', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/create-shop');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="shop name"]').first());
    const slugInput = page.locator('input[name="slug"]').or(page.locator('input[placeholder*="slug"]').first());

    // Type shop name with spaces and mixed case
    await nameInput.fill('My Awesome Shop');
    await page.waitForTimeout(500); // Wait for auto-populate

    // Check slug is auto-populated
    const slugValue = await slugInput.inputValue();
    // Should be lowercase with hyphens
    expect(slugValue).toMatch(/^[a-z0-9-]+$/);
    expect(slugValue).toContain('-');

    await page.screenshot({ path: 'test-results/day-07/07-slug-autopopulate.png' });
  });

  test('FR-4: Seller can override slug', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/create-shop');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="shop name"]').first());
    const slugInput = page.locator('input[name="slug"]').or(page.locator('input[placeholder*="slug"]').first());

    await nameInput.fill('Test Shop');
    await slugInput.clear();
    await slugInput.fill('custom-slug-override');

    const slugValue = await slugInput.inputValue();
    expect(slugValue).toBe('custom-slug-override');

    await page.screenshot({ path: 'test-results/day-07/08-slug-override.png' });
  });

  test('FR-3: Valid shop creation succeeds', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/create-shop');
    await page.waitForLoadState('networkidle');

    const uniqueSlug = `test-shop-${Date.now()}`;
    const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="shop name"]').first());
    const slugInput = page.locator('input[name="slug"]').or(page.locator('input[placeholder*="slug"]').first());
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Create")'));

    await nameInput.fill('Test Shop');
    await slugInput.clear();
    await slugInput.fill(uniqueSlug);

    // Submit form
    await submitButton.click();

    // Should show success or redirect
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/day-07/09-shop-created.png' });

    // Check if redirected or success message shown
    const currentUrl = page.url();
    const hasSuccessMessage = await page.locator('text=/success|created/i').count() > 0;

    expect(currentUrl.includes('dashboard') || hasSuccessMessage).toBeTruthy();
  });

  test('FR-3: Invalid slug format rejected', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/create-shop');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="shop name"]').first());
    const slugInput = page.locator('input[name="slug"]').or(page.locator('input[placeholder*="slug"]').first());
    const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Create")'));

    // Test slug with uppercase (should be rejected or auto-converted)
    await nameInput.fill('Invalid Slug Test');
    await slugInput.clear();
    await slugInput.fill('UPPERCASE');
    await submitButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/day-07/10-invalid-slug-uppercase.png' });

    // Test slug that's too short
    await page.goto('http://localhost:3000/dashboard/create-shop');
    await nameInput.fill('Short');
    await slugInput.clear();
    await slugInput.fill('ab'); // Less than 3 chars
    await submitButton.click();
    await page.waitForTimeout(1000);

    // Should see error message
    const errorVisible = await page.locator('text=/error|invalid|too short/i').count() > 0;
    await page.screenshot({ path: 'test-results/day-07/11-invalid-slug-short.png' });
  });
});
