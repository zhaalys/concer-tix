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
          isFocused ? { backgroundColor: 'rgba(14, 147, 117, 0.12)' } : { backgroundColor: 'transparent' },
        ]}>
        {icon ? (
          <MaterialIcons
            name={icon}
            size={26}
            color={isFocused ? '#0E9375' : theme.textSecondary}
          />
        ) : null}
        {isFocused ? (
          <ThemedText
            type="labelMd"
            style={{
              fontSize: 14,
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
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 6,
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
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    minWidth: 52,
  },
  pressed: {
    opacity: 0.7,
  },
});
