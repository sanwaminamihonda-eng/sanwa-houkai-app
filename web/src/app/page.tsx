'use client';

import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  EditNote as RecordIcon,
  CalendarMonth as ScheduleIcon,
  People as ClientsIcon,
  TrendingUp as StatsIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';

const quickActions = [
  {
    title: '新規記録',
    description: '訪問介護記録を入力',
    icon: <RecordIcon sx={{ fontSize: 40 }} />,
    href: '/records/new',
    color: '#2196F3',
  },
  {
    title: 'スケジュール',
    description: '本日の予定を確認',
    icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
    href: '/schedule',
    color: '#4CAF50',
  },
  {
    title: '利用者一覧',
    description: '利用者情報を管理',
    icon: <ClientsIcon sx={{ fontSize: 40 }} />,
    href: '/clients',
    color: '#FF9800',
  },
];

export default function Home() {
  return (
    <MainLayout title="ダッシュボード">
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          クイックアクション
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action) => (
            <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 4 } }}>
                  <Box sx={{ color: action.color, mb: { xs: 1, sm: 2 } }}>{action.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    {action.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={action.href}
                    variant="contained"
                    sx={{ bgcolor: action.color }}
                  >
                    開く
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            統計サマリー
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <StatsIcon sx={{ color: 'primary.main', mr: 0.5, fontSize: { xs: 18, sm: 24 } }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      本日の訪問
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    --
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <StatsIcon sx={{ color: 'success.main', mr: 0.5, fontSize: { xs: 18, sm: 24 } }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      今週の記録
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    --
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <ClientsIcon sx={{ color: 'warning.main', mr: 0.5, fontSize: { xs: 18, sm: 24 } }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      利用者数
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    --
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card>
                <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <RecordIcon sx={{ color: 'info.main', mr: 0.5, fontSize: { xs: 18, sm: 24 } }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      今月の記録
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                    --
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Demo Link */}
        <Card sx={{ mt: 5, bgcolor: 'grey.50', border: '1px dashed', borderColor: 'grey.300' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <PlayArrowIcon sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h6">
                デモ環境をお試しください
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              サンプルデータで機能をお試しいただけます（ログイン不要）
            </Typography>
            <Button
              component={Link}
              href="/demo"
              variant="outlined"
              color="secondary"
              startIcon={<PlayArrowIcon />}
            >
              デモを見る
            </Button>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
