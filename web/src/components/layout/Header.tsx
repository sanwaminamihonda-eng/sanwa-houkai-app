'use client';

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { DRAWER_WIDTH } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = '訪問介護記録管理' }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut();
  };

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
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box>
          <IconButton
            size="large"
            aria-label="アカウントメニュー"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              src={user?.photoURL || undefined}
            >
              {user?.displayName?.[0] || user?.email?.[0] || '?'}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled sx={{ opacity: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {user?.displayName || 'ユーザー'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
