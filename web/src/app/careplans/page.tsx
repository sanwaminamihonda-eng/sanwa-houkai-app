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
  TextField,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect, functions, httpsCallable } from '@/lib/firebase';
import {
  listCarePlansByFacility,
  listClients,
  ListCarePlansByFacilityData,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';

type CarePlan = ListCarePlansByFacilityData['carePlans'][0];
type Client = ListClientsData['clients'][0];

interface Goal {
  content: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface GenerateCarePlanRequest {
  carePlanId?: string;
  clientId: string;
  staffId: string;
  currentSituation: string;
  familyWishes: string;
  mainSupport: string;
  longTermGoals: Goal[];
  shortTermGoals: Goal[];
}

interface GenerateCarePlanResponse {
  success: boolean;
  pdfUrl: string;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const emptyGoal = (): Goal => ({
  content: '',
  startDate: null,
  endDate: null,
});

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
  const [editingCarePlanId, setEditingCarePlanId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [familyWishes, setFamilyWishes] = useState('');
  const [mainSupport, setMainSupport] = useState('');
  const [longTermGoals, setLongTermGoals] = useState<Goal[]>([emptyGoal(), emptyGoal(), emptyGoal()]);
  const [shortTermGoals, setShortTermGoals] = useState<Goal[]>([emptyGoal(), emptyGoal(), emptyGoal()]);
  const [generating, setGenerating] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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

  const resetForm = () => {
    setEditingCarePlanId(null);
    setSelectedClientId('');
    setCurrentSituation('');
    setFamilyWishes('');
    setMainSupport('');
    setLongTermGoals([emptyGoal(), emptyGoal(), emptyGoal()]);
    setShortTermGoals([emptyGoal(), emptyGoal(), emptyGoal()]);
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditCarePlan = (carePlan: CarePlan) => {
    setEditingCarePlanId(carePlan.id);
    setSelectedClientId(carePlan.client.id);
    setCurrentSituation(carePlan.currentSituation || '');
    setFamilyWishes(carePlan.familyWishes || '');
    setMainSupport(carePlan.mainSupport || '');

    // Parse goals from JSON
    const parsedLongTermGoals = carePlan.longTermGoals as Goal[] | null;
    const parsedShortTermGoals = carePlan.shortTermGoals as Goal[] | null;

    setLongTermGoals(
      parsedLongTermGoals && parsedLongTermGoals.length > 0
        ? [...parsedLongTermGoals, ...Array(3 - parsedLongTermGoals.length).fill(emptyGoal())].slice(0, 3)
        : [emptyGoal(), emptyGoal(), emptyGoal()]
    );
    setShortTermGoals(
      parsedShortTermGoals && parsedShortTermGoals.length > 0
        ? [...parsedShortTermGoals, ...Array(3 - parsedShortTermGoals.length).fill(emptyGoal())].slice(0, 3)
        : [emptyGoal(), emptyGoal(), emptyGoal()]
    );

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!generating) {
      setDialogOpen(false);
    }
  };

  const updateGoal = (
    goals: Goal[],
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
    index: number,
    field: keyof Goal,
    value: string | Date | null
  ) => {
    const newGoals = [...goals];
    if (field === 'startDate' || field === 'endDate') {
      newGoals[index] = {
        ...newGoals[index],
        [field]: value instanceof Date ? value.toISOString().split('T')[0] : null,
      };
    } else {
      newGoals[index] = {
        ...newGoals[index],
        [field]: value as string,
      };
    }
    setGoals(newGoals);
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

      // Filter out empty goals
      const filteredLongTermGoals = longTermGoals.filter((g) => g.content.trim());
      const filteredShortTermGoals = shortTermGoals.filter((g) => g.content.trim());

      const result = await generateCarePlan({
        carePlanId: editingCarePlanId || undefined,
        clientId: selectedClientId,
        staffId: staff.id,
        currentSituation,
        familyWishes,
        mainSupport,
        longTermGoals: filteredLongTermGoals,
        shortTermGoals: filteredShortTermGoals,
      });

      if (result.data.success) {
        setSnackbarMessage(editingCarePlanId ? '計画書を更新しました' : '計画書を作成しました');
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

  const handleDownload = (pdfUrl: string | null | undefined) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
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
                  <TableCell>主な支援内容</TableCell>
                  <TableCell>長期目標</TableCell>
                  <TableCell>短期目標</TableCell>
                  <TableCell>作成日</TableCell>
                  <TableCell>作成者</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCarePlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
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
                  paginatedCarePlans.map((carePlan) => {
                    const longTermGoalsData = carePlan.longTermGoals as Goal[] | null;
                    const shortTermGoalsData = carePlan.shortTermGoals as Goal[] | null;
                    const longTermCount = longTermGoalsData?.filter((g) => g.content)?.length || 0;
                    const shortTermCount = shortTermGoalsData?.filter((g) => g.content)?.length || 0;

                    return (
                      <TableRow key={carePlan.id} hover>
                        <TableCell>
                          <Typography fontWeight={500}>{carePlan.client.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {carePlan.mainSupport || '（未設定）'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${longTermCount}件`}
                            size="small"
                            color={longTermCount > 0 ? 'primary' : 'default'}
                            variant={longTermCount > 0 ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${shortTermCount}件`}
                            size="small"
                            color={shortTermCount > 0 ? 'secondary' : 'default'}
                            variant={shortTermCount > 0 ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>{formatDate(carePlan.createdAt)}</TableCell>
                        <TableCell>
                          <Chip label={carePlan.staff.name} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="編集">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditCarePlan(carePlan)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {carePlan.pdfUrl && (
                            <Tooltip title="PDFをダウンロード">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleDownload(carePlan.pdfUrl)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
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

        {/* Create/Edit Care Plan Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCarePlanId ? '訪問介護計画書を編集' : '訪問介護計画書を作成'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 利用者選択 */}
              <FormControl fullWidth disabled={!!editingCarePlanId}>
                <InputLabel>利用者 *</InputLabel>
                <Select
                  value={selectedClientId}
                  label="利用者 *"
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  disabled={generating || !!editingCarePlanId}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider />

              {/* 基本情報 */}
              <TextField
                label="利用者の生活現状"
                multiline
                rows={3}
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                disabled={generating}
                placeholder="利用者の現在の生活状況を記入してください"
              />

              <TextField
                label="利用者及び家族の意向・希望"
                multiline
                rows={3}
                value={familyWishes}
                onChange={(e) => setFamilyWishes(e.target.value)}
                disabled={generating}
                placeholder="利用者及び家族の意向・希望を記入してください"
              />

              <TextField
                label="主な支援内容"
                multiline
                rows={3}
                value={mainSupport}
                onChange={(e) => setMainSupport(e.target.value)}
                disabled={generating}
                placeholder="提供する主な支援内容を記入してください"
              />

              <Divider />

              {/* 長期目標 */}
              <Typography variant="subtitle1" fontWeight={600}>
                長期目標（最大3件）
              </Typography>
              {longTermGoals.map((goal, index) => (
                <Box key={`long-${index}`} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label={`長期目標 ${index + 1}`}
                    fullWidth
                    value={goal.content}
                    onChange={(e) => updateGoal(longTermGoals, setLongTermGoals, index, 'content', e.target.value)}
                    disabled={generating}
                    size="small"
                  />
                  <DatePicker
                    label="開始日"
                    value={goal.startDate ? new Date(goal.startDate) : null}
                    onChange={(date) => updateGoal(longTermGoals, setLongTermGoals, index, 'startDate', date)}
                    disabled={generating}
                    slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
                  />
                  <DatePicker
                    label="終了日"
                    value={goal.endDate ? new Date(goal.endDate) : null}
                    onChange={(date) => updateGoal(longTermGoals, setLongTermGoals, index, 'endDate', date)}
                    disabled={generating}
                    slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
                  />
                </Box>
              ))}

              <Divider />

              {/* 短期目標 */}
              <Typography variant="subtitle1" fontWeight={600}>
                短期目標（最大3件）
              </Typography>
              {shortTermGoals.map((goal, index) => (
                <Box key={`short-${index}`} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label={`短期目標 ${index + 1}`}
                    fullWidth
                    value={goal.content}
                    onChange={(e) => updateGoal(shortTermGoals, setShortTermGoals, index, 'content', e.target.value)}
                    disabled={generating}
                    size="small"
                  />
                  <DatePicker
                    label="開始日"
                    value={goal.startDate ? new Date(goal.startDate) : null}
                    onChange={(date) => updateGoal(shortTermGoals, setShortTermGoals, index, 'startDate', date)}
                    disabled={generating}
                    slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
                  />
                  <DatePicker
                    label="終了日"
                    value={goal.endDate ? new Date(goal.endDate) : null}
                    onChange={(date) => updateGoal(shortTermGoals, setShortTermGoals, index, 'endDate', date)}
                    disabled={generating}
                    slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
                  />
                </Box>
              ))}

              <Alert severity="info" sx={{ mt: 1 }}>
                計画書の内容を入力し、PDFを生成します。生成されたPDFは自動的にダウンロードされます。
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
              {generating ? '生成中...' : editingCarePlanId ? '更新する' : '生成する'}
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
