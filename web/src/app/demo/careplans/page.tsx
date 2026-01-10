'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
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
  CircularProgress,
  Alert,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { dataConnect } from '@/lib/firebase';
import { demoListCarePlansByFacility, DemoListCarePlansByFacilityData } from '@sanwa-houkai-app/dataconnect';

type CarePlan = DemoListCarePlansByFacilityData['carePlans'][0];

export default function DemoCarePlansPage() {
  const { facilityId } = useDemoContext();

  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const dc = dataConnect;
      const result = await demoListCarePlansByFacility(dc, { facilityId });
      setCarePlans(result.data.carePlans);
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

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

      {/* Plan Detail */}
      {selectedPlan && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{selectedPlan.client.name}の計画書</Typography>
              <IconButton onClick={() => setSelectedPlan(null)} size="small">
                ×
              </IconButton>
            </Box>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">作成者</Typography>
                <Typography>{selectedPlan.staff.name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">作成日</Typography>
                <Typography>{formatDate(selectedPlan.createdAt)}</Typography>
              </Box>
              {selectedPlan.currentSituation && (
                <Box>
                  <Typography variant="body2" color="text.secondary">利用者の生活現状</Typography>
                  <Typography>{selectedPlan.currentSituation}</Typography>
                </Box>
              )}
              {selectedPlan.familyWishes && (
                <Box>
                  <Typography variant="body2" color="text.secondary">利用者及び家族の意向・希望</Typography>
                  <Typography>{selectedPlan.familyWishes}</Typography>
                </Box>
              )}
              {selectedPlan.mainSupport && (
                <Box>
                  <Typography variant="body2" color="text.secondary">主な支援内容</Typography>
                  <Typography>{selectedPlan.mainSupport}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
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

      {/* Care Plans Table */}
      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>利用者</TableCell>
                <TableCell>作成者</TableCell>
                <TableCell>主な支援内容</TableCell>
                <TableCell>作成日</TableCell>
                <TableCell align="center">PDF</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carePlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      計画書がありません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                carePlans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <TableCell>
                      <Typography fontWeight={500}>{plan.client.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={plan.staff.name} size="small" variant="outlined" />
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
                        {truncateText(plan.mainSupport)}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(plan.createdAt)}</TableCell>
                    <TableCell align="center">
                      {plan.pdfUrl && (
                        <Tooltip title="PDF生成済み">
                          <PdfIcon color="error" fontSize="small" />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
