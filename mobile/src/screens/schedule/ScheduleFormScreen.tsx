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
} from 'react-native-paper';
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
  ListClientsData,
  ListServiceTypesData,
  ListStaffData,
} from '@sanwa-houkai-app/dataconnect';
import { ScheduleStackParamList } from '../../navigation/RootNavigator';

type Client = ListClientsData['clients'][0];
type ServiceType = ListServiceTypesData['serviceTypes'][0];
type Staff = ListStaffData['staffs'][0];

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
    return true;
  };

  const handleSave = async () => {
    if (!facilityId) {
      Alert.alert('エラー', '施設情報が取得できません');
      return;
    }
    if (!validateForm()) return;

    setSaving(true);
    try {
      let scheduleId: string;

      if (isEditing && scheduleData) {
        await updateSchedule(dataConnect, {
          id: scheduleData.id,
          clientId: selectedClientId,
          staffId: selectedStaffId,
          serviceTypeId: selectedServiceTypeId || undefined,
          scheduledDate: formatDateForApi(scheduledDate),
          startTime: formatTimeForApi(startTime),
          endTime: formatTimeForApi(endTime),
          notes: notes || undefined,
        });
        scheduleId = scheduleData.id;

        // Notify other users about the update
        await notifyScheduleUpdate(scheduleId, 'update');

        Alert.alert('完了', '予定を更新しました', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        const result = await createSchedule(dataConnect, {
          facilityId,
          clientId: selectedClientId,
          staffId: selectedStaffId,
          serviceTypeId: selectedServiceTypeId || undefined,
          scheduledDate: formatDateForApi(scheduledDate),
          startTime: formatTimeForApi(startTime),
          endTime: formatTimeForApi(endTime),
          notes: notes || undefined,
        });
        scheduleId = result.data.schedule_insert.id;

        // Notify other users about the creation
        await notifyScheduleUpdate(scheduleId, 'create');

        Alert.alert('完了', '予定を作成しました', [
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

    const scheduleId = scheduleData.id;

    Alert.alert('確認', 'この予定を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteSchedule(dataConnect, { id: scheduleId });

            // Notify other users about the deletion
            await notifyScheduleUpdate(scheduleId, 'delete');

            Alert.alert('完了', '予定を削除しました', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch (err) {
            console.error('Delete error:', err);
            Alert.alert('エラー', '削除に失敗しました');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
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
});
