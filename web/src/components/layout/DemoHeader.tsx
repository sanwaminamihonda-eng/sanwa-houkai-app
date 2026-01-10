'use client';

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { DRAWER_WIDTH } from './DemoSidebar';

interface DemoHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function DemoHeader({ title = '訪問介護記録管理', onMenuClick }: DemoHeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="メニューを開く"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            デモユーザー
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
