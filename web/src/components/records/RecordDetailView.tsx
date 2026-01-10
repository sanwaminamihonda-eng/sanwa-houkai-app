'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  SmartToy as AiIcon,
} from '@mui/icons-material';
import { formatDateJapaneseWithWeekday, formatTimeRange } from '@/utils/formatters';

/**
 * サービス情報の型定義
 */
interface Service {
  typeId: string;
  typeName: string;
  items: { id: string; name: string }[];
}

/**
 * バイタル情報の型定義
 */
interface Vitals {
  pulse?: number;
  bloodPressureHigh?: number;
  bloodPressureLow?: number;
}

/**
 * 訪問記録の型定義（本番/デモ共通）
 */
export interface VisitRecordForDetail {
  client: { name: string };
  staff: { name: string };
  visitDate: string;
  startTime: string;
  endTime: string;
  visitReason?: { name: string } | null;
  vitals?: unknown;
  services?: unknown;
  notes?: string | null;
  aiGenerated?: boolean | null;
  satisfaction?: string | null;
  satisfactionReason?: string | null;
  conditionChange?: string | null;
  conditionChangeDetail?: string | null;
  serviceChangeNeeded?: string | null;
  serviceChangeDetail?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * RecordDetailViewのプロパティ
 */
export interface RecordDetailViewProps {
  /** 訪問記録データ */
  record: VisitRecordForDetail | null;
  /** ローディング状態 */
  loading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 戻るボタンクリック時のハンドラ */
  onBack: () => void;
  /** 追加セクション（満足度、状態変化など）を表示するか */
  showExtendedSections?: boolean;
}

/**
 * サービスデータをパース
 */
function parseServices(servicesData: unknown): Service[] {
  if (!servicesData) return [];
  try {
    if (typeof servicesData === 'string') {
      return JSON.parse(servicesData);
    }
    return servicesData as Service[];
  } catch {
    return [];
  }
}

/**
 * バイタルデータをパース
 */
function parseVitals(vitalsData: unknown): Vitals | null {
  if (!vitalsData) return null;
  try {
    if (typeof vitalsData === 'string') {
      return JSON.parse(vitalsData);
    }
    return vitalsData as Vitals;
  } catch {
    return null;
  }
}

/**
 * 訪問記録詳細表示コンポーネント
 * 本番/デモで共通使用
 */
export function RecordDetailView({
  record,
  loading,
  error,
  onBack,
  showExtendedSections = true,
}: RecordDetailViewProps) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !record) {
    return (
      <>
        <Box mb={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            一覧に戻る
          </Button>
        </Box>
        <Alert severity="error">{error || '記録が見つかりません'}</Alert>
      </>
    );
  }

  const services = parseServices(record.services);
  const vitals = parseVitals(record.vitals);

  return (
    <>
      <Box mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
          一覧に戻る
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {record.client.name}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="action" />
                  <Typography>{formatDateJapaneseWithWeekday(record.visitDate)}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon color="action" />
                  <Typography>{formatTimeRange(record.startTime, record.endTime)}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="action" />
                  <Chip label={record.staff.name} variant="outlined" />
                </Box>
                {record.visitReason && (
                  <Chip label={record.visitReason.name} color="primary" variant="outlined" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vitals */}
        {vitals && (vitals.pulse || vitals.bloodPressureHigh || vitals.bloodPressureLow) && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  バイタル
                </Typography>
                <Box display="flex" gap={3} flexWrap="wrap">
                  {vitals.pulse && (
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', minWidth: 100 }}>
                      <Typography variant="body2" color="text.secondary">
                        脈拍
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {vitals.pulse}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        bpm
                      </Typography>
                    </Paper>
                  )}
                  {(vitals.bloodPressureHigh || vitals.bloodPressureLow) && (
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', minWidth: 100 }}>
                      <Typography variant="body2" color="text.secondary">
                        血圧
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {vitals.bloodPressureHigh || '-'}/{vitals.bloodPressureLow || '-'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        mmHg
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Services */}
        {services.length > 0 && (
          <Grid size={{ xs: 12, md: vitals ? 8 : 12 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  サービス内容
                </Typography>
                {services.map((service, index) => (
                  <Box key={service.typeId} mb={index < services.length - 1 ? 2 : 0}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {service.typeName}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {service.items.map((item) => (
                        <Chip
                          key={item.id}
                          label={item.name}
                          size="small"
                          sx={{ bgcolor: 'primary.50' }}
                        />
                      ))}
                    </Box>
                    {index < services.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Notes */}
        {record.notes && (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="h6">特記事項</Typography>
                  {record.aiGenerated && (
                    <Chip
                      icon={<AiIcon />}
                      label="AI生成"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {record.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Extended Sections (Satisfaction, Condition Change, Service Change) */}
        {showExtendedSections && (
          <>
            {record.satisfaction && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      満足度
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {record.satisfaction}
                    </Typography>
                    {record.satisfactionReason && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {record.satisfactionReason}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {record.conditionChange && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      状態の変化
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {record.conditionChange}
                    </Typography>
                    {record.conditionChangeDetail && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {record.conditionChangeDetail}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {record.serviceChangeNeeded && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      サービス変更の必要性
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {record.serviceChangeNeeded}
                    </Typography>
                    {record.serviceChangeDetail && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {record.serviceChangeDetail}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </>
        )}

        {/* Metadata */}
        <Grid size={12}>
          <Box display="flex" justifyContent="flex-end" gap={3}>
            <Typography variant="caption" color="text.secondary">
              作成: {new Date(record.createdAt).toLocaleString('ja-JP')}
            </Typography>
            {record.updatedAt !== record.createdAt && (
              <Typography variant="caption" color="text.secondary">
                更新: {new Date(record.updatedAt).toLocaleString('ja-JP')}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
