import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Chip,
  ActivityIndicator,
  Searchbar,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStaff } from '../../hooks/useStaff';
import { dataConnect } from '../../lib/firebase';
import {
  listVisitRecordsByDateRange,
  listClients,
  ListVisitRecordsByDateRangeData,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';

type VisitRecord = ListVisitRecordsByDateRangeData['visitRecords'][0];
type Client = ListClientsData['clients'][0];

interface Service {
  typeId: string;
  typeName: string;
  items: { id: string; name: string }[];
}

export type RecordStackParamList = {
  RecordHistory: undefined;
  RecordDetail: { recordId: string };
};

type NavigationProp = NativeStackNavigationProp<RecordStackParamList, 'RecordHistory'>;

const DAYS_TO_LOAD = 30;

export default function RecordHistoryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { facilityId, loading: staffLoading } = useStaff();

  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filterClientId, setFilterClientId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - DAYS_TO_LOAD);

      const [recordsRes, clientsRes] = await Promise.all([
        listVisitRecordsByDateRange(dataConnect, {
          facilityId,
          startDate: formatDateForApi(startDate),
          endDate: formatDateForApi(endDate),
        }),
        listClients(dataConnect, { facilityId }),
      ]);

      setRecords(recordsRes.data.visitRecords);
      setClients(clientsRes.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load records:', err);
      setError('データの読み込みに失敗しました');
    }
  }, [facilityId]);

  useEffect(() => {
    if (!facilityId) return;

    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    loadData();
  }, [facilityId, fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleRecordPress = (record: VisitRecord) => {
    navigation.navigate('RecordDetail', { recordId: record.id });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start.slice(0, 5)}-${end.slice(0, 5)}`;
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

  const getServiceSummary = (record: VisitRecord): string => {
    const services = parseServices(record.services);
    if (services.length === 0) return '';

    return services
      .map((s) => {
        const itemNames = s.items.map((i) => i.name).join('、');
        return `${s.typeName}: ${itemNames}`;
      })
      .join(' / ');
  };

  const filteredRecords = filterClientId
    ? records.filter((r) => r.client.id === filterClientId)
    : records;

  const selectedClientName = filterClientId
    ? clients.find((c) => c.id === filterClientId)?.name || '不明'
    : null;

  const renderRecord = ({ item }: { item: VisitRecord }) => (
    <TouchableOpacity onPress={() => handleRecordPress(item)} activeOpacity={0.7}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.dateText}>
              {formatDate(item.visitDate)} {formatTimeRange(item.startTime, item.endTime)}
            </Text>
          </View>
          <Text variant="titleLarge" style={styles.clientName}>
            {item.client.name}
          </Text>
          <Text variant="bodyMedium" style={styles.serviceText} numberOfLines={2}>
            {getServiceSummary(item)}
          </Text>
          <View style={styles.cardFooter}>
            <Chip icon="account" compact textStyle={styles.chipText}>
              {item.staff.name}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (staffLoading || loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!facilityId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>スタッフ情報が見つかりません</Text>
          <Text style={styles.subText}>管理者にお問い合わせください</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          履歴
        </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              size={24}
              onPress={() => setMenuVisible(true)}
              style={filterClientId ? { backgroundColor: theme.colors.primaryContainer } : undefined}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setFilterClientId(null);
              setMenuVisible(false);
            }}
            title="すべて表示"
            leadingIcon={filterClientId === null ? 'check' : undefined}
          />
          <Divider />
          {clients.map((client) => (
            <Menu.Item
              key={client.id}
              onPress={() => {
                setFilterClientId(client.id);
                setMenuVisible(false);
              }}
              title={client.name}
              leadingIcon={filterClientId === client.id ? 'check' : undefined}
            />
          ))}
        </Menu>
      </View>

      {filterClientId && (
        <View style={styles.filterChipContainer}>
          <Chip
            icon="account"
            onClose={() => setFilterClientId(null)}
            style={styles.filterChip}
          >
            {selectedClientName}
          </Chip>
        </View>
      )}

      <FlatList
        data={filteredRecords}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filterClientId
                ? 'この利用者の記録はありません'
                : '記録がありません'}
            </Text>
            <Text style={styles.emptySubText}>
              直近{DAYS_TO_LOAD}日間の記録を表示しています
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontWeight: '600',
  },
  filterChipContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    alignSelf: 'flex-start',
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
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    color: '#616161',
  },
  clientName: {
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceText: {
    color: '#757575',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9E9E9E',
  },
});
