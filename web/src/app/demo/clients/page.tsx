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
import { useDemoContext } from '@/contexts/DemoContext';
import { dataConnect } from '@/lib/firebase';
import { demoListClients, DemoListClientsData } from '@sanwa-houkai-app/dataconnect';

type Client = DemoListClientsData['clients'][0];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function DemoClientsPage() {
  const { facilityId } = useDemoContext();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    try {
      const dc = dataConnect;
      const result = await demoListClients(dc, { facilityId });
      setClients(result.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('データの読み込みに失敗しました');
    }
  }, [facilityId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    loadData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        利用者一覧
      </Typography>

      {/* Client Detail Panel */}
      {selectedClient && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{selectedClient.name}</Typography>
              <IconButton onClick={() => setSelectedClient(null)} size="small">
                ×
              </IconButton>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">フリガナ</Typography>
                <Typography>{selectedClient.nameKana || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">性別</Typography>
                <Typography>{selectedClient.gender || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">要介護度</Typography>
                <Typography>{selectedClient.careLevel?.name || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">電話番号</Typography>
                <Typography>{selectedClient.phone || '-'}</Typography>
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="body2" color="text.secondary">住所</Typography>
                <Typography>{getAddress(selectedClient)}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              size="small"
              placeholder="名前・フリガナで検索"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Tooltip title="更新">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              {filteredClients.length}名の利用者
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
                <TableCell>名前</TableCell>
                <TableCell>フリガナ</TableCell>
                <TableCell>性別</TableCell>
                <TableCell>要介護度</TableCell>
                <TableCell>住所</TableCell>
                <TableCell align="center">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      {searchQuery
                        ? '検索条件に一致する利用者がいません'
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
                    onClick={() => handleViewDetail(client)}
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
                      {client.gender && (
                        <Chip
                          label={client.gender}
                          size="small"
                          color={client.gender === '男性' ? 'info' : 'secondary'}
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {client.careLevel?.name && (
                        <Chip label={client.careLevel.name} size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{getAddress(client)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="詳細を表示">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(client);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {client.phone && (
                        <Tooltip title="電話をかける">
                          <IconButton
                            size="small"
                            component="a"
                            href={`tel:${client.phone}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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
            `${from}-${to} / ${count}件`
          }
        />
      </Card>
    </Box>
  );
}
