'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  IconButton,
  Snackbar,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { format, parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { useScheduleRealtime } from '@/hooks/useScheduleRealtime';
import { dataConnect } from '@/lib/firebase';
import {
  listSchedulesByDateRange,
  ListSchedulesByDateRangeData,
  listClients,
  ListClientsData,
  listStaff,
  ListStaffData,
  listServiceTypes,
  ListServiceTypesData,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '@sanwa-houkai-app/dataconnect';

type Schedule = ListSchedulesByDateRangeData['schedules'][0];
type Client = ListClientsData['clients'][0];
type StaffMember = ListStaffData['staffs'][0];
type ServiceType = ListServiceTypesData['serviceTypes'][0];

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    schedule: Schedule;
  };
}

interface ScheduleFormData {
  clientId: string;
  staffId: string;
  serviceTypeId: string;
  scheduledDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  notes: string;
}

const SERVICE_COLORS: Record<string, string> = {
  '身体介護': '#2196F3',
  '生活援助': '#4CAF50',
  '自立支援': '#FF9800',
  '複合': '#9C27B0',
  'default': '#757575',
};

const getServiceColor = (category?: string | null): string => {
  if (!category) return SERVICE_COLORS.default;
  return SERVICE_COLORS[category] || SERVICE_COLORS.default;
};

const initialFormData: ScheduleFormData = {
  clientId: '',
  staffId: '',
  serviceTypeId: '',
  scheduledDate: new Date(),
  startTime: null,
  endTime: null,
  notes: '',
};

export default function SchedulePage() {
  const { facilityId, staff, loading: staffLoading } = useStaff();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');

  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Calculate date range based on current view
  const getDateRange = useCallback((date: Date, view: string) => {
    if (view === 'dayGridMonth') {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      // Include days from adjacent months that appear in the calendar
      return {
        start: addDays(startOfWeek(start, { weekStartsOn: 1 }), -7),
        end: addDays(endOfWeek(end, { weekStartsOn: 1 }), 7),
      };
    } else if (view === 'timeGridWeek') {
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    } else {
      return { start: date, end: date };
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!facilityId) return;

    const { start, end } = getDateRange(currentDate, currentView);

    try {
      const result = await listSchedulesByDateRange(dataConnect, {
        facilityId,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      });
      setSchedules(result.data.schedules);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      setError('スケジュールの読み込みに失敗しました');
    }
  }, [facilityId, currentDate, currentView, getDateRange]);

  const fetchMasterData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const [clientsResult, staffResult, serviceTypesResult] = await Promise.all([
        listClients(dataConnect, { facilityId }),
        listStaff(dataConnect, { facilityId }),
        listServiceTypes(dataConnect, { facilityId }),
      ]);

      setClients(clientsResult.data.clients);
      setStaffList(staffResult.data.staffs);
      setServiceTypes(serviceTypesResult.data.serviceTypes);
    } catch (err) {
      console.error('Failed to fetch master data:', err);
    }
  }, [facilityId]);

  // Realtime sync
  const { notifyScheduleUpdate } = useScheduleRealtime({
    facilityId,
    staffId: staff?.id || null,
    onUpdate: fetchSchedules,
  });

  useEffect(() => {
    if (!facilityId) return;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSchedules(), fetchMasterData()]);
      setLoading(false);
    };

    loadData();
  }, [facilityId, fetchSchedules, fetchMasterData]);

  // Convert schedules to FullCalendar events
  const events: CalendarEvent[] = useMemo(() => {
    return schedules.map((schedule) => {
      const color = getServiceColor(schedule.serviceType?.category);
      const dateStr = schedule.scheduledDate;

      return {
        id: schedule.id,
        title: `${schedule.client.name}${schedule.serviceType ? ` (${schedule.serviceType.name})` : ''}`,
        start: `${dateStr}T${schedule.startTime}`,
        end: `${dateStr}T${schedule.endTime}`,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: { schedule },
      };
    });
  }, [schedules]);

  // Event handlers
  const handleEventClick = (arg: EventClickArg) => {
    const schedule = arg.event.extendedProps.schedule as Schedule;
    setSelectedSchedule(schedule);
    setDetailDialogOpen(true);
  };

  const handleDateSelect = (arg: DateSelectArg) => {
    const startDate = arg.start;
    const endDate = arg.end;

    setFormData({
      ...initialFormData,
      staffId: staff?.id || '',
      scheduledDate: startDate,
      startTime: startDate,
      endTime: endDate,
    });
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const handleEventDrop = async (arg: EventDropArg) => {
    const schedule = arg.event.extendedProps.schedule as Schedule;
    const newStart = arg.event.start;
    const newEnd = arg.event.end;

    if (!newStart || !newEnd) {
      arg.revert();
      return;
    }

    try {
      await updateSchedule(dataConnect, {
        id: schedule.id,
        scheduledDate: format(newStart, 'yyyy-MM-dd'),
        startTime: format(newStart, 'HH:mm'),
        endTime: format(newEnd, 'HH:mm'),
      });

      setSnackbar({
        open: true,
        message: 'スケジュールを更新しました',
        severity: 'success',
      });

      // Notify other users about the update
      await notifyScheduleUpdate(schedule.id, 'update');
      await fetchSchedules();
    } catch (err) {
      console.error('Failed to update schedule:', err);
      arg.revert();
      setSnackbar({
        open: true,
        message: '更新に失敗しました',
        severity: 'error',
      });
    }
  };

  const handleDatesSet = (arg: { start: Date; end: Date; view: { type: string } }) => {
    const midDate = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
    setCurrentDate(midDate);
    setCurrentView(arg.view.type as typeof currentView);
  };

  const handleOpenNewDialog = () => {
    setFormData({
      ...initialFormData,
      staffId: staff?.id || '',
      scheduledDate: new Date(),
    });
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = () => {
    if (!selectedSchedule) return;

    const dateObj = parse(selectedSchedule.scheduledDate, 'yyyy-MM-dd', new Date());
    const startTimeObj = parse(selectedSchedule.startTime, 'HH:mm', new Date());
    const endTimeObj = parse(selectedSchedule.endTime, 'HH:mm', new Date());

    setFormData({
      clientId: selectedSchedule.client.id,
      staffId: selectedSchedule.staff.id,
      serviceTypeId: selectedSchedule.serviceType?.id || '',
      scheduledDate: dateObj,
      startTime: startTimeObj,
      endTime: endTimeObj,
      notes: selectedSchedule.notes || '',
    });
    setIsEditing(true);
    setDetailDialogOpen(false);
    setFormDialogOpen(true);
  };

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) return;

    if (!confirm('このスケジュールを削除しますか？')) return;

    const scheduleId = selectedSchedule.id;

    try {
      await deleteSchedule(dataConnect, { id: scheduleId });

      setSnackbar({
        open: true,
        message: 'スケジュールを削除しました',
        severity: 'success',
      });

      // Notify other users about the deletion
      await notifyScheduleUpdate(scheduleId, 'delete');

      setDetailDialogOpen(false);
      setSelectedSchedule(null);
      await fetchSchedules();
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      setSnackbar({
        open: true,
        message: '削除に失敗しました',
        severity: 'error',
      });
    }
  };

  const handleSaveSchedule = async () => {
    if (!facilityId || !formData.clientId || !formData.staffId || !formData.scheduledDate || !formData.startTime || !formData.endTime) {
      setSnackbar({
        open: true,
        message: '必須項目を入力してください',
        severity: 'error',
      });
      return;
    }

    setSaving(true);

    try {
      const scheduleData = {
        scheduledDate: format(formData.scheduledDate, 'yyyy-MM-dd'),
        startTime: format(formData.startTime, 'HH:mm'),
        endTime: format(formData.endTime, 'HH:mm'),
        notes: formData.notes || null,
      };

      let scheduleId: string;

      if (isEditing && selectedSchedule) {
        await updateSchedule(dataConnect, {
          id: selectedSchedule.id,
          clientId: formData.clientId,
          staffId: formData.staffId,
          serviceTypeId: formData.serviceTypeId || null,
          ...scheduleData,
        });
        scheduleId = selectedSchedule.id;
      } else {
        const result = await createSchedule(dataConnect, {
          facilityId,
          clientId: formData.clientId,
          staffId: formData.staffId,
          serviceTypeId: formData.serviceTypeId || null,
          ...scheduleData,
        });
        scheduleId = result.data.schedule_insert.id;
      }

      setSnackbar({
        open: true,
        message: isEditing ? 'スケジュールを更新しました' : 'スケジュールを作成しました',
        severity: 'success',
      });

      // Notify other users about the change
      await notifyScheduleUpdate(scheduleId, isEditing ? 'update' : 'create');

      setFormDialogOpen(false);
      setSelectedSchedule(null);
      await fetchSchedules();
    } catch (err) {
      console.error('Failed to save schedule:', err);
      setSnackbar({
        open: true,
        message: '保存に失敗しました',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (staffLoading || loading) {
    return (
      <MainLayout title="スケジュール">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="スケジュール">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="スケジュール">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="スケジュール">
      <Box>
        {/* Header */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" gap={1} flexWrap="wrap">
              {Object.entries(SERVICE_COLORS)
                .filter(([key]) => key !== 'default')
                .map(([category, color]) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    sx={{ backgroundColor: color, color: 'white' }}
                  />
                ))}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNewDialog}
            >
              新規予定
            </Button>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              locale="ja"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              buttonText={{
                today: '今日',
                month: '月',
                week: '週',
                day: '日',
              }}
              events={events}
              selectable={true}
              selectMirror={true}
              editable={true}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventDrop={handleEventDrop}
              datesSet={handleDatesSet}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              allDaySlot={false}
              weekends={true}
              nowIndicator={true}
              height="auto"
              aspectRatio={1.8}
              firstDay={1}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
            />
          </CardContent>
        </Card>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          予定詳細
          <IconButton
            onClick={() => setDetailDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSchedule && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">利用者</Typography>
                <Typography variant="body1">{selectedSchedule.client.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">担当者</Typography>
                <Typography variant="body1">{selectedSchedule.staff.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">日時</Typography>
                <Typography variant="body1">
                  {format(parse(selectedSchedule.scheduledDate, 'yyyy-MM-dd', new Date()), 'yyyy年M月d日(E)', { locale: ja })}
                  {' '}
                  {selectedSchedule.startTime} - {selectedSchedule.endTime}
                </Typography>
              </Box>
              {selectedSchedule.serviceType && (
                <Box>
                  <Typography variant="caption" color="text.secondary">サービス種類</Typography>
                  <Box>
                    <Chip
                      label={selectedSchedule.serviceType.name}
                      size="small"
                      sx={{
                        backgroundColor: getServiceColor(selectedSchedule.serviceType.category),
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
                    label={selectedSchedule.status === 'scheduled' ? '予定' : selectedSchedule.status === 'completed' ? '完了' : 'キャンセル'}
                    size="small"
                    color={selectedSchedule.status === 'scheduled' ? 'primary' : selectedSchedule.status === 'completed' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Box>
              {selectedSchedule.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">メモ</Typography>
                  <Typography variant="body2">{selectedSchedule.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSchedule} color="error" startIcon={<DeleteIcon />}>
            削除
          </Button>
          <Button onClick={handleOpenEditDialog} startIcon={<EditIcon />}>
            編集
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? '予定を編集' : '新規予定'}
          <IconButton
            onClick={() => setFormDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>利用者</InputLabel>
              <Select
                value={formData.clientId}
                label="利用者"
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>担当者</InputLabel>
              <Select
                value={formData.staffId}
                label="担当者"
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              >
                {staffList.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>サービス種類</InputLabel>
              <Select
                value={formData.serviceTypeId}
                label="サービス種類"
                onChange={(e) => setFormData({ ...formData, serviceTypeId: e.target.value })}
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {serviceTypes.map((st) => (
                  <MenuItem key={st.id} value={st.id}>
                    {st.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label="予定日"
              value={formData.scheduledDate}
              onChange={(date) => setFormData({ ...formData, scheduledDate: date })}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TimePicker
                label="開始時間"
                value={formData.startTime}
                onChange={(time) => setFormData({ ...formData, startTime: time })}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                ampm={false}
              />
              <TimePicker
                label="終了時間"
                value={formData.endTime}
                onChange={(time) => setFormData({ ...formData, endTime: time })}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                ampm={false}
              />
            </Box>

            <TextField
              label="メモ"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSaveSchedule} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : isEditing ? '更新' : '作成'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
