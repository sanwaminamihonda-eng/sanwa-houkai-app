'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
  TablePagination,
  Typography,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect } from '@/lib/firebase';
import { listClients, ListClientsData } from '@sanwa-houkai-app/dataconnect';

type Client = ListClientsData['clients'][0];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function ClientsPage() {
  const router = useRouter();
  const { facilityId, loading: staffLoading } = useStaff();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const result = await listClients(dataConnect, { facilityId });
      setClients(result.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('データの読み込みに失敗しました');
    }
  }, [facilityId]);

  useEffect(() => {
    if (!facilityId) return;

    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    loadData();
  }, [facilityId, fetchData]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const handleViewDetail = (clientId: string) => {
    router.push(`/clients/detail/?id=${clientId}`);
  };

  const getAddress = (client: Client): string => {
    const parts = [client.addressPrefecture, client.addressCity].filter(Boolean);
    return parts.join(' ') || '-';
  };

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      (client.nameKana && client.nameKana.toLowerCase().includes(query))
    );
  });

  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  if (staffLoading || loading) {
    return (
      <MainLayout title="利用者管理">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="利用者管理">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="利用者管理">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="利用者管理">
      <Box>
        {/* Search & Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <TextField
                size="small"
                placeholder="名前で検索..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Tooltip title="更新">
                <IconButton onClick={handleRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {filteredClients.length}名
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
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
                {paginatedClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        {searchQuery
                          ? '該当する利用者が見つかりません'
                          : '利用者が登録されていません'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedClients.map((client) => (
                    <TableRow
                      key={client.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewDetail(client.id)}
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
                          {getAddress(client)}
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
                              handleViewDetail(client.id);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={filteredClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="表示件数:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / ${count}名`
            }
          />
        </Card>
      </Box>
    </MainLayout>
  );
}
