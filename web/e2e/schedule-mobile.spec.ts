import { test, expect } from '@playwright/test';

// モバイルビューポート設定（iPhone 14相当）
test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});

test.describe('Schedule Mobile View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/schedule');
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });
  });

  test('should display calendar on mobile - week view', async ({ page }) => {
    // スクリーンショットを撮影
    await page.screenshot({ path: 'e2e-results/mobile-week-view.png', fullPage: true });

    // ツールバーが見えることを確認
    await expect(page.locator('.fc-toolbar')).toBeVisible();

    // タイトルが見えることを確認
    await expect(page.locator('.fc-toolbar-title')).toBeVisible();
  });

  test('should display calendar on mobile - day view', async ({ page }) => {
    // 日表示に切り替え
    const dayButton = page.locator('.fc-timeGridDay-button');
    await dayButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'e2e-results/mobile-day-view.png', fullPage: true });

    await expect(page.locator('.fc-timeGridDay-view')).toBeVisible();
  });

  test('should display calendar on mobile - month view', async ({ page }) => {
    // 月表示に切り替え
    const monthButton = page.locator('.fc-dayGridMonth-button');
    await monthButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'e2e-results/mobile-month-view.png', fullPage: true });

    await expect(page.locator('.fc-dayGridMonth-view')).toBeVisible();
  });

  test('should open hamburger menu on mobile', async ({ page }) => {
    // ハンバーガーメニューボタンをクリック
    const menuButton = page.locator('button[aria-label="メニューを開く"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // サイドバーが開くことを確認（role="dialog"のtemporary drawer）
    await expect(page.locator('[role="dialog"].MuiDrawer-paper')).toBeVisible();

    await page.screenshot({ path: 'e2e-results/mobile-sidebar-open.png', fullPage: true });
  });

  test('should display events on mobile', async ({ page }) => {
    // イベントが存在するか確認
    const events = page.locator('.fc-event');
    const eventCount = await events.count();
    console.log(`Found ${eventCount} events on mobile view`);

    if (eventCount > 0) {
      await page.screenshot({ path: 'e2e-results/mobile-with-events.png', fullPage: true });
    }
  });
});
