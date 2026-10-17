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

test('social platforms are centered in equal columns without diagonal link arrows', async ({ page }) => {
  for (const width of [1440, 375, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    const profiles = page.getByLabel('Social profiles')
    const links = profiles.getByRole('link')
    const row = await profiles.boundingBox()
    expect(row).not.toBeNull()
    await expect(links).toHaveCount(3)

    for (let index = 0; index < 3; index += 1) {
      const box = await links.nth(index).boundingBox()
      expect(box).not.toBeNull()
      expect(Math.abs(box!.x + box!.width / 2 - (row!.x + row!.width * (index + .5) / 3))).toBeLessThan(2)
      expect(await links.nth(index).evaluate((element) => getComputedStyle(element, '::after').content)).toBe('none')
    }
  }

  await page.getByRole('button', { name: 'Search this site' }).click()
  expect(await page.locator('.search-result').first().textContent()).not.toContain('↗')
})

test('BRU branding appears in the navbar and share metadata', async ({ page }) => {
  await page.goto('/')

  const brand = page.getByRole('link', { name: 'Bruce Chau home' })
  const mark = brand.locator('svg.brand-mark')
  await expect(mark).toBeVisible()
  await expect(brand.locator('.brand-word')).toHaveText('BRU')
  await expect(brand.locator('img')).toHaveCount(0)
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg?v=bru-round')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content', 'https://brucechau.pages.dev/social-card.png?v=bru-round',
  )
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content', 'https://brucechau.pages.dev/social-card.png?v=bru-round',
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')

  await page.locator('[data-theme-toggle]').click()
  await expect(mark).toBeVisible()
  await expect(brand.locator('.brand-word')).toHaveCSS('color', 'rgb(245, 242, 234)')

  expect((await page.request.get('/social-card.png')).ok()).toBe(true)
  expect((await page.request.get('/apple-touch-icon.png')).ok()).toBe(true)
  const favicon = await page.request.get('/favicon.svg')
  expect(favicon.ok()).toBe(true)
  expect(await favicon.text()).toContain('<circle cx="130" cy="130" r="130"')
  expect(await favicon.text()).not.toContain('<rect')
})

test('tablet and mobile navbar center the complete BRU logo without overlapping controls', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1100]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    const logo = await page.getByRole('link', { name: 'Bruce Chau home' }).boundingBox()
    const menu = await page.getByRole('button', { name: 'Open navigation menu' }).boundingBox()
    const actions = await page.locator('.titlebar__actions').boundingBox()
    expect(logo).not.toBeNull()
    expect(menu).not.toBeNull()
    expect(actions).not.toBeNull()
    expect(Math.abs(logo!.x + logo!.width / 2 - width / 2)).toBeLessThan(2)
    expect(menu!.x + menu!.width).toBeLessThan(logo!.x)
    expect(logo!.x + logo!.width).toBeLessThan(actions!.x)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})

test('calendar exposes the Google Calendar booking link', async ({ page }) => {
  await page.goto('/calendar')

  await expect(page.getByRole('heading', { name: 'Let’s talk' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Choose a time' })).toHaveAttribute(
    'href',
    /^https:\/\/calendar\.app\.google\/EiHWm4ea8B69bWHXA\/?$/,
  )
})

test('Whoami combines the CV with the existing personal introduction', async ({ page }) => {
  await page.goto('/about/whoami')

  await expect(page.getByRole('heading', { level: 1, name: 'Who am I?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'What I’m building' })).toBeVisible()
  await expect(page.getByText(/Aspen Shopify Hydrogen theme/)).toBeVisible()
  await expect(page.getByText(/Financial Technology at PTIT/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'What I care about' })).toBeVisible()
  await expect(page.getByText(/gym and running/)).toBeVisible()
})

test('Uses shows five categories with descriptions at desktop and mobile widths', async ({ page }) => {
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/about/uses')

    const categories = page.locator('.content-page__body .collection-grid .content-card')
    await expect(categories).toHaveCount(5)
    await expect(categories.locator('h3')).toHaveText(['Audio', 'Daily', 'Hardware', 'Desktop apps', 'Dev tools'])
    for (const category of await categories.all()) {
      await expect(category.locator('p')).not.toBeEmpty()
    }
    await expect(categories.filter({ hasText: 'Hardware' })).toHaveAttribute('href', '/about/uses/hardware')
    await expect(categories.filter({ hasText: 'Daily' })).toHaveAttribute('href', '/about/uses/daily')
    await expect(categories.filter({ hasText: 'Audio' })).toHaveAttribute('href', '/about/uses/audio')
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})

test('Audio IE 900 shows a 20 kHz interactive frequency response without notes at each breakpoint', async ({ page }) => {
  test.setTimeout(60_000)
  for (const width of [1440, 820, 375, 320]) {
    await page.setViewportSize({ width, height: width <= 375 ? 720 : 900 })
    await page.goto('/about/uses/audio')
    await expect(page.getByRole('heading', { level: 1, name: 'Audio' })).toBeVisible()
    await expect(page.locator('.hardware-item')).toHaveCount(1)
    await page.getByRole('button', { name: 'Open quick review of Sennheiser IE 900' }).click()

    const dialog = page.getByRole('dialog', { name: 'Sennheiser IE 900' })
    await expect(dialog).toHaveClass(/is-visible/)
    await expect(dialog.locator('[data-audio-path]')).toHaveAttribute('d', /^M/)
    const curve = await dialog.locator('[data-audio-path]').getAttribute('d')
    expect(Number(curve?.match(/L([\d.]+) [\d.]+$/)?.[1])).toBeGreaterThan(698)
    await expect(dialog.locator('.audio-frequency__unit')).toHaveText('relative dB · 20 Hz–20 kHz')
    await expect(dialog.locator('[data-audio-band-index]')).toHaveCount(14)
    await expect(dialog.locator('.audio-frequency__grid--vertical text').last()).toHaveText('20k')
    await expect(dialog.locator('.audio-frequency__instruction, .audio-frequency__method, [data-audio-source]')).toHaveCount(0)
    await expect(dialog.locator('[data-audio-band-title]')).toHaveText('Sub-bass')

    await dialog.locator('svg [data-audio-band-index="4"]').click()
    await expect(dialog.locator('[data-audio-band-title]')).toHaveText('Presence')
    await expect(dialog.locator('[data-audio-band-range]')).toHaveText('2,500–5,000 Hz')
    await expect(dialog.locator('[data-audio-band-description]')).toContainText('3–4 kHz')
    await dialog.getByRole('button', { name: 'Treble', exact: true }).click()
    await expect(dialog.locator('[data-audio-band-title]')).toHaveText('Treble')
    await expect(dialog.locator('[data-audio-band-description]')).toContainText('5–10 kHz')
    await dialog.getByRole('button', { name: 'Air', exact: true }).click()
    await expect(dialog.locator('[data-audio-band-range]')).toHaveText('10,000–20,000 Hz')
    await expect(dialog.locator('[data-audio-band-description]')).toContainText('measurement setup')
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

    await dialog.getByRole('button', { name: 'Close quick review' }).click()
    await expect(dialog).toBeHidden()
  }
})

test('Daily items use Hardware-style cards and quick reviews at each breakpoint', async ({ page }) => {
  test.setTimeout(60_000)
  const items = [
    { name: 'YETI Rambler Stackable 20 oz', scores: ['2.8', '4.2', '4.1', '4.7', '4.4'] },
    { name: 'LocknLock Wannabe Screw', scores: ['3.7', '3.8', '4.1', '4', '4.2'] },
    { name: 'Enpuly M6 Plus', scores: ['3.8', '3.9', '4', '3.6', '3.7'] },
    { name: 'ENCHEN MS006', scores: ['4.2', '3.6', '4.4', '3.7', '4.1'] },
    { name: 'Ulanzi MA60', scores: ['3.8', '4.2', '4.8', '4.1', '4.5'] },
    { name: 'HyperWork MagSnap', scores: ['4.3', '3.8', '4.5', '3.8', '4.2'] },
  ]
  for (const width of [1440, 820, 375, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 640 : 812 })
    await page.goto('/about/uses/daily')
    await expect(page.getByRole('heading', { level: 1, name: 'Daily' })).toBeVisible()
    await expect(page.locator('.hardware-item')).toHaveCount(items.length)
    await expect(page.locator('.hardware-item h2')).toHaveText(items.map(({ name }) => name))
    for (const imageWrap of await page.locator('.hardware-item__image-wrap').all()) {
      await expect(imageWrap).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    }
    for (const image of await page.locator('.hardware-item img').all()) {
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
    }

    for (const { name, scores } of items) {
      const trigger = page.getByRole('button', { name: `Open quick review of ${name}` })
      await trigger.click()
      const dialog = page.getByRole('dialog', { name })
      await expect(dialog).toHaveClass(/is-visible/)
      await expect(dialog.locator('[data-review-summary]')).not.toBeEmpty()
      await expect(dialog.locator('[data-review-detail]')).not.toBeEmpty()
      await expect(dialog).not.toContainText(/draft|illustrative/i)
      await expect(dialog.locator('[data-score-key]')).toHaveText(scores)
      await expect(dialog.locator('.hardware-rating')).toHaveCount(5)
      const ratingPositions = await dialog.locator('.hardware-rating').evaluateAll((ratings) =>
        ratings.slice(0, 3).map((rating) => {
          const { x, y } = rating.getBoundingClientRect()
          return { x, y }
        }),
      )
      expect(ratingPositions[1].x).toBeGreaterThan(ratingPositions[0].x)
      expect(Math.abs(ratingPositions[1].y - ratingPositions[0].y)).toBeLessThan(2)
      expect(ratingPositions[2].y).toBeGreaterThan(ratingPositions[0].y)
      for (const rating of await dialog.locator('.hardware-rating').all()) {
        await expect(rating).not.toHaveAttribute('open')
        await rating.locator('summary').click()
        await expect(rating).toHaveAttribute('open', '')
        await expect(rating.locator('[data-rating-reason]')).not.toBeEmpty()
      }
      await expect(dialog.locator('.hardware-dialog__image-wrap')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await expect.poll(() => dialog.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      await dialog.getByRole('button', { name: 'Close quick review' }).click()
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    }
  }
})

test('Hardware has ten illustrated pieces and fits desktop, tablet, and mobile', async ({ page }) => {
  for (const width of [1440, 820, 375, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/about/uses/hardware')
    await expect(page.getByRole('heading', { level: 1, name: 'Hardware' })).toBeVisible()
    await expect(page.locator('.hardware-sources')).toHaveCount(0)
    await expect(page.locator('.hardware-item')).toHaveCount(10)
    await expect(page.locator('.hardware-item h2')).toHaveText([
      'MacBook Air M3', 'iPhone 13', 'Leobog Hi75c Pro Glacier',
      'MONKA 3067 Pro', 'Delux M800 Pro', 'ATKGEAR Dragonfly V3',
      'UGREEN PB725', 'Anker Zolo 140W', 'AUKEY PB-Y36', 'UGREEN CM818',
    ])
    await expect(page.locator('.hardware-list').getByText('Midnight · 24 GB RAM · 256 GB SSD')).toBeVisible()
    await expect(page.locator('.hardware-list').getByText('Midnight · 128 GB')).toBeVisible()
    for (const image of await page.locator('.hardware-item img').all()) {
      await expect(image).toBeVisible()
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0)
    }
    for (const imageWrap of await page.locator('.hardware-item__image-wrap').all()) {
      await expect(imageWrap).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    }
    await expect(page.locator('.hardware-item:nth-child(2) img')).toHaveAttribute('src', '/uses/iphone-13-midnight-cutout.png')
    const iphoneCornerAlpha = await page.locator('.hardware-item:nth-child(2) img').evaluate((image: HTMLImageElement) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const context = canvas.getContext('2d')!
      context.drawImage(image, 0, 0)
      return context.getImageData(0, 0, 1, 1).data[3]
    })
    expect(iphoneCornerAlpha).toBe(0)
    const cards = await page.locator('.hardware-item').all()
    const first = await cards[0].boundingBox()
    const second = await cards[1].boundingBox()
    const third = await cards[2].boundingBox()
    expect(first && second && third).toBeTruthy()
    if (first && second && third) {
      expect(first.height).toBeLessThan(240)
      expect(second.height).toBeLessThan(240)
      if (width > 760) {
        expect(second.y).toBe(first.y)
        expect(third.y).toBeGreaterThan(first.y)
      } else {
        expect(second.y).toBeGreaterThan(first.y)
        expect(third.y).toBeGreaterThan(second.y)
      }
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
  await page.getByRole('link', { name: 'all uses' }).click()
  await expect(page).toHaveURL(/\/about\/uses\/?$/)
})

test('Hardware quick reviews open for every item and close accessibly at each breakpoint', async ({ page }) => {
  test.setTimeout(120_000)
  const names = [
    'MacBook Air M3', 'iPhone 13', 'Leobog Hi75c Pro Glacier',
    'MONKA 3067 Pro', 'Delux M800 Pro', 'ATKGEAR Dragonfly V3',
    'UGREEN PB725', 'Anker Zolo 140W', 'AUKEY PB-Y36', 'UGREEN CM818',
  ]
  const expectedScores = [
    ['2', '5', '2.7', '4.2', '4.6'],
    ['3', '4.2', '4.6', '3.2', '3.4'],
    ['4', '4.7', '4', '4.5', '3.3'],
    ['4.2', '3.8', '4.1', '3.6', '3.9'],
    ['4', '4.4', '3.9', '3.7', '3.8'],
    ['4.3', '4', '4.2', '3.8', '4'],
    ['3.5', '4.5', '3.4', '4.1', '4.2'],
    ['3.1', '4.7', '4.1', '4.3', '4.4'],
    ['4.1', '3.6', '4.6', '3.8', '3.7'],
    ['3.7', '4.2', '4.3', '4', '4.2'],
  ]
  for (const width of [1440, 820, 375, 320]) {
    const viewportHeight = width === 320 ? 640 : 812
    await page.setViewportSize({ width, height: viewportHeight })
    await page.goto('/about/uses/hardware')
    for (const [index, name] of names.entries()) {
      const trigger = page.getByRole('button', { name: `Open quick review of ${name}` })
      await trigger.click()
      const dialog = page.getByRole('dialog', { name })
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveClass(/is-visible/)
      await expect(dialog.locator('[data-review-summary]')).not.toBeEmpty()
      await expect(dialog.locator('[data-review-detail]')).not.toBeEmpty()
      await expect(dialog).not.toContainText(/draft|illustrative/i)
      await expect(dialog.locator('.hardware-dialog__image-wrap')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
      await expect(dialog.getByText('Quick review', { exact: true })).toBeVisible()
      await expect(dialog.getByText('Five-point rating')).toHaveCount(0)
      await expect(dialog.locator('[data-review-number], .hardware-dialog__ratings-heading')).toHaveCount(0)
      await expect.poll(() => dialog.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
      await expect(dialog.locator('[data-score-key]')).toHaveText(expectedScores[index])
      await expect(dialog.locator('[data-radar-shape]')).toHaveAttribute('points', /^[\d., ]+$/)
      await expect(dialog.locator('.hardware-rating')).toHaveCount(5)
      for (const rating of await dialog.locator('.hardware-rating').all()) {
        await expect(rating).not.toHaveAttribute('open')
        await rating.locator('summary').click()
        await expect(rating).toHaveAttribute('open', '')
        await expect(rating.locator('[data-rating-reason]')).not.toBeEmpty()
      }
      if (index === 0) {
        const iconOffset = await dialog.locator('.hardware-dialog__close').evaluate((button) => {
          const box = button.getBoundingClientRect()
          const icon = button.querySelector('svg')!.getBoundingClientRect()
          return {
            x: Math.abs(box.x + box.width / 2 - icon.x - icon.width / 2),
            y: Math.abs(box.y + box.height / 2 - icon.y - icon.height / 2),
          }
        })
        expect(iconOffset.x).toBeLessThan(1)
        expect(iconOffset.y).toBeLessThan(1)
      }

      if (width <= 760) {
        await expect.poll(async () => {
          const box = await dialog.boundingBox()
          return box ? Math.min(box.y, viewportHeight - box.y - box.height) : 0
        }).toBeGreaterThanOrEqual(39)
        const dialogBox = await dialog.boundingBox()
        expect(dialogBox).not.toBeNull()
        if (dialogBox) {
          expect(dialogBox.x).toBeGreaterThanOrEqual(17)
          expect(width - dialogBox.x - dialogBox.width).toBeGreaterThanOrEqual(17)
        }
      }

      const imageBox = await dialog.locator('.hardware-dialog__image-wrap').boundingBox()
      const copyBox = await dialog.locator('.hardware-dialog__copy').boundingBox()
      expect(imageBox && copyBox).toBeTruthy()
      if (imageBox && copyBox) {
        if (width > 760) {
          expect(copyBox.x).toBeGreaterThan(imageBox.x)
          expect(Math.abs(copyBox.y - imageBox.y)).toBeLessThan(5)
        } else {
          expect(copyBox.y).toBeGreaterThan(imageBox.y)
        }
      }
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

      if (index === 0) await dialog.getByRole('button', { name: 'Close quick review' }).click()
      else if (index === 1) await page.keyboard.press('Escape')
      else if (width === 375) await dialog.getByRole('button', { name: 'Close review', exact: true }).click()
      else await page.mouse.click(3, 3)
      await expect(dialog).toBeHidden()
      await expect(trigger).toBeFocused()
    }
  }
})

test('Hardware card highlight does not stick after touching multiple items', async ({ page }) => {
  await page.goto('/about/uses/hardware')
  const cards = page.locator('.hardware-item')
  const background = (index: number) => cards.nth(index).evaluate((element) => getComputedStyle(element).backgroundColor)
  const restingBackground = await background(0)

  if (await page.evaluate(() => matchMedia('(hover: none)').matches)) {
    for (const index of [0, 2]) {
      await cards.nth(index).getByRole('button').tap()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await dialog.getByRole('button', { name: 'Close quick review' }).tap()
      await expect(dialog).toBeHidden()
      await expect.poll(() => background(index)).toBe(restingBackground)
    }
    await expect.poll(() => background(0)).toBe(restingBackground)
    await expect.poll(() => background(2)).toBe(restingBackground)
  } else {
    await cards.nth(0).hover()
    await expect.poll(() => background(0)).not.toBe(restingBackground)
    await page.mouse.move(0, 0)
    await expect.poll(() => background(0)).toBe(restingBackground)
  }
})

test('favorites has five future-ready categories with working pages', async ({ page }) => {
  const categories = [
    ['Artist', 'artist', 'Artists and creative work that stay with me.'],
    ['Food', 'food', 'Meals, dishes, and places worth returning to.'],
    ['Beverage', 'beverage', 'Drinks I reach for, from everyday staples to small rituals.'],
    ['Agent Model', 'agent-model', 'AI models and agents I use, test, or keep an eye on.'],
    ['Software', 'software', 'Apps and tools that make my daily work feel better.'],
  ] as const

  await page.setViewportSize({ width: 320, height: 812 })
  await page.goto('/favorites')
  const grid = page.locator('.collection-grid')
  await expect(grid.getByRole('link')).toHaveCount(5)

  for (const [label, slug, description] of categories) {
    await expect(grid.getByRole('link', { name: new RegExp(label) })).toHaveAttribute('href', `/favorites/${slug}`)
    await expect(grid.getByRole('link', { name: new RegExp(label) }).getByText(description)).toBeVisible()
    await page.goto(`/favorites/${slug}`)
    await expect(page.getByRole('heading', { level: 1, name: label })).toBeVisible()
    await expect(page.locator('.content-page__hero').getByText(description)).toBeVisible()
    await expect(page.getByText('No entries yet. This collection is ready for future additions.')).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    await page.goto('/favorites')
  }
})

test('desktop Favorites opens the full page while the mobile sidebar keeps category links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const favoritesLink = page.locator('.top-nav').getByRole('link', { name: 'favorites' })
  await expect(favoritesLink).toHaveAttribute('href', '/favorites')
  await expect(page.locator('.top-nav__group')).toHaveCount(2)
  await favoritesLink.click()
  await expect(page).toHaveURL(/\/favorites\/?$/)
  await expect(page.locator('.collection-grid').getByRole('link')).toHaveCount(5)

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const favoritesGroup = page.locator('.tree-group').filter({ has: page.locator('summary', { hasText: 'favorites' }) })
  await favoritesGroup.locator('summary').click()
  await expect(favoritesGroup.getByRole('link')).toHaveCount(6)
  await favoritesGroup.getByRole('link', { name: 'beverage' }).click()
  await expect(page).toHaveURL(/\/favorites\/beverage\/?$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Beverage' })).toBeVisible()
})

test('desktop nav dropdowns open one at a time and fade in and out', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const blogs = page.locator('[data-nav-dropdown]').filter({ has: page.getByRole('link', { name: 'blogs' }) })
  const about = page.locator('[data-nav-dropdown]').filter({ has: page.getByRole('link', { name: 'about' }) })
  const blogsMenu = blogs.locator('.top-nav__menu')
  const aboutMenu = about.locator('.top-nav__menu')
  await expect(blogsMenu).toHaveCSS('visibility', 'hidden')
  await expect(blogsMenu).toHaveCSS('transition-duration', '0.18s, 0.18s, 0s')

  await blogs.getByRole('link', { name: 'blogs' }).hover()
  await expect(blogs.getByRole('link', { name: 'blogs' })).toHaveAttribute('aria-expanded', 'true')
  await expect(blogsMenu).toHaveCSS('opacity', '1')
  await expect(aboutMenu).toHaveCSS('visibility', 'hidden')

  await about.getByRole('link', { name: 'about' }).hover()
  await expect(blogsMenu).toHaveCSS('opacity', '0')
  await expect(blogsMenu).toHaveCSS('visibility', 'hidden')
  await expect(aboutMenu).toHaveCSS('opacity', '1')
  await page.locator('.top-nav').getByRole('link', { name: 'projects' }).hover()
  await expect(aboutMenu).toHaveCSS('opacity', '0')
  await expect(aboutMenu).toHaveCSS('visibility', 'hidden')

  await blogs.getByRole('link', { name: 'blogs' }).focus()
  await expect(blogsMenu).toHaveCSS('visibility', 'visible')
  await page.keyboard.press('Escape')
  await expect(blogsMenu).toHaveCSS('visibility', 'hidden')
})

test('navbar labels are lowercase and only the hovered item has a yellow underline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/projects')

  const nav = page.locator('.top-nav')
  await expect(nav.locator(':scope > a, :scope > .top-nav__group > a')).toHaveText([
    'home', 'blogs', 'favorites', 'about', 'projects', 'calendar',
  ])
  const about = nav.getByRole('link', { name: 'about' })
  const projects = nav.getByRole('link', { name: 'projects' })
  await expect(projects).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)')

  await about.hover()
  await expect(about).not.toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)')
  await expect(projects).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)')

  await projects.hover()
  await expect(about).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)')
  await expect(projects).not.toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)')

  await page.mouse.move(0, 200)
  await expect(projects).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)')
})

test('gallery layout fits mobile and the career range stays inside its detail card', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
  await expect(page.getByRole('heading', { name: 'Bruce Chau' })).toBeVisible()

  const range = await page.locator('.career-entry--ptit .career-entry__range-label').boundingBox()
  const detail = await page.locator('.career-entry--ptit .career-entry__detail').boundingBox()
  expect(range).not.toBeNull()
  expect(detail).not.toBeNull()
  expect(range!.x).toBeGreaterThanOrEqual(detail!.x)
  expect(range!.x + range!.width).toBeLessThanOrEqual(detail!.x + detail!.width)
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

test('neo-cubist hero is centered and career path remains vertical', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const heading = await page.getByRole('heading', { name: 'Bruce Chau' }).boundingBox()
  const axis = await page.locator('.career-timeline__axis').boundingBox()
  const events = await page.locator('.career-entry__event').all()
  expect(heading).not.toBeNull()
  expect(axis).not.toBeNull()
  expect(Math.abs(heading!.x + heading!.width / 2 - 720)).toBeLessThan(2)
  expect(Math.abs(axis!.x + axis!.width / 2 - 720)).toBeLessThan(2)
  expect(axis!.height).toBeGreaterThan(200)
  expect(axis!.width).toBeLessThan(4)
  expect((await events[0].boundingBox())!.y).toBeLessThan((await events[1].boundingBox())!.y)

  await page.setViewportSize({ width: 375, height: 812 })
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
})

test('Chau lettering keeps the reference proportions and yellow A counter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const c = page.locator('.hero__name-letter[data-letter="6"]')
  const a = page.locator('.hero__name-letter[data-letter="8"]')
  const cBox = await c.boundingBox()
  const aBox = await a.boundingBox()

  expect(cBox).not.toBeNull()
  expect(aBox).not.toBeNull()
  expect(aBox!.y).toBeGreaterThan(cBox!.y + 20)
  expect(Math.abs(aBox!.y + aBox!.height - cBox!.y - cBox!.height)).toBeLessThan(6)
  expect(await c.evaluate((element) => getComputedStyle(element, '::after').display)).toBe('none')
  expect(await a.evaluate((element) => getComputedStyle(element, '::after').backgroundColor)).toBe('rgb(248, 211, 41)')
})

test('hero and desktop navigation are centered without a right sidebar', async ({ page }) => {
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    const heading = await page.getByRole('heading', { name: 'Bruce Chau' }).boundingBox()
    expect(heading).not.toBeNull()
    expect(Math.abs(heading!.x + heading!.width / 2 - width / 2)).toBeLessThan(2)

    if (width === 1440) {
      const nav = await page.getByRole('navigation', { name: 'Site navigation' }).boundingBox()
      const social = await page.getByLabel('Social profiles').boundingBox()
      expect(nav).not.toBeNull()
      expect(social).not.toBeNull()
      expect(Math.abs(nav!.x + nav!.width / 2 - width / 2)).toBeLessThan(2)
      expect(Math.abs(social!.x + social!.width / 2 - width / 2)).toBeLessThan(2)
    }
    await expect(page.locator('#right-rail, [data-toggle-rail]')).toHaveCount(0)
  }
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
  expect((await sidebar.locator('.tree-row').allTextContents()).every((label) => label === label.toLowerCase())).toBe(true)
  await expect(sidebar).toHaveCSS('border-right-width', '2px')
  await expect(sidebar.locator('.file-tree')).toHaveCSS('border-top-width', '2px')
  await expect(sidebar.locator('.sidebar__heading, .network-status')).toHaveCount(0)
  await expect(sidebar).not.toContainText('BRUCE.CHAU')
  await expect.poll(() => page.evaluate(() => (
    document.elementFromPoint(20, 100)?.closest('#site-sidebar') !== null
  ))).toBe(true)

  await toggle.click()
  await expect(sidebar).not.toBeInViewport()

  await page.getByRole('button', { name: 'Open navigation menu' }).click()

  await sidebar.getByRole('link', { name: 'projects' }).click()
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
  await expect(sidebar).toHaveCSS('border-right-width', '2px')
  await expect(sidebar.locator('.tree-row.active')).toHaveCSS('border-radius', '0px')
  await expect(sidebar.locator('.sidebar__heading, .network-status')).toHaveCount(0)
  await expect(backdrop).toBeVisible()
  await expect.poll(() => page.evaluate(() => (
    document.elementFromPoint(20, 100)?.closest('#site-sidebar') !== null
  ))).toBe(true)
  await expect(sidebar.getByRole('link', { name: 'calendar' })).toBeInViewport()

  await backdrop.click({ position: { x: 300, y: 20 } })
  await expect(sidebar).not.toBeInViewport()
  await expect(backdrop).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await sidebar.getByRole('link', { name: 'tech' }).click()
  await expect(page).toHaveURL(/\/blogs\/tech\/?$/)
  await expect(sidebar).not.toBeInViewport()
})

test('career timeline stays centered and opens each chapter opposite its event at every breakpoint', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.locator('.career').scrollIntoViewIfNeeded()

    const header = await page.locator('.career__header').boundingBox()
    const axis = await page.locator('.career-timeline__axis').boundingBox()
    expect(header).not.toBeNull()
    expect(axis).not.toBeNull()
    expect(Math.abs(header!.x + header!.width / 2 - width / 2)).toBeLessThan(2)
    expect(Math.abs(axis!.x + axis!.width / 2 - width / 2)).toBeLessThan(2)

    for (const id of ['ptit', 'weaverse'] as const) {
      await page.locator(`.career-entry--${id} .career-entry__event`).click()
      const entry = page.locator(`.career-entry--${id}`)
      const event = await entry.locator('.career-entry__event').boundingBox()
      const detail = await entry.locator('.career-entry__detail').boundingBox()
      const node = await entry.locator('.career-entry__node').boundingBox()
      const rangeLabel = await entry.locator('.career-entry__range-label').boundingBox()
      const otherId = id === 'ptit' ? 'weaverse' : 'ptit'
      const otherEntry = await page.locator(`.career-entry--${otherId}`).boundingBox()
      expect(event).not.toBeNull()
      expect(detail).not.toBeNull()
      expect(node).not.toBeNull()
      expect(rangeLabel).not.toBeNull()
      expect(otherEntry).not.toBeNull()
      await expect(page.locator(`.career-entry--${otherId} .career-entry__detail`)).toHaveCount(0)

      if (id === 'ptit') {
        expect(detail!.x + detail!.width).toBeLessThan(node!.x)
        expect(event!.x).toBeGreaterThan(node!.x + node!.width)
        expect(otherEntry!.y + otherEntry!.height).toBeLessThan(event!.y)
      } else {
        expect(event!.x + event!.width).toBeLessThan(node!.x)
        expect(detail!.x).toBeGreaterThan(node!.x + node!.width)
        expect(detail!.y + detail!.height).toBeLessThan(otherEntry!.y)
      }
      expect(detail!.x).toBeGreaterThanOrEqual(0)
      expect(detail!.x + detail!.width).toBeLessThanOrEqual(width)
      expect(rangeLabel!.x).toBeGreaterThanOrEqual(detail!.x)
      expect(rangeLabel!.x + rangeLabel!.width).toBeLessThanOrEqual(detail!.x + detail!.width)
      await expect.poll(async () => {
        const now = await page.locator('[data-career-now-node]').boundingBox()
        const selectedNode = await entry.locator('.career-entry__node').boundingBox()
        const bracket = await page.locator('.career-timeline__range').boundingBox()
        if (!now || !selectedNode || !bracket) return false
        return Math.abs(bracket.y - (now.y + now.height / 2)) < 2
          && Math.abs(bracket.y + bracket.height - (selectedNode.y + selectedNode.height / 2)) < 2
      }).toBe(true)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    }
  }
})

test('career chapters describe the FinTech and Shopify journey', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.locator('.career').scrollIntoViewIfNeeded()

  const ptit = page.locator('.career-entry--ptit .career-entry__detail')
  await expect(ptit).toContainText('Studying FinTech at PTIT')
  await expect(ptit).toContainText('building real products, from apps to websites')
  await expect(ptit).toContainText('learned how to learn and built meaningful connections')

  await page.locator('.career-entry--weaverse .career-entry__event').click()
  await expect(page.locator('.career-entry--weaverse .career-entry__event strong')).toHaveText('Weaverse')
  const weaverse = page.locator('.career-entry--weaverse .career-entry__detail')
  await expect(weaverse.getByRole('heading', { name: 'Weaverse' })).toBeVisible()
  await expect(weaverse).toContainText('joined Weaverse as an intern')
  await expect(weaverse).toContainText('full-time team member')
  await expect(weaverse).toContainText('Shopify themes and apps')
})

test('career events show local PTIT and Weaverse logos without crossing the timeline', async ({ page }) => {
  for (const width of [1440, 768, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    for (const [id, src] of [['ptit', '/brand/ptit.svg'], ['weaverse', '/brand/weaverse.svg']] as const) {
      const entry = page.locator(`.career-entry--${id}`)
      const logo = entry.locator('.career-entry__logo')
      await expect(logo).toHaveAttribute('src', src)
      await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

      const logoBox = await logo.boundingBox()
      const nodeBox = await entry.locator('.career-entry__node').boundingBox()
      expect(logoBox).not.toBeNull()
      expect(nodeBox).not.toBeNull()
      if (id === 'weaverse') expect(logoBox!.x + logoBox!.width).toBeLessThan(nodeBox!.x)
      else expect(logoBox!.x).toBeGreaterThan(nodeBox!.x + nodeBox!.width)
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})
