'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  AutoAwesome as AiIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { ResponsiveList } from '@/components/common';
import { ReportsTable, ReportCardList, ReportListItemData } from '@/components/reports';
import { dataConnect } from '@/lib/firebase';
import {
  demoListReportsByFacility,
  demoGetReport,
  DemoGetReportData,
} from '@sanwa-houkai-app/dataconnect';

type ReportDetail = NonNullable<DemoGetReportData['report']>;

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function DemoReportsPage() {
  const { facilityId } = useDemoContext();

  const [reports, setReports] = useState<ReportListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await demoListReportsByFacility(dataConnect, { facilityId });
      setReports(result.data.reports as ReportListItemData[]);
      setError(null);
    } catch (err) {
      console.error('Failed to load reports:', err);
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

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handleViewDetail = async (reportId: string) => {
    setDetailDialogOpen(true);
    setDetailLoading(true);
    setSelectedReport(null);

    try {
      const result = await demoGetReport(dataConnect, { id: reportId });
      if (result.data.report) {
        setSelectedReport(result.data.report);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
      setDetailDialogOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReport(null);
  };

  const paginatedReports = reports.slice(
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
        実施報告書
      </Typography>

      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: { xs: 1.5, sm: 2 } }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              {reports.length}件の報告書
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

      {/* Reports List */}
      <ResponsiveList
        items={paginatedReports}
        emptyMessage="報告書がありません"
        renderTable={(items) => (
          <ReportsTable reports={items} onViewDetail={handleViewDetail} onDownload={handleDownload} />
        )}
        renderCards={(items) => (
          <ReportCardList reports={items} onViewDetail={handleViewDetail} onDownload={handleDownload} />
        )}
        pagination
        totalCount={reports.length}
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
            <Typography variant="h6">報告書詳細</Typography>
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
          ) : selectedReport ? (
            <Box>
              {/* Header Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <CalendarIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>
                      {selectedReport.targetYear}年{selectedReport.targetMonth}月
                    </Typography>
                  </Box>
                  <Box display="flex" gap={3} flexWrap="wrap">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={500}>
                        {selectedReport.client.name}
                      </Typography>
                      {selectedReport.client.careLevel?.name && (
                        <Chip
                          label={selectedReport.client.careLevel.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        担当者:
                      </Typography>
                      <Chip label={selectedReport.staff.name} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* PDF Button */}
              {selectedReport.pdfUrl && (
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(selectedReport.pdfUrl!)}
                  sx={{ mb: 3 }}
                >
                  PDFを開く
                </Button>
              )}

              {/* AI Summary */}
              {selectedReport.summary && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        月次要約
                      </Typography>
                      {selectedReport.aiGenerated && (
                        <Chip
                          icon={<AiIcon />}
                          label="AI生成"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {selectedReport.summary}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Divider sx={{ my: 3 }} />
              <Box display="flex" gap={3} justifyContent="flex-end">
                <Typography variant="body2" color="text.secondary">
                  作成: {new Date(selectedReport.createdAt).toLocaleString('ja-JP')}
                </Typography>
                {selectedReport.updatedAt !== selectedReport.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    更新: {new Date(selectedReport.updatedAt).toLocaleString('ja-JP')}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Alert severity="error">報告書が見つかりません</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
