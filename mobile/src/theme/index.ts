import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const colors = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  divider: '#E0E0E0',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.primaryDark,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    outline: colors.divider,
  },
  custom: {
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    textSecondary: colors.textSecondary,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryDark,
    secondary: colors.primaryLight,
    background: '#121212',
    surface: '#1E1E1E',
    error: colors.error,
    onPrimary: '#FFFFFF',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    outline: '#424242',
  },
  custom: {
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    textSecondary: '#B0B0B0',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export type AppTheme = typeof lightTheme;
