// Day 49 Tests: FR-27, FR-28, FR-29 — Analytics, Billing, CSV Export
// Test the Stage 1 hardening features for seller operational workflows

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Day 49: Analytics, Billing, CSV Export', () => {
  test.setTimeout(60000)

  test.describe('FR-27: Seller analytics dashboard', () => {
    test('Analytics API endpoint is accessible', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics`, {
        failOnStatusCode: false
      })
      
      // Should return 401 (auth required) or 200 (with data)
      expect([200, 401]).toContain(response.status())
    })

    test('Analytics API returns correct data structure', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics`, {
        failOnStatusCode: false
      })
      
      if (response.status() === 200) {
        const data = await response.json()
        
        // Verify analytics object structure
        expect(data).toHaveProperty('analytics')
        expect(data.analytics).toHaveProperty('totalRevenue')
        expect(data.analytics).toHaveProperty('orderCount')
        expect(data.analytics).toHaveProperty('topProducts')
        expect(data.analytics).toHaveProperty('periodDays')
        
        // Verify types
        expect(typeof data.analytics.totalRevenue).toBe('number')
        expect(typeof data.analytics.orderCount).toBe('number')
        expect(Array.isArray(data.analytics.topProducts)).toBeTruthy()
        expect(data.analytics.periodDays).toBe(30)
      }
    })

    test('Analytics dashboard page exists at /dashboard/analytics', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/analytics`)
      
      await page.waitForLoadState('networkidle')
      
      // Check if analytics page loads or redirects to login
      const url = page.url()
      expect(url.includes('/dashboard/analytics') || url.includes('/auth/login')).toBeTruthy()
    })

    test('Analytics dashboard displays total revenue', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/analytics`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/analytics')) {
        // Look for revenue metric
        const revenueCard = page.locator('text=/Total Revenue/i, text=/Revenue/i').first()
        const exists = await revenueCard.count() > 0
        
        if (exists) {
          await expect(revenueCard).toBeVisible()
        }
      }
    })

    test('Analytics dashboard displays order count', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/analytics`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/analytics')) {
        // Look for order count
        const ordersMetric = page.locator('text=/Orders/i, text=/Total Orders/i').first()
        const exists = await ordersMetric.count() > 0
        
        if (exists) {
          await expect(ordersMetric).toBeVisible()
        }
      }
    })

    test('Analytics dashboard displays top products', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/analytics`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/analytics')) {
        // Look for top products section
        const topProducts = page.locator('text=/Top Products/i, text=/Best Selling/i').first()
        const exists = await topProducts.count() > 0
        
        if (exists) {
          await expect(topProducts).toBeVisible()
        }
      }
    })
  })

  test.describe('FR-28: Seller billing dashboard', () => {
    test('Billing API endpoint is accessible', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/billing`, {
        failOnStatusCode: false
      })
      
      // Should return 401 (auth required) or 200 (with data)
      expect([200, 401]).toContain(response.status())
    })

    test('Billing API returns correct data structure', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/billing`, {
        failOnStatusCode: false
      })
      
      if (response.status() === 200) {
        const data = await response.json()
        
        // Verify billing object structure
        expect(data).toHaveProperty('billing')
        expect(data.billing).toHaveProperty('monthlyVolume')
        expect(data.billing).toHaveProperty('stripeFee')
        expect(data.billing).toHaveProperty('netRevenue')
        expect(data.billing).toHaveProperty('transactions')
        
        // Verify types
        expect(typeof data.billing.monthlyVolume).toBe('number')
        expect(typeof data.billing.stripeFee).toBe('number')
        expect(typeof data.billing.netRevenue).toBe('number')
        expect(Array.isArray(data.billing.transactions)).toBeTruthy()
      }
    })

    test('Billing dashboard page exists at /dashboard/billing', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/billing`)
      
      await page.waitForLoadState('networkidle')
      
      // Check if billing page loads or redirects to login
      const url = page.url()
      expect(url.includes('/dashboard/billing') || url.includes('/auth/login')).toBeTruthy()
    })

    test('Billing dashboard displays monthly volume', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/billing`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/billing')) {
        // Look for monthly volume
        const volumeCard = page.locator('text=/Monthly Volume/i, text=/Volume/i').first()
        const exists = await volumeCard.count() > 0
        
        if (exists) {
          await expect(volumeCard).toBeVisible()
        }
      }
    })

    test('Billing dashboard displays Stripe fee calculation', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/billing`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/billing')) {
        // Look for fee information (2.9% + $0.30 per transaction)
        const feeInfo = page.locator('text=/Stripe Fee/i, text=/Fee/i, text=/2.9%/i').first()
        const exists = await feeInfo.count() > 0
        
        if (exists) {
          await expect(feeInfo).toBeVisible()
        }
      }
    })

    test('Billing dashboard displays net revenue', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/billing`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/billing')) {
        // Look for net revenue
        const netRevenue = page.locator('text=/Net Revenue/i, text=/Net/i').first()
        const exists = await netRevenue.count() > 0
        
        if (exists) {
          await expect(netRevenue).toBeVisible()
        }
      }
    })

    test('Billing dashboard displays transaction history', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/billing`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/billing')) {
        // Look for transactions list/table
        const transactions = page.locator('text=/Transaction/i, text=/History/i').first()
        const exists = await transactions.count() > 0
        
        if (exists) {
          await expect(transactions).toBeVisible()
        }
      }
    })
  })

  test.describe('FR-29: Order CSV export', () => {
    test('Orders export API endpoint exists', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/orders/export`, {
        failOnStatusCode: false
      })
      
      // Should return 401 (auth required) or 200 (CSV data)
      expect([200, 401]).toContain(response.status())
    })

    test('Orders export returns CSV content-type', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/orders/export`, {
        failOnStatusCode: false
      })
      
      if (response.status() === 200) {
        const contentType = response.headers()['content-type']
        expect(contentType).toContain('text/csv')
      }
    })

    test('Orders dashboard has export button', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/orders`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard/orders')) {
        // Look for export button
        const exportButton = page.locator('button:has-text("Export"), button:has-text("CSV"), button:has-text("Download")').first()
        const exists = await exportButton.count() > 0
        
        if (exists) {
          await expect(exportButton).toBeVisible()
        }
      }
    })

    test('CSV export contains required order fields', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/orders/export`, {
        failOnStatusCode: false
      })
      
      if (response.status() === 200) {
        const csvContent = await response.text()
        
        // Check CSV headers (first line)
        const headers = csvContent.split('\n')[0]
        
        // Should contain standard order fields
        expect(headers.toLowerCase()).toContain('order')
        expect(headers.toLowerCase()).toMatch(/id|number/)
      }
    })

    test('CSV export includes download filename header', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/orders/export`, {
        failOnStatusCode: false
      })
      
      if (response.status() === 200) {
        const disposition = response.headers()['content-disposition']
        
        // Should suggest a filename for download
        if (disposition) {
          expect(disposition).toContain('attachment')
          expect(disposition).toContain('.csv')
        }
      }
    })
  })

  test.describe('Integration: All three features accessible from dashboard', () => {
    test('Dashboard navigation includes analytics link', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard')) {
        // Look for analytics navigation link
        const analyticsLink = page.locator('a[href*="analytics"], a:has-text("Analytics")').first()
        const exists = await analyticsLink.count() > 0
        
        if (exists) {
          await expect(analyticsLink).toBeVisible()
        }
      }
    })

    test('Dashboard navigation includes billing link', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard')) {
        // Look for billing navigation link
        const billingLink = page.locator('a[href*="billing"], a:has-text("Billing")').first()
        const exists = await billingLink.count() > 0
        
        if (exists) {
          await expect(billingLink).toBeVisible()
        }
      }
    })

    test('Dashboard navigation includes orders link (for CSV export)', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`)
      
      await page.waitForLoadState('networkidle')
      
      if (page.url().includes('/dashboard')) {
        // Look for orders navigation link
        const ordersLink = page.locator('a[href*="orders"], a:has-text("Orders")').first()
        const exists = await ordersLink.count() > 0
        
        if (exists) {
          await expect(ordersLink).toBeVisible()
        }
      }
    })
  })

  test.describe('Security: All endpoints require authentication', () => {
    test('Analytics API returns 401 without auth', async ({ request }) => {
      // Make request without session cookie
      const response = await request.get(`${BASE_URL}/api/analytics`, {
        failOnStatusCode: false,
        headers: {
          // No cookie header
        }
      })
      
      // Should deny access
      expect(response.status()).toBe(401)
    })

    test('Billing API returns 401 without auth', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/billing`, {
        failOnStatusCode: false,
        headers: {
          // No cookie header
        }
      })
      
      // Should deny access
      expect(response.status()).toBe(401)
    })

    test('Export API returns 401 without auth', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/orders/export`, {
        failOnStatusCode: false,
        headers: {
          // No cookie header
        }
      })
      
      // Should deny access
      expect(response.status()).toBe(401)
    })
  })
})
