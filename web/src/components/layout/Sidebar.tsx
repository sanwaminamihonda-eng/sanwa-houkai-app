'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  EditNote as RecordIcon,
  History as HistoryIcon,
  CalendarMonth as ScheduleIcon,
  People as ClientsIcon,
  Person as StaffIcon,
  Description as ReportIcon,
  Assignment as CarePlanIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: '記録入力', icon: <RecordIcon />, href: '/records/new' },
  { text: '履歴一覧', icon: <HistoryIcon />, href: '/records' },
  { text: 'スケジュール', icon: <ScheduleIcon />, href: '/schedule' },
  { text: '利用者管理', icon: <ClientsIcon />, href: '/clients' },
  { text: '支援者管理', icon: <StaffIcon />, href: '/staff' },
  { text: '実施報告書', icon: <ReportIcon />, href: '/reports' },
  { text: '計画書', icon: <CarePlanIcon />, href: '/careplans' },
];

const settingsItems = [
  { text: '設定', icon: <SettingsIcon />, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          訪問介護記録
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href || pathname?.startsWith(item.href + '/')}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {settingsItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
