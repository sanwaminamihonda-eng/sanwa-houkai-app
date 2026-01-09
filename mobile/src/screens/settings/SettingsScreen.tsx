import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List, Avatar, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { SettingsStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'SettingsMain'>;

export default function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const handleCarePlansPress = () => {
    navigation.navigate('CarePlansStack');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
            その他
          </Text>
        </View>

        <View style={styles.userSection}>
          <Avatar.Image
            size={64}
            source={{ uri: user?.photoURL || undefined }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text variant="titleMedium">{user?.displayName || 'ユーザー'}</Text>
            <Text variant="bodySmall" style={styles.email}>
              {user?.email}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>メニュー</List.Subheader>
          <List.Item
            title="帳票一覧"
            description="報告書・計画書の出力"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleCarePlansPress}
          />
          <List.Item
            title="支援者管理"
            description="職員情報の管理"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="設定"
            description="アプリの設定"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            textColor={theme.colors.error}
            style={styles.logoutButton}
          >
            ログアウト
          </Button>
        </View>

        <View style={styles.versionSection}>
          <Text variant="bodySmall" style={styles.versionText}>
            バージョン 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  email: {
    color: '#757575',
    marginTop: 2,
  },
  divider: {
    marginVertical: 8,
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
  versionSection: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#9E9E9E',
  },
});
