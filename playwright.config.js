import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        headless: false,
        storageState: 'auth.json',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
