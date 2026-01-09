import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Chip,
  ActivityIndicator,
  Divider,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { dataConnect } from '../../lib/firebase';
import { getVisitRecord, GetVisitRecordData } from '@sanwa-houkai-app/dataconnect';
import { RecordStackParamList } from './RecordHistoryScreen';

type VisitRecord = NonNullable<GetVisitRecordData['visitRecord']>;

interface Service {
  typeId: string;
  typeName: string;
  items: { id: string; name: string }[];
}

interface Vitals {
  pulse?: number;
  bloodPressureHigh?: number;
  bloodPressureLow?: number;
}

type RouteProps = RouteProp<RecordStackParamList, 'RecordDetail'>;
type NavigationProp = NativeStackNavigationProp<RecordStackParamList, 'RecordDetail'>;

export default function RecordDetailScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { recordId } = route.params;

  const [record, setRecord] = useState<VisitRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const result = await getVisitRecord(dataConnect, { id: recordId });
        if (result.data.visitRecord) {
          setRecord(result.data.visitRecord);
        } else {
          setError('記録が見つかりません');
        }
      } catch (err) {
        console.error('Failed to load record:', err);
        setError('記録の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${weekdays[date.getDay()]})`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
  };

  const parseServices = (servicesData: unknown): Service[] => {
    if (!servicesData) return [];
    try {
      if (typeof servicesData === 'string') {
        return JSON.parse(servicesData);
      }
      return servicesData as Service[];
    } catch {
      return [];
    }
  };

  const parseVitals = (vitalsData: unknown): Vitals | null => {
    if (!vitalsData) return null;
    try {
      if (typeof vitalsData === 'string') {
        return JSON.parse(vitalsData);
      }
      return vitalsData as Vitals;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !record) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleLarge" style={styles.headerTitle}>
            記録詳細
          </Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || '記録が見つかりません'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const services = parseServices(record.services);
  const vitals = parseVitals(record.vitals);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          記録詳細
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Basic Info */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.clientName}>
              {record.client.name}
            </Text>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                訪問日
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {formatDate(record.visitDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                時間
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {formatTimeRange(record.startTime, record.endTime)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                担当
              </Text>
              <Chip icon="account" compact>
                {record.staff.name}
              </Chip>
            </View>
            {record.visitReason && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  訪問理由
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {record.visitReason.name}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Vitals */}
        {vitals && (vitals.pulse || vitals.bloodPressureHigh || vitals.bloodPressureLow) && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                バイタル
              </Text>
              <View style={styles.vitalsContainer}>
                {vitals.pulse && (
                  <View style={styles.vitalItem}>
                    <Text variant="bodyMedium" style={styles.vitalLabel}>
                      脈拍
                    </Text>
                    <Text variant="headlineSmall" style={styles.vitalValue}>
                      {vitals.pulse}
                    </Text>
                    <Text variant="bodySmall" style={styles.vitalUnit}>
                      bpm
                    </Text>
                  </View>
                )}
                {(vitals.bloodPressureHigh || vitals.bloodPressureLow) && (
                  <View style={styles.vitalItem}>
                    <Text variant="bodyMedium" style={styles.vitalLabel}>
                      血圧
                    </Text>
                    <Text variant="headlineSmall" style={styles.vitalValue}>
                      {vitals.bloodPressureHigh || '-'}/{vitals.bloodPressureLow || '-'}
                    </Text>
                    <Text variant="bodySmall" style={styles.vitalUnit}>
                      mmHg
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Services */}
        {services.length > 0 && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                サービス内容
              </Text>
              {services.map((service, index) => (
                <View key={service.typeId} style={styles.serviceSection}>
                  <Text variant="labelLarge" style={styles.serviceTypeLabel}>
                    {service.typeName}
                  </Text>
                  <View style={styles.chipContainer}>
                    {service.items.map((item) => (
                      <Chip
                        key={item.id}
                        style={styles.serviceChip}
                        textStyle={styles.serviceChipText}
                      >
                        {item.name}
                      </Chip>
                    ))}
                  </View>
                  {index < services.length - 1 && <Divider style={styles.serviceDivider} />}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Notes */}
        {record.notes && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                特記事項
              </Text>
              <Text variant="bodyMedium" style={styles.notesText}>
                {record.notes}
              </Text>
              {record.aiGenerated && (
                <Chip icon="robot" style={styles.aiChip} compact>
                  AI生成
                </Chip>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Satisfaction */}
        {record.satisfaction && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                満足度
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {record.satisfaction}
              </Text>
              {record.satisfactionReason && (
                <Text variant="bodyMedium" style={styles.reasonText}>
                  {record.satisfactionReason}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Condition Change */}
        {record.conditionChange && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                状態の変化
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {record.conditionChange}
              </Text>
              {record.conditionChangeDetail && (
                <Text variant="bodyMedium" style={styles.reasonText}>
                  {record.conditionChangeDetail}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Service Change */}
        {record.serviceChangeNeeded && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                サービス変更の必要性
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {record.serviceChangeNeeded}
              </Text>
              {record.serviceChangeDetail && (
                <Text variant="bodyMedium" style={styles.reasonText}>
                  {record.serviceChangeDetail}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={styles.metadataText}>
            作成: {new Date(record.createdAt).toLocaleString('ja-JP')}
          </Text>
          {record.updatedAt !== record.createdAt && (
            <Text variant="bodySmall" style={styles.metadataText}>
              更新: {new Date(record.updatedAt).toLocaleString('ja-JP')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontWeight: '600',
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
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  clientName: {
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 80,
    color: '#757575',
  },
  value: {
    flex: 1,
    color: '#212121',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  vitalsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  vitalItem: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  vitalLabel: {
    color: '#757575',
    marginBottom: 4,
  },
  vitalValue: {
    fontWeight: '600',
    color: '#212121',
  },
  vitalUnit: {
    color: '#9E9E9E',
    marginTop: 2,
  },
  serviceSection: {
    marginBottom: 8,
  },
  serviceTypeLabel: {
    color: '#616161',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: '#E3F2FD',
  },
  serviceChipText: {
    fontSize: 13,
  },
  serviceDivider: {
    marginTop: 12,
    marginBottom: 8,
  },
  notesText: {
    color: '#424242',
    lineHeight: 22,
  },
  aiChip: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: '#F3E5F5',
  },
  reasonText: {
    marginTop: 8,
    color: '#616161',
  },
  metadata: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  metadataText: {
    color: '#9E9E9E',
    marginBottom: 4,
  },
});
