'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Toolbar,
  Alert,
  Button,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import DemoSidebar, { DRAWER_WIDTH } from './DemoSidebar';
import DemoHeader from './DemoHeader';
import { DemoProvider } from '@/contexts/DemoContext';
import { functions, httpsCallable } from '@/lib/firebase';

interface DemoLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DemoLayout({ children, title }: DemoLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleResetClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    if (!resetting) {
      setConfirmOpen(false);
    }
  };

  const handleReset = async () => {
    if (!functions) {
      setSnackbar({
        open: true,
        message: 'Firebase Functionsが初期化されていません',
        severity: 'error',
      });
      setConfirmOpen(false);
      return;
    }

    setResetting(true);
    try {
      const resetDemoData = httpsCallable<Record<string, never>, { success: boolean; message: string }>(
        functions,
        'resetDemoData'
      );
      const result = await resetDemoData({});

      if (result.data.success) {
        setSnackbar({
          open: true,
          message: 'デモデータをリセットしました',
          severity: 'success',
        });
        // ページをリロード
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to reset demo data:', err);
      setSnackbar({
        open: true,
        message: 'リセットに失敗しました',
        severity: 'error',
      });
    } finally {
      setResetting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <DemoProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <DemoSidebar open={mobileOpen} onClose={handleDrawerClose} />
        <DemoHeader title={title} onMenuClick={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
            bgcolor: 'background.default',
          }}
        >
          <Toolbar />
          <Alert
            severity="info"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={resetting ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                onClick={handleResetClick}
                disabled={resetting}
              >
                リセット
              </Button>
            }
          >
            これはデモ環境です。サンプルデータを表示しています。自由に操作できます。
          </Alert>
          {children}
        </Box>
      </Box>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
      >
        <DialogTitle>デモデータをリセット</DialogTitle>
        <DialogContent>
          <DialogContentText>
            デモデータを初期状態に戻します。作成したデータはすべて削除されます。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} disabled={resetting}>
            キャンセル
          </Button>
          <Button
            onClick={handleReset}
            color="warning"
            variant="contained"
            disabled={resetting}
            startIcon={resetting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {resetting ? 'リセット中...' : 'リセット'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DemoProvider>
  );
}
