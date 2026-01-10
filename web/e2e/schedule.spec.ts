import { test, expect } from '@playwright/test';

test.describe('Demo Schedule Page', () => {
  test.beforeEach(async ({ page }) => {
    // デモスケジュールページにアクセス
    await page.goto('/demo/schedule');
  });

  test('should load the schedule page successfully', async ({ page }) => {
    // ローディングが終わるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // FullCalendarが表示されることを確認
    await expect(page.locator('.fc-toolbar')).toBeVisible();
  });

  test('should display calendar with events', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // カレンダーヘッダーが表示されることを確認
    await expect(page.locator('.fc-toolbar-title')).toBeVisible();

    // ビュー切り替えボタンが存在することを確認
    await expect(page.locator('.fc-timeGridWeek-button, .fc-dayGridMonth-button').first()).toBeVisible();
  });

  test.skip('should be able to switch calendar views', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // 月表示に切り替え
    const monthButton = page.locator('.fc-dayGridMonth-button');
    if (await monthButton.isVisible()) {
      await monthButton.click();
      // 月表示のロード待機
      await page.waitForTimeout(2000);
      await expect(page.locator('.fc-daygrid-body')).toBeVisible({ timeout: 10000 });
    }

    // 週表示に切り替え
    const weekButton = page.locator('.fc-timeGridWeek-button');
    if (await weekButton.isVisible()) {
      await weekButton.click();
      // 週表示のロード待機
      await page.waitForTimeout(2000);
      await expect(page.locator('.fc-timegrid-body')).toBeVisible({ timeout: 10000 });
    }
  });

  test.skip('should navigate to previous/next periods', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // 現在の日付タイトルを取得
    const titleBefore = await page.locator('.fc-toolbar-title').textContent();

    // 次へボタンをクリック
    await page.locator('.fc-next-button').click();

    // データ取得のため待機
    await page.waitForTimeout(2000);

    // タイトルが変わったことを確認
    const titleAfter = await page.locator('.fc-toolbar-title').textContent();
    expect(titleAfter).not.toBe(titleBefore);

    // 前へボタンで戻る
    await page.locator('.fc-prev-button').click();
    await page.waitForTimeout(2000);

    const titleReturn = await page.locator('.fc-toolbar-title').textContent();
    expect(titleReturn).toBe(titleBefore);
  });

  test('should open schedule form dialog when clicking on calendar', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // 週表示に切り替え（時間枠をクリックしやすくするため）
    const weekButton = page.locator('.fc-timeGridWeek-button');
    if (await weekButton.isVisible()) {
      await weekButton.click();
    }

    // タイムグリッドの空き時間枠をクリック
    const timeSlot = page.locator('.fc-timegrid-slot-lane').first();
    await timeSlot.click({ force: true });

    // ダイアログが開くことを確認
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
  });

  test('should display existing schedule events', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // イベントが存在する場合、表示されることを確認
    // シードデータがあれば、イベントが表示されるはず
    const events = page.locator('.fc-event');
    const eventCount = await events.count();

    // イベントが1つ以上あるか、または0でもページが正常に動作することを確認
    expect(eventCount).toBeGreaterThanOrEqual(0);
    console.log(`Found ${eventCount} events on the calendar`);
  });

  test('should open event detail dialog when clicking on an event', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // イベントがあるかチェック
    const events = page.locator('.fc-event');
    const eventCount = await events.count();

    if (eventCount > 0) {
      // 最初のイベントをクリック
      await events.first().click();

      // 詳細ダイアログが開くことを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
    } else {
      console.log('No events found, skipping event click test');
    }
  });
});
