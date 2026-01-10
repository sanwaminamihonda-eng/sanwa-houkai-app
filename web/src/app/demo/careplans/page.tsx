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
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { ResponsiveList } from '@/components/common';
import { CarePlansTable, CarePlanCardList } from '@/components/careplans';
import type { CarePlanListItemData } from '@/components/careplans';
import { dataConnect } from '@/lib/firebase';
import { demoListCarePlansByFacility } from '@sanwa-houkai-app/dataconnect';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function DemoCarePlansPage() {
  const { facilityId } = useDemoContext();

  const [carePlans, setCarePlans] = useState<CarePlanListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleViewDetail = (id: string) => {
    // Demo mode: just log for now
    console.log('View care plan detail:', id);
  };

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
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
            onDownload={handleDownload}
          />
        )}
        renderCards={(items) => (
          <CarePlanCardList
            carePlans={items}
            onViewDetail={handleViewDetail}
            onDownload={handleDownload}
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
    </Box>
  );
}
