'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { ResponsiveList } from '@/components/common';
import { RecordsTable, RecordCardList, RecordListItemData } from '@/components/records';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect } from '@/lib/firebase';
import { formatDateForApi } from '@/utils/formatters';
import {
  listVisitRecordsByDateRange,
  listClients,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';

type Client = ListClientsData['clients'][0];

const DAYS_TO_LOAD = 30;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function RecordsPage() {
  const router = useRouter();
  const { facilityId, loading: staffLoading } = useStaff();

  const [records, setRecords] = useState<RecordListItemData[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & pagination state
  const [filterClientId, setFilterClientId] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - DAYS_TO_LOAD);

      const [recordsRes, clientsRes] = await Promise.all([
        listVisitRecordsByDateRange(dataConnect, {
          facilityId,
          startDate: formatDateForApi(startDate),
          endDate: formatDateForApi(endDate),
        }),
        listClients(dataConnect, { facilityId }),
      ]);

      setRecords(recordsRes.data.visitRecords as RecordListItemData[]);
      setClients(clientsRes.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load records:', err);
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

  const handleViewDetail = (recordId: string) => {
    router.push(`/records/detail/?id=${recordId}`);
  };

  const filteredRecords = filterClientId
    ? records.filter((r) => r.client.id === filterClientId)
    : records;

  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (staffLoading || loading) {
    return (
      <MainLayout title="履歴一覧" showBackButton backHref="/">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="履歴一覧" showBackButton backHref="/">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="履歴一覧" showBackButton backHref="/">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="履歴一覧" showBackButton backHref="/">
      <Box>
        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 }, flex: { xs: 1, sm: 'none' } }}>
                <InputLabel>利用者で絞り込み</InputLabel>
                <Select
                  value={filterClientId}
                  label="利用者で絞り込み"
                  onChange={(e) => {
                    setFilterClientId(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">すべて表示</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="更新">
                <IconButton onClick={handleRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 'auto', display: { xs: 'none', sm: 'block' } }}
              >
                直近{DAYS_TO_LOAD}日間の記録を表示
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Records List */}
        <ResponsiveList
          items={paginatedRecords}
          emptyMessage={
            filterClientId
              ? 'この利用者の記録はありません'
              : '記録がありません'
          }
          renderTable={(items) => (
            <RecordsTable records={items} onViewDetail={handleViewDetail} />
          )}
          renderCards={(items) => (
            <RecordCardList records={items} onViewDetail={handleViewDetail} />
          )}
          pagination
          totalCount={filteredRecords.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={setPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          countLabel="件"
        />
      </Box>
    </MainLayout>
  );
}
