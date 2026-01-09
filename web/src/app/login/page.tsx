'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { user, loading, error, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
          <Typography
            variant="h4"
            sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}
          >
            訪問介護記録管理
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            管理画面にログイン
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            fullWidth
            size="large"
            sx={{ py: 1.5 }}
          >
            Googleでログイン
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
