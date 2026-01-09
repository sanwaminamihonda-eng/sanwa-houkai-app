import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Chip,
  ActivityIndicator,
  IconButton,
  Button,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { dataConnect } from '../../lib/firebase';
import { getClient, GetClientData } from '@sanwa-houkai-app/dataconnect';
import { ClientStackParamList } from '../../navigation/RootNavigator';

type Client = NonNullable<GetClientData['client']>;

type RouteProps = RouteProp<ClientStackParamList, 'ClientDetail'>;
type NavigationProp = NativeStackNavigationProp<ClientStackParamList, 'ClientDetail'>;

export default function ClientDetailScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { clientId } = route.params;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const result = await getClient(dataConnect, { id: clientId });
        if (result.data.client) {
          setClient(result.data.client);
        } else {
          setError('利用者が見つかりません');
        }
      } catch (err) {
        console.error('Failed to load client:', err);
        setError('利用者情報の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handlePhonePress = (phone: string | null | undefined, label: string) => {
    if (!phone) {
      Alert.alert('電話番号なし', `${label}の電話番号は登録されていません`);
      return;
    }

    Alert.alert(
      '電話をかける',
      `${phone} に電話をかけますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '電話する', onPress: () => Linking.openURL(`tel:${phone}`) },
      ]
    );
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const calculateAge = (birthDate: string | null | undefined): string => {
    if (!birthDate) return '-';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age}歳`;
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

  if (error || !client) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleLarge" style={styles.headerTitle}>
            利用者詳細
          </Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || '利用者が見つかりません'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          利用者詳細
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Basic Info */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.nameSection}>
              <View style={styles.nameContainer}>
                <Text variant="headlineSmall" style={styles.clientName}>
                  {client.name}
                </Text>
                {client.nameKana && (
                  <Text variant="bodyMedium" style={styles.nameKana}>
                    {client.nameKana}
                  </Text>
                )}
              </View>
              {!client.isActive && (
                <Chip style={styles.inactiveChip} textStyle={styles.inactiveChipText}>
                  非アクティブ
                </Chip>
              )}
            </View>

            <View style={styles.chipRow}>
              {client.careLevel?.name && (
                <Chip
                  style={[styles.careLevelChip, { backgroundColor: theme.colors.secondaryContainer }]}
                  textStyle={styles.chipText}
                >
                  {client.careLevel.name}
                </Chip>
              )}
              {client.gender && (
                <Chip style={styles.genderChip} textStyle={styles.chipText}>
                  {client.gender}
                </Chip>
              )}
              {client.birthDate && (
                <Chip style={styles.ageChip} textStyle={styles.chipText}>
                  {calculateAge(client.birthDate)}
                </Chip>
              )}
            </View>

            {client.birthDate && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  生年月日
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {formatDate(client.birthDate)}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Contact Info */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              連絡先
            </Text>

            {(client.addressPrefecture || client.addressCity) && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  住所
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {[client.addressPrefecture, client.addressCity].filter(Boolean).join(' ')}
                </Text>
              </View>
            )}

            <View style={styles.phoneRow}>
              <View style={styles.phoneInfo}>
                <Text variant="bodyMedium" style={styles.label}>
                  電話番号
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {client.phone || '-'}
                </Text>
              </View>
              <Button
                mode="outlined"
                icon="phone"
                onPress={() => handlePhonePress(client.phone, '利用者')}
                disabled={!client.phone}
                compact
              >
                発信
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Emergency Contact */}
        {(client.emergencyName || client.emergencyPhone) && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                緊急連絡先
              </Text>

              {client.emergencyName && (
                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.label}>
                    氏名
                  </Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {client.emergencyName}
                    {client.emergencyRelation && ` (${client.emergencyRelation})`}
                  </Text>
                </View>
              )}

              <View style={styles.phoneRow}>
                <View style={styles.phoneInfo}>
                  <Text variant="bodyMedium" style={styles.label}>
                    電話番号
                  </Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {client.emergencyPhone || '-'}
                  </Text>
                </View>
                <Button
                  mode="outlined"
                  icon="phone"
                  onPress={() => handlePhonePress(client.emergencyPhone, '緊急連絡先')}
                  disabled={!client.emergencyPhone}
                  compact
                  buttonColor="#FFF3E0"
                >
                  発信
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Care Info */}
        {(client.careManager || client.careOffice) && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                ケア情報
              </Text>

              {client.careManager && (
                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.label}>
                    ケアマネ
                  </Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {client.careManager}
                  </Text>
                </View>
              )}

              {client.careOffice && (
                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.label}>
                    事業所
                  </Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {client.careOffice}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Assessment */}
        {(!!client.assessment || client.lastAssessmentDate) && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                アセスメント
              </Text>

              {client.lastAssessmentDate && (
                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={styles.label}>
                    最終評価日
                  </Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {formatDate(client.lastAssessmentDate)}
                  </Text>
                </View>
              )}

              {!!client.assessment && (
                <>
                  <Divider style={styles.divider} />
                  <Text variant="bodyMedium" style={styles.assessmentText}>
                    {typeof client.assessment === 'string' ? client.assessment : JSON.stringify(client.assessment)}
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Regular Services */}
        {!!client.regularServices && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                定期サービス
              </Text>
              <Text variant="bodyMedium" style={styles.servicesText}>
                {typeof client.regularServices === 'string' ? client.regularServices : JSON.stringify(client.regularServices)}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Notes */}
        {client.notes && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                備考
              </Text>
              <Text variant="bodyMedium" style={styles.notesText}>
                {client.notes}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={styles.metadataText}>
            登録: {new Date(client.createdAt).toLocaleString('ja-JP')}
          </Text>
          {client.updatedAt !== client.createdAt && (
            <Text variant="bodySmall" style={styles.metadataText}>
              更新: {new Date(client.updatedAt).toLocaleString('ja-JP')}
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
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  inactiveChipText: {
    color: '#C62828',
    fontSize: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  careLevelChip: {
    height: 28,
  },
  genderChip: {
    backgroundColor: '#E0E0E0',
    height: 28,
  },
  ageChip: {
    backgroundColor: '#E8F5E9',
    height: 28,
  },
  chipText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  assessmentText: {
    color: '#424242',
    lineHeight: 22,
  },
  servicesText: {
    color: '#424242',
    lineHeight: 22,
  },
  notesText: {
    color: '#424242',
    lineHeight: 22,
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
