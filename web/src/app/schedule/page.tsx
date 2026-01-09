'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/components/layout';

export default function SchedulePage() {
  return (
    <MainLayout title="スケジュール">
      <Box>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              スケジュール画面
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              訪問予定をカレンダー形式で表示します（FullCalendar実装予定）
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
