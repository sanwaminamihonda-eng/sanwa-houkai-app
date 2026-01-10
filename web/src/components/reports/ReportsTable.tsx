'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Download as DownloadIcon,
  AutoAwesome as AiIcon,
} from '@mui/icons-material';
import { formatDateSlash } from '@/utils/formatters';
import { ReportListItemData } from './ReportListItem';

interface ReportsTableProps {
  reports: ReportListItemData[];
  onDownload?: (pdfUrl: string) => void;
}

/**
 * 帳票一覧のデスクトップ用テーブル表示
 */
export function ReportsTable({ reports, onDownload }: ReportsTableProps) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>対象年月</TableCell>
            <TableCell>利用者</TableCell>
            <TableCell>AI要約</TableCell>
            <TableCell>PDF</TableCell>
            <TableCell>作成日</TableCell>
            <TableCell>作成者</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} hover>
              <TableCell>
                <Typography fontWeight={500}>
                  {report.targetYear}年{report.targetMonth}月
                </Typography>
              </TableCell>
              <TableCell>{report.client.name}</TableCell>
              <TableCell>
                {report.aiGenerated ? (
                  <Chip
                    icon={<AiIcon />}
                    label="AI"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">-</Typography>
                )}
              </TableCell>
              <TableCell>
                {report.pdfGenerated ? (
                  <Chip label="生成済み" size="small" color="success" />
                ) : (
                  <Chip label="未生成" size="small" variant="outlined" />
                )}
              </TableCell>
              <TableCell>{formatDateSlash(report.createdAt)}</TableCell>
              <TableCell>
                <Chip label={report.staff.name} size="small" variant="outlined" />
              </TableCell>
              <TableCell align="center">
                {report.pdfGenerated && report.pdfUrl && (
                  <Tooltip title="PDFをダウンロード">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onDownload?.(report.pdfUrl!)}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
