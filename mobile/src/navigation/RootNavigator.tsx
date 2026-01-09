import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RecordInputScreen from '../screens/records/RecordInputScreen';
import RecordHistoryScreen from '../screens/records/RecordHistoryScreen';
import RecordDetailScreen from '../screens/records/RecordDetailScreen';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import ScheduleFormScreen from '../screens/schedule/ScheduleFormScreen';
import ClientListScreen from '../screens/clients/ClientListScreen';
import ClientDetailScreen from '../screens/clients/ClientDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import CarePlansScreen from '../screens/careplans/CarePlansScreen';
import CarePlanDetailScreen from '../screens/careplans/CarePlanDetailScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import ReportDetailScreen from '../screens/reports/ReportDetailScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  RecordInput: undefined;
  RecordHistoryStack: undefined;
  ScheduleStack: undefined;
  ClientStack: undefined;
  Settings: undefined;
};

export type RecordHistoryStackParamList = {
  RecordHistory: undefined;
  RecordDetail: { recordId: string };
};

export type ScheduleStackParamList = {
  ScheduleList: undefined;
  ScheduleForm: {
    schedule?: {
      id: string;
      clientId: string;
      staffId: string;
      serviceTypeId?: string | null;
      scheduledDate: string;
      startTime: string;
      endTime: string;
      notes?: string | null;
      recurrenceId?: string | null;
    };
    initialDate?: string;
  };
};

export type ClientStackParamList = {
  ClientList: undefined;
  ClientDetail: { clientId: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  CarePlansStack: undefined;
  ReportsStack: undefined;
};

export type CarePlansStackParamList = {
  CarePlansList: undefined;
  CarePlanDetail: { carePlanId: string };
};

export type ReportsStackParamList = {
  ReportsList: undefined;
  ReportDetail: { reportId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RecordHistoryStack = createNativeStackNavigator<RecordHistoryStackParamList>();
const ScheduleStack = createNativeStackNavigator<ScheduleStackParamList>();
const ClientStack = createNativeStackNavigator<ClientStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const CarePlansStack = createNativeStackNavigator<CarePlansStackParamList>();
const ReportsStack = createNativeStackNavigator<ReportsStackParamList>();

function RecordHistoryNavigator() {
  return (
    <RecordHistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <RecordHistoryStack.Screen name="RecordHistory" component={RecordHistoryScreen} />
      <RecordHistoryStack.Screen name="RecordDetail" component={RecordDetailScreen} />
    </RecordHistoryStack.Navigator>
  );
}

function ScheduleNavigator() {
  return (
    <ScheduleStack.Navigator screenOptions={{ headerShown: false }}>
      <ScheduleStack.Screen name="ScheduleList" component={ScheduleScreen} />
      <ScheduleStack.Screen name="ScheduleForm" component={ScheduleFormScreen} />
    </ScheduleStack.Navigator>
  );
}

function ClientNavigator() {
  return (
    <ClientStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientStack.Screen name="ClientList" component={ClientListScreen} />
      <ClientStack.Screen name="ClientDetail" component={ClientDetailScreen} />
    </ClientStack.Navigator>
  );
}

function CarePlansNavigator() {
  return (
    <CarePlansStack.Navigator screenOptions={{ headerShown: false }}>
      <CarePlansStack.Screen name="CarePlansList" component={CarePlansScreen} />
      <CarePlansStack.Screen name="CarePlanDetail" component={CarePlanDetailScreen} />
    </CarePlansStack.Navigator>
  );
}

function ReportsNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportsStack.Screen name="ReportsList" component={ReportsScreen} />
      <ReportsStack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </ReportsStack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="CarePlansStack" component={CarePlansNavigator} />
      <SettingsStack.Screen name="ReportsStack" component={ReportsNavigator} />
    </SettingsStack.Navigator>
  );
}

function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="RecordInput"
        component={RecordInputScreen}
        options={{
          tabBarLabel: '記録',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RecordHistoryStack"
        component={RecordHistoryNavigator}
        options={{
          tabBarLabel: '履歴',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleStack"
        component={ScheduleNavigator}
        options={{
          tabBarLabel: '予定表',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ClientStack"
        component={ClientNavigator}
        options={{
          tabBarLabel: '利用者',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'その他',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});
