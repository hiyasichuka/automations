import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: { width: 1080, height: 720 },
      },
    },
  ],
});
