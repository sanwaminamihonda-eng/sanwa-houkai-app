'use client';

import { ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TablePagination,
} from '@mui/material';

interface ResponsiveListProps<T> {
  /** データ配列 */
  items: T[];
  /** 空の場合のメッセージ */
  emptyMessage?: string;
  /** 空の場合のアクション要素 */
  emptyAction?: ReactNode;
  /** デスクトップ用テーブル表示 */
  renderTable: (items: T[]) => ReactNode;
  /** モバイル用カード表示 */
  renderCards: (items: T[]) => ReactNode;
  /** ページネーション有効 */
  pagination?: boolean;
  /** 総件数 */
  totalCount?: number;
  /** ページ */
  page?: number;
  /** ページあたり件数 */
  rowsPerPage?: number;
  /** ページあたり件数オプション */
  rowsPerPageOptions?: number[];
  /** ページ変更ハンドラ */
  onPageChange?: (page: number) => void;
  /** 件数変更ハンドラ */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** カウント単位ラベル */
  countLabel?: string;
}

/**
 * レスポンシブなリスト表示コンポーネント
 * - デスクトップ (md以上): テーブル表示
 * - モバイル (md未満): カード表示
 *
 * CSS media queriesを使用してSSR対応
 */
export function ResponsiveList<T>({
  items,
  emptyMessage = 'データがありません',
  emptyAction,
  renderTable,
  renderCards,
  pagination = false,
  totalCount = 0,
  page = 0,
  rowsPerPage = 10,
  rowsPerPageOptions = [10, 25, 50],
  onPageChange,
  onRowsPerPageChange,
  countLabel = '件',
}: ResponsiveListProps<T>) {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  // 空の場合
  if (items.length === 0) {
    return (
      <Card>
        <CardContent sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {emptyMessage}
          </Typography>
          {emptyAction}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {/* デスクトップ: テーブル表示 */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        {renderTable(items)}
      </Box>

      {/* モバイル: カード表示 */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {renderCards(items)}
      </Box>

      {/* ページネーション */}
      {pagination && totalCount > 0 && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="表示件数:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} / ${count}${countLabel}`
          }
          sx={{
            // モバイル用にページネーションを調整
            '.MuiTablePagination-toolbar': {
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
          }}
        />
      )}
    </Card>
  );
}
