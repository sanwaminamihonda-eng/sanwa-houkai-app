'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/components/layout';

export default function NewRecordPage() {
  return (
    <MainLayout title="新規記録入力">
      <Box>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              記録入力画面
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              訪問介護記録を入力します（実装予定）
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
