import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  useTheme,
  FAB,
  Portal,
  Modal,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, ICalendarEventBase, Mode } from 'react-native-big-calendar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

import { ScheduleStackParamList } from '../../navigation/RootNavigator';

import { useStaff } from '../../hooks/useStaff';
import { useScheduleRealtime } from '../../hooks/useScheduleRealtime';
import { dataConnect } from '../../lib/firebase';
import {
  listSchedulesByDateRange,
  ListSchedulesByDateRangeData,
} from '@sanwa-houkai-app/dataconnect';

dayjs.locale('ja');

type Schedule = ListSchedulesByDateRangeData['schedules'][0];

interface CalendarEvent extends ICalendarEventBase {
  id: string;
  color: string;
  schedule: Schedule;
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

const VIEW_OPTIONS = [
  { value: 'day' as Mode, label: '日' },
  { value: 'week' as Mode, label: '週' },
  { value: 'month' as Mode, label: '月' },
];

type ScheduleScreenNavigationProp = NativeStackNavigationProp<ScheduleStackParamList, 'ScheduleList'>;

export default function ScheduleScreen() {
  const theme = useTheme();
  const navigation = useNavigation<ScheduleScreenNavigationProp>();
  const { facilityId, staff, loading: staffLoading } = useStaff();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<Mode>('week');

  // Detail modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Calculate date range for fetching
  const getDateRange = useCallback((date: Date, mode: Mode) => {
    const current = dayjs(date);
    if (mode === 'month') {
      return {
        start: current.startOf('month').subtract(7, 'day').format('YYYY-MM-DD'),
        end: current.endOf('month').add(7, 'day').format('YYYY-MM-DD'),
      };
    } else if (mode === 'week') {
      return {
        start: current.startOf('week').format('YYYY-MM-DD'),
        end: current.endOf('week').format('YYYY-MM-DD'),
      };
    } else {
      return {
        start: current.format('YYYY-MM-DD'),
        end: current.format('YYYY-MM-DD'),
      };
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    if (!facilityId) return;

    const { start, end } = getDateRange(currentDate, viewMode);

    try {
      const result = await listSchedulesByDateRange(dataConnect, {
        facilityId,
        startDate: start,
        endDate: end,
      });
      setSchedules(result.data.schedules);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      setError('スケジュールの読み込みに失敗しました');
    }
  }, [facilityId, currentDate, viewMode, getDateRange]);

  // Realtime sync - listen for updates from other users
  useScheduleRealtime({
    facilityId,
    staffId: staff?.id || null,
    onUpdate: fetchSchedules,
  });

  // Reload data when screen is focused (e.g., after form submit)
  useFocusEffect(
    useCallback(() => {
      if (!facilityId) return;

      const loadData = async () => {
        setLoading(true);
        await fetchSchedules();
        setLoading(false);
      };

      loadData();
    }, [facilityId, fetchSchedules])
  );

  // Convert schedules to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return schedules.map((schedule) => {
      const dateStr = schedule.scheduledDate;
      const startDateTime = dayjs(`${dateStr}T${schedule.startTime}`).toDate();
      const endDateTime = dayjs(`${dateStr}T${schedule.endTime}`).toDate();
      const isRecurring = !!schedule.recurrenceId;
      const recurringMark = isRecurring ? '🔄 ' : '';

      return {
        id: schedule.id,
        title: `${recurringMark}${schedule.client.name}${schedule.serviceType ? `\n${schedule.serviceType.name}` : ''}`,
        start: startDateTime,
        end: endDateTime,
        color: getServiceColor(schedule.serviceType?.category),
        schedule,
      };
    });
  }, [schedules]);

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedSchedule(event.schedule);
    setDetailModalVisible(true);
  };

  const handleDateChange = (dates: Date[]) => {
    if (dates.length > 0) {
      setCurrentDate(dates[0]);
    }
  };

  const handlePrevious = () => {
    const unit = viewMode === 'day' ? 'day' : viewMode === 'week' ? 'week' : 'month';
    setCurrentDate(dayjs(currentDate).subtract(1, unit).toDate());
  };

  const handleNext = () => {
    const unit = viewMode === 'day' ? 'day' : viewMode === 'week' ? 'week' : 'month';
    setCurrentDate(dayjs(currentDate).add(1, unit).toDate());
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddSchedule = () => {
    navigation.navigate('ScheduleForm', {
      initialDate: dayjs(currentDate).format('YYYY-MM-DD'),
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setDetailModalVisible(false);
    navigation.navigate('ScheduleForm', {
      schedule: {
        id: schedule.id,
        clientId: schedule.client.id,
        staffId: schedule.staff.id,
        serviceTypeId: schedule.serviceType?.id,
        scheduledDate: schedule.scheduledDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        notes: schedule.notes,
        recurrenceId: schedule.recurrenceId,
      },
    });
  };

  const formatDateRange = (): string => {
    const current = dayjs(currentDate);
    if (viewMode === 'day') {
      return current.format('YYYY年M月D日(ddd)');
    } else if (viewMode === 'week') {
      const start = current.startOf('week');
      const end = current.endOf('week');
      return `${start.format('M/D')} - ${end.format('M/D')}`;
    } else {
      return current.format('YYYY年M月');
    }
  };

  if (staffLoading || loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!facilityId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            スタッフ情報が見つかりません。管理者にお問い合わせください。
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchSchedules} style={{ marginTop: 16 }}>
            再読み込み
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.dateNavigation}>
            <IconButton
              icon="chevron-left"
              size={24}
              onPress={handlePrevious}
            />
            <Text style={styles.dateText}>{formatDateRange()}</Text>
            <IconButton
              icon="chevron-right"
              size={24}
              onPress={handleNext}
            />
          </View>
          <Button mode="text" compact onPress={handleToday}>
            今日
          </Button>
        </View>

        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as Mode)}
          buttons={VIEW_OPTIONS}
          style={styles.segmentedButtons}
        />

        {/* Service color legend */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legend}>
          {Object.entries(SERVICE_COLORS)
            .filter(([key]) => key !== 'default')
            .map(([category, color]) => (
              <Chip
                key={category}
                style={[styles.legendChip, { backgroundColor: color }]}
                textStyle={styles.legendChipText}
              >
                {category}
              </Chip>
            ))}
        </ScrollView>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          events={events}
          height={500}
          mode={viewMode}
          date={currentDate}
          onPressEvent={handleEventPress}
          onChangeDate={handleDateChange}
          locale="ja"
          weekStartsOn={1}
          showTime={true}
          swipeEnabled={true}
          eventCellStyle={(event) => ({
            backgroundColor: (event as CalendarEvent).color,
            borderRadius: 4,
          })}
          calendarCellStyle={{
            borderColor: theme.colors.surfaceVariant,
          }}
          headerContainerStyle={{
            backgroundColor: theme.colors.surface,
          }}
          bodyContainerStyle={{
            backgroundColor: theme.colors.surface,
          }}
        />
      </View>

      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="white"
        onPress={handleAddSchedule}
      />

      {/* Detail Modal */}
      <Portal>
        <Modal
          visible={detailModalVisible}
          onDismiss={() => setDetailModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          {selectedSchedule && (
            <ScrollView>
              <Text variant="titleLarge" style={styles.modalTitle}>
                予定詳細
              </Text>
              <Divider style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>利用者</Text>
                <Text style={styles.detailValue}>{selectedSchedule.client.name}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>担当者</Text>
                <Text style={styles.detailValue}>{selectedSchedule.staff.name}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>日時</Text>
                <Text style={styles.detailValue}>
                  {dayjs(selectedSchedule.scheduledDate).format('YYYY年M月D日(ddd)')}
                  {'\n'}
                  {selectedSchedule.startTime} - {selectedSchedule.endTime}
                </Text>
              </View>

              {selectedSchedule.serviceType && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>サービス種類</Text>
                  <Chip
                    style={{
                      backgroundColor: getServiceColor(selectedSchedule.serviceType.category),
                    }}
                    textStyle={{ color: 'white' }}
                  >
                    {selectedSchedule.serviceType.name}
                  </Chip>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ステータス</Text>
                <Chip
                  mode="outlined"
                  style={styles.statusChip}
                >
                  {selectedSchedule.status === 'scheduled'
                    ? '予定'
                    : selectedSchedule.status === 'completed'
                    ? '完了'
                    : 'キャンセル'}
                </Chip>
              </View>

              {selectedSchedule.recurrenceId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>繰り返し</Text>
                  <View style={styles.recurringRow}>
                    <Text style={styles.recurringIcon}>🔄</Text>
                    <Text style={styles.detailValue}>繰り返し予定</Text>
                  </View>
                </View>
              )}

              {selectedSchedule.notes && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>メモ</Text>
                  <Text style={styles.detailValue}>{selectedSchedule.notes}</Text>
                </View>
              )}

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setDetailModalVisible(false)}
                  style={styles.modalButton}
                >
                  閉じる
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleEditSchedule(selectedSchedule)}
                  style={styles.modalButton}
                  icon="pencil"
                >
                  編集
                </Button>
              </View>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 140,
    textAlign: 'center',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  legend: {
    marginTop: 12,
  },
  legendChip: {
    marginRight: 8,
  },
  legendChipText: {
    color: 'white',
    fontSize: 12,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurringIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});
