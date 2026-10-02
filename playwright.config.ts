import { defineConfig, devices } from '@playwright/test'

const productionBaseURL = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: productionBaseURL || 'http://127.0.0.1:3435',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Mini'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: productionBaseURL ? undefined : {
    command: 'bunx astro dev --port 3435 --host 127.0.0.1 --ignore-lock',
    url: 'http://127.0.0.1:3435',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
