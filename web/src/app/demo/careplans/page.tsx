'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { ResponsiveList } from '@/components/common';
import { CarePlansTable, CarePlanCardList } from '@/components/careplans';
import type { CarePlanListItemData } from '@/components/careplans';
import { dataConnect } from '@/lib/firebase';
import {
  demoListCarePlansByFacility,
  demoGetCarePlan,
  DemoGetCarePlanData,
} from '@sanwa-houkai-app/dataconnect';

type CarePlanDetail = NonNullable<DemoGetCarePlanData['carePlan']>;

interface Goal {
  content: string;
  startDate?: string | null;
  endDate?: string | null;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function DemoCarePlansPage() {
  const { facilityId } = useDemoContext();

  const [carePlans, setCarePlans] = useState<CarePlanListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCarePlan, setSelectedCarePlan] = useState<CarePlanDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await demoListCarePlansByFacility(dataConnect, { facilityId });
      setCarePlans(result.data.carePlans as CarePlanListItemData[]);
      setError(null);
    } catch (err) {
      console.error('Failed to load care plans:', err);
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

  const handleViewDetail = async (carePlanId: string) => {
    setDetailDialogOpen(true);
    setDetailLoading(true);
    setSelectedCarePlan(null);

    try {
      const result = await demoGetCarePlan(dataConnect, { id: carePlanId });
      if (result.data.carePlan) {
        setSelectedCarePlan(result.data.carePlan);
      }
    } catch (err) {
      console.error('Failed to load care plan:', err);
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

  const paginatedCarePlans = carePlans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
        訪問介護計画書
      </Typography>

      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              {carePlans.length}件の計画書
            </Typography>
            <Box sx={{ ml: 'auto' }}>
              <Tooltip title="更新">
                <IconButton onClick={handleRefresh} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Care Plans List */}
      <ResponsiveList<CarePlanListItemData>
        items={paginatedCarePlans}
        emptyMessage="計画書がありません"
        renderTable={(items) => (
          <CarePlansTable
            carePlans={items}
            onViewDetail={handleViewDetail}
            onDownload={(pdfUrl) => handleDownload(pdfUrl)}
          />
        )}
        renderCards={(items) => (
          <CarePlanCardList
            carePlans={items}
            onViewDetail={handleViewDetail}
            onDownload={(pdfUrl) => handleDownload(pdfUrl)}
          />
        )}
        pagination
        totalCount={carePlans.length}
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
    </Box>
  );
}
