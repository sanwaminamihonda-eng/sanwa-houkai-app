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
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { formatAddress } from '@/utils/formatters';
import { ClientListItemData } from './ClientListItem';

interface ClientsTableProps {
  clients: ClientListItemData[];
  onViewDetail: (id: string) => void;
}

/**
 * 利用者一覧のデスクトップ用テーブル表示
 */
export function ClientsTable({ clients, onViewDetail }: ClientsTableProps) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>氏名</TableCell>
            <TableCell>フリガナ</TableCell>
            <TableCell>介護度</TableCell>
            <TableCell>性別</TableCell>
            <TableCell>住所</TableCell>
            <TableCell>電話番号</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onViewDetail(client.id)}
            >
              <TableCell>
                <Typography fontWeight={500}>{client.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {client.nameKana || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                {client.careLevel?.name ? (
                  <Chip
                    label={client.careLevel.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {client.gender ? (
                  <Chip label={client.gender} size="small" variant="outlined" />
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatAddress(client.addressPrefecture, client.addressCity)}
                </Typography>
              </TableCell>
              <TableCell>
                {client.phone ? (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="body2">{client.phone}</Typography>
                    <Tooltip title="電話をかける">
                      <IconButton
                        size="small"
                        color="primary"
                        href={`tel:${client.phone}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="詳細を表示">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(client.id);
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
