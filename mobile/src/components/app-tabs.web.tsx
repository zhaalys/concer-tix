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

import { Header } from './Header';
import { ThemedText } from './themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <View style={styles.root}>
      <Header />
      <View style={styles.body}>
        <Tabs>
          <TabSlot style={{ height: '100%' }} />
          <TabList asChild>
            <CustomTabList>
              <TabTrigger name="beranda" href={'/' as never} asChild>
                <TabButton icon="home">Beranda</TabButton>
              </TabTrigger>
              <TabTrigger name="jelajah" href={'/explore' as never} asChild>
                <TabButton icon="explore">Jelajah</TabButton>
              </TabTrigger>
              <TabTrigger name="tiket" href={'/tickets' as never} asChild>
                <TabButton icon="confirmation-number">Tiket</TabButton>
              </TabTrigger>
              <TabTrigger name="gelang" href={'/wristband' as never} asChild>
                <TabButton icon="style">Gelang</TabButton>
              </TabTrigger>
            </CustomTabList>
          </TabList>
        </Tabs>
      </View>
    </View>
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
          isFocused ? { backgroundColor: '#E6F4F1' } : { backgroundColor: 'transparent' },
        ]}>
        {icon ? (
          <MaterialIcons
            name={icon}
            size={22}
            color={isFocused ? '#0E9375' : '#64748B'}
          />
        ) : null}
        {isFocused ? (
          <ThemedText
            type="labelMd"
            style={{
              fontSize: 13,
              color: '#0E9375',
              fontWeight: '700',
            }}>
            {children}
          </ThemedText>
        ) : null}
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
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  innerContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  tabBtnPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonView: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    width: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
});
