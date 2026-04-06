import { test, expect } from '@playwright/test'

test.describe('Waitlist form', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the waitlist API to return success
    await page.route('/api/waitlist', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { message: "You're on the list!" } }),
      })
    })

    // Mock the count API
    await page.route('/api/waitlist/count', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { count: 847 } }),
      })
    })

    await page.goto('/en')
  })

  test('happy path — customer signup in Douala', async ({ page }) => {
    // Scroll to waitlist section
    await page.locator('#waitlist').scrollIntoViewIfNeeded()

    // Fill email
    await page.fill('#waitlist-email', 'test@example.com')

    // Select Customer type
    await page.click('button[aria-pressed]:has-text("Customer")')

    // Select Douala city
    await page.selectOption('#waitlist-city', 'douala')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify success state
    await expect(page.locator('[role="status"]')).toBeVisible()
    await expect(page.locator('[role="status"]')).toContainText("You're on the list")
  })

  test('shows validation error for invalid email', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()
    await page.fill('#waitlist-email', 'not-an-email')
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  test('shows live count below form', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()
    await expect(page.locator('text=847')).toBeVisible()
  })
})
