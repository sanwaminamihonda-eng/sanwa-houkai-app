'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import { format, parse } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ScheduleForCalendar } from './types';
import { getServiceColor } from './utils';

export interface ScheduleDetailDialogProps {
  open: boolean;
  schedule: ScheduleForCalendar | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScheduleDetailDialog({
  open,
  schedule,
  onClose,
  onEdit,
  onDelete,
}: ScheduleDetailDialogProps) {
  if (!schedule) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        予定詳細
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">利用者</Typography>
            <Typography variant="body1">{schedule.client.name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">担当者</Typography>
            <Typography variant="body1">{schedule.staff.name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">日時</Typography>
            <Typography variant="body1">
              {format(parse(schedule.scheduledDate, 'yyyy-MM-dd', new Date()), 'yyyy年M月d日(E)', { locale: ja })}
              {' '}
              {schedule.startTime} - {schedule.endTime}
            </Typography>
          </Box>
          {schedule.serviceType && (
            <Box>
              <Typography variant="caption" color="text.secondary">サービス種類</Typography>
              <Box>
                <Chip
                  label={schedule.serviceType.name}
                  size="small"
                  sx={{
                    backgroundColor: getServiceColor(schedule.serviceType.category),
                    color: 'white',
                  }}
                />
              </Box>
            </Box>
          )}
          <Box>
            <Typography variant="caption" color="text.secondary">ステータス</Typography>
            <Box>
              <Chip
                label={schedule.status === 'scheduled' ? '予定' : schedule.status === 'completed' ? '完了' : 'キャンセル'}
                size="small"
                color={schedule.status === 'scheduled' ? 'primary' : schedule.status === 'completed' ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
          </Box>
          {schedule.recurrenceId && (
            <Box>
              <Typography variant="caption" color="text.secondary">繰り返し</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RepeatIcon fontSize="small" color="action" />
                <Typography variant="body2">繰り返し予定</Typography>
              </Box>
            </Box>
          )}
          {schedule.notes && (
            <Box>
              <Typography variant="caption" color="text.secondary">メモ</Typography>
              <Typography variant="body2">{schedule.notes}</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="error" startIcon={<DeleteIcon />}>
          削除
        </Button>
        <Button onClick={onEdit} startIcon={<EditIcon />}>
          編集
        </Button>
      </DialogActions>
    </Dialog>
  );
}
