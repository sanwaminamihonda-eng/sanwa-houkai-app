import { test, expect } from '@playwright/test';

// デスクトップビューポート設定
test.use({
  viewport: { width: 1280, height: 720 },
  isMobile: false,
});

test.describe('Responsive Lists Desktop View', () => {
  test.describe('Demo Records Page', () => {
    test('should display table on desktop', async ({ page }) => {
      await page.goto('/demo/records');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // テーブルが表示されることを確認
      const table = page.locator('table');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'e2e-results/desktop-records-table.png', fullPage: true });
    });
  });

  test.describe('Demo Clients Page', () => {
    test('should display table on desktop', async ({ page }) => {
      await page.goto('/demo/clients');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // テーブルが表示されることを確認
      const table = page.locator('table');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'e2e-results/desktop-clients-table.png', fullPage: true });
    });
  });

  test.describe('Demo Reports Page', () => {
    test('should display table on desktop', async ({ page }) => {
      await page.goto('/demo/reports');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // テーブルが表示されることを確認
      const table = page.locator('table');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'e2e-results/desktop-reports-table.png', fullPage: true });
    });
  });

  test.describe('Demo Care Plans Page', () => {
    test('should display table on desktop', async ({ page }) => {
      await page.goto('/demo/careplans');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // テーブルが表示されることを確認
      const table = page.locator('table');
      await expect(table).toBeVisible();

      await page.screenshot({ path: 'e2e-results/desktop-careplans-table.png', fullPage: true });
    });
  });

  test.describe('Demo Dashboard', () => {
    test('should display 4-column stats on desktop', async ({ page }) => {
      await page.goto('/demo');
      await page.waitForLoadState('networkidle');

      // ダッシュボードタイトルが表示されることを確認
      await expect(page.getByRole('heading', { name: 'デモダッシュボード' })).toBeVisible({ timeout: 10000 });

      // 統計カードが横並びで表示されていることを確認
      const statCards = page.locator('.MuiCard-root');
      const count = await statCards.count();
      expect(count).toBeGreaterThanOrEqual(4);

      await page.screenshot({ path: 'e2e-results/desktop-dashboard.png', fullPage: true });
    });
  });

  test.describe('New Record Form', () => {
    test('should display form with side-by-side vitals on desktop', async ({ page }) => {
      await page.goto('/demo/records/new');
      await page.waitForLoadState('networkidle');

      // フォームが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // バイタルフィールドが表示されることを確認
      await expect(page.locator('h6').filter({ hasText: 'バイタル' })).toBeVisible();

      await page.screenshot({ path: 'e2e-results/desktop-record-form.png', fullPage: true });
    });
  });
});
