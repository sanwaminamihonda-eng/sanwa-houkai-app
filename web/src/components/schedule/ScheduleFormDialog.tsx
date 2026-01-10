'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  IconButton,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Close as CloseIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import {
  ScheduleFormData,
  ClientOption,
  StaffOption,
  ServiceTypeOption,
  RecurrenceType,
  RecurrenceEndType,
  WEEKDAYS,
} from './types';

export interface ScheduleFormDialogProps {
  open: boolean;
  isEditing: boolean;
  formData: ScheduleFormData;
  clients: ClientOption[];
  staffList: StaffOption[];
  serviceTypes: ServiceTypeOption[];
  saving: boolean;
  onFormChange: (data: ScheduleFormData) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
}

export function ScheduleFormDialog({
  open,
  isEditing,
  formData,
  clients,
  staffList,
  serviceTypes,
  saving,
  onFormChange,
  onSave,
  onClose,
}: ScheduleFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? '予定を編集' : '新規予定'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormControl fullWidth required>
            <InputLabel>利用者</InputLabel>
            <Select
              value={formData.clientId}
              label="利用者"
              onChange={(e) => onFormChange({ ...formData, clientId: e.target.value })}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>担当者</InputLabel>
            <Select
              value={formData.staffId}
              label="担当者"
              onChange={(e) => onFormChange({ ...formData, staffId: e.target.value })}
            >
              {staffList.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>サービス種類</InputLabel>
            <Select
              value={formData.serviceTypeId}
              label="サービス種類"
              onChange={(e) => onFormChange({ ...formData, serviceTypeId: e.target.value })}
            >
              <MenuItem value="">
                <em>未選択</em>
              </MenuItem>
              {serviceTypes.map((st) => (
                <MenuItem key={st.id} value={st.id}>
                  {st.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="予定日"
            value={formData.scheduledDate}
            onChange={(date) => onFormChange({ ...formData, scheduledDate: date })}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TimePicker
              label="開始時間"
              value={formData.startTime}
              onChange={(time) => onFormChange({ ...formData, startTime: time })}
              slotProps={{ textField: { fullWidth: true, required: true } }}
              ampm={false}
            />
            <TimePicker
              label="終了時間"
              value={formData.endTime}
              onChange={(time) => onFormChange({ ...formData, endTime: time })}
              slotProps={{ textField: { fullWidth: true, required: true } }}
              ampm={false}
            />
          </Box>

          <TextField
            label="メモ"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
            fullWidth
          />

          {/* Recurrence settings (only for new schedules) */}
          {!isEditing && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <RepeatIcon color="action" />
                <Typography variant="subtitle1">繰り返し設定</Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>繰り返しパターン</InputLabel>
                <Select
                  value={formData.recurrence.type}
                  label="繰り返しパターン"
                  onChange={(e) => onFormChange({
                    ...formData,
                    recurrence: {
                      ...formData.recurrence,
                      type: e.target.value as RecurrenceType,
                      weekdays: e.target.value === 'none' ? [] : formData.recurrence.weekdays,
                    },
                  })}
                >
                  <MenuItem value="none">繰り返しなし</MenuItem>
                  <MenuItem value="daily">毎日</MenuItem>
                  <MenuItem value="weekly">毎週</MenuItem>
                  <MenuItem value="biweekly">隔週</MenuItem>
                  <MenuItem value="monthly">毎月</MenuItem>
                </Select>
              </FormControl>

              {/* Weekday selection (for weekly/biweekly) */}
              {(formData.recurrence.type === 'weekly' || formData.recurrence.type === 'biweekly') && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    曜日を選択（複数可）
                  </Typography>
                  <FormGroup row>
                    {WEEKDAYS.map((day) => (
                      <FormControlLabel
                        key={day.key}
                        control={
                          <Checkbox
                            checked={formData.recurrence.weekdays.includes(day.key)}
                            onChange={(e) => {
                              const newWeekdays = e.target.checked
                                ? [...formData.recurrence.weekdays, day.key]
                                : formData.recurrence.weekdays.filter(d => d !== day.key);
                              onFormChange({
                                ...formData,
                                recurrence: {
                                  ...formData.recurrence,
                                  weekdays: newWeekdays,
                                },
                              });
                            }}
                            size="small"
                          />
                        }
                        label={day.label}
                        sx={{ mr: 1 }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}

              {/* End condition (for recurrence) */}
              {formData.recurrence.type !== 'none' && (
                <>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">終了条件</FormLabel>
                    <RadioGroup
                      row
                      value={formData.recurrence.endType}
                      onChange={(e) => onFormChange({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          endType: e.target.value as RecurrenceEndType,
                        },
                      })}
                    >
                      <FormControlLabel value="count" control={<Radio size="small" />} label="回数指定" />
                      <FormControlLabel value="until" control={<Radio size="small" />} label="終了日指定" />
                    </RadioGroup>
                  </FormControl>

                  {formData.recurrence.endType === 'count' ? (
                    <TextField
                      label="繰り返し回数"
                      type="number"
                      value={formData.recurrence.count}
                      onChange={(e) => onFormChange({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          count: Math.max(1, Math.min(52, parseInt(e.target.value) || 1)),
                        },
                      })}
                      inputProps={{ min: 1, max: 52 }}
                      helperText="1〜52回まで"
                      fullWidth
                    />
                  ) : (
                    <DatePicker
                      label="終了日"
                      value={formData.recurrence.until}
                      onChange={(date) => onFormChange({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          until: date,
                        },
                      })}
                      minDate={formData.scheduledDate || undefined}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={onSave} variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : isEditing ? '更新' : '作成'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
