'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
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
import {
  ScheduleCalendarView,
  ScheduleForCalendar,
  ClientOption,
  StaffOption,
  ServiceTypeOption,
  ScheduleApiHandlers,
  CreateScheduleInput,
  UpdateScheduleInput,
} from '@/components/schedule';

type Schedule = ListSchedulesByDateRangeData['schedules'][0];
type Client = ListClientsData['clients'][0];
type StaffMember = ListStaffData['staffs'][0];
type ServiceType = ListServiceTypesData['serviceTypes'][0];

export default function SchedulePage() {
  const { facilityId, staff, loading: staffLoading } = useStaff();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<string>('timeGridWeek');

  // Track last fetched date range to prevent infinite loops
  const lastFetchedRangeRef = useRef<string>('');

  // Calculate date range based on current view
  const getDateRange = useCallback((date: Date, view: string) => {
    if (view === 'dayGridMonth') {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
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

  const fetchSchedules = useCallback(async (force = false) => {
    if (!facilityId) return;

    const { start, end } = getDateRange(currentDate, currentView);
    const rangeKey = `${format(start, 'yyyy-MM-dd')}_${format(end, 'yyyy-MM-dd')}`;

    // Skip if we already fetched this range (prevent infinite loop)
    if (!force && rangeKey === lastFetchedRangeRef.current) {
      return;
    }

    lastFetchedRangeRef.current = rangeKey;

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

  // Force refetch handler for user actions and realtime updates
  const handleForceRefetch = useCallback(async () => {
    await fetchSchedules(true);
  }, [fetchSchedules]);

  // Realtime sync
  const { notifyScheduleUpdate } = useScheduleRealtime({
    facilityId,
    staffId: staff?.id || null,
    onUpdate: handleForceRefetch,
  });

  // Initial load - master data only
  useEffect(() => {
    if (!facilityId) return;
    fetchMasterData();
  }, [facilityId, fetchMasterData]);

  // Schedule data load - triggered by date/view changes
  useEffect(() => {
    if (!facilityId) return;

    const loadSchedules = async () => {
      setLoading(true);
      await fetchSchedules();
      setLoading(false);
    };

    loadSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityId, currentDate, currentView]);

  // Handle date range change from calendar - only update state, don't fetch
  const handleDateRangeChange = useCallback((date: Date, _: Date, view: string) => {
    // Only update if values actually changed
    setCurrentDate(prev => {
      const prevStr = format(prev, 'yyyy-MM-dd');
      const newStr = format(date, 'yyyy-MM-dd');
      return prevStr !== newStr ? date : prev;
    });
    setCurrentView(prev => prev !== view ? view : prev);
  }, []);

  // API handlers for dependency injection
  const apiHandlers: ScheduleApiHandlers = useMemo(() => ({
    createSchedule: async (data: CreateScheduleInput) => {
      const result = await createSchedule(dataConnect, data);
      return { id: result.data.schedule_insert.id };
    },
    updateSchedule: async (id: string, data: UpdateScheduleInput) => {
      await updateSchedule(dataConnect, { id, ...data });
    },
    deleteSchedule: async (id: string) => {
      await deleteSchedule(dataConnect, { id });
    },
    getSchedulesByRecurrenceId: async (recurrenceId: string) => {
      const result = await getSchedulesByRecurrenceId(dataConnect, { recurrenceId });
      return result.data.schedules as ScheduleForCalendar[];
    },
    notifyUpdate: async (scheduleId: string, action: 'create' | 'update' | 'delete') => {
      await notifyScheduleUpdate(scheduleId, action);
    },
  }), [notifyScheduleUpdate]);

  // Convert to common types
  const schedulesForCalendar: ScheduleForCalendar[] = useMemo(() => {
    return schedules.map(s => ({
      ...s,
      serviceType: s.serviceType ? {
        id: s.serviceType.id,
        name: s.serviceType.name,
        category: s.serviceType.category,
        color: s.serviceType.color,
      } : null,
    }));
  }, [schedules]);

  const clientOptions: ClientOption[] = useMemo(() => {
    return clients.map(c => ({ id: c.id, name: c.name }));
  }, [clients]);

  const staffOptions: StaffOption[] = useMemo(() => {
    return staffList.map(s => ({ id: s.id, name: s.name }));
  }, [staffList]);

  const serviceTypeOptions: ServiceTypeOption[] = useMemo(() => {
    return serviceTypes.map(st => ({
      id: st.id,
      name: st.name,
      category: st.category,
    }));
  }, [serviceTypes]);

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

  return (
    <MainLayout title="スケジュール" showBackButton backHref="/">
      <ScheduleCalendarView
        schedules={schedulesForCalendar}
        clients={clientOptions}
        staffList={staffOptions}
        serviceTypes={serviceTypeOptions}
        loading={false}
        error={error}
        currentStaffId={staff?.id || ''}
        facilityId={facilityId}
        apiHandlers={apiHandlers}
        onRefetch={handleForceRefetch}
        onDateRangeChange={handleDateRangeChange}
      />
    </MainLayout>
  );
}
