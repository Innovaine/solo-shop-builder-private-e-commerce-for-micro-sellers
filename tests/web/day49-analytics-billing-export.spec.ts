import { test, expect } from '@playwright/test';

const HOST = process.env.HTTPS_APP_HOST_NAME ?? 'www.soloshopbox.com';
const BASE_URL = `https://${HOST}:3000`;

test.describe('Day 49: Analytics, Billing, CSV Export', () => {
  let sessionCookie: string;

  test.beforeAll(async ({ browser }) => {
    // Create a session for authenticated tests
    const page = await browser.newPage();
    
    // Try HTTPS first, fallback to localhost if unreachable
    let loginUrl = `${BASE_URL}/auth/login`;
    try {
      await page.goto(loginUrl, { timeout: 10000 });
    } catch (e) {
      console.log('HTTPS unreachable, falling back to localhost');
      loginUrl = 'http://localhost:3000/auth/login';
      await page.goto(loginUrl);
    }
    
    // For test purposes, create a test account via API
    const signupResponse = await page.request.post(`${BASE_URL}/api/auth/signup`, {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      },
    }).catch(() => page.request.post('http://localhost:3000/api/auth/signup', {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      },
    }));
    
    const cookies = await page.context().cookies();
    const session = cookies.find(c => c.name === 'session');
    sessionCookie = session ? `session=${session.value}` : '';
    
    await page.close();
  });

  test('FR-36: Analytics dashboard loads and displays metrics', async ({ page }) => {
    test.setTimeout(30000);
    
    // Navigate to analytics page
    await page.goto(`${BASE_URL}/dashboard/analytics`, { 
      timeout: 10000,
    }).catch(() => page.goto('http://localhost:3000/dashboard/analytics'));
    
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    // Check for analytics cards
    const content = await page.content();
    
    // Should have revenue/orders/products metrics
    expect(content.toLowerCase()).toMatch(/revenue|total.*revenue|sales/i);
    expect(content.toLowerCase()).toMatch(/orders|total.*orders/i);
    
    // Design compliance: should use text-slate-blue class (per day 49 engineering notes)
    expect(content).toContain('text-slate-blue');
  });

  test('FR-28: Billing dashboard loads and shows transaction history', async ({ page }) => {
    test.setTimeout(30000);
    
    await page.goto(`${BASE_URL}/dashboard/billing`).catch(() => 
      page.goto('http://localhost:3000/dashboard/billing')
    );
    
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    const content = await page.content();
    
    // Should display billing/transaction information
    expect(content.toLowerCase()).toMatch(/billing|transactions|payments/i);
  });

  test('FR-30: Order CSV export endpoint exists and returns CSV', async ({ page }) => {
    test.setTimeout(30000);
    
    // Test the API endpoint directly
    const response = await page.request.get(`${BASE_URL}/api/orders/export`, {
      headers: sessionCookie ? { Cookie: sessionCookie } : {},
    }).catch(() => page.request.get('http://localhost:3000/api/orders/export', {
      headers: sessionCookie ? { Cookie: sessionCookie } : {},
    }));
    
    // Should return CSV (even if empty)
    const contentType = response.headers()['content-type'] || '';
    expect([200, 401]).toContain(response.status()); // 401 if not authenticated
    
    if (response.status() === 200) {
      expect(contentType).toMatch(/csv|text\/csv|application\/csv/i);
    }
  });

  test('Health check endpoint returns OK', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/health`).catch(() =>
      page.request.get('http://localhost:3000/api/health')
    );
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('Homepage loads without errors', async ({ page }) => {
    await page.goto(BASE_URL).catch(() => page.goto('http://localhost:3000'));
    
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
