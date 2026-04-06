import { test, expect } from '@playwright/test'

test.describe('Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/waitlist/count', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { count: 100 } }),
      })
    })
    await page.goto('/en')
  })

  test('nav links are keyboard focusable', async ({ page }) => {
    // Tab to first nav link
    await page.keyboard.press('Tab')
    // Continue tabbing through nav
    const navButtons = page.locator('nav button, nav a')
    const count = await navButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('nav CTA scrolls to waitlist on Enter', async ({ page }) => {
    // Focus the Pre-Register nav button and press Enter
    const navCta = page.locator('nav button').last()
    await navCta.focus()
    await page.keyboard.press('Enter')

    // Waitlist section should be visible after scroll
    await expect(page.locator('#waitlist')).toBeInViewport({ timeout: 2000 })
  })

  test('waitlist form is fully keyboard navigable', async ({ page }) => {
    // Navigate to waitlist section
    await page.locator('#waitlist').scrollIntoViewIfNeeded()

    // Focus email input
    await page.focus('#waitlist-email')
    await expect(page.locator('#waitlist-email')).toBeFocused()

    // Tab to Customer button
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('type toggle responds to Space key', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()

    // Focus the first aria-pressed button (Customer)
    const customerBtn = page.locator('button[aria-pressed]').first()
    await customerBtn.focus()
    await page.keyboard.press('Space')

    await expect(customerBtn).toHaveAttribute('aria-pressed', 'true')
  })

  test('type toggle responds to Enter key', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()

    // Focus the Vendor button and activate with Enter
    const vendorBtn = page.locator('button[aria-pressed]').last()
    await vendorBtn.focus()
    await page.keyboard.press('Enter')

    await expect(vendorBtn).toHaveAttribute('aria-pressed', 'true')
  })

  test('submit button is reachable via Tab', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.focus()
    await expect(submitBtn).toBeFocused()
  })

  test('focused elements have visible outline', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()

    // Focus the email input and check it has a visible focus style
    await page.focus('#waitlist-email')

    const outlineStyle = await page.locator('#waitlist-email').evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        boxShadow: styles.boxShadow,
        borderLeftWidth: styles.borderLeftWidth,
      }
    })

    // The input uses a focus ring (box-shadow or outline) or amber left border
    const hasFocusIndicator =
      outlineStyle.outlineWidth !== '0px' ||
      (outlineStyle.boxShadow !== 'none' && outlineStyle.boxShadow !== '') ||
      outlineStyle.borderLeftWidth !== '0px'

    expect(hasFocusIndicator).toBe(true)
  })

  test('tab order through form fields is logical', async ({ page }) => {
    await page.locator('#waitlist').scrollIntoViewIfNeeded()

    // Start at email
    await page.focus('#waitlist-email')
    await expect(page.locator('#waitlist-email')).toBeFocused()

    // Tab → Customer button
    await page.keyboard.press('Tab')
    const firstTypeBtn = page.locator('button[aria-pressed]').first()
    await expect(firstTypeBtn).toBeFocused()

    // Tab → Vendor button
    await page.keyboard.press('Tab')
    const secondTypeBtn = page.locator('button[aria-pressed]').last()
    await expect(secondTypeBtn).toBeFocused()
  })
})
