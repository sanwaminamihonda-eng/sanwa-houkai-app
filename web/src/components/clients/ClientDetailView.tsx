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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  WarningAmber as WarningIcon,
  Assignment as AssignmentIcon,
  EventRepeat as EventRepeatIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { formatDateJapanese } from '@/utils/formatters';

/**
 * 利用者データの型定義（本番/デモ共通）
 */
/**
 * アセスメントデータの型（JSONオブジェクトまたは文字列）
 */
export type AssessmentData = {
  mobility?: string;
  cognition?: string;
} | string | null;

export interface ClientForDetail {
  name: string;
  nameKana?: string | null;
  isActive: boolean;
  gender?: string | null;
  birthDate?: string | null;
  careLevel?: { name: string } | null;
  addressPrefecture?: string | null;
  addressCity?: string | null;
  phone?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  careManager?: string | null;
  careOffice?: string | null;
  assessment?: AssessmentData;
  lastAssessmentDate?: string | null;
  regularServices?: string | string[] | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * ClientDetailViewのプロパティ
 */
export interface ClientDetailViewProps {
  /** 利用者データ */
  client: ClientForDetail | null;
  /** ローディング状態 */
  loading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 戻るボタンクリック時のハンドラ */
  onBack: () => void;
  /** 拡張セクション（アセスメント、定期サービス）を表示するか */
  showExtendedSections?: boolean;
}

/**
 * 年齢計算
 */
function calculateAge(birthDate: string | null | undefined): string {
  if (!birthDate) return '-';
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age}歳`;
}

/**
 * 住所フォーマット
 */
function getFullAddress(client: ClientForDetail): string {
  const parts = [client.addressPrefecture, client.addressCity].filter(Boolean);
  return parts.join(' ') || '-';
}

/**
 * アセスメントデータをフォーマット
 */
function formatAssessment(assessment: AssessmentData | undefined): string | null {
  if (!assessment) return null;

  // 文字列の場合はそのまま返す
  if (typeof assessment === 'string') {
    return assessment;
  }

  // オブジェクトの場合はフォーマット
  const parts: string[] = [];
  if (assessment.mobility) {
    parts.push(`移動: ${assessment.mobility}`);
  }
  if (assessment.cognition) {
    parts.push(`認知: ${assessment.cognition}`);
  }

  return parts.length > 0 ? parts.join('\n') : null;
}

/**
 * 定期サービスをフォーマット
 */
function formatRegularServices(services: string | string[] | null | undefined): string | null {
  if (!services) return null;

  // 文字列の場合はそのまま返す
  if (typeof services === 'string') {
    return services;
  }

  // 配列の場合はカンマ区切りで結合
  if (Array.isArray(services)) {
    return services.join('、');
  }

  return null;
}

/**
 * 利用者詳細表示コンポーネント
 * 本番/デモで共通使用
 */
export function ClientDetailView({
  client,
  loading,
  error,
  onBack,
  showExtendedSections = true,
}: ClientDetailViewProps) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client) {
    return (
      <>
        <Box mb={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            一覧に戻る
          </Button>
        </Box>
        <Alert severity="error">{error || '利用者が見つかりません'}</Alert>
      </>
    );
  }

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
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    {client.name}
                  </Typography>
                  {client.nameKana ? (
                    <Typography variant="body1" color="text.secondary">
                      {client.nameKana}
                    </Typography>
                  ) : null}
                </Box>
                {!client.isActive ? (
                  <Chip label="非アクティブ" color="error" variant="outlined" />
                ) : null}
              </Box>

              <Box display="flex" flexWrap="wrap" gap={2} mt={3}>
                {client.careLevel?.name ? (
                  <Chip label={client.careLevel.name} color="primary" variant="outlined" />
                ) : null}
                {client.gender ? (
                  <Chip icon={<PersonIcon />} label={client.gender} variant="outlined" />
                ) : null}
                {client.birthDate ? (
                  <Chip
                    icon={<CakeIcon />}
                    label={calculateAge(client.birthDate)}
                    variant="outlined"
                    color="success"
                  />
                ) : null}
              </Box>

              {client.birthDate ? (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    生年月日:
                  </Typography>
                  <Typography variant="body1">{formatDateJapanese(client.birthDate)}</Typography>
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                連絡先
              </Typography>

              <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                <LocationIcon color="action" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    住所
                  </Typography>
                  <Typography variant="body1">{getFullAddress(client)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <PhoneIcon color="action" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      電話番号
                    </Typography>
                    <Typography variant="body1">{client.phone || '-'}</Typography>
                  </Box>
                </Box>
                {client.phone ? (
                  <Tooltip title="電話をかける">
                    <IconButton color="primary" href={`tel:${client.phone}`} size="large">
                      <PhoneIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        {client.emergencyName || client.emergencyPhone ? (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', bgcolor: 'warning.50' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <WarningIcon color="warning" />
                  <Typography variant="h6">緊急連絡先</Typography>
                </Box>

                {client.emergencyName ? (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      氏名
                    </Typography>
                    <Typography variant="body1">
                      {client.emergencyName}
                      {client.emergencyRelation ? (
                        <Chip
                          label={client.emergencyRelation}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      ) : null}
                    </Typography>
                  </Box>
                ) : null}

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      電話番号
                    </Typography>
                    <Typography variant="body1">{client.emergencyPhone || '-'}</Typography>
                  </Box>
                  {client.emergencyPhone ? (
                    <Tooltip title="電話をかける">
                      <IconButton color="warning" href={`tel:${client.emergencyPhone}`} size="large">
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Care Info */}
        {client.careManager || client.careOffice ? (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AssignmentIcon color="action" />
                  <Typography variant="h6">ケア情報</Typography>
                </Box>

                {client.careManager ? (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      ケアマネジャー
                    </Typography>
                    <Typography variant="body1">{client.careManager}</Typography>
                  </Box>
                ) : null}

                {client.careOffice ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      事業所
                    </Typography>
                    <Typography variant="body1">{client.careOffice}</Typography>
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Assessment (Extended Section) */}
        {showExtendedSections && (client.assessment || client.lastAssessmentDate) ? (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  アセスメント
                </Typography>

                {client.lastAssessmentDate ? (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      最終評価日
                    </Typography>
                    <Typography variant="body1">
                      {formatDateJapanese(client.lastAssessmentDate)}
                    </Typography>
                  </Box>
                ) : null}

                {formatAssessment(client.assessment) ? (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {formatAssessment(client.assessment)}
                    </Typography>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Regular Services (Extended Section) */}
        {showExtendedSections && formatRegularServices(client.regularServices) ? (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <EventRepeatIcon color="action" />
                  <Typography variant="h6">定期サービス</Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {formatRegularServices(client.regularServices)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Notes */}
        {client.notes ? (
          <Grid
            size={{
              xs: 12,
              md: showExtendedSections && formatRegularServices(client.regularServices) ? 6 : 12,
            }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <NotesIcon color="action" />
                  <Typography variant="h6">備考</Typography>
                </Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {client.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : null}

        {/* Metadata */}
        <Grid size={12}>
          <Box display="flex" justifyContent="flex-end" gap={3}>
            <Typography variant="caption" color="text.secondary">
              登録: {new Date(client.createdAt).toLocaleString('ja-JP')}
            </Typography>
            {client.updatedAt !== client.createdAt ? (
              <Typography variant="caption" color="text.secondary">
                更新: {new Date(client.updatedAt).toLocaleString('ja-JP')}
              </Typography>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
