import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0E9375',
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarLabelPosition: 'beside-icon',
          tabBarLabel: ({ focused, children }) =>
            focused ? (
              <ThemedText style={[styles.label, { color: '#0E9375' }]}>{children}</ThemedText>
            ) : null,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: theme.background,
              borderTopColor: 'rgba(0,0,0,0.06)',
              paddingBottom: Math.max(insets.bottom, 8),
              height: 64 + Math.max(insets.bottom, 8),
            },
          ],
          tabBarLabelStyle: styles.labelSpacing,
          tabBarIconStyle: styles.icon,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Jelajah',
            tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'Tiket',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="confirmation-number" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wristband"
          options={{
            title: 'Gelang',
            tabBarIcon: ({ color }) => <MaterialIcons name="style" size={28} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  labelSpacing: {
    marginLeft: 5,
  },
  icon: {
    marginTop: 0,
  },
});
