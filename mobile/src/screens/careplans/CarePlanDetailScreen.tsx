import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Chip,
  ActivityIndicator,
  Divider,
  IconButton,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { dataConnect } from '../../lib/firebase';
import { getCarePlan, GetCarePlanData } from '@sanwa-houkai-app/dataconnect';
import { CarePlansStackParamList } from '../../navigation/RootNavigator';

type CarePlan = NonNullable<GetCarePlanData['carePlan']>;

interface Goal {
  content: string;
  startDate?: string | null;
  endDate?: string | null;
}

type RouteProps = RouteProp<CarePlansStackParamList, 'CarePlanDetail'>;
type NavigationProp = NativeStackNavigationProp<CarePlansStackParamList, 'CarePlanDetail'>;

export default function CarePlanDetailScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { carePlanId } = route.params;

  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarePlan = async () => {
      try {
        const result = await getCarePlan(dataConnect, { id: carePlanId });
        if (result.data.carePlan) {
          setCarePlan(result.data.carePlan);
        } else {
          setError('計画書が見つかりません');
        }
      } catch (err) {
        console.error('Failed to load care plan:', err);
        setError('計画書の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCarePlan();
  }, [carePlanId]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleOpenPdf = async () => {
    if (!carePlan?.pdfUrl) {
      Alert.alert('エラー', 'PDFが見つかりません');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(carePlan.pdfUrl);
      if (supported) {
        await Linking.openURL(carePlan.pdfUrl);
      } else {
        Alert.alert('エラー', 'PDFを開けません');
      }
    } catch (err) {
      console.error('Failed to open PDF:', err);
      Alert.alert('エラー', 'PDFを開けませんでした');
    }
  };

  const parseGoals = (goalsData: unknown): Goal[] => {
    if (!goalsData) return [];
    try {
      if (typeof goalsData === 'string') {
        return JSON.parse(goalsData);
      }
      return goalsData as Goal[];
    } catch {
      return [];
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

  if (error || !carePlan) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleLarge" style={styles.headerTitle}>
            計画書詳細
          </Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || '計画書が見つかりません'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const longTermGoals = parseGoals(carePlan.longTermGoals);
  const shortTermGoals = parseGoals(carePlan.shortTermGoals);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          計画書詳細
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Client Info */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.clientName}>
              {carePlan.client.name}
            </Text>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                作成日
              </Text>
              <Text variant="bodyLarge" style={styles.value}>
                {formatDate(carePlan.createdAt)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                担当者
              </Text>
              <Chip icon="account" compact>
                {carePlan.staff.name}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* PDF Download */}
        {carePlan.pdfUrl && (
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={handleOpenPdf}
            style={styles.pdfButton}
          >
            PDFを開く
          </Button>
        )}

        {/* Current Situation */}
        {carePlan.currentSituation && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                利用者の生活現状
              </Text>
              <Text variant="bodyMedium" style={styles.contentText}>
                {carePlan.currentSituation}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Family Wishes */}
        {carePlan.familyWishes && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                利用者及び家族の意向・希望
              </Text>
              <Text variant="bodyMedium" style={styles.contentText}>
                {carePlan.familyWishes}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Main Support */}
        {carePlan.mainSupport && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                主な支援内容
              </Text>
              <Text variant="bodyMedium" style={styles.contentText}>
                {carePlan.mainSupport}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Long Term Goals */}
        {longTermGoals.length > 0 && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                長期目標
              </Text>
              {longTermGoals.map((goal, index) => (
                goal.content && (
                  <View key={`long-${index}`} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <Chip
                        compact
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                        textStyle={styles.goalNumber}
                      >
                        {index + 1}
                      </Chip>
                      {(goal.startDate || goal.endDate) && (
                        <Text variant="bodySmall" style={styles.goalPeriod}>
                          {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                        </Text>
                      )}
                    </View>
                    <Text variant="bodyMedium" style={styles.goalContent}>
                      {goal.content}
                    </Text>
                    {index < longTermGoals.length - 1 && <Divider style={styles.goalDivider} />}
                  </View>
                )
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Short Term Goals */}
        {shortTermGoals.length > 0 && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                短期目標
              </Text>
              {shortTermGoals.map((goal, index) => (
                goal.content && (
                  <View key={`short-${index}`} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <Chip
                        compact
                        style={{ backgroundColor: theme.colors.secondaryContainer }}
                        textStyle={styles.goalNumber}
                      >
                        {index + 1}
                      </Chip>
                      {(goal.startDate || goal.endDate) && (
                        <Text variant="bodySmall" style={styles.goalPeriod}>
                          {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                        </Text>
                      )}
                    </View>
                    <Text variant="bodyMedium" style={styles.goalContent}>
                      {goal.content}
                    </Text>
                    {index < shortTermGoals.length - 1 && <Divider style={styles.goalDivider} />}
                  </View>
                )
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={styles.metadataText}>
            作成: {new Date(carePlan.createdAt).toLocaleString('ja-JP')}
          </Text>
          {carePlan.updatedAt !== carePlan.createdAt && (
            <Text variant="bodySmall" style={styles.metadataText}>
              更新: {new Date(carePlan.updatedAt).toLocaleString('ja-JP')}
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
  pdfButton: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  contentText: {
    color: '#424242',
    lineHeight: 22,
  },
  goalItem: {
    marginBottom: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  goalNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalPeriod: {
    color: '#757575',
  },
  goalContent: {
    color: '#424242',
    lineHeight: 22,
    paddingLeft: 8,
  },
  goalDivider: {
    marginTop: 12,
    marginBottom: 8,
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
