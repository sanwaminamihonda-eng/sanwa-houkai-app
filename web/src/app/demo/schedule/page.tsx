'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { useDemoContext } from '@/contexts/DemoContext';
import { dataConnect } from '@/lib/firebase';
import {
  demoListSchedulesByDateRange,
  DemoListSchedulesByDateRangeData,
  demoGetSchedulesByRecurrenceId,
  demoListClients,
  DemoListClientsData,
  demoListStaff,
  DemoListStaffData,
  demoListServiceTypes,
  DemoListServiceTypesData,
  demoCreateSchedule,
  demoUpdateSchedule,
  demoDeleteSchedule,
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

type Schedule = DemoListSchedulesByDateRangeData['schedules'][0];
type Client = DemoListClientsData['clients'][0];
type StaffMember = DemoListStaffData['staffs'][0];
type ServiceType = DemoListServiceTypesData['serviceTypes'][0];

export default function DemoSchedulePage() {
  const { facilityId, staffId } = useDemoContext();

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
      const result = await demoListSchedulesByDateRange(dataConnect, {
        facilityId,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      });
      setSchedules(result.data.schedules);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      setError('スケジュールの読み込みに失敗しました');
    }
  }, [facilityId, currentDate, currentView, getDateRange]);

  const fetchMasterData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const [clientsResult, staffResult, serviceTypesResult] = await Promise.all([
        demoListClients(dataConnect, { facilityId }),
        demoListStaff(dataConnect, { facilityId }),
        demoListServiceTypes(dataConnect, { facilityId }),
      ]);

      setClients(clientsResult.data.clients);
      setStaffList(staffResult.data.staffs);
      setServiceTypes(serviceTypesResult.data.serviceTypes);
    } catch (err) {
      console.error('Failed to fetch master data:', err);
    }
  }, [facilityId]);

  // Initial load - master data only
  useEffect(() => {
    if (!facilityId) return;
    fetchMasterData();
  }, [facilityId, fetchMasterData]);

  // Schedule data load - triggered by date/view changes
  useEffect(() => {
    if (!facilityId) return;

    const loadSchedules = async () => {
      // Only show loading on initial load, not on view changes
      if (schedules.length === 0) {
        setLoading(true);
      }
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

  // API handlers for dependency injection (demo version)
  const apiHandlers: ScheduleApiHandlers = useMemo(() => ({
    createSchedule: async (data: CreateScheduleInput) => {
      const result = await demoCreateSchedule(dataConnect, data);
      return { id: result.data.schedule_insert.id };
    },
    updateSchedule: async (id: string, data: UpdateScheduleInput) => {
      await demoUpdateSchedule(dataConnect, { id, ...data });
    },
    deleteSchedule: async (id: string) => {
      await demoDeleteSchedule(dataConnect, { id });
    },
    getSchedulesByRecurrenceId: async (recurrenceId: string) => {
      const result = await demoGetSchedulesByRecurrenceId(dataConnect, { recurrenceId });
      return result.data.schedules as ScheduleForCalendar[];
    },
    notifyUpdate: async () => {
      // Demo does not use realtime sync (noop)
    },
  }), []);

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

  // Force refetch for user actions (create, update, delete)
  // Must be defined before conditional returns to follow Rules of Hooks
  const handleRefetch = useCallback(async () => {
    await fetchSchedules(true);
  }, [fetchSchedules]);

  // Show error if any
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Show loading overlay on initial load only
  if (loading && schedules.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ScheduleCalendarView
        schedules={schedulesForCalendar}
        clients={clientOptions}
        staffList={staffOptions}
        serviceTypes={serviceTypeOptions}
        loading={false}
        error={null}
        currentStaffId={staffId}
        facilityId={facilityId}
        apiHandlers={apiHandlers}
        onRefetch={handleRefetch}
        onDateRangeChange={handleDateRangeChange}
    />
  );
}
