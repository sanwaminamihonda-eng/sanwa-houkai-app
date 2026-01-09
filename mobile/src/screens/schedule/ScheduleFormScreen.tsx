import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  TextInput,
  ActivityIndicator,
  Appbar,
  HelperText,
  Chip,
  Divider,
  RadioButton,
  Portal,
  Modal,
} from 'react-native-paper';
import { RRule, Options } from 'rrule';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useStaff } from '../../hooks/useStaff';
import { useScheduleRealtime } from '../../hooks/useScheduleRealtime';
import { dataConnect } from '../../lib/firebase';
import {
  listClients,
  listStaff,
  listServiceTypes,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByRecurrenceId,
  ListClientsData,
  ListServiceTypesData,
  ListStaffData,
} from '@sanwa-houkai-app/dataconnect';
import { ScheduleStackParamList } from '../../navigation/RootNavigator';

type Client = ListClientsData['clients'][0];
type ServiceType = ListServiceTypesData['serviceTypes'][0];
type Staff = ListStaffData['staffs'][0];

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

type ScheduleFormRouteProp = RouteProp<ScheduleStackParamList, 'ScheduleForm'>;
type ScheduleFormNavigationProp = NativeStackNavigationProp<ScheduleStackParamList, 'ScheduleForm'>;

export default function ScheduleFormScreen() {
  const theme = useTheme();
  const navigation = useNavigation<ScheduleFormNavigationProp>();
  const route = useRoute<ScheduleFormRouteProp>();

  const { facilityId, staff: currentStaff, loading: staffLoading } = useStaff();

  // Realtime sync notification
  const { notifyScheduleUpdate } = useScheduleRealtime({
    facilityId,
    staffId: currentStaff?.id || null,
    onUpdate: () => {}, // Form screen doesn't need to respond to updates
  });

  // Determine if editing
  const scheduleData = route.params?.schedule;
  const isEditing = !!scheduleData;
  const initialDate = route.params?.initialDate;

  // Master data
  const [clients, setClients] = useState<Client[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingMasters, setLoadingMasters] = useState(true);

  // Form state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 繰り返し予定操作用の状態
  const [recurrenceEditScope, setRecurrenceEditScope] = useState<RecurrenceEditScope>('single');
  const [recurrenceDeleteScope, setRecurrenceDeleteScope] = useState<RecurrenceDeleteScope>('single');
  const [showEditScopeDialog, setShowEditScopeDialog] = useState(false);
  const [showDeleteScopeDialog, setShowDeleteScopeDialog] = useState(false);
  const [processingRecurrence, setProcessingRecurrence] = useState(false);

  // 繰り返し設定の状態
  const [recurrence, setRecurrence] = useState<RecurrenceSettings>({
    type: 'none',
    weekdays: [],
    endType: 'count',
    count: 10,
    until: null,
  });
  const [showUntilPicker, setShowUntilPicker] = useState(false);

  // Initialize form with existing data or defaults
  useEffect(() => {
    if (isEditing && scheduleData) {
      setSelectedClientId(scheduleData.clientId);
      setSelectedStaffId(scheduleData.staffId);
      setSelectedServiceTypeId(scheduleData.serviceTypeId || '');

      // Parse date
      const dateParts = scheduleData.scheduledDate.split('-');
      const parsedDate = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      );
      setScheduledDate(parsedDate);

      // Parse times
      const startParts = scheduleData.startTime.split(':');
      const startDate = new Date();
      startDate.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
      setStartTime(startDate);

      const endParts = scheduleData.endTime.split(':');
      const endDate = new Date();
      endDate.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
      setEndTime(endDate);

      setNotes(scheduleData.notes || '');
    } else if (initialDate) {
      setScheduledDate(new Date(initialDate));
    }
  }, [isEditing, scheduleData, initialDate]);

  // Set default staff to current user
  useEffect(() => {
    if (currentStaff && !isEditing && !selectedStaffId) {
      setSelectedStaffId(currentStaff.id);
    }
  }, [currentStaff, isEditing, selectedStaffId]);

  // Load master data
  useEffect(() => {
    if (!facilityId) return;

    const loadMasters = async () => {
      setLoadingMasters(true);
      try {
        const [clientsRes, staffRes, typesRes] = await Promise.all([
          listClients(dataConnect, { facilityId }),
          listStaff(dataConnect, { facilityId }),
          listServiceTypes(dataConnect, { facilityId }),
        ]);

        setClients(clientsRes.data.clients);
        setStaffList(staffRes.data.staffs);
        setServiceTypes(typesRes.data.serviceTypes);
      } catch (err) {
        console.error('Failed to load masters:', err);
        Alert.alert('エラー', 'マスタデータの読み込みに失敗しました');
      } finally {
        setLoadingMasters(false);
      }
    };

    loadMasters();
  }, [facilityId]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatTimeForApi = (date: Date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const validateForm = (): boolean => {
    if (!selectedClientId) {
      Alert.alert('入力エラー', '利用者を選択してください');
      return false;
    }
    if (!selectedStaffId) {
      Alert.alert('入力エラー', '担当者を選択してください');
      return false;
    }
    if (startTime >= endTime) {
      Alert.alert('入力エラー', '終了時間は開始時間より後にしてください');
      return false;
    }
    // 週次/隔週で曜日未選択の場合はエラー
    if (!isEditing && (recurrence.type === 'weekly' || recurrence.type === 'biweekly') && recurrence.weekdays.length === 0) {
      Alert.alert('入力エラー', '繰り返しの曜日を選択してください');
      return false;
    }
    return true;
  };

  // 繰り返しルールから日付リストを生成
  const generateRecurringDates = (startDate: Date, rec: RecurrenceSettings): Date[] => {
    if (rec.type === 'none') {
      return [startDate];
    }

    const options: Partial<Options> = {
      dtstart: startDate,
    };

    switch (rec.type) {
      case 'daily':
        options.freq = RRule.DAILY;
        break;
      case 'weekly':
        options.freq = RRule.WEEKLY;
        if (rec.weekdays.length > 0) {
          options.byweekday = rec.weekdays.map(day => {
            const weekday = WEEKDAYS.find(w => w.key === day);
            return weekday?.rruleDay || RRule.MO;
          });
        }
        break;
      case 'biweekly':
        options.freq = RRule.WEEKLY;
        options.interval = 2;
        if (rec.weekdays.length > 0) {
          options.byweekday = rec.weekdays.map(day => {
            const weekday = WEEKDAYS.find(w => w.key === day);
            return weekday?.rruleDay || RRule.MO;
          });
        }
        break;
      case 'monthly':
        options.freq = RRule.MONTHLY;
        break;
    }

    if (rec.endType === 'count') {
      options.count = rec.count;
    } else if (rec.until) {
      options.until = rec.until;
    }

    const rule = new RRule(options as Options);
    return rule.all();
  };

  // RRULEを文字列形式で生成
  const generateRRuleString = (rec: RecurrenceSettings): string | undefined => {
    if (rec.type === 'none') {
      return undefined;
    }

    let rule = '';
    switch (rec.type) {
      case 'daily':
        rule = 'FREQ=DAILY';
        break;
      case 'weekly':
        rule = 'FREQ=WEEKLY';
        if (rec.weekdays.length > 0) {
          rule += `;BYDAY=${rec.weekdays.join(',')}`;
        }
        break;
      case 'biweekly':
        rule = 'FREQ=WEEKLY;INTERVAL=2';
        if (rec.weekdays.length > 0) {
          rule += `;BYDAY=${rec.weekdays.join(',')}`;
        }
        break;
      case 'monthly':
        rule = 'FREQ=MONTHLY';
        break;
    }

    if (rec.endType === 'count') {
      rule += `;COUNT=${rec.count}`;
    } else if (rec.until) {
      const y = rec.until.getFullYear();
      const m = String(rec.until.getMonth() + 1).padStart(2, '0');
      const d = String(rec.until.getDate()).padStart(2, '0');
      rule += `;UNTIL=${y}${m}${d}T235959Z`;
    }

    return rule;
  };

  // 曜日選択をトグル
  const toggleWeekday = (key: string) => {
    setRecurrence(prev => ({
      ...prev,
      weekdays: prev.weekdays.includes(key)
        ? prev.weekdays.filter(d => d !== key)
        : [...prev.weekdays, key],
    }));
  };

  const handleSave = async () => {
    if (!facilityId) {
      Alert.alert('エラー', '施設情報が取得できません');
      return;
    }
    if (!validateForm()) return;

    // 編集時に繰り返し予定の場合は選択ダイアログを表示
    if (isEditing && scheduleData?.recurrenceId && !showEditScopeDialog) {
      setShowEditScopeDialog(true);
      return;
    }

    performSave();
  };

  const performSave = async () => {
    if (!facilityId) return;

    setSaving(true);
    try {
      const startTimeStr = formatTimeForApi(startTime);
      const endTimeStr = formatTimeForApi(endTime);
      const notesStr = notes || undefined;
      const recurrenceRule = generateRRuleString(recurrence);

      if (isEditing && scheduleData) {
        // 編集範囲に応じて更新
        if (recurrenceEditScope === 'all' && scheduleData.recurrenceId) {
          // シリーズ全体を更新
          const result = await getSchedulesByRecurrenceId(dataConnect, {
            recurrenceId: scheduleData.recurrenceId,
          });

          await Promise.all(
            result.data.schedules.map(schedule =>
              updateSchedule(dataConnect, {
                id: schedule.id,
                clientId: selectedClientId,
                staffId: selectedStaffId,
                serviceTypeId: selectedServiceTypeId || undefined,
                startTime: startTimeStr,
                endTime: endTimeStr,
                notes: notesStr,
              })
            )
          );

          await notifyScheduleUpdate(scheduleData.id, 'update');

          Alert.alert('完了', `${result.data.schedules.length}件の予定を更新しました`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else if (recurrenceEditScope === 'thisAndFuture' && scheduleData.recurrenceId) {
          // この予定以降を更新
          const result = await getSchedulesByRecurrenceId(dataConnect, {
            recurrenceId: scheduleData.recurrenceId,
          });

          const targetDate = scheduleData.scheduledDate;
          const futureSchedules = result.data.schedules.filter(
            s => s.scheduledDate >= targetDate
          );

          await Promise.all(
            futureSchedules.map(schedule =>
              updateSchedule(dataConnect, {
                id: schedule.id,
                clientId: selectedClientId,
                staffId: selectedStaffId,
                serviceTypeId: selectedServiceTypeId || undefined,
                startTime: startTimeStr,
                endTime: endTimeStr,
                notes: notesStr,
              })
            )
          );

          await notifyScheduleUpdate(scheduleData.id, 'update');

          Alert.alert('完了', `${futureSchedules.length}件の予定を更新しました`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          // 単一予定のみ更新
          await updateSchedule(dataConnect, {
            id: scheduleData.id,
            clientId: selectedClientId,
            staffId: selectedStaffId,
            serviceTypeId: selectedServiceTypeId || undefined,
            scheduledDate: formatDateForApi(scheduledDate),
            startTime: startTimeStr,
            endTime: endTimeStr,
            notes: notesStr,
          });

          await notifyScheduleUpdate(scheduleData.id, 'update');

          Alert.alert('完了', '予定を更新しました', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }

        // 編集範囲をリセット
        setRecurrenceEditScope('single');
      } else {
        // 新規作成時は繰り返し予定を一括作成
        const dates = generateRecurringDates(scheduledDate, recurrence);

        // 親IDを生成（繰り返しの場合）
        const recurrenceId = recurrenceRule ? crypto.randomUUID() : undefined;

        // 最初の予定を作成
        const firstResult = await createSchedule(dataConnect, {
          facilityId,
          clientId: selectedClientId,
          staffId: selectedStaffId,
          serviceTypeId: selectedServiceTypeId || undefined,
          scheduledDate: formatDateForApi(dates[0]),
          startTime: startTimeStr,
          endTime: endTimeStr,
          notes: notesStr,
          recurrenceRule,
          recurrenceId,
        });

        // 残りの予定を作成
        if (dates.length > 1) {
          await Promise.all(
            dates.slice(1).map(date =>
              createSchedule(dataConnect, {
                facilityId,
                clientId: selectedClientId,
                staffId: selectedStaffId,
                serviceTypeId: selectedServiceTypeId || undefined,
                scheduledDate: formatDateForApi(date),
                startTime: startTimeStr,
                endTime: endTimeStr,
                notes: notesStr,
                recurrenceRule,
                recurrenceId,
              })
            )
          );
        }

        // Notify other users about the creation
        await notifyScheduleUpdate(firstResult.data.schedule_insert.id, 'create');

        const message = dates.length > 1
          ? `${dates.length}件の予定を作成しました`
          : '予定を作成しました';

        Alert.alert('完了', message, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!scheduleData) return;

    // 繰り返し予定の場合は選択ダイアログを表示
    if (scheduleData.recurrenceId) {
      setShowDeleteScopeDialog(true);
      return;
    }

    // 単一予定の場合は確認後に削除
    Alert.alert('確認', 'この予定を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => performDelete([scheduleData.id]),
      },
    ]);
  };

  const handleConfirmRecurrenceDelete = async () => {
    if (!scheduleData || !scheduleData.recurrenceId) return;

    setProcessingRecurrence(true);

    try {
      if (recurrenceDeleteScope === 'single') {
        // 単一予定のみ削除
        await performDelete([scheduleData.id]);
      } else {
        // シリーズ全体を削除
        const result = await getSchedulesByRecurrenceId(dataConnect, {
          recurrenceId: scheduleData.recurrenceId,
        });
        const scheduleIds = result.data.schedules.map(s => s.id);
        await performDelete(scheduleIds);
      }
    } finally {
      setProcessingRecurrence(false);
      setShowDeleteScopeDialog(false);
    }
  };

  const performDelete = async (scheduleIds: string[]) => {
    setDeleting(true);
    try {
      // 複数の予定を削除
      await Promise.all(
        scheduleIds.map(id => deleteSchedule(dataConnect, { id }))
      );

      // Notify other users about the deletion
      await notifyScheduleUpdate(scheduleIds[0], 'delete');

      const message = scheduleIds.length > 1
        ? `${scheduleIds.length}件の予定を削除しました`
        : '予定を削除しました';

      Alert.alert('完了', message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Delete error:', err);
      Alert.alert('エラー', '削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  };

  if (staffLoading || loadingMasters) {
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
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>施設情報が見つかりません</Text>
          <Text style={styles.subText}>管理者にお問い合わせください</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? '予定編集' : '新規予定'} />
        {isEditing && (
          <Appbar.Action
            icon="delete"
            onPress={handleDelete}
            disabled={deleting}
          />
        )}
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Client Selection */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          利用者 *
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedClientId}
            onValueChange={setSelectedClientId}
            style={styles.picker}
          >
            <Picker.Item label="選択してください" value="" />
            {clients.map((client) => (
              <Picker.Item key={client.id} label={client.name} value={client.id} />
            ))}
          </Picker>
        </View>
        {!selectedClientId && (
          <HelperText type="info">利用者を選択してください</HelperText>
        )}

        {/* Staff Selection */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          担当者 *
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStaffId}
            onValueChange={setSelectedStaffId}
            style={styles.picker}
          >
            <Picker.Item label="選択してください" value="" />
            {staffList.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
        </View>
        {!selectedStaffId && (
          <HelperText type="info">担当者を選択してください</HelperText>
        )}

        {/* Service Type Selection */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          サービス種類
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedServiceTypeId}
            onValueChange={setSelectedServiceTypeId}
            style={styles.picker}
          >
            <Picker.Item label="選択なし" value="" />
            {serviceTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>

        {/* Scheduled Date */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          予定日 *
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          icon="calendar"
        >
          {formatDate(scheduledDate)}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setScheduledDate(date);
            }}
          />
        )}

        {/* Time Selection */}
        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              開始時間 *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowStartTimePicker(true)}
              style={styles.timeButton}
              icon="clock-outline"
            >
              {formatTime(startTime)}
            </Button>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, time) => {
                  setShowStartTimePicker(Platform.OS === 'ios');
                  if (time) setStartTime(time);
                }}
              />
            )}
          </View>
          <View style={styles.timeColumn}>
            <Text variant="labelLarge" style={styles.sectionLabel}>
              終了時間 *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowEndTimePicker(true)}
              style={styles.timeButton}
              icon="clock-outline"
            >
              {formatTime(endTime)}
            </Button>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, time) => {
                  setShowEndTimePicker(Platform.OS === 'ios');
                  if (time) setEndTime(time);
                }}
              />
            )}
          </View>
        </View>

        {/* Notes */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          メモ
        </Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          placeholder="連絡事項などを入力..."
          style={styles.notesInput}
        />

        {/* 繰り返し設定（新規作成時のみ） */}
        {!isEditing && (
          <>
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.recurrenceTitle}>
              繰り返し設定
            </Text>

            {/* 繰り返しパターン */}
            <Text variant="labelLarge" style={styles.sectionLabel}>
              繰り返しパターン
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={recurrence.type}
                onValueChange={(value) => setRecurrence(prev => ({
                  ...prev,
                  type: value as RecurrenceType,
                  weekdays: value === 'none' ? [] : prev.weekdays,
                }))}
                style={styles.picker}
              >
                <Picker.Item label="繰り返しなし" value="none" />
                <Picker.Item label="毎日" value="daily" />
                <Picker.Item label="毎週" value="weekly" />
                <Picker.Item label="隔週" value="biweekly" />
                <Picker.Item label="毎月" value="monthly" />
              </Picker>
            </View>

            {/* 曜日選択（週次/隔週の場合） */}
            {(recurrence.type === 'weekly' || recurrence.type === 'biweekly') && (
              <>
                <Text variant="labelLarge" style={styles.sectionLabel}>
                  曜日を選択（複数可）
                </Text>
                <View style={styles.weekdayContainer}>
                  {WEEKDAYS.map((day) => (
                    <Chip
                      key={day.key}
                      selected={recurrence.weekdays.includes(day.key)}
                      onPress={() => toggleWeekday(day.key)}
                      style={styles.weekdayChip}
                      showSelectedOverlay
                    >
                      {day.label}
                    </Chip>
                  ))}
                </View>
                {recurrence.weekdays.length === 0 && (
                  <HelperText type="info">少なくとも1つの曜日を選択してください</HelperText>
                )}
              </>
            )}

            {/* 終了条件（繰り返しありの場合） */}
            {recurrence.type !== 'none' && (
              <>
                <Text variant="labelLarge" style={styles.sectionLabel}>
                  終了条件
                </Text>
                <RadioButton.Group
                  onValueChange={(value) => setRecurrence(prev => ({
                    ...prev,
                    endType: value as RecurrenceEndType,
                  }))}
                  value={recurrence.endType}
                >
                  <View style={styles.radioRow}>
                    <RadioButton.Item label="回数指定" value="count" style={styles.radioItem} />
                    <RadioButton.Item label="終了日指定" value="until" style={styles.radioItem} />
                  </View>
                </RadioButton.Group>

                {recurrence.endType === 'count' ? (
                  <>
                    <TextInput
                      mode="outlined"
                      label="繰り返し回数"
                      keyboardType="number-pad"
                      value={String(recurrence.count)}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 1;
                        setRecurrence(prev => ({
                          ...prev,
                          count: Math.max(1, Math.min(52, num)),
                        }));
                      }}
                      style={styles.countInput}
                    />
                    <HelperText type="info">1〜52回まで</HelperText>
                  </>
                ) : (
                  <>
                    <Button
                      mode="outlined"
                      onPress={() => setShowUntilPicker(true)}
                      style={styles.dateButton}
                      icon="calendar"
                    >
                      {recurrence.until ? formatDate(recurrence.until) : '終了日を選択'}
                    </Button>
                    {showUntilPicker && (
                      <DateTimePicker
                        value={recurrence.until || new Date()}
                        mode="date"
                        minimumDate={scheduledDate}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(_, date) => {
                          setShowUntilPicker(Platform.OS === 'ios');
                          if (date) {
                            setRecurrence(prev => ({ ...prev, until: date }));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving || deleting || !selectedClientId || !selectedStaffId}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          {isEditing ? '更新' : '作成'}
        </Button>

        {/* Cancel Button */}
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={saving || deleting}
          style={styles.cancelButton}
        >
          キャンセル
        </Button>
      </ScrollView>

      {/* Edit Scope Dialog */}
      <Portal>
        <Modal
          visible={showEditScopeDialog}
          onDismiss={() => !processingRecurrence && setShowEditScopeDialog(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            繰り返し予定の編集
          </Text>
          <Text variant="bodySmall" style={styles.modalDescription}>
            この予定は繰り返し予定です。編集範囲を選択してください。
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setRecurrenceEditScope(value as RecurrenceEditScope)}
            value={recurrenceEditScope}
          >
            <RadioButton.Item label="この予定のみ" value="single" />
            <RadioButton.Item label="この予定以降すべて" value="thisAndFuture" />
            <RadioButton.Item label="シリーズ全体" value="all" />
          </RadioButton.Group>
          <View style={styles.modalActions}>
            <Button
              mode="text"
              onPress={() => setShowEditScopeDialog(false)}
              disabled={processingRecurrence}
            >
              キャンセル
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setShowEditScopeDialog(false);
                performSave();
              }}
              disabled={processingRecurrence}
              loading={processingRecurrence}
            >
              続行
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Delete Scope Dialog */}
      <Portal>
        <Modal
          visible={showDeleteScopeDialog}
          onDismiss={() => !processingRecurrence && setShowDeleteScopeDialog(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleMedium" style={styles.modalTitle}>
            繰り返し予定の削除
          </Text>
          <Text variant="bodySmall" style={styles.modalDescription}>
            この予定は繰り返し予定です。削除範囲を選択してください。
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setRecurrenceDeleteScope(value as RecurrenceDeleteScope)}
            value={recurrenceDeleteScope}
          >
            <RadioButton.Item label="この予定のみ" value="single" />
            <RadioButton.Item label="シリーズ全体" value="all" />
          </RadioButton.Group>
          <View style={styles.modalActions}>
            <Button
              mode="text"
              onPress={() => setShowDeleteScopeDialog(false)}
              disabled={processingRecurrence}
            >
              キャンセル
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirmRecurrenceDelete}
              disabled={processingRecurrence}
              loading={processingRecurrence}
              buttonColor={theme.colors.error}
            >
              削除
            </Button>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#757575',
  },
  errorText: {
    fontSize: 16,
    color: '#B00020',
  },
  subText: {
    marginTop: 8,
    color: '#757575',
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 4,
    color: '#424242',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  dateButton: {
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timeColumn: {
    flex: 1,
  },
  timeButton: {
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
  saveButton: {
    marginTop: 24,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 16,
  },
  recurrenceTitle: {
    marginBottom: 8,
    color: '#424242',
  },
  weekdayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  weekdayChip: {
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioItem: {
    flex: 1,
    minWidth: 140,
  },
  countInput: {
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  modalDescription: {
    color: '#757575',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
});
