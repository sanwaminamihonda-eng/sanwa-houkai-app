import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import {
  Text,
  useTheme,
  Button,
  TextInput,
  SegmentedButtons,
  Chip,
  ActivityIndicator,
  Divider,
  HelperText,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useStaff } from '../../hooks/useStaff';
import { dataConnect, functions, httpsCallable } from '../../lib/firebase';
import {
  listClients,
  listVisitReasons,
  listServiceTypes,
  listServiceItems,
  createVisitRecord,
  ListClientsData,
  ListVisitReasonsData,
  ListServiceTypesData,
  ListServiceItemsData,
} from '@sanwa-houkai-app/dataconnect';

type Client = ListClientsData['clients'][0];
type VisitReason = ListVisitReasonsData['visitReasons'][0];
type ServiceType = ListServiceTypesData['serviceTypes'][0];
type ServiceItem = ListServiceItemsData['serviceItems'][0];

interface Vitals {
  pulse?: number;
  bloodPressureHigh?: number;
  bloodPressureLow?: number;
}

interface SelectedServices {
  [serviceTypeId: string]: string[];
}

export default function RecordInputScreen() {
  const theme = useTheme();
  const { staff, facilityId, loading: staffLoading } = useStaff();

  // Master data
  const [clients, setClients] = useState<Client[]>([]);
  const [visitReasons, setVisitReasons] = useState<VisitReason[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [serviceItemsByType, setServiceItemsByType] = useState<Record<string, ServiceItem[]>>({});
  const [loadingMasters, setLoadingMasters] = useState(true);

  // Form state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visitReasonId, setVisitReasonId] = useState<string>('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [vitals, setVitals] = useState<Vitals>({});
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  // Load master data
  useEffect(() => {
    if (!facilityId) return;

    const loadMasters = async () => {
      setLoadingMasters(true);
      try {
        const [clientsRes, reasonsRes, typesRes] = await Promise.all([
          listClients(dataConnect, { facilityId }),
          listVisitReasons(dataConnect),
          listServiceTypes(dataConnect, { facilityId }),
        ]);

        setClients(clientsRes.data.clients);
        setVisitReasons(reasonsRes.data.visitReasons);
        setServiceTypes(typesRes.data.serviceTypes);

        // Default visit reason
        if (reasonsRes.data.visitReasons.length > 0) {
          setVisitReasonId(reasonsRes.data.visitReasons[0].id);
        }

        // Load service items for each type
        const itemsPromises = typesRes.data.serviceTypes.map((type) =>
          listServiceItems(dataConnect, { serviceTypeId: type.id })
        );
        const itemsResults = await Promise.all(itemsPromises);
        const itemsMap: Record<string, ServiceItem[]> = {};
        typesRes.data.serviceTypes.forEach((type, idx) => {
          itemsMap[type.id] = itemsResults[idx].data.serviceItems;
        });
        setServiceItemsByType(itemsMap);
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

  const toggleServiceItem = useCallback((typeId: string, itemId: string) => {
    setSelectedServices((prev) => {
      const current = prev[typeId] || [];
      if (current.includes(itemId)) {
        return { ...prev, [typeId]: current.filter((id) => id !== itemId) };
      }
      return { ...prev, [typeId]: [...current, itemId] };
    });
  }, []);

  const buildServicesPayload = () => {
    const services: { typeId: string; typeName: string; items: { id: string; name: string }[] }[] = [];
    serviceTypes.forEach((type) => {
      const selectedItemIds = selectedServices[type.id] || [];
      if (selectedItemIds.length > 0) {
        const items = serviceItemsByType[type.id]
          ?.filter((item) => selectedItemIds.includes(item.id))
          .map((item) => ({ id: item.id, name: item.name }));
        if (items && items.length > 0) {
          services.push({ typeId: type.id, typeName: type.name, items });
        }
      }
    });
    return services;
  };

  const handleGenerateNotes = async () => {
    if (!selectedClientId) {
      Alert.alert('入力エラー', '利用者を選択してください');
      return;
    }

    const services = buildServicesPayload();
    if (services.length === 0) {
      Alert.alert('入力エラー', 'サービス内容を1つ以上選択してください');
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientId);
    const selectedReason = visitReasons.find((r) => r.id === visitReasonId);

    setGeneratingNotes(true);
    try {
      const generateVisitNotes = httpsCallable<
        {
          clientName: string;
          visitDate: string;
          visitReason?: string;
          services: typeof services;
          vitals?: Vitals;
        },
        { notes: string; aiGenerated: boolean }
      >(functions, 'generateVisitNotes');

      const result = await generateVisitNotes({
        clientName: selectedClient?.name || '',
        visitDate: formatDate(visitDate),
        visitReason: selectedReason?.name,
        services,
        vitals: Object.keys(vitals).length > 0 ? vitals : undefined,
      });

      setNotes(result.data.notes);
      setAiGenerated(true);
      Alert.alert('完了', 'AIが特記事項を生成しました');
    } catch (err) {
      console.error('AI generation error:', err);
      Alert.alert('エラー', 'AI生成に失敗しました。手動で入力してください。');
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleSave = async () => {
    if (!staff || !facilityId) {
      Alert.alert('エラー', 'スタッフ情報が取得できません');
      return;
    }
    if (!selectedClientId) {
      Alert.alert('入力エラー', '利用者を選択してください');
      return;
    }

    const services = buildServicesPayload();
    if (services.length === 0) {
      Alert.alert('入力エラー', 'サービス内容を1つ以上選択してください');
      return;
    }

    setSaving(true);
    try {
      await createVisitRecord(dataConnect, {
        clientId: selectedClientId,
        staffId: staff.id,
        visitDate: formatDateForApi(visitDate),
        visitReasonId: visitReasonId || undefined,
        startTime: formatTimeForApi(startTime),
        endTime: formatTimeForApi(endTime),
        vitals: Object.keys(vitals).length > 0 ? vitals : undefined,
        services,
        notes: notes || undefined,
        aiGenerated: aiGenerated || undefined,
      });

      Alert.alert('完了', '記録を保存しました', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedClientId('');
            setVitals({});
            setSelectedServices({});
            setNotes('');
            setAiGenerated(false);
          },
        },
      ]);
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (staffLoading || loadingMasters) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!staff || !facilityId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>スタッフ情報が見つかりません</Text>
          <Text style={styles.subText}>管理者にお問い合わせください</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

        {/* Visit Date */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          訪問日 *
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          {formatDate(visitDate)}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={visitDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setVisitDate(date);
            }}
          />
        )}

        {/* Visit Reason */}
        <Text variant="labelLarge" style={styles.sectionLabel}>
          訪問理由
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={visitReasonId}
            onValueChange={setVisitReasonId}
            style={styles.picker}
          >
            {visitReasons.map((reason) => (
              <Picker.Item key={reason.id} label={reason.name} value={reason.id} />
            ))}
          </Picker>
        </View>

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

        <Divider style={styles.divider} />

        {/* Vitals */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          バイタル
        </Text>
        <View style={styles.vitalsRow}>
          <TextInput
            label="脈拍"
            value={vitals.pulse?.toString() || ''}
            onChangeText={(v) => setVitals((prev) => ({ ...prev, pulse: v ? parseInt(v, 10) : undefined }))}
            keyboardType="numeric"
            style={styles.vitalInput}
            right={<TextInput.Affix text="bpm" />}
          />
          <TextInput
            label="血圧（高）"
            value={vitals.bloodPressureHigh?.toString() || ''}
            onChangeText={(v) =>
              setVitals((prev) => ({ ...prev, bloodPressureHigh: v ? parseInt(v, 10) : undefined }))
            }
            keyboardType="numeric"
            style={styles.vitalInput}
            right={<TextInput.Affix text="mmHg" />}
          />
          <TextInput
            label="血圧（低）"
            value={vitals.bloodPressureLow?.toString() || ''}
            onChangeText={(v) =>
              setVitals((prev) => ({ ...prev, bloodPressureLow: v ? parseInt(v, 10) : undefined }))
            }
            keyboardType="numeric"
            style={styles.vitalInput}
            right={<TextInput.Affix text="mmHg" />}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Service Content */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          サービス内容 *
        </Text>
        {serviceTypes.map((type) => (
          <View key={type.id} style={styles.serviceTypeSection}>
            <Text variant="labelLarge" style={styles.serviceTypeLabel}>
              {type.name}
            </Text>
            <View style={styles.chipContainer}>
              {serviceItemsByType[type.id]?.map((item) => {
                const isSelected = selectedServices[type.id]?.includes(item.id);
                return (
                  <Chip
                    key={item.id}
                    selected={isSelected}
                    onPress={() => toggleServiceItem(type.id, item.id)}
                    style={styles.chip}
                    showSelectedCheck
                  >
                    {item.name}
                  </Chip>
                );
              })}
            </View>
          </View>
        ))}

        <Divider style={styles.divider} />

        {/* Notes */}
        <View style={styles.notesTitleRow}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            特記事項
          </Text>
          <Button
            mode="outlined"
            onPress={handleGenerateNotes}
            loading={generatingNotes}
            disabled={generatingNotes || !selectedClientId}
            compact
            icon="auto-fix"
          >
            AI生成
          </Button>
        </View>
        {aiGenerated && (
          <Text variant="bodySmall" style={styles.aiGeneratedLabel}>
            AIにより生成されました（編集可能）
          </Text>
        )}
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={(text) => {
            setNotes(text);
            if (aiGenerated && text !== notes) {
              // If user edits AI-generated text, keep the flag but allow editing
            }
          }}
          placeholder="利用者の状態や気づいたことを記入..."
          style={styles.notesInput}
        />

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving || !selectedClientId}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          保存
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
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '600',
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
  divider: {
    marginVertical: 16,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  serviceTypeSection: {
    marginBottom: 16,
  },
  serviceTypeLabel: {
    marginBottom: 8,
    color: '#616161',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  notesTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiGeneratedLabel: {
    color: '#2196F3',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  saveButton: {
    marginTop: 24,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
});
