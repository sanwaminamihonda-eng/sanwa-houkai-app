// Schedule component utilities - shared between production and demo

import { RRule, Options } from 'rrule';
import { format } from 'date-fns';
import { RecurrenceSettings, WEEKDAYS } from './types';

// Service type colors
export const SERVICE_COLORS: Record<string, string> = {
  '身体介護': '#2196F3',
  '生活援助': '#4CAF50',
  '自立支援': '#FF9800',
  '複合': '#9C27B0',
  'default': '#757575',
};

export const getServiceColor = (category?: string | null): string => {
  if (!category) return SERVICE_COLORS.default;
  return SERVICE_COLORS[category] || SERVICE_COLORS.default;
};

// RRule weekday mapping
const RRULE_WEEKDAYS = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU,
} as const;

// Generate recurring dates from recurrence settings
export const generateRecurringDates = (startDate: Date, recurrence: RecurrenceSettings): Date[] => {
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
          return RRULE_WEEKDAYS[day as keyof typeof RRULE_WEEKDAYS] || RRule.MO;
        });
      }
      break;
    case 'biweekly':
      options.freq = RRule.WEEKLY;
      options.interval = 2;
      if (recurrence.weekdays.length > 0) {
        options.byweekday = recurrence.weekdays.map(day => {
          return RRULE_WEEKDAYS[day as keyof typeof RRULE_WEEKDAYS] || RRule.MO;
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

// Generate RRULE string from recurrence settings
export const generateRRuleString = (recurrence: RecurrenceSettings): string | null => {
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

// Re-export WEEKDAYS for convenience
export { WEEKDAYS };
