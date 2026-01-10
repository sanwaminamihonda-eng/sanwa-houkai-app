'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useDemoContext } from '@/contexts/DemoContext';
import { dataConnect } from '@/lib/firebase';
import {
  demoListClients,
  demoListVisitRecordsByDateRange,
  demoListSchedulesByDateRange,
} from '@sanwa-houkai-app/dataconnect';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function StatCard({ title, value, icon, href, color }: StatCardProps) {
  return (
    <Card
      component={Link}
      href={href}
      sx={{
        textDecoration: 'none',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: color,
              color: 'white',
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DemoPage() {
  const { facilityId } = useDemoContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clients: 0,
    todaySchedules: 0,
    thisMonthRecords: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dc = dataConnect;
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const [clientsRes, schedulesRes, recordsRes] = await Promise.all([
          demoListClients(dc, { facilityId }),
          demoListSchedulesByDateRange(dc, {
            facilityId,
            startDate: today.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0],
          }),
          demoListVisitRecordsByDateRange(dc, {
            facilityId,
            startDate: startOfMonth.toISOString().split('T')[0],
            endDate: endOfMonth.toISOString().split('T')[0],
          }),
        ]);

        setStats({
          clients: clientsRes.data.clients.length,
          todaySchedules: schedulesRes.data.schedules.length,
          thisMonthRecords: recordsRes.data.visitRecords.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [facilityId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        デモダッシュボード
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="利用者数"
            value={stats.clients}
            icon={<PeopleIcon />}
            href="/demo/clients"
            color="#4CAF50"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="今日の予定"
            value={stats.todaySchedules}
            icon={<CalendarIcon />}
            href="/demo/schedule"
            color="#2196F3"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="今月の訪問記録"
            value={stats.thisMonthRecords}
            icon={<AssignmentIcon />}
            href="/demo/records"
            color="#FF9800"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="報告書"
            value="確認"
            icon={<DescriptionIcon />}
            href="/demo/reports"
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            クイックアクション
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/demo/records"
              variant="contained"
              startIcon={<AssignmentIcon />}
            >
              記録入力
            </Button>
            <Button
              component={Link}
              href="/demo/schedule"
              variant="outlined"
              startIcon={<CalendarIcon />}
            >
              スケジュール確認
            </Button>
            <Button
              component={Link}
              href="/demo/clients"
              variant="outlined"
              startIcon={<PeopleIcon />}
            >
              利用者一覧
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            このデモ環境では、サンプルデータを使って機能をお試しいただけます。
            データは自由に編集でき、リセットボタンで初期状態に戻すことができます。
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="text"
            sx={{ mt: 1 }}
          >
            本番環境にログイン
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
