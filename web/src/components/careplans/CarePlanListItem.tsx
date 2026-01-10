'use client';

import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { formatDateSlash } from '@/utils/formatters';

export interface CarePlanListItemData {
  id: string;
  client: {
    id: string;
    name: string;
  };
  staff: {
    id: string;
    name: string;
  };
  pdfUrl?: string | null;
  createdAt: string;
}

interface CarePlanListItemProps {
  carePlan: CarePlanListItemData;
  onViewDetail: (id: string) => void;
  onDownload?: (pdfUrl: string) => void;
}

/**
 * 計画書一覧のモバイル用カード表示アイテム
 */
export function CarePlanListItem({ carePlan, onViewDetail, onDownload }: CarePlanListItemProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (carePlan.pdfUrl && onDownload) {
      onDownload(carePlan.pdfUrl);
    }
  };

  return (
    <Box
      onClick={() => onViewDetail(carePlan.id)}
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* 利用者名 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <PersonIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={500}>
          {carePlan.client.name}
        </Typography>
      </Box>

      {/* 作成日とPDFステータス */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, pl: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {formatDateSlash(carePlan.createdAt)}
          </Typography>
        </Box>
        {carePlan.pdfUrl ? (
          <Chip label="PDF生成済み" size="small" color="success" />
        ) : (
          <Chip label="PDF未生成" size="small" variant="outlined" />
        )}
      </Box>

      {/* 担当者と操作 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 4 }}>
        <Chip label={carePlan.staff.name} size="small" variant="outlined" />
        <Box sx={{ display: 'flex', gap: 1 }}>
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
          {carePlan.pdfUrl && (
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
    </Box>
  );
}

interface CarePlanCardListProps {
  carePlans: CarePlanListItemData[];
  onViewDetail: (id: string) => void;
  onDownload?: (pdfUrl: string) => void;
}

/**
 * 計画書一覧のモバイル用カードリスト
 */
export function CarePlanCardList({ carePlans, onViewDetail, onDownload }: CarePlanCardListProps) {
  return (
    <Box>
      {carePlans.map((carePlan) => (
        <CarePlanListItem
          key={carePlan.id}
          carePlan={carePlan}
          onViewDetail={onViewDetail}
          onDownload={onDownload}
        />
      ))}
    </Box>
  );
}
