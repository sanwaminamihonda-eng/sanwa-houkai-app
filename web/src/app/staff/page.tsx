'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { MainLayout } from '@/components/layout';

export default function StaffPage() {
  return (
    <MainLayout title="支援者管理">
      <Box>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              支援者一覧画面
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              支援者（ヘルパー）情報の管理を行います（実装予定）
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
