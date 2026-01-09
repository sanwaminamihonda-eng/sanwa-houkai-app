import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from './src/theme';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
