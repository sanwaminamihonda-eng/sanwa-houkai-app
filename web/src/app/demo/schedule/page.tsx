'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
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

  const fetchSchedules = useCallback(async () => {
    if (!facilityId) return;

    const { start, end } = getDateRange(currentDate, currentView);

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

  useEffect(() => {
    if (!facilityId) return;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSchedules(), fetchMasterData()]);
      setLoading(false);
    };

    loadData();
  }, [facilityId, fetchSchedules, fetchMasterData]);

  // Handle date range change from calendar
  const handleDateRangeChange = useCallback((date: Date, _: Date, view: string) => {
    setCurrentDate(date);
    setCurrentView(view);
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
      <Typography variant="h5" sx={{ mb: 3 }}>
        スケジュール
      </Typography>

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
        onRefetch={fetchSchedules}
        onDateRangeChange={handleDateRangeChange}
      />
    </Box>
  );
}
