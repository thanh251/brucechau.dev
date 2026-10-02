import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3435',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bunx astro dev --port 3435 --host 127.0.0.1 --ignore-lock',
    url: 'http://127.0.0.1:3435',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
