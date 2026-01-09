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
  Download as DownloadIcon,
  AutoAwesome as AiIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect, functions, httpsCallable } from '@/lib/firebase';
import {
  listReportsByFacility,
  listClients,
  ListReportsByFacilityData,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';

type Report = ListReportsByFacilityData['reports'][0];
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

  const [reports, setReports] = useState<Report[]>([]);
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

      setReports(reportsRes.data.reports);
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

        // PDFをダウンロード
        window.open(result.data.pdfUrl, '_blank');

        // 一覧を更新
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

  const handleDownload = (pdfUrl: string | null | undefined) => {
    if (pdfUrl) {
      // gs:// URLの場合は署名付きURLに変換が必要
      // ここでは直接開く（Cloud Storageからのダウンロード）
      // 実際にはCloud Functionで署名付きURLを取得するAPIが必要かもしれない
      window.open(pdfUrl, '_blank');
    }
  };

  const formatYearMonth = (year: number, month: number) => {
    return `${year}年${month}月`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const filteredReports = filterClientId
    ? reports.filter((r) => r.client.id === filterClientId)
    : reports;

  const paginatedReports = filteredReports.slice(
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

  // 年の選択肢を生成（過去3年〜来年）
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 3 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  if (staffLoading || loading) {
    return (
      <MainLayout title="帳票・報告">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="帳票・報告">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="帳票・報告">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="帳票・報告">
      <Box>
        {/* Header */}
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
              <Box sx={{ ml: 'auto' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  報告書を作成
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>対象年月</TableCell>
                  <TableCell>利用者</TableCell>
                  <TableCell>AI要約</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell>作成日</TableCell>
                  <TableCell>作成者</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        {filterClientId
                          ? 'この利用者の報告書はありません'
                          : '報告書がありません'}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{ mt: 2 }}
                      >
                        報告書を作成
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReports.map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {formatYearMonth(report.targetYear, report.targetMonth)}
                        </Typography>
                      </TableCell>
                      <TableCell>{report.client.name}</TableCell>
                      <TableCell>
                        {report.aiGenerated ? (
                          <Chip
                            icon={<AiIcon />}
                            label="AI"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.pdfGenerated ? (
                          <Chip label="生成済み" size="small" color="success" />
                        ) : (
                          <Chip label="未生成" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell>
                        <Chip label={report.staff.name} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        {report.pdfGenerated && report.pdfUrl && (
                          <Tooltip title="PDFをダウンロード">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleDownload(report.pdfUrl)}
                            >
                              <DownloadIcon fontSize="small" />
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
            count={filteredReports.length}
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
                AIによる月次要約を含めると、特記事項が自動的にまとめられます。
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
