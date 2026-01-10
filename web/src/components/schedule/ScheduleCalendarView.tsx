'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Repeat as RepeatIcon } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg, EventDropArg, EventContentArg } from '@fullcalendar/core';
import { format, parse } from 'date-fns';

import {
  ScheduleForCalendar,
  ClientOption,
  StaffOption,
  ServiceTypeOption,
  ScheduleApiHandlers,
  CalendarEvent,
  ScheduleFormData,
  RecurrenceEditScope,
  RecurrenceDeleteScope,
  initialFormData,
  initialRecurrence,
} from './types';
import { getServiceColor, SERVICE_COLORS, generateRecurringDates, generateRRuleString } from './utils';
import { ScheduleDetailDialog } from './ScheduleDetailDialog';
import { ScheduleFormDialog } from './ScheduleFormDialog';
import { RecurrenceEditDialog } from './RecurrenceEditDialog';
import { RecurrenceDeleteDialog } from './RecurrenceDeleteDialog';

export interface ScheduleCalendarViewProps {
  // Data
  schedules: ScheduleForCalendar[];
  clients: ClientOption[];
  staffList: StaffOption[];
  serviceTypes: ServiceTypeOption[];

  // State
  loading: boolean;
  error: string | null;

  // Context
  currentStaffId: string;
  facilityId: string;

  // API handlers (dependency injection)
  apiHandlers: ScheduleApiHandlers;

  // Callbacks
  onRefetch: () => Promise<void>;
  onDateRangeChange: (start: Date, end: Date, view: string) => void;
}

export function ScheduleCalendarView({
  schedules,
  clients,
  staffList,
  serviceTypes,
  loading,
  error,
  currentStaffId,
  facilityId,
  apiHandlers,
  onRefetch,
  onDateRangeChange,
}: ScheduleCalendarViewProps) {
  // Dialog states
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleForCalendar | null>(null);
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Recurrence dialog states
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
  const handleEventClick = useCallback((arg: EventClickArg) => {
    const schedule = arg.event.extendedProps.schedule as ScheduleForCalendar;
    setSelectedSchedule(schedule);
    setDetailDialogOpen(true);
  }, []);

  const handleDateSelect = useCallback((arg: DateSelectArg) => {
    const startDate = arg.start;
    const endDate = arg.end;

    setFormData({
      ...initialFormData,
      staffId: currentStaffId,
      scheduledDate: startDate,
      startTime: startDate,
      endTime: endDate,
    });
    setIsEditing(false);
    setFormDialogOpen(true);
  }, [currentStaffId]);

  const handleEventDrop = useCallback(async (arg: EventDropArg) => {
    const schedule = arg.event.extendedProps.schedule as ScheduleForCalendar;
    const newStart = arg.event.start;
    const newEnd = arg.event.end;

    if (!newStart || !newEnd) {
      arg.revert();
      return;
    }

    try {
      await apiHandlers.updateSchedule(schedule.id, {
        scheduledDate: format(newStart, 'yyyy-MM-dd'),
        startTime: format(newStart, 'HH:mm'),
        endTime: format(newEnd, 'HH:mm'),
      });

      setSnackbar({
        open: true,
        message: 'スケジュールを更新しました',
        severity: 'success',
      });

      await apiHandlers.notifyUpdate(schedule.id, 'update');
      await onRefetch();
    } catch (err) {
      console.error('Failed to update schedule:', err);
      arg.revert();
      setSnackbar({
        open: true,
        message: '更新に失敗しました',
        severity: 'error',
      });
    }
  }, [apiHandlers, onRefetch]);

  const handleEventResize = useCallback(async (arg: EventResizeDoneArg) => {
    const schedule = arg.event.extendedProps.schedule as ScheduleForCalendar;
    const newStart = arg.event.start;
    const newEnd = arg.event.end;

    if (!newStart || !newEnd) {
      arg.revert();
      return;
    }

    try {
      await apiHandlers.updateSchedule(schedule.id, {
        scheduledDate: format(newStart, 'yyyy-MM-dd'),
        startTime: format(newStart, 'HH:mm'),
        endTime: format(newEnd, 'HH:mm'),
      });

      setSnackbar({
        open: true,
        message: 'スケジュールを更新しました',
        severity: 'success',
      });

      await apiHandlers.notifyUpdate(schedule.id, 'update');
      await onRefetch();
    } catch (err) {
      console.error('Failed to resize schedule:', err);
      arg.revert();
      setSnackbar({
        open: true,
        message: '更新に失敗しました',
        severity: 'error',
      });
    }
  }, [apiHandlers, onRefetch]);

  const handleDatesSet = useCallback((arg: { start: Date; end: Date; view: { type: string } }) => {
    const midDate = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
    onDateRangeChange(midDate, midDate, arg.view.type);
  }, [onDateRangeChange]);

  const handleOpenNewDialog = useCallback(() => {
    setFormData({
      ...initialFormData,
      staffId: currentStaffId,
      scheduledDate: new Date(),
    });
    setIsEditing(false);
    setFormDialogOpen(true);
  }, [currentStaffId]);

  const openEditForm = useCallback(() => {
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
  }, [selectedSchedule]);

  const handleOpenEditDialog = useCallback(() => {
    if (!selectedSchedule) return;

    // For recurring schedules, show scope selection dialog
    if (selectedSchedule.recurrenceId) {
      setRecurrenceEditScope('single');
      setRecurrenceEditDialogOpen(true);
      return;
    }

    openEditForm();
  }, [selectedSchedule, openEditForm]);

  const handleConfirmRecurrenceEdit = useCallback(() => {
    setRecurrenceEditDialogOpen(false);
    openEditForm();
  }, [openEditForm]);

  const handleDeleteSchedule = useCallback(() => {
    if (!selectedSchedule) return;

    // For recurring schedules, show scope selection dialog
    if (selectedSchedule.recurrenceId) {
      setRecurrenceDeleteScope('single');
      setRecurrenceDeleteDialogOpen(true);
      return;
    }

    // For single schedules, confirm and delete
    if (!confirm('このスケジュールを削除しますか？')) return;
    performDelete([selectedSchedule.id]);
  }, [selectedSchedule]);

  const performDelete = useCallback(async (scheduleIds: string[]) => {
    try {
      await Promise.all(
        scheduleIds.map(id => apiHandlers.deleteSchedule(id))
      );

      const message = scheduleIds.length > 1
        ? `${scheduleIds.length}件の予定を削除しました`
        : 'スケジュールを削除しました';

      setSnackbar({
        open: true,
        message,
        severity: 'success',
      });

      await apiHandlers.notifyUpdate(scheduleIds[0], 'delete');

      setDetailDialogOpen(false);
      setSelectedSchedule(null);
      await onRefetch();
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      setSnackbar({
        open: true,
        message: '削除に失敗しました',
        severity: 'error',
      });
    }
  }, [apiHandlers, onRefetch]);

  const handleConfirmRecurrenceDelete = useCallback(async () => {
    if (!selectedSchedule || !selectedSchedule.recurrenceId) return;

    setProcessingRecurrence(true);

    try {
      if (recurrenceDeleteScope === 'single') {
        await performDelete([selectedSchedule.id]);
      } else {
        const relatedSchedules = await apiHandlers.getSchedulesByRecurrenceId(selectedSchedule.recurrenceId);
        const scheduleIds = relatedSchedules.map(s => s.id);
        await performDelete(scheduleIds);
      }
    } finally {
      setProcessingRecurrence(false);
      setRecurrenceDeleteDialogOpen(false);
    }
  }, [selectedSchedule, recurrenceDeleteScope, apiHandlers, performDelete]);

  const handleSaveSchedule = useCallback(async () => {
    if (!facilityId || !formData.clientId || !formData.staffId || !formData.scheduledDate || !formData.startTime || !formData.endTime) {
      setSnackbar({
        open: true,
        message: '必須項目を入力してください',
        severity: 'error',
      });
      return;
    }

    // Validate weekday selection for weekly/biweekly
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
        // Edit existing schedule
        if (recurrenceEditScope === 'all' && selectedSchedule.recurrenceId) {
          // Update entire series
          const relatedSchedules = await apiHandlers.getSchedulesByRecurrenceId(selectedSchedule.recurrenceId);

          await Promise.all(
            relatedSchedules.map(schedule =>
              apiHandlers.updateSchedule(schedule.id, {
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
            message: `${relatedSchedules.length}件の予定を更新しました`,
            severity: 'success',
          });
        } else if (recurrenceEditScope === 'thisAndFuture' && selectedSchedule.recurrenceId) {
          // Update this and future schedules
          const relatedSchedules = await apiHandlers.getSchedulesByRecurrenceId(selectedSchedule.recurrenceId);
          const targetDate = selectedSchedule.scheduledDate;
          const futureSchedules = relatedSchedules.filter(s => s.scheduledDate >= targetDate);

          await Promise.all(
            futureSchedules.map(schedule =>
              apiHandlers.updateSchedule(schedule.id, {
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
          // Update single schedule
          await apiHandlers.updateSchedule(selectedSchedule.id, {
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

        setRecurrenceEditScope('single');
        await apiHandlers.notifyUpdate(selectedSchedule.id, 'update');
      } else {
        // Create new schedule(s)
        const dates = generateRecurringDates(formData.scheduledDate, formData.recurrence);
        const recurrenceId = recurrenceRule ? crypto.randomUUID() : null;

        // Create first schedule
        const firstResult = await apiHandlers.createSchedule({
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

        // Create remaining schedules
        if (dates.length > 1) {
          await Promise.all(
            dates.slice(1).map(date =>
              apiHandlers.createSchedule({
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

        await apiHandlers.notifyUpdate(firstResult.id, 'create');
      }

      setFormDialogOpen(false);
      setSelectedSchedule(null);
      await onRefetch();
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
  }, [facilityId, formData, isEditing, selectedSchedule, recurrenceEditScope, apiHandlers, onRefetch]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
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
          // Resize handle styling
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
          // Drag visual feedback
          '& .fc-event.fc-dragging': {
            opacity: 0.7,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          // Resize visual feedback
          '& .fc-event.fc-resizing': {
            opacity: 0.8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          },
          // Now indicator (Google Calendar style red line)
          '& .fc-timegrid-now-indicator-line': {
            borderColor: '#EA4335',
            borderWidth: '2px',
          },
          '& .fc-timegrid-now-indicator-arrow': {
            borderColor: '#EA4335',
          },
        }}
      >
        <CardContent sx={{ minHeight: 600 }}>
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
            height={600}
            contentHeight="auto"
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

      {/* Dialogs */}
      <ScheduleDetailDialog
        open={detailDialogOpen}
        schedule={selectedSchedule}
        onClose={() => setDetailDialogOpen(false)}
        onEdit={handleOpenEditDialog}
        onDelete={handleDeleteSchedule}
      />

      <ScheduleFormDialog
        open={formDialogOpen}
        isEditing={isEditing}
        formData={formData}
        clients={clients}
        staffList={staffList}
        serviceTypes={serviceTypes}
        saving={saving}
        onFormChange={setFormData}
        onSave={handleSaveSchedule}
        onClose={() => setFormDialogOpen(false)}
      />

      <RecurrenceEditDialog
        open={recurrenceEditDialogOpen}
        scope={recurrenceEditScope}
        onScopeChange={setRecurrenceEditScope}
        onConfirm={handleConfirmRecurrenceEdit}
        onCancel={() => setRecurrenceEditDialogOpen(false)}
      />

      <RecurrenceDeleteDialog
        open={recurrenceDeleteDialogOpen}
        scope={recurrenceDeleteScope}
        processing={processingRecurrence}
        onScopeChange={setRecurrenceDeleteScope}
        onConfirm={handleConfirmRecurrenceDelete}
        onCancel={() => setRecurrenceDeleteDialogOpen(false)}
      />

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
    </Box>
  );
}
