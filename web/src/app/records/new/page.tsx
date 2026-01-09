'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Divider,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { MainLayout } from '@/components/layout';
import { useStaff } from '@/hooks/useStaff';
import { dataConnect } from '@/lib/firebase';
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

export default function NewRecordPage() {
  const { staff, facilityId, loading: staffLoading } = useStaff();

  // Master data
  const [clients, setClients] = useState<Client[]>([]);
  const [visitReasons, setVisitReasons] = useState<VisitReason[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [serviceItemsByType, setServiceItemsByType] = useState<Record<string, ServiceItem[]>>({});
  const [loadingMasters, setLoadingMasters] = useState(true);

  // Form state
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [visitDate, setVisitDate] = useState<Date | null>(new Date());
  const [visitReasonId, setVisitReasonId] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date(Date.now() + 60 * 60 * 1000));
  const [vitals, setVitals] = useState<Vitals>({});
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Notification
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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

        if (reasonsRes.data.visitReasons.length > 0) {
          setVisitReasonId(reasonsRes.data.visitReasons[0].id);
        }

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
        setSnackbar({ open: true, message: 'マスタデータの読み込みに失敗しました', severity: 'error' });
      } finally {
        setLoadingMasters(false);
      }
    };

    loadMasters();
  }, [facilityId]);

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

  const handleSave = async () => {
    if (!staff || !facilityId) {
      setSnackbar({ open: true, message: 'スタッフ情報が取得できません', severity: 'error' });
      return;
    }
    if (!selectedClientId) {
      setSnackbar({ open: true, message: '利用者を選択してください', severity: 'error' });
      return;
    }
    if (!visitDate || !startTime || !endTime) {
      setSnackbar({ open: true, message: '日時を入力してください', severity: 'error' });
      return;
    }

    const services = buildServicesPayload();
    if (services.length === 0) {
      setSnackbar({ open: true, message: 'サービス内容を1つ以上選択してください', severity: 'error' });
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
      });

      setSnackbar({ open: true, message: '記録を保存しました', severity: 'success' });

      // Reset form
      setSelectedClientId('');
      setVitals({});
      setSelectedServices({});
      setNotes('');
    } catch (err) {
      console.error('Save error:', err);
      setSnackbar({ open: true, message: '保存に失敗しました', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (staffLoading || loadingMasters) {
    return (
      <MainLayout title="新規記録入力">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!staff || !facilityId) {
    return (
      <MainLayout title="新規記録入力">
        <Alert severity="error">
          スタッフ情報が見つかりません。管理者にお問い合わせください。
        </Alert>
      </MainLayout>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <MainLayout title="新規記録入力">
        <Card>
          <CardContent>
            {/* Client Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="client-label">利用者 *</InputLabel>
              <Select
                labelId="client-label"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                label="利用者 *"
              >
                <MenuItem value="">選択してください</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date and Time */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DatePicker
                  label="訪問日 *"
                  value={visitDate}
                  onChange={setVisitDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TimePicker
                  label="開始時間 *"
                  value={startTime}
                  onChange={setStartTime}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <TimePicker
                  label="終了時間 *"
                  value={endTime}
                  onChange={setEndTime}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            {/* Visit Reason */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="reason-label">訪問理由</InputLabel>
              <Select
                labelId="reason-label"
                value={visitReasonId}
                onChange={(e) => setVisitReasonId(e.target.value)}
                label="訪問理由"
              >
                {visitReasons.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    {reason.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Vitals */}
            <Typography variant="h6" gutterBottom>
              バイタル
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="脈拍"
                  type="number"
                  value={vitals.pulse ?? ''}
                  onChange={(e) =>
                    setVitals((prev) => ({
                      ...prev,
                      pulse: e.target.value ? parseInt(e.target.value, 10) : undefined,
                    }))
                  }
                  fullWidth
                  slotProps={{ input: { endAdornment: <Typography variant="body2">bpm</Typography> } }}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="血圧（高）"
                  type="number"
                  value={vitals.bloodPressureHigh ?? ''}
                  onChange={(e) =>
                    setVitals((prev) => ({
                      ...prev,
                      bloodPressureHigh: e.target.value ? parseInt(e.target.value, 10) : undefined,
                    }))
                  }
                  fullWidth
                  slotProps={{ input: { endAdornment: <Typography variant="body2">mmHg</Typography> } }}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="血圧（低）"
                  type="number"
                  value={vitals.bloodPressureLow ?? ''}
                  onChange={(e) =>
                    setVitals((prev) => ({
                      ...prev,
                      bloodPressureLow: e.target.value ? parseInt(e.target.value, 10) : undefined,
                    }))
                  }
                  fullWidth
                  slotProps={{ input: { endAdornment: <Typography variant="body2">mmHg</Typography> } }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Service Content */}
            <Typography variant="h6" gutterBottom>
              サービス内容 *
            </Typography>
            {serviceTypes.map((type) => (
              <Box key={type.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {type.name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {serviceItemsByType[type.id]?.map((item) => {
                    const isSelected = selectedServices[type.id]?.includes(item.id);
                    return (
                      <Chip
                        key={item.id}
                        label={item.name}
                        onClick={() => toggleServiceItem(type.id, item.id)}
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                      />
                    );
                  })}
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* Notes */}
            <Typography variant="h6" gutterBottom>
              特記事項
            </Typography>
            <TextField
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="利用者の状態や気づいたことを記入..."
              fullWidth
              sx={{ mb: 3 }}
            />

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={saving || !selectedClientId}
              >
                {saving ? <CircularProgress size={24} /> : '保存'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </MainLayout>
    </LocalizationProvider>
  );
}
