'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import { RecurrenceDeleteScope } from './types';

export interface RecurrenceDeleteDialogProps {
  open: boolean;
  scope: RecurrenceDeleteScope;
  processing: boolean;
  onScopeChange: (scope: RecurrenceDeleteScope) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RecurrenceDeleteDialog({
  open,
  scope,
  processing,
  onScopeChange,
  onConfirm,
  onCancel,
}: RecurrenceDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => !processing && onCancel()}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>繰り返し予定の削除</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          この予定は繰り返し予定です。削除範囲を選択してください。
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={scope}
            onChange={(e) => onScopeChange(e.target.value as RecurrenceDeleteScope)}
          >
            <FormControlLabel
              value="single"
              control={<Radio />}
              label="この予定のみ"
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="シリーズ全体"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={processing}>
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={processing}
        >
          {processing ? <CircularProgress size={24} /> : '削除'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
