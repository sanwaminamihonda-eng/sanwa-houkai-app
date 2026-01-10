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
  AutoAwesome as AiIcon,
} from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { dataConnect } from '@/lib/firebase';
import { demoListReportsByFacility, DemoListReportsByFacilityData } from '@sanwa-houkai-app/dataconnect';

type Report = DemoListReportsByFacilityData['reports'][0];

export default function DemoReportsPage() {
  const { facilityId } = useDemoContext();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const dc = dataConnect;
      const result = await demoListReportsByFacility(dc, { facilityId });
      setReports(result.data.reports);
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

  const formatPeriod = (year: number, month: number) => {
    return `${year}年${month}月`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
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
        実施報告書
      </Typography>

      {/* Report Detail */}
      {selectedReport && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {selectedReport.client.name} - {formatPeriod(selectedReport.targetYear, selectedReport.targetMonth)}
              </Typography>
              <IconButton onClick={() => setSelectedReport(null)} size="small">
                ×
              </IconButton>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">対象期間</Typography>
                <Typography>{formatPeriod(selectedReport.targetYear, selectedReport.targetMonth)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">作成者</Typography>
                <Typography>{selectedReport.staff.name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">作成日</Typography>
                <Typography>{formatDate(selectedReport.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">PDF生成</Typography>
                <Typography>{selectedReport.pdfGenerated ? '生成済み' : '未生成'}</Typography>
              </Box>
              {selectedReport.summary && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="body2" color="text.secondary">要約</Typography>
                  <Typography>{selectedReport.summary}</Typography>
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

      {/* Reports Table */}
      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>対象期間</TableCell>
                <TableCell>利用者</TableCell>
                <TableCell>作成者</TableCell>
                <TableCell>作成日</TableCell>
                <TableCell align="center">AI生成</TableCell>
                <TableCell align="center">PDF</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      報告書がありません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow
                    key={report.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedReport(report)}
                  >
                    <TableCell>
                      <Typography fontWeight={500}>
                        {formatPeriod(report.targetYear, report.targetMonth)}
                      </Typography>
                    </TableCell>
                    <TableCell>{report.client.name}</TableCell>
                    <TableCell>
                      <Chip label={report.staff.name} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell align="center">
                      {report.aiGenerated && (
                        <Tooltip title="AI生成">
                          <AiIcon color="primary" fontSize="small" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {report.pdfGenerated && (
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
