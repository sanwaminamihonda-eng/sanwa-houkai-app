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
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { ResponsiveList } from '@/components/common';
import { ReportsTable, ReportCardList, ReportListItemData } from '@/components/reports';
import { dataConnect } from '@/lib/firebase';
import { demoListReportsByFacility } from '@sanwa-houkai-app/dataconnect';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function DemoReportsPage() {
  const { facilityId } = useDemoContext();

  const [reports, setReports] = useState<ReportListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
          <ReportsTable reports={items} onDownload={handleDownload} />
        )}
        renderCards={(items) => (
          <ReportCardList reports={items} onDownload={handleDownload} />
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
    </Box>
  );
}
