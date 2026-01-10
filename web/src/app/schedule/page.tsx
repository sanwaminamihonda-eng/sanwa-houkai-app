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
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg, EventDropArg, EventContentArg } from '@fullcalendar/core';
import { format, parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { RRule, Options } from 'rrule';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { useScheduleRealtime } from '@/hooks/useScheduleRealtime';
import { dataConnect } from '@/lib/firebase';
import {
  listSchedulesByDateRange,
  ListSchedulesByDateRangeData,
  getSchedulesByRecurrenceId,
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
    isRecurring: boolean;
  };
}

// 繰り返しパターンの型定義
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
type RecurrenceEndType = 'count' | 'until';

// 繰り返し予定操作の選択肢
type RecurrenceEditScope = 'single' | 'thisAndFuture' | 'all';
type RecurrenceDeleteScope = 'single' | 'all';

// 曜日マッピング
const WEEKDAYS = [
  { key: 'MO', label: '月', rruleDay: RRule.MO },
  { key: 'TU', label: '火', rruleDay: RRule.TU },
  { key: 'WE', label: '水', rruleDay: RRule.WE },
  { key: 'TH', label: '木', rruleDay: RRule.TH },
  { key: 'FR', label: '金', rruleDay: RRule.FR },
  { key: 'SA', label: '土', rruleDay: RRule.SA },
  { key: 'SU', label: '日', rruleDay: RRule.SU },
] as const;

interface RecurrenceSettings {
  type: RecurrenceType;
  weekdays: string[];
  endType: RecurrenceEndType;
  count: number;
  until: Date | null;
}

interface ScheduleFormData {
  clientId: string;
  staffId: string;
  serviceTypeId: string;
  scheduledDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  notes: string;
  recurrence: RecurrenceSettings;
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

const initialRecurrence: RecurrenceSettings = {
  type: 'none',
  weekdays: [],
  endType: 'count',
  count: 10,
  until: null,
};

const initialFormData: ScheduleFormData = {
  clientId: '',
  staffId: '',
  serviceTypeId: '',
  scheduledDate: new Date(),
  startTime: null,
  endTime: null,
  notes: '',
  recurrence: { ...initialRecurrence },
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

  // 繰り返し予定操作ダイアログ
  const [recurrenceEditDialogOpen, setRecurrenceEditDialogOpen] = useState(false);
  const [recurrenceDeleteDialogOpen, setRecurrenceDeleteDialogOpen] = useState(false);
  const [recurrenceEditScope, setRecurrenceEditScope] = useState<RecurrenceEditScope>('single');
  const [recurrenceDeleteScope, setRecurrenceDeleteScope] = useState<RecurrenceDeleteScope>('single');
  const [processingRecurrence, setProcessingRecurrence] = useState(false);

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
      const isRecurring = !!schedule.recurrenceId;

      return {
        id: schedule.id,
        title: `${schedule.client.name}${schedule.serviceType ? ` (${schedule.serviceType.name})` : ''}`,
        start: `${dateStr}T${schedule.startTime}`,
        end: `${dateStr}T${schedule.endTime}`,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: { schedule, isRecurring },
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

  // イベントリサイズ（時間の伸縮）ハンドラ
  const handleEventResize = async (arg: EventResizeDoneArg) => {
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
      console.error('Failed to resize schedule:', err);
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

    // 繰り返し予定の場合は選択ダイアログを表示
    if (selectedSchedule.recurrenceId) {
      setRecurrenceEditScope('single');
      setRecurrenceEditDialogOpen(true);
      return;
    }

    openEditForm();
  };

  const openEditForm = () => {
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
      recurrence: { ...initialRecurrence },
    });
    setIsEditing(true);
    setDetailDialogOpen(false);
    setFormDialogOpen(true);
  };

  const handleConfirmRecurrenceEdit = async () => {
    if (!selectedSchedule) return;

    if (recurrenceEditScope === 'single') {
      // 単一予定のみ編集
      setRecurrenceEditDialogOpen(false);
      openEditForm();
    } else if (recurrenceEditScope === 'all') {
      // シリーズ全体を編集 - フォームを開いて保存時に一括更新
      setRecurrenceEditDialogOpen(false);
      openEditForm();
    } else if (recurrenceEditScope === 'thisAndFuture') {
      // この予定以降を編集
      setRecurrenceEditDialogOpen(false);
      openEditForm();
    }
  };

  // 繰り返しルールから日付リストを生成
  const generateRecurringDates = (startDate: Date, recurrence: RecurrenceSettings): Date[] => {
    if (recurrence.type === 'none') {
      return [startDate];
    }

    const options: Partial<Options> = {
      dtstart: startDate,
    };

    switch (recurrence.type) {
      case 'daily':
        options.freq = RRule.DAILY;
        break;
      case 'weekly':
        options.freq = RRule.WEEKLY;
        if (recurrence.weekdays.length > 0) {
          options.byweekday = recurrence.weekdays.map(day => {
            const weekday = WEEKDAYS.find(w => w.key === day);
            return weekday?.rruleDay || RRule.MO;
          });
        }
        break;
      case 'biweekly':
        options.freq = RRule.WEEKLY;
        options.interval = 2;
        if (recurrence.weekdays.length > 0) {
          options.byweekday = recurrence.weekdays.map(day => {
            const weekday = WEEKDAYS.find(w => w.key === day);
            return weekday?.rruleDay || RRule.MO;
          });
        }
        break;
      case 'monthly':
        options.freq = RRule.MONTHLY;
        break;
    }

    if (recurrence.endType === 'count') {
      options.count = recurrence.count;
    } else if (recurrence.until) {
      options.until = recurrence.until;
    }

    const rule = new RRule(options as Options);
    return rule.all();
  };

  // RRULEを文字列形式で生成
  const generateRRuleString = (recurrence: RecurrenceSettings): string | null => {
    if (recurrence.type === 'none') {
      return null;
    }

    let rule = '';
    switch (recurrence.type) {
      case 'daily':
        rule = 'FREQ=DAILY';
        break;
      case 'weekly':
        rule = 'FREQ=WEEKLY';
        if (recurrence.weekdays.length > 0) {
          rule += `;BYDAY=${recurrence.weekdays.join(',')}`;
        }
        break;
      case 'biweekly':
        rule = 'FREQ=WEEKLY;INTERVAL=2';
        if (recurrence.weekdays.length > 0) {
          rule += `;BYDAY=${recurrence.weekdays.join(',')}`;
        }
        break;
      case 'monthly':
        rule = 'FREQ=MONTHLY';
        break;
    }

    if (recurrence.endType === 'count') {
      rule += `;COUNT=${recurrence.count}`;
    } else if (recurrence.until) {
      rule += `;UNTIL=${format(recurrence.until, 'yyyyMMdd')}T235959Z`;
    }

    return rule;
  };

  const handleDeleteSchedule = () => {
    if (!selectedSchedule) return;

    // 繰り返し予定の場合は選択ダイアログを表示
    if (selectedSchedule.recurrenceId) {
      setRecurrenceDeleteScope('single');
      setRecurrenceDeleteDialogOpen(true);
      return;
    }

    // 単一予定の場合は確認後に削除
    if (!confirm('このスケジュールを削除しますか？')) return;
    performDelete([selectedSchedule.id]);
  };

  const handleConfirmRecurrenceDelete = async () => {
    if (!selectedSchedule || !selectedSchedule.recurrenceId) return;

    setProcessingRecurrence(true);

    try {
      if (recurrenceDeleteScope === 'single') {
        // 単一予定のみ削除
        await performDelete([selectedSchedule.id]);
      } else {
        // シリーズ全体を削除
        const result = await getSchedulesByRecurrenceId(dataConnect, {
          recurrenceId: selectedSchedule.recurrenceId,
        });
        const scheduleIds = result.data.schedules.map(s => s.id);
        await performDelete(scheduleIds);
      }
    } finally {
      setProcessingRecurrence(false);
      setRecurrenceDeleteDialogOpen(false);
    }
  };

  const performDelete = async (scheduleIds: string[]) => {
    try {
      // 複数の予定を削除
      await Promise.all(
        scheduleIds.map(id => deleteSchedule(dataConnect, { id }))
      );

      const message = scheduleIds.length > 1
        ? `${scheduleIds.length}件の予定を削除しました`
        : 'スケジュールを削除しました';

      setSnackbar({
        open: true,
        message,
        severity: 'success',
      });

      // Notify other users about the deletion
      await notifyScheduleUpdate(scheduleIds[0], 'delete');

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

    // 週次/隔週で曜日未選択の場合はエラー
    if ((formData.recurrence.type === 'weekly' || formData.recurrence.type === 'biweekly') && formData.recurrence.weekdays.length === 0) {
      setSnackbar({
        open: true,
        message: '繰り返しの曜日を選択してください',
        severity: 'error',
      });
      return;
    }

    setSaving(true);

    try {
      const startTime = format(formData.startTime, 'HH:mm');
      const endTime = format(formData.endTime, 'HH:mm');
      const notes = formData.notes || null;
      const recurrenceRule = generateRRuleString(formData.recurrence);

      if (isEditing && selectedSchedule) {
        // 編集範囲に応じて更新
        if (recurrenceEditScope === 'all' && selectedSchedule.recurrenceId) {
          // シリーズ全体を更新
          const result = await getSchedulesByRecurrenceId(dataConnect, {
            recurrenceId: selectedSchedule.recurrenceId,
          });

          await Promise.all(
            result.data.schedules.map(schedule =>
              updateSchedule(dataConnect, {
                id: schedule.id,
                clientId: formData.clientId,
                staffId: formData.staffId,
                serviceTypeId: formData.serviceTypeId || null,
                startTime,
                endTime,
                notes,
              })
            )
          );

          setSnackbar({
            open: true,
            message: `${result.data.schedules.length}件の予定を更新しました`,
            severity: 'success',
          });
        } else if (recurrenceEditScope === 'thisAndFuture' && selectedSchedule.recurrenceId) {
          // この予定以降を更新
          const result = await getSchedulesByRecurrenceId(dataConnect, {
            recurrenceId: selectedSchedule.recurrenceId,
          });

          const targetDate = selectedSchedule.scheduledDate;
          const futureSchedules = result.data.schedules.filter(
            s => s.scheduledDate >= targetDate
          );

          await Promise.all(
            futureSchedules.map(schedule =>
              updateSchedule(dataConnect, {
                id: schedule.id,
                clientId: formData.clientId,
                staffId: formData.staffId,
                serviceTypeId: formData.serviceTypeId || null,
                startTime,
                endTime,
                notes,
              })
            )
          );

          setSnackbar({
            open: true,
            message: `${futureSchedules.length}件の予定を更新しました`,
            severity: 'success',
          });
        } else {
          // 単一予定のみ更新
          await updateSchedule(dataConnect, {
            id: selectedSchedule.id,
            clientId: formData.clientId,
            staffId: formData.staffId,
            serviceTypeId: formData.serviceTypeId || null,
            scheduledDate: format(formData.scheduledDate, 'yyyy-MM-dd'),
            startTime,
            endTime,
            notes,
          });

          setSnackbar({
            open: true,
            message: 'スケジュールを更新しました',
            severity: 'success',
          });
        }

        // 編集範囲をリセット
        setRecurrenceEditScope('single');
        await notifyScheduleUpdate(selectedSchedule.id, 'update');
      } else {
        // 新規作成時は繰り返し予定を一括作成
        const dates = generateRecurringDates(formData.scheduledDate, formData.recurrence);

        // 親IDを生成（繰り返しの場合）
        const recurrenceId = recurrenceRule ? crypto.randomUUID() : null;

        // 最初の予定を作成して親IDを取得
        const firstResult = await createSchedule(dataConnect, {
          facilityId,
          clientId: formData.clientId,
          staffId: formData.staffId,
          serviceTypeId: formData.serviceTypeId || null,
          scheduledDate: format(dates[0], 'yyyy-MM-dd'),
          startTime,
          endTime,
          notes,
          recurrenceRule,
          recurrenceId,
        });

        // 残りの予定を作成
        if (dates.length > 1) {
          await Promise.all(
            dates.slice(1).map(date =>
              createSchedule(dataConnect, {
                facilityId,
                clientId: formData.clientId,
                staffId: formData.staffId,
                serviceTypeId: formData.serviceTypeId || null,
                scheduledDate: format(date, 'yyyy-MM-dd'),
                startTime,
                endTime,
                notes,
                recurrenceRule,
                recurrenceId,
              })
            )
          );
        }

        const message = dates.length > 1
          ? `${dates.length}件の予定を作成しました`
          : 'スケジュールを作成しました';

        setSnackbar({
          open: true,
          message,
          severity: 'success',
        });

        await notifyScheduleUpdate(firstResult.data.schedule_insert.id, 'create');
      }

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
      <MainLayout title="スケジュール" showBackButton backHref="/">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!facilityId) {
    return (
      <MainLayout title="スケジュール" showBackButton backHref="/">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="スケジュール" showBackButton backHref="/">
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="スケジュール" showBackButton backHref="/">
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
        <Card
          sx={{
            // リサイズハンドルのスタイリング
            '& .fc-event-resizer': {
              opacity: 0,
              transition: 'opacity 0.2s ease',
            },
            '& .fc-event:hover .fc-event-resizer': {
              opacity: 1,
            },
            '& .fc-event-resizer-start': {
              cursor: 'n-resize',
            },
            '& .fc-event-resizer-end': {
              cursor: 's-resize',
            },
            // ドラッグ中の視覚フィードバック
            '& .fc-event.fc-dragging': {
              opacity: 0.7,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            // リサイズ中の視覚フィードバック
            '& .fc-event.fc-resizing': {
              opacity: 0.8,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            },
            // 現在時刻インジケーターの強調（Googleカレンダー風赤線）
            '& .fc-timegrid-now-indicator-line': {
              borderColor: '#EA4335',
              borderWidth: '2px',
            },
            '& .fc-timegrid-now-indicator-arrow': {
              borderColor: '#EA4335',
            },
          }}
        >
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
              eventResize={handleEventResize}
              eventResizableFromStart={true}
              datesSet={handleDatesSet}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              snapDuration="00:15:00"
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
              eventContent={(arg: EventContentArg) => {
                const isRecurring = arg.event.extendedProps.isRecurring;
                // イベントの長さを計算（分単位）
                const duration = arg.event.end && arg.event.start
                  ? (arg.event.end.getTime() - arg.event.start.getTime()) / (1000 * 60)
                  : 60;
                const isShort = duration < 30;

                return (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.5,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    p: 0.25,
                  }}>
                    {isRecurring && (
                      <RepeatIcon sx={{ fontSize: isShort ? 12 : 14, flexShrink: 0, mt: '1px' }} />
                    )}
                    <Box sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      lineHeight: 1.1,
                    }}>
                      {/* 短いイベントでは時間を省略してタイトルのみ表示 */}
                      {!isShort && (
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{ fontWeight: 500, fontSize: '0.7rem', lineHeight: 1.1 }}
                        >
                          {arg.timeText}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{
                          fontSize: isShort ? '0.65rem' : '0.7rem',
                          lineHeight: 1.1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {arg.event.title}
                      </Typography>
                    </Box>
                  </Box>
                );
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
              {selectedSchedule.recurrenceId && (
                <Box>
                  <Typography variant="caption" color="text.secondary">繰り返し</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <RepeatIcon fontSize="small" color="action" />
                    <Typography variant="body2">繰り返し予定</Typography>
                  </Box>
                </Box>
              )}
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

            {/* 繰り返し設定（新規作成時のみ） */}
            {!isEditing && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <RepeatIcon color="action" />
                  <Typography variant="subtitle1">繰り返し設定</Typography>
                </Box>

                <FormControl fullWidth>
                  <InputLabel>繰り返しパターン</InputLabel>
                  <Select
                    value={formData.recurrence.type}
                    label="繰り返しパターン"
                    onChange={(e) => setFormData({
                      ...formData,
                      recurrence: {
                        ...formData.recurrence,
                        type: e.target.value as RecurrenceType,
                        weekdays: e.target.value === 'none' ? [] : formData.recurrence.weekdays,
                      },
                    })}
                  >
                    <MenuItem value="none">繰り返しなし</MenuItem>
                    <MenuItem value="daily">毎日</MenuItem>
                    <MenuItem value="weekly">毎週</MenuItem>
                    <MenuItem value="biweekly">隔週</MenuItem>
                    <MenuItem value="monthly">毎月</MenuItem>
                  </Select>
                </FormControl>

                {/* 曜日選択（週次/隔週の場合） */}
                {(formData.recurrence.type === 'weekly' || formData.recurrence.type === 'biweekly') && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      曜日を選択（複数可）
                    </Typography>
                    <FormGroup row>
                      {WEEKDAYS.map((day) => (
                        <FormControlLabel
                          key={day.key}
                          control={
                            <Checkbox
                              checked={formData.recurrence.weekdays.includes(day.key)}
                              onChange={(e) => {
                                const newWeekdays = e.target.checked
                                  ? [...formData.recurrence.weekdays, day.key]
                                  : formData.recurrence.weekdays.filter(d => d !== day.key);
                                setFormData({
                                  ...formData,
                                  recurrence: {
                                    ...formData.recurrence,
                                    weekdays: newWeekdays,
                                  },
                                });
                              }}
                              size="small"
                            />
                          }
                          label={day.label}
                          sx={{ mr: 1 }}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                )}

                {/* 終了条件（繰り返しありの場合） */}
                {formData.recurrence.type !== 'none' && (
                  <>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">終了条件</FormLabel>
                      <RadioGroup
                        row
                        value={formData.recurrence.endType}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurrence: {
                            ...formData.recurrence,
                            endType: e.target.value as RecurrenceEndType,
                          },
                        })}
                      >
                        <FormControlLabel value="count" control={<Radio size="small" />} label="回数指定" />
                        <FormControlLabel value="until" control={<Radio size="small" />} label="終了日指定" />
                      </RadioGroup>
                    </FormControl>

                    {formData.recurrence.endType === 'count' ? (
                      <TextField
                        label="繰り返し回数"
                        type="number"
                        value={formData.recurrence.count}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurrence: {
                            ...formData.recurrence,
                            count: Math.max(1, Math.min(52, parseInt(e.target.value) || 1)),
                          },
                        })}
                        inputProps={{ min: 1, max: 52 }}
                        helperText="1〜52回まで"
                        fullWidth
                      />
                    ) : (
                      <DatePicker
                        label="終了日"
                        value={formData.recurrence.until}
                        onChange={(date) => setFormData({
                          ...formData,
                          recurrence: {
                            ...formData.recurrence,
                            until: date,
                          },
                        })}
                        minDate={formData.scheduledDate || undefined}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSaveSchedule} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : isEditing ? '更新' : '作成'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recurrence Edit Scope Dialog */}
      <Dialog
        open={recurrenceEditDialogOpen}
        onClose={() => setRecurrenceEditDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>繰り返し予定の編集</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            この予定は繰り返し予定です。編集範囲を選択してください。
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={recurrenceEditScope}
              onChange={(e) => setRecurrenceEditScope(e.target.value as RecurrenceEditScope)}
            >
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="この予定のみ"
              />
              <FormControlLabel
                value="thisAndFuture"
                control={<Radio />}
                label="この予定以降すべて"
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="シリーズ全体"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecurrenceEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleConfirmRecurrenceEdit} variant="contained">
            続行
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recurrence Delete Scope Dialog */}
      <Dialog
        open={recurrenceDeleteDialogOpen}
        onClose={() => !processingRecurrence && setRecurrenceDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>繰り返し予定の削除</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            この予定は繰り返し予定です。削除範囲を選択してください。
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={recurrenceDeleteScope}
              onChange={(e) => setRecurrenceDeleteScope(e.target.value as RecurrenceDeleteScope)}
            >
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="この予定のみ"
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="シリーズ全体"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRecurrenceDeleteDialogOpen(false)}
            disabled={processingRecurrence}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmRecurrenceDelete}
            variant="contained"
            color="error"
            disabled={processingRecurrence}
          >
            {processingRecurrence ? <CircularProgress size={24} /> : '削除'}
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
