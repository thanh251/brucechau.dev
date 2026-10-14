import { expect, test } from '@playwright/test'

test('homepage exposes the configured social profiles', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Bruce Chau/)
  await expect(page.getByRole('heading', { name: 'Bruce Chau' })).toBeVisible()

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

test('gallery layout fits mobile and the career range stays clear of events', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
  await expect(page.getByRole('heading', { name: 'Bruce Chau' })).toBeVisible()

  const range = await page.locator('.career__bracket span').boundingBox()
  const firstEvent = await page.locator('.career-event').first().boundingBox()
  expect(range).not.toBeNull()
  expect(firstEvent).not.toBeNull()
  expect(range!.y + range!.height).toBeLessThan(firstEvent!.y)
})

test('main pages fit a narrow 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 })

  for (const path of [
    '/', '/blogs', '/blogs/tech', '/blog/building-this-personal-blog',
    '/projects', '/favorites', '/about/whoami', '/about/uses', '/calendar',
  ]) {
    await page.goto(path)
    await expect.poll(
      () => page.evaluate(() => document.documentElement.scrollWidth),
      { message: `Horizontal overflow on ${path}` },
    ).toBeLessThanOrEqual(320)
  }
})

test('neo-cubist hero leaves room for status and career path remains vertical', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const heading = await page.getByRole('heading', { name: 'Bruce Chau' }).boundingBox()
  const status = await page.locator('#right-rail').boundingBox()
  const axis = await page.locator('.career__axis').boundingBox()
  const events = await page.locator('.career-event').all()
  expect(heading).not.toBeNull()
  expect(status).not.toBeNull()
  expect(axis).not.toBeNull()
  expect(heading!.x + heading!.width).toBeLessThan(status!.x)
  expect(axis!.height).toBeGreaterThan(200)
  expect(axis!.width).toBeLessThan(4)
  expect((await events[0].boundingBox())!.y).toBeLessThan((await events[1].boundingBox())!.y)

  await page.setViewportSize({ width: 375, height: 812 })
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
})

test('theme switch works in both directions', async ({ page }) => {
  await page.goto('/')

  const theme = page.locator('[data-theme-toggle]')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await theme.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await theme.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('desktop status panel can be hidden and restored', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const rail = page.locator('#right-rail')
  await expect(rail).toBeVisible()
  await page.getByRole('button', { name: 'Hide status panel' }).click()
  await expect(rail).toHaveCSS('opacity', '0')
  await page.getByRole('button', { name: 'Show status panel' }).click()
  await expect(rail).toHaveCSS('opacity', '1')
})

test('tablet can open, close, and navigate with the left sidebar drawer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Primary navigation' })
  const toggle = page.locator('[data-toggle-sidebar]')

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-label', 'Open navigation menu')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(sidebar).not.toBeInViewport()

  await toggle.click()
  await expect(sidebar).toBeInViewport()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAttribute('aria-label', 'Close navigation menu')
  await expect.poll(() => page.evaluate(() => (
    document.elementFromPoint(20, 100)?.closest('#site-sidebar') !== null
  ))).toBe(true)

  await sidebar.getByRole('button', { name: 'Close navigation menu' }).click()
  await expect(sidebar).not.toBeInViewport()

  await page.getByRole('button', { name: 'Open navigation menu' }).click()

  await sidebar.getByRole('link', { name: 'PROJECTS' }).click()
  await expect(page).toHaveURL(/\/projects\/?$/)
  await expect(sidebar).not.toBeInViewport()
})

test('mobile can open, close, and navigate with the left sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  const sidebar = page.getByRole('complementary', { name: 'Primary navigation' })
  const toggle = page.locator('[data-toggle-sidebar]')
  const backdrop = page.locator('[data-backdrop]')

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-label', 'Open navigation menu')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(sidebar).not.toBeInViewport()

  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await expect(sidebar).toBeInViewport()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveAttribute('aria-label', 'Close navigation menu')
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

test('tablet can open and close the right status drawer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')

  const rail = page.locator('#right-rail')
  const toggle = page.locator('[data-toggle-rail]')

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-label', 'Open status panel')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(rail).not.toBeInViewport()

  await toggle.click()
  await expect(rail).toBeInViewport()
  await expect(toggle).toHaveAttribute('aria-label', 'Close status panel')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(rail.getByText('Local time', { exact: true })).toBeVisible()
  await expect(rail.getByText('Weather', { exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => (
    document.elementFromPoint(window.innerWidth - 20, 100)?.closest('#right-rail') !== null
  ))).toBe(true)

  await rail.getByRole('button', { name: 'Close status panel' }).click()
  await expect(rail).not.toBeInViewport()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('mobile can use the right status drawer and backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  const rail = page.locator('#right-rail')
  const toggle = page.locator('[data-toggle-rail]')
  const backdrop = page.locator('[data-backdrop]')

  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-label', 'Open status panel')
  await expect(rail).not.toBeInViewport()

  await toggle.click()
  await expect(rail).toBeInViewport()
  await expect(backdrop).toBeVisible()
  await expect(rail.getByText('Local time', { exact: true })).toBeVisible()
  await expect(rail.getByText('Weather', { exact: true })).toBeVisible()

  await backdrop.click({ position: { x: 20, y: 20 } })
  await expect(rail).not.toBeInViewport()
  await expect(backdrop).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})
