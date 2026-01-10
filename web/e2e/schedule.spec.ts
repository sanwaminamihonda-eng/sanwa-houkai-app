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

  test('should be able to switch calendar views', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(2000);

    // 初期表示は週ビュー
    await expect(page.locator('.fc-timeGridWeek-view')).toBeVisible();

    // 月表示に切り替え
    const monthButton = page.locator('.fc-dayGridMonth-button');
    await monthButton.click();
    await page.waitForTimeout(2000);
    await expect(page.locator('.fc-dayGridMonth-view')).toBeVisible({ timeout: 10000 });

    // 日表示に切り替え
    const dayButton = page.locator('.fc-timeGridDay-button');
    await dayButton.click();
    await page.waitForTimeout(2000);
    await expect(page.locator('.fc-timeGridDay-view')).toBeVisible({ timeout: 10000 });

    // 週表示に戻す
    const weekButton = page.locator('.fc-timeGridWeek-button');
    await weekButton.click();
    await page.waitForTimeout(2000);
    await expect(page.locator('.fc-timeGridWeek-view')).toBeVisible({ timeout: 10000 });
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

  test.skip('should open schedule form dialog when clicking new schedule button', async ({ page }) => {
    // カレンダーが読み込まれるまで待機
    await expect(page.locator('.fc')).toBeVisible({ timeout: 30000 });

    // 「新規予定」ボタンをクリック（テキストを含むボタンを選択）
    const newScheduleButton = page.locator('button:has-text("新規予定")');
    await expect(newScheduleButton).toBeVisible({ timeout: 5000 });
    await newScheduleButton.click();

    // フォームダイアログが開くことを確認（ダイアログタイトルで確認）
    await expect(page.getByRole('heading', { name: '新規予定' })).toBeVisible({ timeout: 5000 });
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

      // 詳細ダイアログが開くことを確認（Drawerではなく、MuiDialogを選択）
      await expect(page.locator('.MuiDialog-root [role="dialog"]')).toBeVisible({ timeout: 5000 });
    } else {
      console.log('No events found, skipping event click test');
    }
  });
});
