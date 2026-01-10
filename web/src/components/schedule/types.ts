// Schedule component types - shared between production and demo

// Schedule data type (common for production/demo)
export interface ScheduleForCalendar {
  id: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status?: string | null;
  notes?: string | null;
  recurrenceRule?: string | null;
  recurrenceId?: string | null;
  client: { id: string; name: string };
  staff: { id: string; name: string };
  serviceType: {
    id: string;
    name: string;
    category: string | null;
    color?: string | null;
  } | null;
}

// Master data types
export interface ClientOption {
  id: string;
  name: string;
}

export interface StaffOption {
  id: string;
  name: string;
}

export interface ServiceTypeOption {
  id: string;
  name: string;
  category: string | null;
}

// Recurrence types
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
export type RecurrenceEndType = 'count' | 'until';
export type RecurrenceEditScope = 'single' | 'thisAndFuture' | 'all';
export type RecurrenceDeleteScope = 'single' | 'all';

export interface RecurrenceSettings {
  type: RecurrenceType;
  weekdays: string[];
  endType: RecurrenceEndType;
  count: number;
  until: Date | null;
}

// Form data type
export interface ScheduleFormData {
  clientId: string;
  staffId: string;
  serviceTypeId: string;
  scheduledDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  notes: string;
  recurrence: RecurrenceSettings;
}

// API input types
export interface CreateScheduleInput {
  facilityId: string;
  clientId: string;
  staffId: string;
  serviceTypeId: string | null;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  recurrenceRule: string | null;
  recurrenceId: string | null;
}

export interface UpdateScheduleInput {
  clientId?: string;
  staffId?: string;
  serviceTypeId?: string | null;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  notes?: string | null;
}

// API handlers interface (for dependency injection)
export interface ScheduleApiHandlers {
  createSchedule: (data: CreateScheduleInput) => Promise<{ id: string }>;
  updateSchedule: (id: string, data: UpdateScheduleInput) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getSchedulesByRecurrenceId: (recurrenceId: string) => Promise<ScheduleForCalendar[]>;
  notifyUpdate: (scheduleId: string, action: 'create' | 'update' | 'delete') => Promise<void>;
}

// FullCalendar event type
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    schedule: ScheduleForCalendar;
    isRecurring: boolean;
  };
}

// Initial values
export const initialRecurrence: RecurrenceSettings = {
  type: 'none',
  weekdays: [],
  endType: 'count',
  count: 10,
  until: null,
};

export const initialFormData: ScheduleFormData = {
  clientId: '',
  staffId: '',
  serviceTypeId: '',
  scheduledDate: new Date(),
  startTime: null,
  endTime: null,
  notes: '',
  recurrence: { ...initialRecurrence },
};

// Weekday mapping for RRule
export const WEEKDAYS = [
  { key: 'MO', label: '月' },
  { key: 'TU', label: '火' },
  { key: 'WE', label: '水' },
  { key: 'TH', label: '木' },
  { key: 'FR', label: '金' },
  { key: 'SA', label: '土' },
  { key: 'SU', label: '日' },
] as const;
