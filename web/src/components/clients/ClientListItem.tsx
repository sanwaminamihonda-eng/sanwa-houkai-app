'use client';

import {
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { formatAddress } from '@/utils/formatters';

export interface ClientListItemData {
  id: string;
  name: string;
  nameKana?: string | null;
  gender?: string | null;
  phone?: string | null;
  addressPrefecture?: string | null;
  addressCity?: string | null;
  careLevel?: {
    id: string;
    name: string;
  } | null;
}

interface ClientListItemProps {
  client: ClientListItemData;
  onViewDetail: (id: string) => void;
}

/**
 * 利用者一覧のモバイル用カード表示アイテム
 */
export function ClientListItem({ client, onViewDetail }: ClientListItemProps) {
  const address = formatAddress(client.addressPrefecture, client.addressCity);

  return (
    <Box
      onClick={() => onViewDetail(client.id)}
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
      {/* 名前と介護度 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <PersonIcon color="action" />
        <Typography variant="subtitle1" fontWeight={500} sx={{ flex: 1 }}>
          {client.name}
        </Typography>
        {client.careLevel?.name && (
          <Chip
            label={client.careLevel.name}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* フリガナ */}
      {client.nameKana && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, pl: 4 }}>
          {client.nameKana}
        </Typography>
      )}

      {/* 性別・住所 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, pl: 4 }}>
        {client.gender && (
          <Chip label={client.gender} size="small" variant="outlined" />
        )}
        {address !== '-' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {address}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 電話と操作 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 4 }}>
        {client.phone ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2">{client.phone}</Typography>
            <IconButton
              size="small"
              color="primary"
              href={`tel:${client.phone}`}
              onClick={(e) => e.stopPropagation()}
            >
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box />
        )}
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(client.id);
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

interface ClientCardListProps {
  clients: ClientListItemData[];
  onViewDetail: (id: string) => void;
}

/**
 * 利用者一覧のモバイル用カードリスト
 */
export function ClientCardList({ clients, onViewDetail }: ClientCardListProps) {
  return (
    <Box>
      {clients.map((client) => (
        <ClientListItem
          key={client.id}
          client={client}
          onViewDetail={onViewDetail}
        />
      ))}
    </Box>
  );
}
