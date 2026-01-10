'use client';

import {
  Box,
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
  Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { formatDateSlash } from '@/utils/formatters';
import { CarePlanListItemData } from './CarePlanListItem';

interface CarePlansTableProps {
  carePlans: CarePlanListItemData[];
  onViewDetail: (id: string) => void;
  onDownload?: (pdfUrl: string) => void;
}

/**
 * 計画書一覧のデスクトップ用テーブル表示
 */
export function CarePlansTable({ carePlans, onViewDetail, onDownload }: CarePlansTableProps) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>利用者</TableCell>
            <TableCell>作成日</TableCell>
            <TableCell>担当者</TableCell>
            <TableCell>PDF</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carePlans.map((carePlan) => (
            <TableRow
              key={carePlan.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onViewDetail(carePlan.id)}
            >
              <TableCell>
                <Typography fontWeight={500}>{carePlan.client.name}</Typography>
              </TableCell>
              <TableCell>{formatDateSlash(carePlan.createdAt)}</TableCell>
              <TableCell>
                <Chip label={carePlan.staff.name} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                {carePlan.pdfUrl ? (
                  <Chip label="生成済み" size="small" color="success" />
                ) : (
                  <Chip label="未生成" size="small" variant="outlined" />
                )}
              </TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="詳細を表示">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(carePlan.id);
                      }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {carePlan.pdfUrl && (
                    <Tooltip title="PDFをダウンロード">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload?.(carePlan.pdfUrl!);
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
