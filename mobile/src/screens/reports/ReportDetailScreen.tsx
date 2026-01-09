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
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { dataConnect } from '../../lib/firebase';
import { getReport, GetReportData } from '@sanwa-houkai-app/dataconnect';
import { ReportsStackParamList } from '../../navigation/RootNavigator';

type Report = NonNullable<GetReportData['report']>;

type RouteProps = RouteProp<ReportsStackParamList, 'ReportDetail'>;
type NavigationProp = NativeStackNavigationProp<ReportsStackParamList, 'ReportDetail'>;

export default function ReportDetailScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { reportId } = route.params;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getReport(dataConnect, { id: reportId });
        if (result.data.report) {
          setReport(result.data.report);
        } else {
          setError('報告書が見つかりません');
        }
      } catch (err) {
        console.error('Failed to load report:', err);
        setError('報告書の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const formatYearMonth = (year: number, month: number) => {
    return `${year}年${String(month).padStart(2, '0')}月`;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ja-JP');
  };

  const handleOpenPdf = async () => {
    if (!report?.pdfUrl) {
      Alert.alert('エラー', 'PDFが見つかりません');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(report.pdfUrl);
      if (supported) {
        await Linking.openURL(report.pdfUrl);
      } else {
        Alert.alert('エラー', 'PDFを開けません');
      }
    } catch (err) {
      console.error('Failed to open PDF:', err);
      Alert.alert('エラー', 'PDFを開けませんでした');
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

  if (error || !report) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Text variant="titleLarge" style={styles.headerTitle}>
            報告書詳細
          </Text>
          <View style={{ width: 48 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error || '報告書が見つかりません'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          報告書詳細
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Basic Info */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.yearMonth}>
              {formatYearMonth(report.targetYear, report.targetMonth)}
            </Text>
            <Text variant="titleLarge" style={styles.clientName}>
              {report.client.name}
            </Text>
            {report.client.careLevel && (
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.label}>
                  要介護度
                </Text>
                <Chip compact>{report.client.careLevel.name}</Chip>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>
                担当者
              </Text>
              <Chip icon="account" compact>
                {report.staff.name}
              </Chip>
            </View>
            <View style={styles.badgeRow}>
              {report.aiGenerated && (
                <Chip
                  icon="robot"
                  compact
                  style={{ backgroundColor: theme.colors.tertiaryContainer }}
                >
                  AI要約あり
                </Chip>
              )}
              {report.pdfGenerated && (
                <Chip
                  icon="file-pdf-box"
                  compact
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                >
                  PDF生成済
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* PDF Download */}
        {report.pdfUrl && (
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={handleOpenPdf}
            style={styles.pdfButton}
          >
            PDFを開く
          </Button>
        )}

        {/* AI Summary */}
        {report.summary && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  {report.aiGenerated ? 'AI月次要約' : '月次要約'}
                </Text>
                {report.aiGenerated && (
                  <Chip
                    icon="robot"
                    compact
                    textStyle={styles.chipText}
                    style={{ backgroundColor: theme.colors.tertiaryContainer }}
                  >
                    AI
                  </Chip>
                )}
              </View>
              <Text variant="bodyMedium" style={styles.summaryText}>
                {report.summary}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* No Summary */}
        {!report.summary && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                月次要約
              </Text>
              <Text variant="bodyMedium" style={styles.noDataText}>
                要約はありません
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={styles.metadataText}>
            作成: {formatDateTime(report.createdAt)}
          </Text>
          {report.updatedAt !== report.createdAt && (
            <Text variant="bodySmall" style={styles.metadataText}>
              更新: {formatDateTime(report.updatedAt)}
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
  yearMonth: {
    fontWeight: '700',
    marginBottom: 8,
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
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  pdfButton: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  summaryText: {
    color: '#424242',
    lineHeight: 24,
  },
  noDataText: {
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  chipText: {
    fontSize: 12,
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
