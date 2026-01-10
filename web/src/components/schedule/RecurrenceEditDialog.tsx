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
} from '@mui/material';
import { RecurrenceEditScope } from './types';

export interface RecurrenceEditDialogProps {
  open: boolean;
  scope: RecurrenceEditScope;
  onScopeChange: (scope: RecurrenceEditScope) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RecurrenceEditDialog({
  open,
  scope,
  onScopeChange,
  onConfirm,
  onCancel,
}: RecurrenceEditDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>繰り返し予定の編集</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          この予定は繰り返し予定です。編集範囲を選択してください。
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={scope}
            onChange={(e) => onScopeChange(e.target.value as RecurrenceEditScope)}
          >
            <FormControlLabel
              value="single"
              control={<Radio />}
              label="この予定のみ"
            />
            <FormControlLabel
              value="thisAndFuture"
              control={<Radio />}
              label="この予定以降すべて"
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
        <Button onClick={onCancel}>キャンセル</Button>
        <Button onClick={onConfirm} variant="contained">
          続行
        </Button>
      </DialogActions>
    </Dialog>
  );
}
