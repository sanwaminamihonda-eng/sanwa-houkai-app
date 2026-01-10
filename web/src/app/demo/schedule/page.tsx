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
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useDemoContext } from '@/contexts/DemoContext';
import { dataConnect } from '@/lib/firebase';
import { demoListSchedulesByDateRange, DemoListSchedulesByDateRangeData } from '@sanwa-houkai-app/dataconnect';

type Schedule = DemoListSchedulesByDateRangeData['schedules'][0];

export default function DemoSchedulePage() {
  const { facilityId } = useDemoContext();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  };

  const fetchData = useCallback(async () => {
    try {
      const dc = dataConnect;
      const { start, end } = getWeekRange(currentDate);

      const result = await demoListSchedulesByDateRange(dc, {
        facilityId,
        startDate: formatDateForApi(start),
        endDate: formatDateForApi(end),
      });

      setSchedules(result.data.schedules);
      setError(null);
    } catch (err) {
      console.error('Failed to load schedules:', err);
      setError('データの読み込みに失敗しました');
    }
  }, [facilityId, currentDate]);

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

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)}-${end.slice(0, 5)}`;
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      default:
        return '予定';
    }
  };

  const { start, end } = getWeekRange(currentDate);

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
        スケジュール
      </Typography>

      {/* Navigation */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <ButtonGroup variant="outlined" size="small">
              <Button onClick={handlePrevWeek}>
                <ChevronLeftIcon />
              </Button>
              <Button onClick={handleToday}>今日</Button>
              <Button onClick={handleNextWeek}>
                <ChevronRightIcon />
              </Button>
            </ButtonGroup>

            <Typography variant="h6">
              {start.getMonth() + 1}/{start.getDate()} - {end.getMonth() + 1}/{end.getDate()}
            </Typography>

            <Tooltip title="更新">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>日付</TableCell>
                <TableCell>時間</TableCell>
                <TableCell>利用者</TableCell>
                <TableCell>担当</TableCell>
                <TableCell>サービス</TableCell>
                <TableCell>ステータス</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">
                      この週のスケジュールはありません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id} hover>
                    <TableCell>{formatDate(schedule.scheduledDate)}</TableCell>
                    <TableCell>{formatTimeRange(schedule.startTime, schedule.endTime)}</TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{schedule.client.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={schedule.staff.name} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {schedule.serviceType && (
                        <Chip
                          label={schedule.serviceType.name}
                          size="small"
                          sx={{
                            bgcolor: schedule.serviceType.color || '#607D8B',
                            color: 'white',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(schedule.status)}
                        size="small"
                        color={getStatusColor(schedule.status)}
                        variant="outlined"
                      />
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
