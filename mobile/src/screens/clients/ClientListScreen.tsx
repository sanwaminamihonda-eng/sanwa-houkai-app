import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Linking, Alert } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Chip,
  ActivityIndicator,
  Searchbar,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStaff } from '../../hooks/useStaff';
import { dataConnect } from '../../lib/firebase';
import {
  listClients,
  ListClientsData,
} from '@sanwa-houkai-app/dataconnect';
import { ClientStackParamList } from '../../navigation/RootNavigator';

type Client = ListClientsData['clients'][0];

type NavigationProp = NativeStackNavigationProp<ClientStackParamList, 'ClientList'>;

export default function ClientListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { facilityId, loading: staffLoading } = useStaff();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    if (!facilityId) return;

    try {
      const res = await listClients(dataConnect, { facilityId });
      setClients(res.data.clients);
      setError(null);
    } catch (err) {
      console.error('Failed to load clients:', err);
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

  const handleClientPress = (client: Client) => {
    navigation.navigate('ClientDetail', { clientId: client.id });
  };

  const handlePhonePress = (phone: string | null | undefined, clientName: string) => {
    if (!phone) {
      Alert.alert('電話番号なし', 'この利用者の電話番号は登録されていません');
      return;
    }

    Alert.alert(
      '電話をかける',
      `${clientName}さんに電話をかけますか？\n${phone}`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '電話する', onPress: () => Linking.openURL(`tel:${phone}`) },
      ]
    );
  };

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      (client.nameKana && client.nameKana.toLowerCase().includes(query))
    );
  });

  const getAddress = (client: Client): string => {
    const parts = [client.addressPrefecture, client.addressCity].filter(Boolean);
    return parts.join(' ');
  };

  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity onPress={() => handleClientPress(item)} activeOpacity={0.7}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.nameContainer}>
              <Text variant="titleLarge" style={styles.clientName}>
                {item.name}
              </Text>
              {item.nameKana && (
                <Text variant="bodySmall" style={styles.nameKana}>
                  {item.nameKana}
                </Text>
              )}
            </View>
            <IconButton
              icon="phone"
              size={24}
              iconColor={item.phone ? theme.colors.primary : '#BDBDBD'}
              onPress={(e) => {
                e.stopPropagation();
                handlePhonePress(item.phone, item.name);
              }}
            />
          </View>

          <View style={styles.infoRow}>
            {item.careLevel?.name && (
              <Chip
                compact
                style={[styles.careLevelChip, { backgroundColor: theme.colors.secondaryContainer }]}
                textStyle={styles.chipText}
              >
                {item.careLevel.name}
              </Chip>
            )}
            {item.gender && (
              <Chip compact style={styles.genderChip} textStyle={styles.chipText}>
                {item.gender}
              </Chip>
            )}
          </View>

          {getAddress(item) && (
            <View style={styles.addressRow}>
              <Text variant="bodyMedium" style={styles.addressText}>
                📍 {getAddress(item)}
              </Text>
            </View>
          )}
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
          利用者
        </Text>
        <Text variant="bodyMedium" style={styles.countText}>
          {filteredClients.length}名
        </Text>
      </View>

      <Searchbar
        placeholder="名前で検索..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />

      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? '該当する利用者が見つかりません' : '利用者が登録されていません'}
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
  countText: {
    color: '#757575',
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  searchInput: {
    fontSize: 14,
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
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
  },
  clientName: {
    fontWeight: '600',
  },
  nameKana: {
    color: '#757575',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  careLevelChip: {
    height: 28,
  },
  genderChip: {
    backgroundColor: '#E0E0E0',
    height: 28,
  },
  chipText: {
    fontSize: 12,
  },
  addressRow: {
    marginTop: 8,
  },
  addressText: {
    color: '#616161',
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
});
