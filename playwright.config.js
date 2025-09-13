// playwright.config.js (ESM)
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  fullyParallel: true,
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.spec\.js/,
      use: {
        headless: false,
      },
    },
    {
      name: 'chromium',
      use: {
        headless: false,
        storageState: 'auth.json',
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ['setup'],
    },
  ],
});
