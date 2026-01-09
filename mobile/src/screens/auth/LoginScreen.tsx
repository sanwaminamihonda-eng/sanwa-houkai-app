import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { signInWithGoogle, loading, error } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="clipboard-text"
            size={80}
            color={theme.colors.primary}
          />
          <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
            訪問介護記録
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            サービス記録・管理アプリ
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="google"
            onPress={signInWithGoogle}
            style={styles.googleButton}
            contentStyle={styles.googleButtonContent}
            labelStyle={styles.googleButtonLabel}
          >
            Googleでログイン
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    color: '#757575',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  googleButton: {
    borderRadius: 8,
  },
  googleButtonContent: {
    height: 48,
  },
  googleButtonLabel: {
    fontSize: 16,
  },
});
