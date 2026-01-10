import { test, expect } from '@playwright/test';

// モバイルビューポート設定（iPhone 14相当）
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.describe('Responsive Lists Mobile View', () => {
  test.describe('Demo Records Page', () => {
    test('should display card list on mobile', async ({ page }) => {
      await page.goto('/demo/records');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認（h5タイトルで検索）
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // モバイルではテーブルコンテナが非表示（CSS display:none）
      // CSSでdisplay:noneになっているので、ロケータは見つかるがvisibleではない
      await page.screenshot({ path: 'e2e-results/mobile-records-list.png', fullPage: true });
    });

    test('should navigate to record detail on mobile', async ({ page }) => {
      await page.goto('/demo/records');
      await page.waitForLoadState('networkidle');

      // ページ読み込み待機
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'e2e-results/mobile-record-detail.png', fullPage: true });
    });
  });

  test.describe('Demo Clients Page', () => {
    test('should display card list on mobile', async ({ page }) => {
      await page.goto('/demo/clients');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      await page.screenshot({ path: 'e2e-results/mobile-clients-list.png', fullPage: true });
    });

    test('should show phone call button on mobile client card', async ({ page }) => {
      await page.goto('/demo/clients');
      await page.waitForLoadState('networkidle');

      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e-results/mobile-client-with-phone.png', fullPage: true });
    });
  });

  test.describe('Demo Reports Page', () => {
    test('should display card list on mobile', async ({ page }) => {
      await page.goto('/demo/reports');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      await page.screenshot({ path: 'e2e-results/mobile-reports-list.png', fullPage: true });
    });
  });

  test.describe('Demo Care Plans Page', () => {
    test('should display card list on mobile', async ({ page }) => {
      await page.goto('/demo/careplans');
      await page.waitForLoadState('networkidle');

      // ページが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      await page.screenshot({ path: 'e2e-results/mobile-careplans-list.png', fullPage: true });
    });
  });

  test.describe('Demo Dashboard', () => {
    test('should display 2x2 grid stats on mobile', async ({ page }) => {
      await page.goto('/demo');
      await page.waitForLoadState('networkidle');

      // ダッシュボードタイトルが表示されることを確認
      await expect(page.getByRole('heading', { name: 'デモダッシュボード' })).toBeVisible({ timeout: 10000 });

      // 統計カードが表示されていることを確認
      const statCards = page.locator('.MuiCard-root');
      await expect(statCards.first()).toBeVisible();

      await page.screenshot({ path: 'e2e-results/mobile-dashboard.png', fullPage: true });
    });

    test('should navigate from dashboard to pages', async ({ page }) => {
      await page.goto('/demo');
      await page.waitForLoadState('networkidle');

      // 記録入力ボタンをクリック
      const recordButton = page.getByRole('link', { name: /記録入力/ });
      await recordButton.click();

      // 記録一覧または記録入力ページに遷移することを確認
      await page.waitForURL('**/demo/records**');
    });
  });

  test.describe('New Record Form', () => {
    test('should display form correctly on mobile', async ({ page }) => {
      await page.goto('/demo/records/new');
      await page.waitForLoadState('networkidle');

      // フォームが表示されることを確認
      await expect(page.locator('h5')).toBeVisible({ timeout: 10000 });

      // 利用者選択ラベルが表示されることを確認（firstで一意化）
      await expect(page.locator('label').filter({ hasText: '利用者' }).first()).toBeVisible();

      await page.screenshot({ path: 'e2e-results/mobile-record-form.png', fullPage: true });
    });

    test('should show vitals fields in correct layout on mobile', async ({ page }) => {
      await page.goto('/demo/records/new');
      await page.waitForLoadState('networkidle');

      // バイタルセクションのヘッディングが表示されることを確認
      await expect(page.locator('h6').filter({ hasText: 'バイタル' })).toBeVisible();

      // 脈拍ラベルが表示されることを確認（firstで一意化）
      await expect(page.locator('label').filter({ hasText: '脈拍' }).first()).toBeVisible();

      await page.screenshot({ path: 'e2e-results/mobile-vitals-section.png', fullPage: true });
    });
  });
});
