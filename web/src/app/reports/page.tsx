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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AiIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { ResponsiveList } from '@/components/common';
import { ReportsTable, ReportCardList, ReportListItemData } from '@/components/reports';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect, functions, httpsCallable } from '@/lib/firebase';
import {
  listReportsByFacility,
  listClients,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';

type Client = ListClientsData['clients'][0];

interface GenerateReportRequest {
  clientId: string;
  staffId: string;
  targetYear: number;
  targetMonth: number;
  generateAiSummary: boolean;
}

interface GenerateReportResponse {
  success: boolean;
  pdfUrl: string;
  recordCount: number;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function ReportsPage() {
  const { staff, facilityId, loading: staffLoading } = useStaff();

  const [reports, setReports] = useState<ReportListItemData[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & pagination state
  const [filterClientId, setFilterClientId] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [includeAiSummary, setIncludeAiSummary] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const [reportsRes, clientsRes] = await Promise.all([
        listReportsByFacility(dataConnect, { facilityId }),
        listClients(dataConnect, { facilityId }),
      ]);

      setReports(reportsRes.data.reports as ReportListItemData[]);
      setClients(clientsRes.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load reports:', err);
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

  const handleOpenDialog = () => {
    setSelectedClientId('');
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setIncludeAiSummary(true);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!generating) {
      setDialogOpen(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedClientId || !staff) {
      setSnackbarMessage('利用者を選択してください');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!functions) {
      setSnackbarMessage('Firebase Functionsが初期化されていません');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setGenerating(true);

    try {
      const generateReport = httpsCallable<GenerateReportRequest, GenerateReportResponse>(
        functions,
        'generateReport'
      );

      const result = await generateReport({
        clientId: selectedClientId,
        staffId: staff.id,
        targetYear: selectedYear,
        targetMonth: selectedMonth,
        generateAiSummary: includeAiSummary,
      });

      if (result.data.success) {
        setSnackbarMessage(`報告書を生成しました（${result.data.recordCount}件の記録）`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        window.open(result.data.pdfUrl, '_blank');
        await fetchData();
        setDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
      setSnackbarMessage('報告書の生成に失敗しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const filteredReports = filterClientId
    ? reports.filter((r) => r.client.id === filterClientId)
    : reports;

  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 年の選択肢を生成（過去3年〜来年）
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 3 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  if (staffLoading || loading) {
    return (
      <MainLayout title="帳票・報告" showBackButton backHref="/">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="帳票・報告" showBackButton backHref="/">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="帳票・報告" showBackButton backHref="/">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="帳票・報告" showBackButton backHref="/">
      <Box>
        {/* Header */}
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
              <Box sx={{ ml: 'auto' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  報告書を作成
                </Button>
                <IconButton
                  color="primary"
                  onClick={handleOpenDialog}
                  sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Reports List */}
        <ResponsiveList
          items={paginatedReports}
          emptyMessage={
            filterClientId
              ? 'この利用者の報告書はありません'
              : '報告書がありません'
          }
          emptyAction={
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              報告書を作成
            </Button>
          }
          renderTable={(items) => (
            <ReportsTable reports={items} onDownload={handleDownload} />
          )}
          renderCards={(items) => (
            <ReportCardList reports={items} onDownload={handleDownload} />
          )}
          pagination
          totalCount={filteredReports.length}
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

        {/* Create Report Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>実施報告書を作成</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>利用者 *</InputLabel>
                <Select
                  value={selectedClientId}
                  label="利用者 *"
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  disabled={generating}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box display="flex" gap={2}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>対象年</InputLabel>
                  <Select
                    value={selectedYear}
                    label="対象年"
                    onChange={(e) => setSelectedYear(e.target.value as number)}
                    disabled={generating}
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}年
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>対象月</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="対象月"
                    onChange={(e) => setSelectedMonth(e.target.value as number)}
                    disabled={generating}
                  >
                    {monthOptions.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}月
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeAiSummary}
                    onChange={(e) => setIncludeAiSummary(e.target.checked)}
                    disabled={generating}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <AiIcon fontSize="small" color="primary" />
                    <span>AIで月次要約を生成する</span>
                  </Box>
                }
              />

              <Alert severity="info" sx={{ mt: 1 }}>
                対象月の訪問記録からPDF形式の実施報告書を生成します。
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={generating}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerateReport}
              disabled={generating || !selectedClientId}
              startIcon={generating ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {generating ? '生成中...' : '生成する'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}
