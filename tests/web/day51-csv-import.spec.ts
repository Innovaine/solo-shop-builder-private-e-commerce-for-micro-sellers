import { test, expect } from '@playwright/test';

// Test FR-28: CSV product import
test.describe('FR-28: CSV Product Import', () => {
  let authCookie: string;

  test.beforeAll(async ({ browser }) => {
    // Create authenticated session
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Go to login page
    await page.goto('https://www.soloshopbox.com/auth/login');
    
    // Fill login form (using password auth from FR-21)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    
    // Get session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');
    if (sessionCookie) {
      authCookie = `${sessionCookie.name}=${sessionCookie.value}`;
    }
    
    await context.close();
  });

  test('should load CSV import page', async ({ page }) => {
    // Set auth cookie
    if (authCookie) {
      await page.context().addCookies([
        { name: 'session', value: authCookie.split('=')[1], domain: 'www.soloshopbox.com', path: '/' }
      ]);
    }

    await page.goto('https://www.soloshopbox.com/dashboard/products/import');
    
    // Check page loads
    await expect(page).toHaveURL(/\/dashboard\/products\/import/);
    
    // Check for CSV upload UI elements
    await expect(page.locator('input[type="file"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=CSV Import')).toBeVisible();
    
    await page.screenshot({ path: 'test-results/day-51/csv-import-page.png' });
  });

  test('should show file upload button', async ({ page }) => {
    if (authCookie) {
      await page.context().addCookies([
        { name: 'session', value: authCookie.split('=')[1], domain: 'www.soloshopbox.com', path: '/' }
      ]);
    }

    await page.goto('https://www.soloshopbox.com/dashboard/products/import');
    
    // Look for file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Check for upload/submit button
    const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Import")');
    await expect(uploadButton.first()).toBeVisible();
  });

  test('should display instructions for CSV format', async ({ page }) => {
    if (authCookie) {
      await page.context().addCookies([
        { name: 'session', value: authCookie.split('=')[1], domain: 'www.soloshopbox.com', path: '/' }
      ]);
    }

    await page.goto('https://www.soloshopbox.com/dashboard/products/import');
    
    // Check for instructions mentioning required columns
    const pageText = await page.textContent('body');
    expect(pageText).toContain('title');
    expect(pageText).toContain('price');
    
    await page.screenshot({ path: 'test-results/day-51/csv-import-instructions.png' });
  });
});
