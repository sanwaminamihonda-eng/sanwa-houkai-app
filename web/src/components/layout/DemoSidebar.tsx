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
  Chip,
} from '@mui/material';
import {
  EditNote as RecordIcon,
  History as HistoryIcon,
  CalendarMonth as ScheduleIcon,
  People as ClientsIcon,
  Description as ReportIcon,
  Assignment as CarePlanIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: '記録入力', icon: <RecordIcon />, href: '/demo/records/new' },
  { text: '履歴一覧', icon: <HistoryIcon />, href: '/demo/records' },
  { text: 'スケジュール', icon: <ScheduleIcon />, href: '/demo/schedule' },
  { text: '利用者管理', icon: <ClientsIcon />, href: '/demo/clients' },
  { text: '実施報告書', icon: <ReportIcon />, href: '/demo/reports' },
  { text: '計画書', icon: <CarePlanIcon />, href: '/demo/careplans' },
];

const bottomItems = [
  { text: '本番サイトへ', icon: <HomeIcon />, href: '/' },
];

export default function DemoSidebar() {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            訪問介護記録
          </Typography>
          <Chip label="DEMO" size="small" color="warning" sx={{ fontWeight: 600 }} />
        </Box>
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
          {bottomItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
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
