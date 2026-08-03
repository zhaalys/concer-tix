import { MaterialIcons } from '@expo/vector-icons';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="beranda" href="/" asChild>
            <TabButton icon="home">Beranda</TabButton>
          </TabTrigger>
          <TabTrigger name="jelajah" href="/explore" asChild>
            <TabButton icon="explore">Jelajah</TabButton>
          </TabTrigger>
          <TabTrigger name="tiket" href="/tickets" asChild>
            <TabButton icon="confirmation-number">Tiket</TabButton>
          </TabTrigger>
          <TabTrigger name="profil" href="/profile" asChild>
            <TabButton icon="account-circle">Profil</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & { icon?: keyof typeof MaterialIcons.glyphMap }) {
  const theme = useTheme();

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabBtnPressable, pressed && styles.pressed]}>
      <View
        style={[
          styles.tabButtonView,
          isFocused
            ? { backgroundColor: 'rgba(14, 62, 199, 0.12)' }
            : { backgroundColor: 'transparent' },
        ]}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? '#0e3ec7' : theme.textSecondary}
          />
        )}
        <ThemedText
          type="labelMd"
          style={{
            color: isFocused ? '#0e3ec7' : theme.textSecondary,
            fontWeight: isFocused ? '700' : '500',
          }}>
          {children}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={[styles.innerContainer, { backgroundColor: theme.background }]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: MaxContentWidth,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  tabBtnPressable: {
    flex: 1,
  },
  tabButtonView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
