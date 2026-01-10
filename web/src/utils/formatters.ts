/**
 * 共通フォーマットユーティリティ
 * 本番/デモで共通使用
 */

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * 日付フォーマット（曜日付き）
 * @example "2026/01/10 (金)"
 */
export function formatDateWithWeekday(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekday = WEEKDAYS[date.getDay()];

  return `${year}/${month}/${day} (${weekday})`;
}

/**
 * 日付フォーマット（曜日なし）
 * @example "2026/01/10"
 */
export function formatDateSlash(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

/**
 * 日付フォーマット（日本語・曜日付き）
 * @example "2026年1月10日 (金)"
 */
export function formatDateJapaneseWithWeekday(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  return `${year}年${month}月${day}日 (${weekday})`;
}

/**
 * 日付フォーマット（日本語・曜日なし）
 * @example "2026年1月10日"
 */
export function formatDateJapanese(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}

/**
 * 日付フォーマット（短縮・曜日付き）
 * @example "1/10 (金)"
 */
export function formatDateShortWithWeekday(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  return `${month}/${day} (${weekday})`;
}

/**
 * 時間範囲フォーマット
 * @example "09:00-10:30"
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const start = startTime.slice(0, 5);
  const end = endTime.slice(0, 5);
  return `${start}-${end}`;
}

/**
 * 時間フォーマット（秒を除去）
 * @example "09:00"
 */
export function formatTime(time: string | null | undefined): string {
  if (!time) return '-';
  return time.slice(0, 5);
}

/**
 * 住所を結合
 * @example "東京都 新宿区"
 */
export function formatAddress(
  prefecture: string | null | undefined,
  city: string | null | undefined
): string {
  const parts = [prefecture, city].filter(Boolean);
  return parts.join(' ') || '-';
}

/**
 * テキストを指定文字数で切り詰め
 * @example "長いテキスト..."
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number = 50
): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * API用の日付フォーマット
 * @example "2026-01-10"
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
