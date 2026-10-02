import { expect, test } from '@playwright/test'

test('homepage exposes the configured social profiles', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Bruce Chau/)
  await expect(page.getByRole('heading', { name: 'I’m Bruce Chau' })).toBeVisible()

  const socialProfiles = page.getByLabel('Social profiles')
  await expect(socialProfiles.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    /^https:\/\/github\.com\/thanh251\/?$/,
  )
  await expect(socialProfiles.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.linkedin\.com\/in\/tuanthanhchau\/?$/,
  )
  await expect(socialProfiles.getByRole('link', { name: /Facebook/ })).toHaveAttribute(
    'href',
    /^https:\/\/www\.facebook\.com\/ctthnh25\/?$/,
  )
})

test('calendar exposes the Google Calendar booking link', async ({ page }) => {
  await page.goto('/calendar')

  await expect(page.getByRole('heading', { name: 'Let’s talk' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Choose a time' })).toHaveAttribute(
    'href',
    /^https:\/\/calendar\.app\.google\/EiHWm4ea8B69bWHXA\/?$/,
  )
})

test('tablet can open, close, and navigate with the left sidebar drawer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Primary navigation' })
  const toggle = page.getByRole('button', { name: 'Toggle navigation' })

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(sidebar).not.toBeInViewport()

  await toggle.click()
  await expect(sidebar).toBeInViewport()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect.poll(() => page.evaluate(() => (
    document.elementFromPoint(20, 100)?.closest('#site-sidebar') !== null
  ))).toBe(true)

  await sidebar.getByRole('link', { name: 'PROJECTS' }).click()
  await expect(page).toHaveURL(/\/projects\/?$/)
  await expect(sidebar).not.toBeInViewport()
})

test('mobile can open, close, and navigate with the left sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Primary navigation' })
  const toggle = page.getByRole('button', { name: 'Toggle navigation' })
  const backdrop = page.locator('[data-backdrop]')

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(sidebar).not.toBeInViewport()

  await toggle.click()
  await expect(sidebar).toBeInViewport()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(backdrop).toBeVisible()
  await expect.poll(() => page.evaluate(() => (
    document.elementFromPoint(20, 100)?.closest('#site-sidebar') !== null
  ))).toBe(true)
  await expect(sidebar.getByRole('link', { name: 'CALENDAR' })).toBeInViewport()

  await backdrop.click({ position: { x: 300, y: 20 } })
  await expect(sidebar).not.toBeInViewport()
  await expect(backdrop).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await sidebar.getByRole('link', { name: 'tech' }).click()
  await expect(page).toHaveURL(/\/blogs\/tech\/?$/)
  await expect(sidebar).not.toBeInViewport()
})
