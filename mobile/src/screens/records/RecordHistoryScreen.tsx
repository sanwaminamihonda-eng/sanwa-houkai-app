import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordHistoryScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
          履歴
        </Text>
        <Text variant="bodyMedium" style={styles.placeholder}>
          訪問記録の履歴一覧（実装予定）
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    marginTop: 8,
    color: '#757575',
  },
});
