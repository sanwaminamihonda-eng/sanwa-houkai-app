'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/components/layout';

export default function RecordsPage() {
  return (
    <MainLayout title="履歴一覧">
      <Box>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              履歴一覧画面
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              訪問介護記録の一覧を表示します（実装予定）
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
