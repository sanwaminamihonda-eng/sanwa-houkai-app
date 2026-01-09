import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Chip,
  ActivityIndicator,
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
  listReportsByFacility,
  listClients,
  ListReportsByFacilityData,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';
import { ReportsStackParamList } from '../../navigation/RootNavigator';

type Report = ListReportsByFacilityData['reports'][0];
type Client = ListClientsData['clients'][0];

type NavigationProp = NativeStackNavigationProp<ReportsStackParamList, 'ReportsList'>;

export default function ReportsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { facilityId, loading: staffLoading } = useStaff();

  const [reports, setReports] = useState<Report[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filterClientId, setFilterClientId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const [reportsRes, clientsRes] = await Promise.all([
        listReportsByFacility(dataConnect, { facilityId }),
        listClients(dataConnect, { facilityId }),
      ]);

      setReports(reportsRes.data.reports);
      setClients(clientsRes.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load reports:', err);
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

  const handleReportPress = (report: Report) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };

  const formatYearMonth = (year: number, month: number) => {
    return `${year}年${String(month).padStart(2, '0')}月`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const filteredReports = filterClientId
    ? reports.filter((r) => r.client.id === filterClientId)
    : reports;

  const selectedClientName = filterClientId
    ? clients.find((c) => c.id === filterClientId)?.name || '不明'
    : null;

  const renderReport = ({ item }: { item: Report }) => {
    return (
      <TouchableOpacity onPress={() => handleReportPress(item)} activeOpacity={0.7}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleLarge" style={styles.yearMonth}>
                {formatYearMonth(item.targetYear, item.targetMonth)}
              </Text>
              <View style={styles.badges}>
                {item.aiGenerated && (
                  <Chip
                    icon="robot"
                    compact
                    textStyle={styles.chipText}
                    style={[styles.aiChip, { backgroundColor: theme.colors.tertiaryContainer }]}
                  >
                    AI
                  </Chip>
                )}
                {item.pdfGenerated && item.pdfUrl && (
                  <Chip icon="file-pdf-box" compact textStyle={styles.chipText}>
                    PDF
                  </Chip>
                )}
              </View>
            </View>
            <Text variant="titleMedium" style={styles.clientName}>
              {item.client.name}
            </Text>
            {item.summary && (
              <Text variant="bodyMedium" style={styles.summaryText} numberOfLines={2}>
                {item.summary}
              </Text>
            )}
            <View style={styles.cardFooter}>
              <Text variant="bodySmall" style={styles.dateText}>
                作成日: {formatDate(item.createdAt)}
              </Text>
              <Chip icon="account" compact textStyle={styles.chipText}>
                {item.staff.name}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

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
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            実施報告書
          </Text>
        </View>
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
        data={filteredReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filterClientId
                ? 'この利用者の報告書はありません'
                : '報告書がありません'}
            </Text>
            <Text style={styles.emptySubText}>
              Web管理画面から報告書を作成できます
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
    paddingRight: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  yearMonth: {
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  aiChip: {},
  clientName: {
    marginBottom: 8,
  },
  summaryText: {
    color: '#757575',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#9E9E9E',
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
