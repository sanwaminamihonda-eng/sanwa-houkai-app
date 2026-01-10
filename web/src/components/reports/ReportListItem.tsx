'use client';

import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  AutoAwesome as AiIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { formatDateSlash } from '@/utils/formatters';

export interface ReportListItemData {
  id: string;
  targetYear: number;
  targetMonth: number;
  client: {
    id: string;
    name: string;
  };
  staff: {
    id: string;
    name: string;
  };
  aiGenerated?: boolean | null;
  pdfGenerated?: boolean | null;
  pdfUrl?: string | null;
  createdAt: string;
}

interface ReportListItemProps {
  report: ReportListItemData;
  onDownload?: (pdfUrl: string) => void;
}

/**
 * 帳票一覧のモバイル用カード表示アイテム
 */
export function ReportListItem({ report, onDownload }: ReportListItemProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (report.pdfUrl && onDownload) {
      onDownload(report.pdfUrl);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* 対象年月と利用者 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CalendarIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600} color="primary">
          {report.targetYear}年{report.targetMonth}月
        </Typography>
      </Box>

      {/* 利用者名 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 4 }}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body1" fontWeight={500}>
          {report.client.name}
        </Typography>
      </Box>

      {/* ステータスバッジ */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, pl: 4, flexWrap: 'wrap' }}>
        {report.aiGenerated && (
          <Chip
            icon={<AiIcon />}
            label="AI要約"
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
        {report.pdfGenerated ? (
          <Chip label="PDF生成済み" size="small" color="success" />
        ) : (
          <Chip label="PDF未生成" size="small" variant="outlined" />
        )}
      </Box>

      {/* 作成情報と操作 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 4 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {formatDateSlash(report.createdAt)} / {report.staff.name}
          </Typography>
        </Box>
        {report.pdfGenerated && report.pdfUrl && (
          <IconButton
            size="small"
            color="primary"
            onClick={handleDownload}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

interface ReportCardListProps {
  reports: ReportListItemData[];
  onDownload?: (pdfUrl: string) => void;
}

/**
 * 帳票一覧のモバイル用カードリスト
 */
export function ReportCardList({ reports, onDownload }: ReportCardListProps) {
  return (
    <Box>
      {reports.map((report) => (
        <ReportListItem
          key={report.id}
          report={report}
          onDownload={onDownload}
        />
      ))}
    </Box>
  );
}
