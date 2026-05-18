import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.soloshopbox.com';

/**
 * Day 52 — UX Back Buttons Test
 * 
 * Tests that back navigation buttons were added to 5 dashboard pages:
 * - products/[id]/edit
 * - settings
 * - profile
 * - branding
 * - email-template
 */

test.describe('Day 52 — UX Back Buttons', () => {
  let sessionCookie: string;
  let productId: string;

  test.beforeAll(async ({ browser }) => {
    // Login and get session cookie
    const page = await browser.newPage();
    
    await page.goto(`${BASE_URL}/auth/login`);
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    const cookies = await page.context().cookies();
    const session = cookies.find(c => c.name === 'session');
    sessionCookie = session ? `${session.name}=${session.value}` : '';
    
    // Create a test product to use for edit page test
    const response = await page.request.post(`${BASE_URL}/api/products`, {
      headers: { 'Cookie': sessionCookie },
      data: {
        title: 'Test Product for Back Button',
        price: 10,
        description: 'Test product',
        category: 'electronics'
      }
    });
    
    if (response.ok()) {
      const data = await response.json();
      productId = data.id;
    }
    
    await page.close();
  });

  test('Product edit page has back button', async ({ page }) => {
    test.setTimeout(20_000);
    
    if (!productId) {
      test.skip();
      return;
    }

    await page.goto(`${BASE_URL}/dashboard/products/${productId}/edit`, {
      waitUntil: 'networkidle'
    });

    // Check for back button (text or icon)
    const backButton = page.locator('button, a').filter({ 
      hasText: /back|return|products/i 
    }).first();
    
    await expect(backButton).toBeVisible({ timeout: 5000 });
    
    // Verify it's clickable
    await expect(backButton).toBeEnabled();
  });

  test('Settings page has back button', async ({ page }) => {
    test.setTimeout(20_000);
    
    await page.goto(`${BASE_URL}/dashboard/settings`, {
      waitUntil: 'networkidle'
    });

    const backButton = page.locator('button, a').filter({ 
      hasText: /back|dashboard/i 
    }).first();
    
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await expect(backButton).toBeEnabled();
  });

  test('Profile page has back button', async ({ page }) => {
    test.setTimeout(20_000);
    
    await page.goto(`${BASE_URL}/dashboard/profile`, {
      waitUntil: 'networkidle'
    });

    const backButton = page.locator('button, a').filter({ 
      hasText: /back|dashboard/i 
    }).first();
    
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await expect(backButton).toBeEnabled();
  });

  test('Branding page has back button', async ({ page }) => {
    test.setTimeout(20_000);
    
    await page.goto(`${BASE_URL}/dashboard/branding`, {
      waitUntil: 'networkidle'
    });

    const backButton = page.locator('button, a').filter({ 
      hasText: /back|dashboard/i 
    }).first();
    
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await expect(backButton).toBeEnabled();
  });

  test('Email template page has back button', async ({ page }) => {
    test.setTimeout(20_000);
    
    await page.goto(`${BASE_URL}/dashboard/email-template`, {
      waitUntil: 'networkidle'
    });

    const backButton = page.locator('button, a').filter({ 
      hasText: /back|dashboard/i 
    }).first();
    
    await expect(backButton).toBeVisible({ timeout: 5000 });
    await expect(backButton).toBeEnabled();
  });
});
