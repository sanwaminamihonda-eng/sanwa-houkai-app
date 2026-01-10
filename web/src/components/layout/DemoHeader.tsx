'use client';

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { DRAWER_WIDTH } from './DemoSidebar';

interface DemoHeaderProps {
  title?: string;
}

export default function DemoHeader({ title = '訪問介護記録管理' }: DemoHeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
          <Chip label="DEMO" size="small" color="warning" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}
          >
            D
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            デモユーザー
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
