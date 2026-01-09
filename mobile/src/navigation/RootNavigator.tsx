import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import RecordInputScreen from '../screens/records/RecordInputScreen';
import RecordHistoryScreen from '../screens/records/RecordHistoryScreen';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import ClientListScreen from '../screens/clients/ClientListScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

export type RootTabParamList = {
  RecordInput: undefined;
  RecordHistory: undefined;
  Schedule: undefined;
  ClientList: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
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
          name="RecordHistory"
          component={RecordHistoryScreen}
          options={{
            tabBarLabel: '履歴',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="history" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            tabBarLabel: '予定表',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ClientList"
          component={ClientListScreen}
          options={{
            tabBarLabel: '利用者',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'その他',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dots-horizontal" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
