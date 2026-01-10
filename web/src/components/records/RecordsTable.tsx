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
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { formatDateWithWeekday, formatTimeRange } from '@/utils/formatters';
import { RecordListItemData, getServiceSummary } from './RecordListItem';

interface RecordsTableProps {
  records: RecordListItemData[];
  onViewDetail: (id: string) => void;
}

/**
 * 記録一覧のデスクトップ用テーブル表示
 */
export function RecordsTable({ records, onViewDetail }: RecordsTableProps) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>訪問日</TableCell>
            <TableCell>時間</TableCell>
            <TableCell>利用者</TableCell>
            <TableCell>サービス内容</TableCell>
            <TableCell>担当</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onViewDetail(record.id)}
            >
              <TableCell>{formatDateWithWeekday(record.visitDate)}</TableCell>
              <TableCell>{formatTimeRange(record.startTime, record.endTime)}</TableCell>
              <TableCell>
                <Typography fontWeight={500}>{record.client.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getServiceSummary(record.services)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={record.staff.name} size="small" variant="outlined" />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="詳細を表示">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(record.id);
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
