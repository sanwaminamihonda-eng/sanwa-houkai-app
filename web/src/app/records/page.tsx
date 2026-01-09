'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  TablePagination,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect } from '@/lib/firebase';
import {
  listVisitRecordsByDateRange,
  listClients,
  ListVisitRecordsByDateRangeData,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';

type VisitRecord = ListVisitRecordsByDateRangeData['visitRecords'][0];
type Client = ListClientsData['clients'][0];

interface Service {
  typeId: string;
  typeName: string;
  items: { id: string; name: string }[];
}

const DAYS_TO_LOAD = 30;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function RecordsPage() {
  const router = useRouter();
  const { facilityId, loading: staffLoading } = useStaff();

  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & pagination state
  const [filterClientId, setFilterClientId] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

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

      setRecords(recordsRes.data.visitRecords);
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
    router.push(`/records/${recordId}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)}-${end.slice(0, 5)}`;
  };

  const parseServices = (servicesData: unknown): Service[] => {
    if (!servicesData) return [];
    try {
      if (typeof servicesData === 'string') {
        return JSON.parse(servicesData);
      }
      return servicesData as Service[];
    } catch {
      return [];
    }
  };

  const getServiceSummary = (record: VisitRecord): string => {
    const services = parseServices(record.services);
    if (services.length === 0) return '-';

    return services
      .map((s) => {
        const itemNames = s.items.map((i) => i.name).slice(0, 3).join('、');
        const hasMore = s.items.length > 3;
        return `${s.typeName}: ${itemNames}${hasMore ? '...' : ''}`;
      })
      .join(' / ');
  };

  const filteredRecords = filterClientId
    ? records.filter((r) => r.client.id === filterClientId)
    : records;

  const paginatedRecords = filteredRecords.slice(
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

  if (staffLoading || loading) {
    return (
      <MainLayout title="履歴一覧">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="履歴一覧">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="履歴一覧">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="履歴一覧">
      <Box>
        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 200 }}>
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
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                直近{DAYS_TO_LOAD}日間の記録を表示
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
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
                {paginatedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        {filterClientId
                          ? 'この利用者の記録はありません'
                          : '記録がありません'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewDetail(record.id)}
                    >
                      <TableCell>{formatDate(record.visitDate)}</TableCell>
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
                          {getServiceSummary(record)}
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
                              handleViewDetail(record.id);
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
            count={filteredRecords.length}
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
    </MainLayout>
  );
}
