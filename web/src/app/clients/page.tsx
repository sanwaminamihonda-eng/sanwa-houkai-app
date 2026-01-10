'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { ResponsiveList } from '@/components/common';
import { ClientsTable, ClientCardList, ClientListItemData } from '@/components/clients';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect } from '@/lib/firebase';
import { listClients } from '@sanwa-houkai-app/dataconnect';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function ClientsPage() {
  const router = useRouter();
  const { facilityId, loading: staffLoading } = useStaff();

  const [clients, setClients] = useState<ClientListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const result = await listClients(dataConnect, { facilityId });
      setClients(result.data.clients as ClientListItemData[]);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
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

  if (staffLoading || loading) {
    return (
      <MainLayout title="利用者管理" showBackButton backHref="/">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="利用者管理" showBackButton backHref="/">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="利用者管理" showBackButton backHref="/">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="利用者管理" showBackButton backHref="/">
      <Box>
        {/* Search & Actions */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <TextField
                size="small"
                placeholder="名前で検索..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ minWidth: { xs: '100%', sm: 250 }, flex: { xs: 1, sm: 'none' } }}
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

        {/* Clients List */}
        <ResponsiveList
          items={paginatedClients}
          emptyMessage={
            searchQuery
              ? '該当する利用者が見つかりません'
              : '利用者が登録されていません'
          }
          renderTable={(items) => (
            <ClientsTable clients={items} onViewDetail={handleViewDetail} />
          )}
          renderCards={(items) => (
            <ClientCardList clients={items} onViewDetail={handleViewDetail} />
          )}
          pagination
          totalCount={filteredClients.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={setPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          countLabel="名"
        />
      </Box>
    </MainLayout>
  );
}
