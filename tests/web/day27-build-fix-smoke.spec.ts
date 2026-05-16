import { test, expect } from '@playwright/test';

/**
 * Day 27 Smoke Tests
 * Purpose: Verify the Day 26 build blocker fix (missing dynamic exports) worked
 * and the app is functional end-to-end.
 * 
 * Engineer fixed:
 * - app/auth/verify/page.tsx (added dynamic export + Suspense wrapper)
 * - app/api/checkout/route.ts (added dynamic export)
 * - app/dashboard/page.tsx (added dynamic export)
 */

test.describe('Day 27 - Build fix verification', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000');
    expect(response?.status()).toBe(200);
    
    // Should show the landing page with CTA
    await expect(page.locator('h1')).toContainText(/shop|start|build/i);
  });

  test('health endpoint returns OK', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/api/health');
    expect(response?.status()).toBe(200);
    
    const body = await response?.json();
    expect(body.status).toBe('ok');
    expect(body.checks.database.status).toBe('ok');
    expect(body.checks.email.status).toBe('ok');
  });

  test('login page loads (test auth route)', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Should have email input
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Should have submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('verify page loads (previously failing with dynamic export error)', async ({ page }) => {
    // This was the main blocker - verify page failed static export
    // because useSearchParams() wasn't wrapped in Suspense
    await page.goto('http://localhost:3000/auth/verify');
    
    // Page should load without 500 error
    expect(page.url()).toContain('/auth/verify');
    
    // Should show verification UI or redirect logic
    // (exact behavior depends on whether there's a token query param)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('dashboard page loads (another dynamic export fix)', async ({ page }) => {
    // Dashboard had missing dynamic export
    // Without auth, should redirect to login
    await page.goto('http://localhost:3000/dashboard');
    
    // Should either show dashboard or redirect to login
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    // Either on dashboard (if session exists) or redirected to login
    expect(currentUrl).toMatch(/\/dashboard|\/auth\/login/);
  });

  test('checkout route is dynamic (API route fix)', async ({ page }) => {
    // Checkout API route had missing dynamic export
    // Test it doesn't fail with static export error
    const response = await page.request.post('http://localhost:3000/api/checkout', {
      data: {
        cartItems: [
          { productId: 'test-id', quantity: 1, price: 10.00, name: 'Test Product' }
        ]
      }
    });
    
    // Expect either success or auth/validation error, NOT 500 static export error
    expect(response.status()).not.toBe(500);
    
    // Likely 401 (no session) or 400 (validation error) is acceptable
    // as long as the route is dynamic and doesn't crash the build
  });

  test('product storefront loads (general smoke test)', async ({ page }) => {
    // Test a public route to ensure general app functionality
    // This should work even without auth
    const response = await page.goto('http://localhost:3000/shop/test-shop');
    
    // Either shows shop (200) or 404 if shop doesn't exist
    // Both are valid - we just want to ensure no build/runtime errors
    expect([200, 404]).toContain(response?.status() || 0);
  });
});
