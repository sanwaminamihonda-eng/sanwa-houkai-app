'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/components/layout';

export default function ClientsPage() {
  return (
    <MainLayout title="利用者管理">
      <Box>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              利用者一覧画面
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              利用者情報の一覧と管理を行います（実装予定）
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
