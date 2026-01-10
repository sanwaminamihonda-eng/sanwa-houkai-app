'use client';

import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { formatDateWithWeekday, formatTimeRange } from '@/utils/formatters';

export interface RecordListItemData {
  id: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  client: {
    id: string;
    name: string;
  };
  staff: {
    id: string;
    name: string;
  };
  services?: unknown;
  notes?: string | null;
}

interface Service {
  typeId: string;
  typeName: string;
  items: { id: string; name: string }[];
}

/**
 * サービス内容を要約文字列に変換
 */
export function getServiceSummary(servicesData: unknown): string {
  if (!servicesData) return '-';

  // Handle current API format: { details: "...", items: ["item1", "item2"] }
  const data = servicesData as { details?: string; items?: string[] };
  if (data?.items && Array.isArray(data.items)) {
    return data.items.slice(0, 3).join('、') + (data.items.length > 3 ? '...' : '');
  }

  // Handle legacy format: Service[]
  if (Array.isArray(servicesData)) {
    const services = servicesData as Service[];
    if (services.length === 0) return '-';
    return services
      .map((s) => {
        const itemNames = s.items?.map((i) => i.name).slice(0, 3).join('、') || '';
        const hasMore = s.items?.length > 3;
        return `${s.typeName}: ${itemNames}${hasMore ? '...' : ''}`;
      })
      .join(' / ');
  }

  // Handle string format (JSON)
  if (typeof servicesData === 'string') {
    try {
      const parsed = JSON.parse(servicesData);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 3).map((s: string | Service) =>
          typeof s === 'string' ? s : s.typeName
        ).join('、');
      }
    } catch {
      return servicesData;
    }
  }

  return '-';
}

interface RecordListItemProps {
  record: RecordListItemData;
  onViewDetail: (id: string) => void;
}

/**
 * 記録一覧のモバイル用カード表示アイテム
 */
export function RecordListItem({ record, onViewDetail }: RecordListItemProps) {
  return (
    <Box
      onClick={() => onViewDetail(record.id)}
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
      {/* 日付と時間 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={600} color="primary">
          {formatDateWithWeekday(record.visitDate)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TimeIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {formatTimeRange(record.startTime, record.endTime)}
          </Typography>
        </Box>
      </Box>

      {/* 利用者名 */}
      <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 0.5 }}>
        {record.client.name}
      </Typography>

      {/* サービス内容 */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {getServiceSummary(record.services)}
      </Typography>

      {/* 担当と操作 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Chip label={record.staff.name} size="small" variant="outlined" />
        </Box>
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(record.id);
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

interface RecordCardListProps {
  records: RecordListItemData[];
  onViewDetail: (id: string) => void;
}

/**
 * 記録一覧のモバイル用カードリスト
 */
export function RecordCardList({ records, onViewDetail }: RecordCardListProps) {
  return (
    <Box>
      {records.map((record) => (
        <RecordListItem
          key={record.id}
          record={record}
          onViewDetail={onViewDetail}
        />
      ))}
    </Box>
  );
}
