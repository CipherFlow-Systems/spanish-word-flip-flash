import { defineConfig, devices } from '@playwright/test';

// Only baseURL is overridable; defaults to localhost:8080
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const baseURL = env?.E2E_BASE_URL || 'http://localhost:8080';
const slowMo = env?.SLOW_MO ? Number(env.SLOW_MO) : 0;
const startLocalServer = baseURL === 'http://localhost:8080';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!env?.CI,
  retries: env?.CI ? 2 : 0,
  workers: env?.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'reports-e2e/junit.xml' }],
    ['html', { outputFolder: 'reports-e2e/html', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: slowMo ? { slowMo } : undefined,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: startLocalServer
    ? {
        command: 'npm run dev -- --host 127.0.0.1 --port 8080 --strictPort',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
});



