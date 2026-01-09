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
  Snackbar,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect, functions, httpsCallable } from '@/lib/firebase';
import {
  listCarePlansByFacility,
  listClients,
  getCarePlan,
  ListCarePlansByFacilityData,
  ListClientsData,
  GetCarePlanData,
} from '@sanwa-houkai-app/dataconnect';

type CarePlan = ListCarePlansByFacilityData['carePlans'][0];
type CarePlanDetail = NonNullable<GetCarePlanData['carePlan']>;
type Client = ListClientsData['clients'][0];

interface Goal {
  content: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface GenerateCarePlanRequest {
  clientId: string;
  staffId: string;
}

interface GenerateCarePlanResponse {
  success: boolean;
  carePlanId: string;
  pdfUrl: string;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function CarePlansPage() {
  const { staff, facilityId, loading: staffLoading } = useStaff();

  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
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
  const [generating, setGenerating] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCarePlan, setSelectedCarePlan] = useState<CarePlanDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const [carePlansRes, clientsRes] = await Promise.all([
        listCarePlansByFacility(dataConnect, { facilityId }),
        listClients(dataConnect, { facilityId }),
      ]);

      setCarePlans(carePlansRes.data.carePlans);
      setClients(clientsRes.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load care plans:', err);
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
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!generating) {
      setDialogOpen(false);
    }
  };

  const handleGenerateCarePlan = async () => {
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
      const generateCarePlan = httpsCallable<GenerateCarePlanRequest, GenerateCarePlanResponse>(
        functions,
        'generateCarePlan'
      );

      const result = await generateCarePlan({
        clientId: selectedClientId,
        staffId: staff.id,
      });

      if (result.data.success) {
        setSnackbarMessage('計画書を生成しました');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // PDFをダウンロード
        window.open(result.data.pdfUrl, '_blank');

        // 一覧を更新
        await fetchData();
        setDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to generate care plan:', err);
      setSnackbarMessage('計画書の生成に失敗しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleViewDetail = async (carePlanId: string) => {
    setDetailDialogOpen(true);
    setDetailLoading(true);
    setSelectedCarePlan(null);

    try {
      const result = await getCarePlan(dataConnect, { id: carePlanId });
      if (result.data.carePlan) {
        setSelectedCarePlan(result.data.carePlan);
      }
    } catch (err) {
      console.error('Failed to load care plan:', err);
      setSnackbarMessage('計画書の読み込みに失敗しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setDetailDialogOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedCarePlan(null);
  };

  const handleDownload = (pdfUrl: string | null | undefined) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const parseGoals = (goalsData: unknown): Goal[] => {
    if (!goalsData) return [];
    try {
      if (typeof goalsData === 'string') {
        return JSON.parse(goalsData);
      }
      return goalsData as Goal[];
    } catch {
      return [];
    }
  };

  const filteredCarePlans = filterClientId
    ? carePlans.filter((cp) => cp.client.id === filterClientId)
    : carePlans;

  const paginatedCarePlans = filteredCarePlans.slice(
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
      <MainLayout title="訪問介護計画書">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="訪問介護計画書">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="訪問介護計画書">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="訪問介護計画書">
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
                  計画書を作成
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Care Plans Table */}
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>利用者</TableCell>
                  <TableCell>作成日</TableCell>
                  <TableCell>担当者</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCarePlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        {filterClientId
                          ? 'この利用者の計画書はありません'
                          : '計画書がありません'}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{ mt: 2 }}
                      >
                        計画書を作成
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCarePlans.map((carePlan) => (
                    <TableRow
                      key={carePlan.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewDetail(carePlan.id)}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>
                          {carePlan.client.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(carePlan.createdAt)}</TableCell>
                      <TableCell>
                        <Chip label={carePlan.staff.name} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {carePlan.pdfUrl ? (
                          <Chip label="生成済み" size="small" color="success" />
                        ) : (
                          <Chip label="未生成" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Tooltip title="詳細を表示">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(carePlan.id);
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {carePlan.pdfUrl && (
                            <Tooltip title="PDFをダウンロード">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(carePlan.pdfUrl);
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
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
            count={filteredCarePlans.length}
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

        {/* Create Care Plan Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>訪問介護計画書を作成</DialogTitle>
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

              <Alert severity="info" sx={{ mt: 1 }}>
                利用者の情報と過去の訪問記録から、AIが訪問介護計画書を自動生成します。
                生成後、内容を確認・編集できます。
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={generating}>
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerateCarePlan}
              disabled={generating || !selectedClientId}
              startIcon={generating ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {generating ? '生成中...' : '生成する'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">計画書詳細</Typography>
              <IconButton onClick={handleCloseDetailDialog} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {detailLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress />
              </Box>
            ) : selectedCarePlan ? (
              <Box>
                {/* Client Info */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <PersonIcon color="primary" />
                      <Typography variant="h5" fontWeight={600}>
                        {selectedCarePlan.client.name}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={3} flexWrap="wrap">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          作成日:
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedCarePlan.createdAt)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color="text.secondary">
                          担当者:
                        </Typography>
                        <Chip label={selectedCarePlan.staff.name} size="small" variant="outlined" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* PDF Button */}
                {selectedCarePlan.pdfUrl && (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(selectedCarePlan.pdfUrl)}
                    sx={{ mb: 3 }}
                  >
                    PDFを開く
                  </Button>
                )}

                <Grid container spacing={3}>
                  {/* Current Situation */}
                  {selectedCarePlan.currentSituation && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            利用者の生活現状
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                            {selectedCarePlan.currentSituation}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Family Wishes */}
                  {selectedCarePlan.familyWishes && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            利用者及び家族の意向・希望
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                            {selectedCarePlan.familyWishes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Main Support */}
                  {selectedCarePlan.mainSupport && (
                    <Grid size={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            主な支援内容
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                            {selectedCarePlan.mainSupport}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Long Term Goals */}
                  {parseGoals(selectedCarePlan.longTermGoals).length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                            長期目標
                          </Typography>
                          {parseGoals(selectedCarePlan.longTermGoals).map((goal, index) => (
                            goal.content && (
                              <Paper
                                key={`long-${index}`}
                                variant="outlined"
                                sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}
                              >
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <Chip
                                    label={index + 1}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600 }}
                                  />
                                  {(goal.startDate || goal.endDate) && (
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                                    </Typography>
                                  )}
                                </Box>
                                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                                  {goal.content}
                                </Typography>
                              </Paper>
                            )
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {/* Short Term Goals */}
                  {parseGoals(selectedCarePlan.shortTermGoals).length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom color="secondary">
                            短期目標
                          </Typography>
                          {parseGoals(selectedCarePlan.shortTermGoals).map((goal, index) => (
                            goal.content && (
                              <Paper
                                key={`short-${index}`}
                                variant="outlined"
                                sx={{ p: 2, mb: 2, bgcolor: 'secondary.50' }}
                              >
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <Chip
                                    label={index + 1}
                                    size="small"
                                    color="secondary"
                                    sx={{ fontWeight: 600 }}
                                  />
                                  {(goal.startDate || goal.endDate) && (
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                                    </Typography>
                                  )}
                                </Box>
                                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                                  {goal.content}
                                </Typography>
                              </Paper>
                            )
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>

                {/* Metadata */}
                <Divider sx={{ my: 3 }} />
                <Box display="flex" gap={3} justifyContent="flex-end">
                  <Typography variant="body2" color="text.secondary">
                    作成: {new Date(selectedCarePlan.createdAt).toLocaleString('ja-JP')}
                  </Typography>
                  {selectedCarePlan.updatedAt !== selectedCarePlan.createdAt && (
                    <Typography variant="body2" color="text.secondary">
                      更新: {new Date(selectedCarePlan.updatedAt).toLocaleString('ja-JP')}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Alert severity="error">計画書が見つかりません</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog}>閉じる</Button>
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
